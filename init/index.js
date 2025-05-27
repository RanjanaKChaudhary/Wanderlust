const mongoose = require ("mongoose");
const initData = require ("./data.js");
const Listing = require("../models/listings.js");

main()
.then(()=>{
    console.log("DB conneceted");
})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  
}

const initDB = async()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner:"682dcf5c28c94f6efa45e172"}));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};


initDB();