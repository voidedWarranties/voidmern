import express from "express";
const router = express.Router();

router.get("/", (req, res) => { // Create a route /logout
    req.logout(); // Log the user out
    res.redirect("../"); // Redirect to /
});

export default router;