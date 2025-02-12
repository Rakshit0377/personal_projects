const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        trim: true,
        required: true,  // Ensure a comment is provided
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,  // Ensure a rating is provided
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Review", reviewSchema);
