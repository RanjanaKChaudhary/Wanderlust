const express = require ("express");
const router = express.Router();
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listings.js");

const validateListing = (req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error);
  } else{
    next();
  }};


 
  
  //Index route
  router.get("/",  wrapAsync (async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
  
  }));
  
  //new route
  router.get("/new", ( req,res)=>{
  res.render("listings/new.ejs");
  });
  
  //create route
  
  router.post("/", wrapAsync ( async(req,res)=>{
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
  })
  ); 
  
  //edit route
  
  router.get("/:id/edit",  wrapAsync (async(req,res)=>{
    let id = req.params.id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
  }));
  
  //update route
  
  router.put("/:id", wrapAsync (async(req,res)=>{
    let id = req.params.id.trim();
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
  }));
  
  //show route
  
  router.get("/:id", wrapAsync ( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
  }));
  
  
  
  //delete route
  
  router.delete("/:id", wrapAsync (async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
  
  }));
  
module.exports = router;  