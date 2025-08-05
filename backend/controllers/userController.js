const userModel = require("../models/User");

const updateUserLanguage = async (req, res) => {
  const userId = req.user._id; // from the token
  const { selectedLanguage } = req.body;

  if (!selectedLanguage) {
    return res.status(400).json({ message: "No language selected" });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { selectedLanguage },
      { new: true }
    );

    res.status(200).json({
      message: "Language updated successfully",
      selectedLanguage: user.selectedLanguage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update language", error });
  }
};

module.exports = {
  updateUserLanguage,
};
