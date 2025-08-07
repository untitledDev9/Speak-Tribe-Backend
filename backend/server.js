const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config();
connectDB()
const app = express()

// middlewares
app.use(cors())
app.use(express.json())     // to parse json data or bodies

// routes
const authRoutes = require('./routes/authRoutes')   // all my auth contollers e.g login, signup
app.use('/api/auth', authRoutes)    // base URL

const dashboardRoute = require('./routes/dashboard'); // user dashboard routh
app.use('/api', dashboardRoute);

const languageRoutes = require('./routes/languageRoute');
app.use('/api/language', languageRoutes);

const yorubaAlphabets = require('./routes/yoruba/alphabeteRoutes'); // yoruba alphabet
app.use('/api/yoruba', yorubaAlphabets);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

app.get('/', (req,res) => {
  res.status(200).json({
    message: 'Speak Tribe server is up and running'
  })
})













const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT} ✅✅✅`)
})
