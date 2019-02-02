var mongoose = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var Userschema =  new mongoose.Schema({
    username: String,
    passport: String
});

Userschema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", Userschema)