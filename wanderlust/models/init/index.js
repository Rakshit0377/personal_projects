const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../listing");
main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.error("Error connecting to DB:", err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
const initDB = async () =>{
    await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({...obj,owner:"652d0081ae547c5d37e56b5f"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialied");
}
initDB();