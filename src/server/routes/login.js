import express from "express";
const router = express.Router();

import passport from "passport";
const scopes = ["identify", "email", "guilds"];

import generateJwt from "../generateJwt";

router.get("/",
    passport.authenticate("discord", { scope: scopes, session: false }),
    (req, res) => { // Create a route /login that authenticates using discord and the given scopes

    });

router.get("/callback",
    passport.authenticate("discord", { failureRedirect: "/", session: false }), // Validate the OAuth token and redirect to /login if it fails
    (req, res) => {
        const youser = req.user; // Get the user from req.user
        const token = generateJwt({ // Generate a JWT token from the user's id
            id: youser.id
        });
        res.cookie("discord_jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }); // Send a cookie in the response headers named discord_jwt that lasts 14 days, set httpOnly to true so javascript on the client can't access this cookie
        res.redirect("../"); // Redirect to the page outside of this route (localhost:port/)
    });

export default router;