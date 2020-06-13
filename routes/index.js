const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//WELCOME PAGE
router.get("/", (req, res) => {
    // res.send("welcome");
    res.render("welcome"); // renders the welcome.ejs page
});

//DASHBOARD with authenticated
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        name: req.user.name,
    }); // renders the dashboard.ejs page
});

module.exports = router;