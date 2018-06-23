import express from "express";
import expressStaticGzip from "express-static-gzip";
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
import { init as dbInit } from "./database/driver";
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

const cookieExtractor = (req) => { // Define a custom token extractor for passport-jwt to use
    var token = null; // Set a variable token as null so if it is not set later we can check if it exists with if(token)
    if(req && req.cookies) { // Check if the request exists and the request has cookies
        token = req.cookies.discord_jwt; // Set token equal to the cookie named discord_jwt
    }

    return token; // Return the token
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor, // Use the custom token extractor to get the token from the client
    secretOrKey: config.session_secret // Set the secret for the token
};

if(process.env.NODE_ENV === "production") { // Only if the application is in production mode (npm run build, npm run serve, webpack.prod.js)
    app.get("*.js", (req, res, next) => { // Define a middleware for all requests to js files
        req.url = `${req.url}.gz`; // Which "redirects" the request to the same file but with a .gz
        res.set("Content-Encoding", "gzip"); // Set the appropriate headers so the client can decode the gz
        res.set("Content-Type", "text/javascript"); // And know what kind of file it should be
        next(); // The middleware is finished, continue to the next route/middleware
    });

    app.use(express.static(path.join(__dirname, "../client"))); // Serve files in the dist/client folder as static files
    app.use(expressStaticGzip(path.join(__dirname, "../client"))); // Serve gzipped files in the dist/client folder as static files
}

passport.use(new JWTStrategy(jwtOptions, async (payload, done) => { // Use the JWT strategy to authenticate some pages using the token extractor above
    const user = await User.findOne({ discordID: payload.sub }); // Find the user from the database using the payload of the token (the id)
    if(user.loggedIn) { // If the database says the user is logged in,
        return done(null, user, payload); // Let the user through
    }
    return done(); // Otherwise, get a 401 Unauthorized error
}));

passport.use(new DiscordStrategy({ // Be able to use the passport-discord strategy to authenticate for Discord
    clientID: config.discord_client_id, // Set the client ID,
    clientSecret: config.discord_client_secret, // And the secret, which you get from creating a new Discord app
    callbackURL: process.env.NODE_ENV === "production" ? `${config.express_url}/login/callback` : "http://localhost:3001/login/callback", // If we're in production mode, use the express URL in the config. Otherwise, use localhost:3001
    scope: scopes // Use the scopes provided in an array
}, async (accessToken, refreshToken, user, done) => {
    if(user) { // If the user exists
        const userDb = await User.findOne({ discordID: user.id }); // Try to find the user from the database using its id
        if(userDb) { // If that entry exists
            User.findOneAndUpdate({ discordID: user.id }, { // Update it
                loggedIn: true // And say it is logged in
            }, (err, user) => {

            });
            return done(null, user); // and finish
        } else { // Otherwise
            User.create({ // Create a new user and store its info
                email: user.email,
                picture: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
                discordID: user.id,
                username: user.username,
                discriminator: user.discriminator,
                loggedIn: true
            });
            return done(null, user); // and finish
        }
    }
}));

app.use(passport.initialize()); // Use middleware to initialize passport

// Use the routes
app.use("/login", login);
app.use("/logout", logout);
app.use("/api", api);

app.listen(3000, () => console.log("express app started")); // Start the express server