 
 // controllers/learnController.js
const User = require("../models/userInfo"); // adjust path/name if different

// Example alphabets — you can move to DB later
const ALPHABETS = {
  yoruba: [
    { letter: "A", pronunciation: "ah" },
    { letter: "B", pronunciation: "beh" },
    { letter: "D", pronunciation: "deh" },
    { letter: "E", pronunciation: "eh" },
    { letter: "Ẹ", pronunciation: "air" },
    { letter: "F", pronunciation: "feh" },
    { letter: "G", pronunciation: "geh" },
    { letter: "GB", pronunciation: "gb" },
    { letter: "H", pronunciation: "heh" },
    { letter: "I", pronunciation: "ee" },
    { letter: "J", pronunciation: "jeh" },
    { letter: "K", pronunciation: "keh" },
    { letter: "L", pronunciation: "leh" },
    { letter: "M", pronunciation: "meh" },
    { letter: "N", pronunciation: "neh" },
    { letter: "O", pronunciation: "oh" },
    { letter: "Ọ", pronunciation: "aw" },
    { letter: "P", pronunciation: "peh" },
    { letter: "R", pronunciation: "reh" },
    { letter: "S", pronunciation: "seh" },
    { letter: "Ṣ", pronunciation: "sh" },
    { letter: "T", pronunciation: "teh" },
    { letter: "U", pronunciation: "oo" },
    { letter: "W", pronunciation: "weh" },
    { letter: "Y", pronunciation: "yeh" }
  ],
  // add other languages if needed
};

exports.getAlphabetsWithProgress = async (req, res) => {
  try {
    const language = (req.params.language || "yoruba").toLowerCase();
    const alphabets = ALPHABETS[language] || [];

    // req.user should be set by your auth middleware (protect)
    const userId = req.user?._id || req.user?.userId || req.user?.id;
    let alphabetProgressPercent = 0;

    if (userId) {
      const user = await User.findById(userId).select("progress");
      if (user && user.progress && typeof user.progress.alphabet === "number") {
        alphabetProgressPercent = user.progress.alphabet; // stored as percentage 0-100
      }
    }

    return res.json({
      alphabets,
      progress: { alphabet: alphabetProgressPercent }
    });
  } catch (err) {
    console.error("getAlphabetsWithProgress:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateAlphabetProgress = async (req, res) => {
  try {
    const language = (req.params.language || "yoruba").toLowerCase();
    const { progress } = req.body; // expect a number 0..100
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "progress must be a number 0-100" });
    }

    const userId = req.user?._id || req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // update only alphabet progress (keeps words/sentences untouched)
    const user = await User.findById(userId).select("progress");
    const current = user?.progress || { alphabet: 0, words: 0, sentences: 0 };
    current.alphabet = progress;

    const updated = await User.findByIdAndUpdate(
      userId,
      { progress: current },
      { new: true, runValidators: true }
    ).select("progress");

    return res.json({ progress: updated.progress });
  } catch (err) {
    console.error("updateAlphabetProgress:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
