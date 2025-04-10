const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");

// Get all posts
router.get("/", async (req, res) => {
   try {
      const posts = await Post.find();
      res.json(posts);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
});

// Get a post
router.get("/:id", async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found." });

      res.status(200).json(post);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
});

// Create a post
router.post("/", verifyToken, async (req, res) => {
   try {
      const { content, media } = req.body;

      const newPost = new Post({
         content,
         media,
         userId: req.user.id,
      });
      await newPost.save();

      res.status(201).json({ message: "Post created successfully." });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Like a post
router.post("/:id/like", verifyToken, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found." });

      const userId = req.user.id;
      if (post.likes.includes(userId))
         return res
            .status(400)
            .json({ message: "You already liked this post." });

      post.likes.push(userId);
      await post.save();

      res.status(200).json({ message: "Post liked!" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Comment on a post
router.post("/:id/comment", verifyToken, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found." });

      const userId = req.user.id;
      const { text } = req.body;

      if (!text)
         return res.status(400).json({ message: "Comment cannot be empty." });

      post.comments.push({
         user: userId,
         text: text,
      });
      await post.save();

      res.status(200).json({ message: "Comment added!" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Share a post
router.post("/:id/share", verifyToken, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found." });

      const userId = req.user.id;
      if (post.shares.includes(userId)) {
         return res
            .status(400)
            .json({ message: "You already shared this post." });
      }

      post.shares.push(userId);
      await post.save();

      res.status(200).json({ message: "Post shared!" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

// Delete a post
router.delete("/:id", verifyToken, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found." });

      await Post.deleteOne(post);

      res.status(200).json({ message: "Post deleted successfully." });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

module.exports = router;
