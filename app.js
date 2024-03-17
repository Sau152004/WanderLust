const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const path = require("path");
// const MONGODB_URL = "mongodb://127.0.0.1:27017/wanderlust";

const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');  // mongo-session
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routes of models
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./models/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());

const Atlas_Url= process.env.ATLAS_URL;
async function main() {
  await mongoose.connect(Atlas_Url);
}

main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// app.get("/", (req, res) => {
//   res.send("Everything Normal");
//   // console.log(req.cookies);
//   // console.log("Hello", req.cookies.name.toUpperCase());
//   console.log(req.session);
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("greet","namaste",{expires:  new Date(Date.now() + 9000)});   // It takes values in name-value pair and a explicit options
//   // with expires it will expire in that much of time 9s after creation
//   res.cookie("name","Akash");
//   res.send("We sent you some cookies");
// });


const store= MongoStore.create({
  mongoUrl : Atlas_Url,
  crypto:{
    secret :process.env.SECRET,    //you can simply use secret but to encryt the code and make it more safe it is ude in crypto
  },
  touchAfter : 24*60*60,  //time in second after how many hour the mongo session is expired
});

store.on("error",()=>{
   console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,   //pass the mongo session  info to express-session options 
  secret: process.env.SECRET, // It is compulsory while other options are on choice
  // It is generally not like this in human readable string but some unarranged characters by machine rather than manual
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Ek hafte tak session ka data cookie ke form me store rahega.
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //Initialise passport
app.use(passport.session()); // if a request is made from different pages then let them understand as single session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Storing information about user in the session storage
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //Store flash message in local variable
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//       const fakeUser={
//         email:"fakeuser234@gmail.com",
//         username: "fakeUser123"    //It is not defined explicitly in the schema but it can be used
//         // We don not define the password here
//       };
//       let registerdUser= await User.register(fakeUser,"helloworld");   //It takes 3 arguments userdetails, password, callback function
//       res.send(registerdUser);
// });

app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.get(
  "/search",
  wrapAsync(async (req, res) => {
    let toSearch = "";
    let f = req.query.searchValue.split(" ");
    for (let i = 0; i < f.length; i++) {
      let x = f[i].substring(0, 1).toUpperCase();
      x += f[i].substring(1);
      toSearch +=" "+ x;
    }
    toSearch=toSearch.trim();
    // let toSearch = f + req.query.searchValue.substring(1);
    console.log(toSearch);

    if(!toSearch || toSearch.length<2){
      req.flash("error","Please enter a valid keyword");
      return res.redirect("/listings");
    }

    let allListings = await Listing.find({ location: toSearch });
    let country = await Listing.find({ country: toSearch });
    let title = await Listing.find({ title: toSearch });

    // console.log("Country--> ", country);
    // console.log("Title--> ", title);

    if (country && country.length > 0) {
      for (let i = 0; i < country.length; i++) {
        allListings.push(country[i]);
      }
    }

    if (title && title.length > 0) {
      for (let i = 0; i < title.length; i++) {
        allListings.push(title[i]);
      }
    }
    // console.log(allListings);

    if (!allListings || allListings.length == 0) {
      throw new ExpressError(
        404,
        "No rooms available at this loaction. Try with some other location or keyword."
      );
    }
    res.render("listings/index.ejs", { allListings });
  })
);

app.all("*", (req, res, next) => {
  // for all the type of request whose path didnot matches the above paths
  next(new ExpressError(404, "Page Not Found!!"));
});

// Custom Error Handler
app.use((err, req, res, next) => {
  // all four arguments must be passed weather used or not
  const {
    name = "Error",
    statusCode = 500,
    message = "Something Went Wrong",
  } = err;
  console.log(err.name, " ", err.message);
  res.status(statusCode).render("listings/error.ejs", { message, name });
});

app.listen(port, () => {
  console.log(`App is listening at port: ${port}`);
});
