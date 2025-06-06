const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const path = require ("path");
const methodOverride = require ("method-override"); 
const ejsMate = require ("ejs-mate");
const ExpressError = require ("./utils/ExpressError.js");

const listings = require ("./routes/listing.js");
const reviews = require ("./routes/review.js");
const user = require ("./routes/user.js");

const { Session } = require("inspector/promises");
const session =require ("express-session");
const flash = require ("connect-flash");
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const User = require ("./models/user.js");


main()
.then(()=>{  
    console.log("DB connected");
}).catch(err => console.log(err));



async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.listen("8080",(req,res)=>{
    console.log("app is listening on port 8080");
});

//session
const sessionOptions={
  secret:"mysecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httponly:true
  },
};


app.use(session(sessionOptions));
app.use (flash());

app.use (passport.initialize());
app.use (passport.session());
passport.use (new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash ("success");
  res.locals.error = req.flash ("error");
  res.locals.currUser = req.user;
  next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use ("/listings", listings);
app.use ("/listings/:id/reviews",reviews);
app.use ("/", user);


//main page route
app.get("/",(req,res)=>{
   res.redirect("/listings")});
    

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

