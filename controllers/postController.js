// // postController.js
// const Post = require("../models/postModel");

// exports.getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve posts" });
//   }
// };

// exports.createPost = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const post = new Post({ title, content });
//     await post.save();

//     req.io.emit("newPost", post);  // Emit new post to all clients
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(400).json({ error: "Failed to create post" });
//   }
// };

// exports.likePost = async (req, res) => {
//   try {
//     const post = await Post.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );

//     req.io.emit("likePost", post);  // Emit like update to all clients
//     res.json(post);
//   } catch (error) {
//     res.status(400).json({ error: "Failed to like post" });
//   }
// };




const Post = require("../models/postModel");
const axios = require("axios");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
};


exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const video_url = req.file.path;  // Video URL stored in the uploads directory

  try {
    const newPost = new Post({ title, content, video_url });
    await newPost.save();

    req.io.emit("newPost", newPost);  // Emit new post via socket
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
};


exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    req.io.emit("likePost", post); // Emit like update to all clients
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: "Failed to like post" });
  }
};

