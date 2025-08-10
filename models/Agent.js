const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  hostname: { type: String },
  ip: { type: String },
  status: { type: String, enum: ['online', 'offline', 'locked'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
