const mongoose = require("mongoose");
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose);  // Now passport will work fine with mongoose and itself creates username and password field in the schema
// It will also do hashing and salting by itself

const User= mongoose.model("User",userSchema);
module.exports= User;