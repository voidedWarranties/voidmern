import express from "express";
import expressStaticGzip from "express-static-gzip";
import session from "express-session";
import path from "path";

// Routes
import login from "./routes/login";
import logout from "./routes/logout";
import api from "./routes/api";

import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Strategy as JWTStrategy } from "passport-jwt";
import cookieParser from "cookie-parser";
import User from "./database/models/User";
import { init as dbInit, getConnection } from "./database/driver";
// import connectmongo from "connect-mongo";
// const mongooseSession = connectmongo(session); // Be able to use connect-mongo by using "new mongooseSession"
import config from "../config.json";
const scopes = ["identify", "email", "guilds"];

const app = express(); // Create the express app
app.use(cookieParser());

dbInit(); // Connect to the database

// const store = new mongooseSession({ // Create a new Mongoose Session Store,
//     mongooseConnection: getConnection() // Using the current Mongoose connection
// });

const cookieExtractor = (req) => {
    var token = null;
    if(req && req.cookies) {
        token = req.cookies.discord_jwt;
    }

    return token;
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.session_secret
};

if(process.env.NODE_ENV === "production") {
    app.get("*.html", (req, res, next) => {
        req.url = `${req.url}.gz`;
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/html");
        next();
    });
    app.get("*.js", (req, res, next) => {
        req.url = `${req.url}.gz`;
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/javascript");
        next();
    });

    app.use(express.static(path.join(__dirname, "../client")));
    app.use(expressStaticGzip(path.join(__dirname, "../client")));
}

passport.use(new JWTStrategy(jwtOptions, async (payload, done) => {
    const user = await User.findOne({ discordID: payload.sub });
    if(user.loggedIn) {
        return done(null, user, payload);
    }
    return done();
}));

passport.use(new DiscordStrategy({ // Be able to use the passport-discord strategy to authenticate for Discord
    clientID: config.discord_client_id, // Set the client ID,
    clientSecret: config.discord_client_secret, // And the secret, which you get from creating a new Discord app
    callbackURL: process.env.NODE_ENV === "production" ? `${config.express_url}/login/callback` : "http://localhost:3001/login/callback", // If we're in production mode, use the express URL in the config. Otherwise, use localhost:3001
    scope: scopes // Use the scopes provided in an array
}, async (accessToken, refreshToken, user, done) => {
    if(user) {
        const userDb = await User.findOne({ discordID: user.id });
        if(userDb) {
            User.findOneAndUpdate({ discordID: user.id }, {
                loggedIn: true
            }, (err, user) => {

            });
            return done(null, user);
        } else {
            User.create({
                email: user.email,
                picture: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
                discordID: user.id,
                username: user.username,
                discriminator: user.discriminator,
                loggedIn: true
            });
            return done(null, user);
        }
    }
}));

// app.use(session({ // Set the session middleware
//     // name: "voidmern", // Set the name of the cookie to voidmern
//     secret: config.session_secret, // Set a suuuper secret session key
//     // resave: false, // Don't force the session to be saved over and over
//     // saveUninitialized: false, // Save new, but not initialized, sessions to the store
//     // store, // Use the session store made earlier
//     // cookie: {
//     //     maxAge: 1209600000, // Set the cookie to expire after 14 days
//     //     sameSite: true // Set sameSite rules to strict
//     // }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user); // Save the user into the store
// });

// passport.deserializeUser((id, done) => {
//     done(null, id); // Attach user to req.user
// });

app.use(passport.initialize()); // Use middleware to initialize passport
// app.use(passport.session()); // Change req.user to the deserialized user

// Use the routes
app.use("/login", login);
app.use("/logout", logout);
app.use("/api", api);

app.get("/test", (req, res) => res.send(req.cookies));

app.get("/authtest", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send(`User Found: ${JSON.stringify(req.user)}`);
});

app.get("/cookie", (req, res) => {
    res.cookie("test", "test").send("cookies!");
});

app.listen(3000, () => console.log("express app started")); // Start the express server