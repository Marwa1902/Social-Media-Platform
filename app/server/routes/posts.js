const router = require("express").Router();
const Post = require("../models/Post");

//create a post
router.post("/", async (req, res)=>{
    const newPost = await Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json(save);
    }catch(err){
        res.status(500).json(err);
    }
});

//like a post or unliike a post
router.put("/:id/like", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked");
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been disliked");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//get a post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline post
router.get("/timeline/all", async(req, res)=>{
    let postArray = [];
    try{
        const currentUser = await User.findById(req.query.userId); // Retrieve userId from query parameters
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch(err){
        res.status(500).json(err);
    }
});

// Create a new post with attachments
router.post("/", async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.status(200).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add attachments to an existing post
router.put("/:id/attachments", async (req, res) => {
    try {
        const { id } = req.params;
        const { attachments } = req.body;

        // Find the post by ID and update the attachments field
        const updatedPost = await Post.findByIdAndUpdate(id, { attachments }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error adding attachments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
