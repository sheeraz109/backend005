const Video = require('../models/Video');
const Interaction = require('../models/Interaction');
const SavedVideo = require('../models/SavedVideo'); // Model for saved videos
// Upload video
exports.uploadVideo = async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const videoUrl = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    const video = new Video({
      title,
      description,
      videoUrl: videoUrl, // Save the corrected video URL
      userId: req.user.userId,
    });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Fetch all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const correctedVideos = videos.map((video) => ({
      ...video.toObject(),
      videoUrl: `${req.protocol}://${req.get('host')}/${video.videoUrl.replace(/\\/g, '/')}`,
    }));

    res.status(200).json(correctedVideos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.likeVideo = async (req, res) => {
  try {
    // Find the interaction for the video (this assumes you're storing interactions in an 'Interaction' model)
    let interaction = await Interaction.findOne({ videoId: req.params.id });
    console.log('interation',interation);

    if (!interaction) {
      // If no interaction exists, create a new one for this video
      interaction = new Interaction({ videoId: req.params.id });
    }

    const userId = req.user.userId;

    // Toggle the like
    if (!interaction.likes.includes(userId)) {
      // Add the user to the like array if not already liked
      interaction.likes.push(userId);
    } else {
      // Remove the user from the like array if already liked
      interaction.likes.pull(userId);
    }

    await interaction.save();

    // Return the updated likes count
    res.status(200).json({ likes: interaction.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add comment to video
exports.commentOnVideo = async (req, res) => {
  const { text } = req.body;
  try {
    let interaction = await Interaction.findOne({ id: req.params.videoId });
    if (!interaction) {
      interaction = new Interaction({ id: req.params.videoId });
    }
    interaction.comments.push({ userId: req.user.userId, text });
    await interaction.save();
    res.status(200).json(interaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteVideo = async (req, res) => {
  try {
      const { videoId } = req.params;

      // Find the video and delete it
      const video = await Video.findByIdAndDelete(videoId);

      if (!video) {
          return res.status(404).json({ error: "Video not found" });
      }

      res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

