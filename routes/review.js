const express = require ("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");

const reviewController = require ("../controllers/reviews.js");

// / review validation
  const validateReview = (req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400, result.error);
    } else{
      next();
    }};


//review post route
router.post("/", wrapAsync(reviewController.createReview ));

  // review delete route
  router.delete("/:reviewId",wrapAsync(reviewController.destroyReview));

  module.exports = router;  