const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRediectUrl } = require("../utils/middleware");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { email, username, password,confirmPassword } = req.body;
    if(confirmPassword!==password){
      throw new ExpressError(500,"Password and Confirm Password should be same");
    }
    const newUser = new User({ email: email, username: username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome to WanderLust, ${username}`);
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRediectUrl,
  passport.authenticate("local", {
    // A middleware that is used to authenticate the data entered by the user
    failureRedirect: "/login", // If authentication fails then where to redirect
    failureFlash: true, // If authentication fails then whether to flash message or not
  }),
  wrapAsync(async (req, res) => {
    let { username, password } = req.body;
    console.log("Password ---> ", password);
    req.flash("success", `Welcome back, ${username}`);

    let redirectUrl = res.locals.redirectUrl
      ? res.locals.redirectUrl
      : "/listings";

    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "You are Logged Out!");
    res.redirect("/listings");
  });
});

module.exports = router;
