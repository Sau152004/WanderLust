const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("../init/data.js");

async function main() {
  await mongoose.connect(
    "mongodb+srv://akashmishra15703:Ashok15%40@cluster0.swcoivv.mongodb.net/?retryWrites=true&w=majority"
  );
}

main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


 async function initDB() {
  // await Listing.deleteMany({});
  // console.log(initData.data);

//  await Listing.insertMany(initData.data).then(() => {
//     console.log("Initailised DB Successfully");
//   });

  // for (let i = 0; i < initData.data.length; i++) {
  //   let res=  await Listing.insert(initData.data[i]);
  //   // await res.save();
  //   console.log(res);
  // }

  let ans= await new Listing({
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    owner: '65f758b31612281bf71baa24',
    gst: 12,
    category: "lake",
    geometry:{ type: 'Point', coordinates: [ -118.689423, 34.035591 ] },
  });

  let a= await ans.save();
  console.log(a);

}

initDB();
