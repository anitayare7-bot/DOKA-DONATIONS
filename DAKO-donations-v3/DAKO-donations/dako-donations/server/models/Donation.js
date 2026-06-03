const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({

    food: {
        type: String,
        required: true
    },

    quantity: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    expiryTime: {
        type: String,  // ISO datetime string, or "0" for no expiry
        required: true
    },

    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Urgent", "Sent", "Accepted"]
    },

    sentAt: {
        type: Date,
        default: null
    },

    acceptedAt: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Donation", donationSchema)
