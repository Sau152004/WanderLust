const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("../init/data.js");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/miniProject");
}

main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


 async function initDB() {
  await Listing.deleteMany({});
  console.log(initData.data);

 await Listing.insertMany(initData.data).then(() => {
    console.log("Initailised DB Successfully");
  });

  // for (let i = 0; i < initData.data.length; i++) {
  //   let res=  await Listing.insert(initData.data[i]);
  //   // await res.save();
  //   console.log(res);
  // }

}

initDB();
