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
import { init as dbInit, getConnection } from "./database/driver";
import connectmongo from "connect-mongo";
const mongooseSession = connectmongo(session); // Be able to use connect-mongo by using "new mongooseSession"
import config from "../config.json";
const scopes = ["identify", "email", "guilds"];

const app = express(); // Create the express app

dbInit(); // Connect to the database

const store = new mongooseSession({ // Create a new Mongoose Session Store,
    mongooseConnection: getConnection() // Using the current Mongoose connection
});

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

passport.use(new DiscordStrategy({ // Be able to use the passport-discord strategy to authenticate for Discord
    clientID: config.discord_client_id, // Set the client ID,
    clientSecret: config.discord_client_secret, // And the secret, which you get from creating a new Discord app
    callbackURL: process.env.NODE_ENV === "production" ? `${config.express_url}/login/callback` : `http://localhost:3001/login/callback`, // If we're in production mode, use the express URL in the config. Otherwise, use localhost:3001
    scope: scopes // Use the scopes provided in an array
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        return done(null, profile); // Since the data storage is being handled by sessions, just call done 
    });
}));

app.use(session({ // Set the session middleware
    name: "voidmern", // Set the name of the cookie to voidmern
    secret: config.session_secret, // Set a suuuper secret session key
    resave: false, // Don't force the session to be saved over and over
    saveUninitialized: false, // Save new, but not initialized, sessions to the store
    store, // Use the session store made earlier
    cookie: {
        maxAge: 1209600000, // Set the cookie to expire after 14 days
        sameSite: true // Set sameSite rules to strict
    }
}));

passport.serializeUser((user, done) => {
    done(null, user); // Save the user into the store
});

passport.deserializeUser((id, done) => {
    done(null, id); // Attach user to req.user
});

app.use(passport.initialize()); // Use middleware to initialize passport
app.use(passport.session()); // Change req.user to the deserialized user

// Use the routes
app.use("/login", login);
app.use("/logout", logout);
app.use("/api", api);

app.listen(3000, () => console.log("express app started")); // Start the express server