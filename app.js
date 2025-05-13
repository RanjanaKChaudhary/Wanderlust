const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listings.js");
const path = require ("path");
const methodOverride = require ("method-override"); 
const ejsMate = require ("ejs-mate");
const { nextTick } = require("process");
const wrapAsync = require ("./utils/wrapAsync.js");
const ExpressError = require ("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");
const listings = require ("./routes/listing.js");


main()
.then(()=>{  
    console.log("DB conneceted");
}).catch(err => console.log(err));



async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.listen("8080",(req,res)=>{
    console.log("app is listening on port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

  // review validation
  const validateReview = (req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressError(400, result.error);
    } else{
      next();
    }};

app.use ("/listings", listings);
    

  
//review post route
app.post("/listings/:id/reviews",  wrapAsync ( async (req,res)=>{

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review (req.body.review);
  
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  
  // console.log("New review saved");
  // res.send("new review saved");
  res.redirect(`/listings/${listing._id}`);
  
  
  }));

  // review delete route
  app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }));

//error handler
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"} = err;
  res.render("error.ejs" ,{message});
  // res.status(statusCode).send(message);
});

