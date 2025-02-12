const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(), // Removed the stray period (.)
        image: Joi.string().allow("", null) // Allows empty or null values for the image field
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(), // Ensures the rating is between 1 and 5
        comment: Joi.string().required() // The comment is required
    }).required()
});
