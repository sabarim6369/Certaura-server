const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
router.post('/agents/register', agentController.registerAgent);
router.get('/agents/lab/:labId', agentController.getAgentsByLab);
router.post("/restart-agent", agentController.restartAgent);
router.post("/startingeagent", agentController.startingsingleagent);

module.exports = router;