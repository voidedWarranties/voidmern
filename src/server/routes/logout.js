import express from "express";
import passport from "passport";
const router = express.Router();

import User from "../database/models/User";

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => { // Create a route /logout
    User.findOneAndUpdate({ discordID: req.user.id }, { loggedIn: false }, (err, user) => {

    });
    req.logout(); // Log the user out
    res.clearCookie("discord_jwt");
    res.redirect("../"); // Redirect to /
});

export default router;