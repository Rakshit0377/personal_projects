const express = require("express");
const router = express.Router();
const { listingSchema } = require("../../schema.js");
const Listing = require("../../models/listing.js");
const {isLoggedIn}= require("../middleware.js");
// const multer  = require('multer');
// const {storage}= require('../layouts/cloudconfig');

// const upload = multer({storage});
// router.post('/', upload.single('listing[image]'), function (req, res, next) {
//     res.send(req.file);
//   });


// New route
router.get("/new", isLoggedIn,(req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create a listing");
        console.log(req.flash("error")); // Verify the flash message
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
});


// Show route
router.get("/:id", async (req, res) => {
    try {
        console.log("Route accessed");
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate("reviews")
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        console.log("Fetched listing:", listing);
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
});


// Create route
router.post("/",isLoggedIn, async(req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


// Edit route
router.get("/:id/edit" ,isLoggedIn,async(req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Update route
router.put("/:id", isLoggedIn, async(req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete route
router.delete("/:id",isLoggedIn, async(req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;