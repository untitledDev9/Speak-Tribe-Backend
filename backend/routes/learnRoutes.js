// routes/learnRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // your existing middleware
const learnController = require("../controllers/learnController");

router.get("/:language/alphabet", protect, learnController.getAlphabetsWithProgress);
router.put("/:language/alphabet/progress", protect, learnController.updateAlphabetProgress);

module.exports = router;
