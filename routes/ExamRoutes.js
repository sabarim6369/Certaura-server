const express = require("express");
const router = express.Router();
const examController = require("../controllers/Examcontroller");

// Create exam
router.post("/", examController.createExam);

// Get all exams (can filter by labId)
router.get("/", examController.getExams);

// Get one exam by ID
router.get("/:id", examController.getExamById);

// Update exam by ID
router.put("/:id", examController.updateExam);

// Delete exam by ID
router.delete("/:id", examController.deleteExam);

module.exports = router;
