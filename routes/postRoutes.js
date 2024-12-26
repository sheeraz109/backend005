// // postRoutes.js
// const express = require("express");
// const { getPosts, createPost, likePost } = require("../controllers/postController");
// const auth = require("../middleware/auth");
// const router = express.Router();

// module.exports = (io) => {
//   router.get("/posts", getPosts);  // Retrieve all posts
//   router.post("/posts", auth, (req, res) => {
//     req.io = io;                  // Attach `io` to `req` for createPost
//     createPost(req, res);
//   });
//   router.put("/posts/:id/like", auth, (req, res) => {
//     req.io = io;                  // Attach `io` to `req` for likePost
//     likePost(req, res);
//   });
  

//   return router;
// };


const express = require("express");
const { getPosts, createPost, likePost } = require("../controllers/postController");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = (io) => {
  router.get("/posts", getPosts);  // Retrieve all posts
  router.post("/posts", auth, upload.single("video"), (req, res) => {
    req.io = io;  // Attach `io` to `req` for createPost
    createPost(req, res);
  });
  router.put("/posts/:id/like", auth, (req, res) => {
    req.io = io;  // Attach `io` to `req` for likePost
    likePost(req, res);
  });

  return router;
};
