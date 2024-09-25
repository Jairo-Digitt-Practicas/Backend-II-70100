/** @format */

const express = require("express");
const isAuthenticated = require("../middlewares/passportMiddleware");

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;
