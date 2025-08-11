const Agent = require('../models/Agent');

exports.registerAgent = async (req, res) => {
  console.log("😍😍😍😍😍😍😍😍😎😎😎",req.body);
  try {
    const { deviceId, labId, hostname, ip } = req.body;

    let agent = await Agent.findOne({ deviceId });
    if (agent) {
      agent.lab = labId;
      agent.hostname = hostname;
      agent.ip = ip;
      agent.status = 'online';
      agent.lastSeen = Date.now();
      await agent.save();
    } else {
      agent = new Agent({ deviceId, lab: labId, hostname, ip, status: 'online' });
      await agent.save();
    }

    res.status(200).json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAgentsByLab = async (req, res) => {
  console.log("😍😍😍😎😎",req.params)
  try {
    const { labId } = req.params;
    const agents = await Agent.find({ lab: labId });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
