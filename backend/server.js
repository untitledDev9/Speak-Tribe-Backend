const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// ===== Routes =====
const authRoutes = require("./routes/authRoutes"); // Login, signup, etc.
app.use("/api/auth", authRoutes);

const dashboardRoute = require("./routes/dashboard"); // User dashboard
app.use("/api", dashboardRoute);

const languageRoutes = require("./routes/languageRoute"); // Language data
app.use("/api/language", languageRoutes);

const yorubaAlphabets = require("./routes/yoruba/alphabeteRoutes"); // Yoruba alphabet
app.use("/api/yoruba", yorubaAlphabets);

const userRoutes = require("./routes/userRoutes"); // User profile & settings
app.use("/api/user", userRoutes);




const learnRoutes = require("./routes/learnRoutes");
app.use("/api/learn", learnRoutes);





// ===== Health Check Route =====
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Speak Tribe server is up and running",
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});
