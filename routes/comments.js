//======================================
//COMMENTS ROUTE
//======================================
var express = require("express");
var router = express.Router({mergeParams:true})
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleWare = require("../middleWare/index")

router.get("/new", middleWare.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
        }else{
             res.render("comment/new",{
                 campground:campground
             })         
        }
    })
    
   
})

//comment creator

router.post("/", middleWare.isLoggedIn,  function(req,res){
    //lookup camp using id
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err){
            req.flash("error", "Somthing went wrong")
            res.redirect("/campgrounds")
        }else{
            
            
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                     req.flash("error", "Somthing went wrong")
                }else{
                    //add usename and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    //save comment
                    comment.save()
                    //push to campground as associate
                    foundCamp.comments.push(comment)
                    //save comment
                    foundCamp.save()
                    
                    req.flash("success", "Comment Added ")
                    res.redirect('/campgrounds/' + foundCamp._id)
                   
                }
            })
            //connect new comment to camp
            
            
            
           
        }
    })
    
    //redirect
})

//edit comment form
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function(req,res){

Comment.findById(req.params.comment_id, function(err, foundComment) {
    res.render("comment/edit", 
    {
        campground_id : req.params.id,
        comment:foundComment
    })
})    
})

//update comment
router.put("/:comment_id", middleWare.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,  updatedComment){
        if(err){
            req.flash("error", "You need to be logged in")
            
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })                                                                                                                                                                                                        
})


//delete comment
router.delete("/:comment_id", middleWare.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){
        if(err){
            req.flash("error", "Somthing went wrong")
            
        }else{
             req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})






module.exports = router;