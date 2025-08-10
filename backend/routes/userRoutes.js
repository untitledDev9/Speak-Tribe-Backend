const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { getUserProgress, updateUserProgress } = require("../controllers/progressController");
const { getMe, updateUserLanguage } = require("../controllers/userController");

// progress endpoints
router.get("/progress", protect, getUserProgress);
router.put("/progress", protect, updateUserProgress);

// other user routes
router.get("/me", protect, getMe);
router.put("/language", protect, updateUserLanguage);

module.exports = router;
