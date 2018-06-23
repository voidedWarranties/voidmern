import express from "express";
import passport from "passport";
const router = express.Router();

import User from "../database/models/User";

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => { // Create a route /logout, have it be restricted to authenticated users only
    User.findOneAndUpdate({ discordID: req.user.id }, { loggedIn: false }, (err, user) => { // Find the user using the authenticated user's id, and update it to say it is no longer logged in

    });
    req.logout(); // Log the user out
    res.clearCookie("discord_jwt"); // Remove the cookie called discord_jwt from the client
    res.redirect("../"); // Redirect to /
});

export default router;