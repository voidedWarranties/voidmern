import express from "express";
const router = express.Router();

import passport from "passport";
const scopes = ["identify", "email", "guilds"];

router.get("/",
    passport.authenticate("discord", { scope: scopes }),
    (req, res) => { // Create a route /login that authenticates using discord and the given scopes

});

router.get("/callback",
    passport.authenticate("discord", { failureRedirect: "/" }), // Validate the OAuth token and redirect to /login if it fails
    (req, res) => {
        res.redirect("../"); // Redirect to /
});

export default router;