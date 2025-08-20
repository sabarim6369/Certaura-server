const Agent = require('../models/Agent');
const { sendCommandToLab,sendCommandToAgent } = require("../Services/Agentservice")

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
exports.restartAgent = async (req, res) => {
  try {
    const { labId, deviceId } = req.body;

    if (!labId || !deviceId) {
      return res.status(400).json({ error: "labId and deviceId are required" });
    }

    // Send RESTART command to the specific agent
    sendCommandToAgent(labId, deviceId, { type: "RESTART_EXAM" });

    res.json({ message: `Restart command sent to agent ${deviceId} in lab ${labId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.startingsingleagent=async(req,res)=>{
    console.log("😍😍😍😍😍😍😍😍",req.body)
    

  try{
 const { labId, deviceId,Examurl } = req.body;
console.log(Examurl)
    if (!labId || !deviceId) {
      return res.status(400).json({ error: "labId and deviceId are required" });
    }
        sendCommandToAgent(labId, deviceId,{ type: "RESTART_EXAM", url: Examurl });


    res.json({ message: `Restart command sent to agent ${deviceId} in lab ${labId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  
  }
 
}
exports.getagentidsbylabid=async(req,res)=>{
  try{
    const {labId}=req.body;

  }
  catch(err){

  }
}