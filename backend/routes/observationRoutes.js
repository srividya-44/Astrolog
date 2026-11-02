
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Observation = require("../models/Observation");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all observation routes
router.use(authMiddleware);


// ADD OBSERVATION - POST
router.post("/", async (req, res) => {
    try {
        const { objectName, category, date, description } = req.body;

        if (
            !objectName?.trim() ||
            !category ||
            !date ||
            !description?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const observation = new Observation({
            objectName,
            category,
            date,
            description,
            userId: req.userId
        });

        const savedObservation = await observation.save();

        res.status(201).json(savedObservation);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// VIEW OWN OBSERVATIONS - GET
router.get("/", async (req, res) => {
    try {
        const observations = await Observation.find({
            userId: req.userId
        }).sort({ date: -1 });

        res.status(200).json(observations);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// EDIT OWN OBSERVATION - PUT
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid observation ID"
            });
        }

        const { objectName, category, date, description } = req.body;

        if (
            !objectName?.trim() ||
            !category ||
            !date ||
            !description?.trim()
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const updatedObservation = await Observation.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                objectName,
                category,
                date,
                description
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedObservation) {
            return res.status(404).json({
                message: "Observation not found"
            });
        }

        res.status(200).json(updatedObservation);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE OWN OBSERVATION - DELETE
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid observation ID"
            });
        }

        const deletedObservation = await Observation.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!deletedObservation) {
            return res.status(404).json({
                message: "Observation not found"
            });
        }

        res.status(200).json({
            message: "Observation deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
