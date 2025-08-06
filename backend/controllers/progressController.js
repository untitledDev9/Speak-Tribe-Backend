// controllers/progressController.js
const UserProgress = require("../models/UserProgress");

const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const progress = await UserProgress.findOne({ userId });

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress" });
  }
};

module.exports = { getUserProgress };
