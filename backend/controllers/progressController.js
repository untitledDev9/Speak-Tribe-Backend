// controllers/progressController.js
const User = require("../models/User"); // adjust if your model filename differs

// GET /api/user/progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("progress");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ensure progress object exists
    const progress = user.progress || { alphabet: 0, words: 0, sentences: 0 };
    return res.json({ progress });
  } catch (err) {
    console.error("Get progress error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/progress
// Accepts either:
// 1) { progress: { alphabet: 10, words: 5 } }  -- merges keys
// 2) { stage: "alphabet", value: 10 }          -- updates single stage
exports.updateUserProgress = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { progress, stage, value } = req.body;
    const allowedStages = ["alphabet", "words", "sentences"];

    // load existing progress
    const user = await User.findById(userId).select("progress");
    if (!user) return res.status(404).json({ message: "User not found" });

    const current = user.progress || { alphabet: 0, words: 0, sentences: 0 };
    const newProgress = { ...current };

    if (progress && typeof progress === "object") {
      for (const k of Object.keys(progress)) {
        if (allowedStages.includes(k) && typeof progress[k] === "number") {
          newProgress[k] = progress[k];
        }
      }
    } else if (stage && allowedStages.includes(stage) && typeof value === "number") {
      newProgress[stage] = value;
    } else {
      return res.status(400).json({
        message:
          'Provide "progress" object or { stage: "<alphabet|words|sentences>", value: <number> }',
      });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { progress: newProgress },
      { new: true, runValidators: true }
    ).select("progress");

    return res.json({ progress: updated.progress });
  } catch (err) {
    console.error("Update progress error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
