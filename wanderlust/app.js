// require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const listingRouter = require("./views/routes/listing.js");
const reviewRouter = require("./views/routes/review.js");
const userRouter = require("./views/routes/user");

// Database connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to DB");
}

main().catch((err) => {
    console.error("Error connecting to DB:", err);
});

// Middleware setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: false, // Set to true in production if using HTTPS
        sameSite: "strict",
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Helper middleware to check authentication
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect("/login");
    }
    next();
};

// // Routes
// app.get("/", (req, res) => {
//     res.send("Welcome to Wanderlust!");
// });

app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/listings/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/listings", isLoggedIn, async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Edit route
app.get("/listings/:id/edit", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Update route
app.put("/listings/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete route
app.delete("/listings/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Demo user creation
app.get("/demouser", async (req, res) => {
    try {
        let existingUser = await User.findOne({ email: "student@gmail.com" });
        if (existingUser) return res.send("User already exists: " + existingUser);

        const fakeUser = new User({ email: "student@gmail.com", username: "Rak" });
        const registeredUser = await User.register(fakeUser, "helloworld");
        res.send(registeredUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating demo user");
    }
});

// Include external routers
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);
app.use("/", userRouter);

// Catch-all for undefined routes
app.all("*", (req, res) => {
    res.status(404).send("Page not found!");
});

// Start server
app.listen(8089, () => {
    console.log("Server is running on port 8081");
});
