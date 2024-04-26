const router = require("express").Router();
const bcrypt = require("bcrypt");
const { findById } = require("../models/User");
const User = require("../models/User");

//update user
router.put("/id", async(req, res)=>{
    if(req.body.userId == req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err)
            {
                return res.status(500).json(err);
            }
        }
            try
            {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });
                res.status(200).json("Account updated")    
            }catch(err)
            {
                return res.status(500).json(err);
            }
    } else{
        return res.status(403).json("you can only update your account")
    }
})


//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            const user = await User.deleteOne({ _id: req.params.id });
            res.status(200).json("Account deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only delete your account");
    }
});


//get a user
router.get("/:id", async(req, res)=>{
    try{
        const user = await User/findById(req.params.id);
        const {password, updateAt, ...other} = user.doc;
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
});

//follow a user
router.put("/:id/follow", async (req, res)=> {
    if(req.body.userId !== req.params.id){ //if the user are same, if not proceed
        try{
            //checking the users
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.id);
            //if this user doesnt follow this user already then add the user
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUserser.updateOne({$push:{following:req.body.id}});  
                res.sendStatus(200).json("user has been followed");
            }
            else{  //othersie send this messgae
                res.status(403).json("you already foolow this user")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }else{ //if they are same
        res.status(403).json("you cant follow urself");
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res)=> {
    if(req.body.userId !== req.params.id){ //if the user are same, if not proceed
        try{
            //checking the users
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.id);
            //if this user  follow this user already then remove the user
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUserser.updateOne({$pull:{following:req.body.id}});  
                res.sendStatus(200).json("user has been unfollowed");
            }
            else{  //othersie send this messgae
                res.status(403).json("you already unfollowed this user")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }else{ //if they are same
        res.status(403).json("you cant unfollow urself");
    }
})

module.exports = router