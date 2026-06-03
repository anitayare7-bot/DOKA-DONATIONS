const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

// ROUTES
const donationRoutes = require("./routes/donationRoutes")
app.use("/api/donations", donationRoutes)

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("DAKO API running...")
})

// MONGO CONNECT
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))