
const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema({

    objectName: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "Observation",
    observationSchema
);
