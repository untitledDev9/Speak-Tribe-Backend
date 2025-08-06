// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUserProgress } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");
const { updateUserLanguage } = require("../controllers/userController");

router.get("/progress", protect, getUserProgress);

router.put("/language", protect, updateUserLanguage);
module.exports = router;
