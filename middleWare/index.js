var middleWareObj = {};
var Campground = require("../models/campground")
var Comment = require("../models/comment")


middleWareObj.checkCampOwnership = function checkCampOwnership(req,res,next){
     if (req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCamp){
            if (err){
                req.flash("error", "Campground not Found")
            }
                else{
                    //does the user own the campground
                    if(foundCamp.creator.id.equals(req.user._id)){
                        next()  
                    }else{
                       req.flash("error", "Permission Denied")
                       res.redirect("back");
                    }    
                }
            })
        
    }else{
        req.flash("error", "You need to be logging in")
        
        res.redirect("back");
    }
   
  }




middleWareObj.checkCommentOwnership = function checkCommentOwnership(req,res,next){
     if (req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                req.flash("error", "Campground not found")
                res.redirect("back")
            }
                else{
                    //does the user own the comment
                    if(foundComment.author.id.equals(req.user._id)){
                        next()  
                    }else{
                         req.flash("error", "You don't have permission t do that")
                       res.redirect("back");
                    }    
                }
            })
        
    }else{
         req.flash("error", "You need to be logging in")
        
        res.redirect("back");
    }
   
  }




middleWareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
   req.flash("error", "You need to logged In")
    res.redirect("/login");
}









module.exports = middleWareObj;