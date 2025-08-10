const User = require("../models/User"); // match your actual model file name

// GET the logged-in user's info
const getMe = async (req, res) => {
  try {
    // req.user is set by your authentication middleware
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE the logged-in user's selected language
const updateUserLanguage = async (req, res) => {
  const { selectedLanguage } = req.body;

  if (!selectedLanguage) {
    return res.status(400).json({ message: "No language selected" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.userId, // support both
      { selectedLanguage },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Language updated successfully",
      selectedLanguage: updatedUser.selectedLanguage,
    });
  } catch (error) {
      console.error("Language update error:", error);
    console.error("Error updating language:", error);
    res.status(500).json({ message: "Failed to update language" });
  }
};

module.exports = {
  getMe,
  updateUserLanguage
};
