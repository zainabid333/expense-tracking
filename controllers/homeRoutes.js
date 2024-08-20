const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home Page",
        user: req.session.user || null,
    });
});

module.exports = router;
