const Exam = require("../models/Exammodel");
const { sendCommandToLab } = require("../Services/Agentservice")
exports.createExam = async (req, res) => {
  try {
    const { name, url, status, autoMode, autoOnTime, autoOffTime, labId } = req.body;

    if (!name || !url || !labId) {
      return res.status(400).json({ error: "name, url and labId are required" });
    }

    const exam = new Exam({
      name: name.trim(),
      url: url.trim(),
      status: status || "Stopped",
      autoMode: autoMode || false,
      autoOnTime: autoOnTime || "",
      autoOffTime: autoOffTime || "",
      labId,
    });

    const savedExam = await exam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all exams (optionally filter by labId)
exports.getExams = async (req, res) => {
  try {
    const { labId } = req.query;
    let filter = {};
    if (labId) {
      filter.labId = labId;
    }
    const exams = await Exam.find(filter);
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const examBeforeUpdate = await Exam.findById(req.params.id);
    if (!examBeforeUpdate) return res.status(404).json({ error: "Exam not found" });

    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (req.body.status && req.body.status !== examBeforeUpdate.status) {
      const labId = updatedExam.labId.toString();
      if (req.body.status === "Running" || req.body.status === "Started") {
        sendCommandToLab(labId, { type: "START_EXAM", url: updatedExam.url });
      } else if (req.body.status === "Stopped") {
        sendCommandToLab(labId, { type: "STOP_EXAM" });
      }
    }

    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
