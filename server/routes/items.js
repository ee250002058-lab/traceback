const express   = require("express")
const mongoose  = require("mongoose")
const router    = express.Router()

// ── Schema ────────────────────────────────────────────────────────────────────
const itemSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  location:    { type: String, required: true, trim: true },
  status:      { type: String, enum: ["Lost", "Found", "Resolved"], default: "Lost" },
  category:    { type: String, default: "" },
  description: { type: String, default: "" },
  dateTime:    { type: String, default: "" },
  image:       { type: String, default: null }, // base64 string
  createdAt:   { type: Number, default: () => Date.now() }
})

const Item = mongoose.model("Item", itemSchema)

// ── GET all items ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" })
  }
})

// ── POST new item ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body)
    const saved = await item.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ error: "Failed to create item", details: err.message })
  }
})

// ── PUT edit item ─────────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ error: "Item not found" })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: "Failed to update item", details: err.message })
  }
})

// ── PATCH resolve item ────────────────────────────────────────────────────────
router.patch("/:id/resolve", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    )
    if (!updated) return res.status(404).json({ error: "Item not found" })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: "Failed to resolve item" })
  }
})

// ── DELETE item ───────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: "Item not found" })
    res.json({ message: "Item deleted" })
  } catch (err) {
    res.status(400).json({ error: "Failed to delete item" })
  }
})

module.exports = router