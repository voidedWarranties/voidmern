import express from "express";
import passport from "passport";
const router = express.Router();

const scopes = ["identify", "email", "guilds"];

import generateJwt from "../generateJwt";

import User from "../database/models/User";

router.get("/user", passport.authenticate("jwt", { session: false }), (req, res) => { // Create a route /api/user
    res.json(req.user); // Send the current user as a result
});


// KAKAO AUTHENTICATION
router.get("/kakao/login", passport.authenticate("kakao", { session: false }), (req, res) => {

});

router.get("/kakao/callback", passport.authenticate("kakao", { failureRedirect: "/", session: false }), (req, res) => {
    const youser = req.user;
    const token = generateJwt({
        id: youser.email
    });
    res.cookie("cty_jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true });
    res.redirect("../../");
});

// DISCORD AUTHENTICATION
router.get("/discord/login", passport.authenticate("discord", { scope: scopes, session: false }), (req, res) => {

});

router.get("/discord/callback", passport.authenticate("discord", { failureRedirect: "/", session: false }), (req, res) => {
        const youser = req.user; // Get the user from req.user
        const token = generateJwt({ // Generate a JWT token from the user's id
            id: youser.email
        });
        res.cookie("cty_jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }); // Send a cookie in the response headers named discord_jwt that lasts 14 days, set httpOnly to true so javascript on the client can't access this cookie
        res.redirect("../../"); // Redirect to the page outside of this route (localhost:port/)
});

router.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
    User.findOneAndUpdate({ email: req.user.email }, { loggedIn: null }, (err, user) => { // Find the user using the authenticated user's id, and update it to say it is no longer logged in

    });
    req.logout();
    res.clearCookie("cty_jwt");
    res.redirect("../../");
});

router.get("/account/delete/:email", passport.authenticate("jwt", { session: false }), (req, res) => {
    const email = req.params.email;
    if(email === req.user.email) {
        User.findOneAndRemove({ email: req.user.email }, (err, res) => {

        });
        req.logout();
        res.clearCookie("cty_jwt");
        res.redirect("../../../");
    } else {
        res.redirect("../../../");
    }
});
export default router;