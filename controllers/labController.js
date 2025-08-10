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
