
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer middleware for video uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // Limit size to 50MB for larger videos
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/mkv' ||
      file.mimetype === 'video/webm' ||
      file.mimetype === 'video/avi' ||
      file.mimetype === 'video/mov' // Add more formats if necessary
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (mp4, mkv, webm, avi, mov) are allowed!'));
    }
  },
});

module.exports = upload;
