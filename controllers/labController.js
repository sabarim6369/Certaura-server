const Lab = require('../models/Labmodel');

exports.createLab = async (req, res) => {
  try {
    const { name, description } = req.body;
    const lab = new Lab({ name, description });
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabs = async (req, res) => {
  try {
    const labs = await Lab.find();
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    console.log(id)

    const updatedLab = await Lab.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedLab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    res.json(updatedLab);
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLab = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLab = await Lab.findByIdAndDelete(id);

    if (!deletedLab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    res.json({ message: "Lab deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
