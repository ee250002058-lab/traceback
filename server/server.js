require("dotenv").config()
const express  = require("express")
const mongoose = require("mongoose")
const cors     = require("cors")
const itemsRouter = require("./routes/items")

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json({ limit: "10mb" })) // 10mb to handle base64 images

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/items", itemsRouter)

// Health check — visit http://localhost:5000 to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "Traceback server is running ✅" })
})

// ── Connect to MongoDB then start server ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas")
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message)
    process.exit(1)
  })