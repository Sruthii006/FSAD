const express = require("express");
const router = express.Router();

const Assignment = require("../models/Assignment");

router.post("/add", async (req, res) => {
  try {
    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline
    });

    await assignment.save();

    res.json({
      message: "Assignment added successfully",
      assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;