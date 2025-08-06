const userModel = require('../models/User');

const selectLanguage = async (req, res) => {
  const { userId } = req.user; // from auth middleware
  const { language } = req.body;

  // The default progress for a new language
  const defaultProgress = {
    alphabet: true,
    colors: false,
    greetings: false,
    words: false,
    sentences: false
  };

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.language = language;
    user.progress[language] = defaultProgress;

    await user.save();

    res.status(200).json({
      message: "Language selected successfully",
      language,
      progress: user.progress[language]
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { selectLanguage };
