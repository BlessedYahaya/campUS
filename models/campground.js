var mongoose = require("mongoose");

//setup Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    creator:{
        id:{
            type: mongoose.Schema.Types.ObjectId ,
            ref:"User"
        }, username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
        ]
})

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
