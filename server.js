const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const LabRoutes = require("./routes/labRoutes");
const AgentRoutes = require("./routes/AgentRoutes");
const Agent=require("./models/Agent")
const examRoutes = require("./routes/ExamRoutes");
const {setAgentsByLabMap}=require("./Services/Agentservice")
require("./cron/Autostartjob")
const cors=require("cors");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use("/agent", AgentRoutes);
app.use("/lab", LabRoutes);
app.use("/exams", examRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/ws' });

const agentsByLab = {};
setAgentsByLabMap(agentsByLab);
wss.on('connection', (ws) => {
  console.log('Agent connected');
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('WS REGISTER message data:', data);

      if (data.type === 'REGISTER') {
        const { deviceId, labId, hostname, ip } = data;

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

        console.log(`Registered agent in DB: ${hostname} (${deviceId}) in lab ${labId}`);

        if (!agentsByLab[labId]) agentsByLab[labId] = {};
        agentsByLab[labId][deviceId] = ws;

        ws.send(JSON.stringify({ type: 'REGISTERED', success: true }));
      }
    } catch (err) {
      console.log(err);
      console.error('Invalid WS message:', message);
    }
  });

  ws.on('close', () => {
    console.log('Agent disconnected');
    for (const labId in agentsByLab) {
      for (const deviceId in agentsByLab[labId]) {
        if (agentsByLab[labId][deviceId] === ws) {
          delete agentsByLab[labId][deviceId];
          if (Object.keys(agentsByLab[labId]).length === 0) {
            delete agentsByLab[labId];
          }
          break;
        }
      }
    }
  });
});



app.post('/start-exam/:labId/:deviceId', (req, res) => {
  const { labId, deviceId } = req.params;
  const { url } = req.body;

  if (
    agentsByLab[labId] &&
    agentsByLab[labId][deviceId] &&
    agentsByLab[labId][deviceId].readyState === WebSocket.OPEN
  ) {
    agentsByLab[labId][deviceId].send(JSON.stringify({ type: 'START_EXAM', url }));
    return res.json({ success: true, message: `Started exam on device ${deviceId}` });
  } else {
    return res.status(404).json({ success: false, message: 'Agent not connected' });
  }
});
// app.post('/stop-exam/:labId/:deviceId', (req, res) => {
//   const { labId, deviceId } = req.params;

//   if (
//     agentsByLab[labId] &&
//     agentsByLab[labId][deviceId] &&
//     agentsByLab[labId][deviceId].readyState === WebSocket.OPEN
//   ) {
//     agentsByLab[labId][deviceId].send(JSON.stringify({ type: 'STOP_EXAM' }));
//     return res.json({ success: true, message: `Stopped exam on device ${deviceId}` });
//   } else {
//     return res.status(404).json({ success: false, message: 'Agent not connected' });
//   }
// });

-server.listen(PORT, () => console.log(`Server running with WS on port ${PORT}`));
