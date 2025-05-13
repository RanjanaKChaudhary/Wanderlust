
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const Review = require ("./review.js")

main()
.then(()=>{
    console.log("DB connected");
})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust'); 
}

const listingSchema = new Schema({
    title:String,
    description:String,
    image:{
        type:String,
                default: "https://pixabay.com/photos/hotel-travel-palm-luxury-tourism-1831072/",
                
                set: (v)=>v==="" ? "https://pixabay.com/photos/hotel-travel-palm-luxury-tourism-1831072/":v,
            },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        },
        
    ],
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;