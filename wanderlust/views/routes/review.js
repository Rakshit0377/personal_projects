const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../../schema.js");
const Review = require("../../models/review.js");
const Listing = require("../../models/listing.js");

// Create a review
router.post("/", async (req, res) => {
    try {
        console.log("Review Data Received:", req.body.review);

        // Validate data
        // const result = reviewSchema.validate(req.body.review);
        // if (result.error) {
        //     console.log("Validation Error:", result.error.details);
        //     req.flash("error", `Validation Error: ${result.error.details.map(el => el.message).join(",")}`);
        //     return res.redirect(`/listings/${req.params.id}`);
        // }

        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const newReview = new Review(req.body.review);
        console.log("New Review Created:", newReview);

        await newReview.save();
        console.log("Review Saved Successfully!");

        listing.reviews.push(newReview._id);
        await listing.save();
        console.log("Review Added to Listing!");

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("Error Adding Review:", err);
        req.flash("error", "Failed to add review.");
        res.redirect(`/listings/${req.params.id}`);
    }
});


// Delete a review
router.delete("/:reviewId", async (req, res) => {
    try {
        const { id, reviewId } = req.params;

        // Remove the review reference from the listing
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        // Delete the review
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to delete review.");
        res.redirect(`/listings/${id}`);
    }
});

module.exports = router;
