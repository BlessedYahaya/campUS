var express = require("express");
var router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleWare = require("../middleWare/index");



router.get("/", function (req,res){
   
   
   //get campgrounds from database
   Campground.find({},function(err,allcampgrounds){
         if(err){
        console.log("ERROR")
        console.log(err)
    }
    else{
        res.render("campground/index", {campgrounds:allcampgrounds});
          }
    });
    
//CREATE ROUTE
router.post("/", middleWare.isLoggedIn,  function (req,res){
    
    //get data from form and add to camp ground array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.Image;
    var description = req.body.description;
    var username = req.user.username
    var id = req.user._id
    var newCamp = {name:name, price:price, image: image, description: description, creator:{id,username}}
   //Create a new camp and save to db
   Campground.create(newCamp,function(err, added){
        if(err){
        console.log(err)
    }else{
         
          //redirect to campgrounds page
          console.log(newCamp.creator)
    res.redirect("/campgrounds")
        
    }
   })
   });

//NEW ROUTE -- SHOW FORM TO CREATE ROUTE

router.get("/new", middleWare.isLoggedIn, function (req,res){
    res.render("campground/new.ejs")
})

//shows more info about one camp ground
router.get("/:id", function (req,res){
    //find campground with provided template
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
        console.log(err)
    }else{
          //render show template with camp if id description
         
          res.render("campground/show", {campground:foundCamp})
    
        }
        
    })
    
});
})


//edit campground route
router.get("/:id/edit", middleWare.checkCampOwnership, function(req, res){
    
 Campground.findById(req.params.id, function(err, foundCamp){
                         res.render("campground/edit", {
                         campground:foundCamp
                     });   

})   
});


//update campground route
router.put("/:id", middleWare.checkCampOwnership, function(req,res){
     Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err,UpdatedCamp){
        if(err){
            res.redirect("/campgrounds")
            
        }else{
            res.redirect("/campgrounds/" + UpdatedCamp._id )
        }
    } )
})

//DESTROY campground
router.delete("/:id", middleWare.checkCampOwnership, function(req,res){
   Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err){
       if(err){
            req.flash("error", "Somthing went wrong")
           res.redirect("/campgrounds")
       }
        req.flash("success", "Campground deleted")
       res.redirect("/campgrounds")
   })
    
})





module.exports = router;