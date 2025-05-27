
const Listing = require ("../models/listings");
module.exports.index = async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
  
  };

  module.exports.renderNewForm = ( req,res)=>{
  res.render("listings/new.ejs");
  };

  module.exports.createListing  =  async(req,res)=>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        newListing.owner = req.user._id; 
        res.redirect("/listings");
        req.flash("success","New listing created");
};

module.exports.renderEditForm = async(req,res)=>{
    let id = req.params.id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
  };

module.exports.updateListing = async(req,res)=>{
    let id = req.params.id.trim();
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
  };
  
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    res.render("listings/show.ejs",{listing});
  };

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
  
  };