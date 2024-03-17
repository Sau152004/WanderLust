const mongoose = require("mongoose");
const MONGODB_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");
const initData = require("../init/data.js");

async function main() {
  await mongoose.connect(MONGODB_URL);
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

  // To add owner to the already created listings
  initData.data = initData.data.map((pre) => ({
    ...pre,
    owner: "65f1a0123ae876d121ae63aa",
  }));
  
  Listing.insertMany(initData.data).then((res) => {
    console.log("Initailised DB Successfully");
  });
}

initDB();
