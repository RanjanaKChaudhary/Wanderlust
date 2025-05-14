const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const path = require ("path");
const methodOverride = require ("method-override"); 
const ejsMate = require ("ejs-mate");
const ExpressError = require ("./utils/ExpressError.js");
const listings = require ("./routes/listing.js");
const reviews = require ("./routes/review.js");


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

app.use ("/listings", listings);
app.use ("/listings/:id/reviews",reviews);
    

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

  


  

//error handler
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"} = err;
  res.render("error.ejs" ,{message});
  // res.status(statusCode).send(message);
});

