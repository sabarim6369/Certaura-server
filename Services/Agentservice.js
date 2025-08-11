
let agentsByLab = {};

function setAgentsByLabMap(map) {
  agentsByLab = map;
}

function sendCommandToLab(labId, command) {
  if (agentsByLab[labId]) {
    Object.values(agentsByLab[labId]).forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(command));
      }
    });
  }
}

module.exports = {
  setAgentsByLabMap,
  sendCommandToLab,
};
