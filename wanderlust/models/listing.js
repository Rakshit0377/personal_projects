const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");
const listingSchema = new Schema({
    title: { type: String },
    description: { type: String },
    image: {
      filename: { type: String,  },
      url: { type: String,}
    },
    price: { type: Number },
    location: { type: String },
    country: { type: String },
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
  });
  
  listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
      await Review.deleteMany({id:{$in : listing.reviews}});
    }
  });
  // Create the model
  const Listing = mongoose.model("Listing", listingSchema);
  module.exports = Listing