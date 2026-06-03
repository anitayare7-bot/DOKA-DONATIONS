const express = require("express")
const router = express.Router()
const Donation = require("../models/Donation")

// CREATE donation
router.post("/", async (req, res) => {
  try {
    const newDonation = new Donation(req.body)
    const saved = await newDonation.save()
    res.status(201).json(saved)
  } catch (err) {
    console.log("ERROR:", err)
    res.status(500).json(err)
  }
})

// GET all donations
router.get("/", async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 })
        res.json(donations)
    } catch (err) {
        res.status(500).json(err)
    }
})

// UPDATE donation status (mark sent, accepted, etc.)
router.patch("/:id", async (req, res) => {
    try {
        const updated = await Donation.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        res.json(updated)
    } catch (err) {
        res.status(500).json(err)
    }
})

// DELETE donation
router.delete("/:id", async (req, res) => {
    try {
        await Donation.findByIdAndDelete(req.params.id)
        res.json("Deleted successfully")
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
