import express from "express";
const router = express.Router();

router.get("/user", (req, res) => { // Create a route /api/user
    res.json(req.user); // Send the current user as a result
});

export default router;