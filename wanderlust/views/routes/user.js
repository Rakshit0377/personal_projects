const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // Register the user
        console.log(registeredUser);

        // Log in the user programmatically
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); // Pass error to the error-handling middleware
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong during registration.");
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login", // Redirect to /login if authentication fails
        failureFlash: true,        // Enable flash messages for authentication errors
    }),
    async (req, res) => {
        try {
            req.flash("success", "Welcome back!");
            res.redirect(res.locals.redirectUrl || "/listings"); // Redirect after successful login
        } catch (err) {
            console.error(err);
            req.flash("error", "Something went wrong.");
            res.redirect("/login");
        }
    }
);

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now.");
        res.redirect("/listings");
    });
});

module.exports = router;
