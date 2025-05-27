const express = require ("express");
const router = express.Router();
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listings.js");
const {isLoggedIn} = require ("../middleware.js");
const listingController = require ("../controllers/listing.js");
// const multer = require ('multer')
// const upload = multer ({dest: 'uploads/'})

const validateListing = (req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error);
  } else{
    next();
  }};


  router
  .route ("/")
  .get( wrapAsync (listingController.index))
  .post(isLoggedIn, wrapAsync (listingController.createListing));
  
  
  
  //edit route
  
  router.get("/:id/edit", isLoggedIn, wrapAsync (listingController.renderEditForm));
  
//new route
  router.get("/new",isLoggedIn,listingController.renderNewForm);
 
  router
  .route ("/:id")
  .get( wrapAsync (listingController.showListing ))
  .put( isLoggedIn, wrapAsync (listingController.updateListing))
  .delete(isLoggedIn, wrapAsync (listingController.destroyListing));
  
  

  

  
    
  
  
  
  
module.exports = router;  