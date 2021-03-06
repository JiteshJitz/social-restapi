const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update user
router.put("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id || req.user.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bycrpt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch(err) {
                return res.status(500).json("Some error");
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch(err){
            return res.status(500).json("some error 2");
    }
    } else {
        return res.status(403).json("You can only update your account")
    }
});

//delete user

router.delete("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
    
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted scucessfully");
        } catch(err){
            return res.status(500).json("some error 2");
    }
    } else {
        return res.status(403).json("You can only delete your account")
    }
});

//get a user
router.get("/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password,updateAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (err){
        res.status(500).json(err)
    }
});
//follow a user

router.put("/:id/follow", async (req, res)=>{
    // Check to see you are not follwing yourself
    if (req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //check to see if you are not already follwing the user
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {following: req.params.id}});
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already follow this user");
            }
        } catch(err){
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow youself")
    }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res)=>{
    // Check to see you are not follwing yourself
    if (req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //check
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}});
                await currentUser.updateOne({$pull: {following: req.params.id}});
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you dont follow this user");
            }
        } catch(err){
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot unfollow youself")
    }
});

module.exports = router