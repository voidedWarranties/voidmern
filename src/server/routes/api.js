import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/user", passport.authenticate("jwt", { session: false }), (req, res) => { // Create a route /api/user
    res.json(req.user); // Send the current user as a result
});

export default router;