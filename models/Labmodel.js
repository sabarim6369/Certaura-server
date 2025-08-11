const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  status:{type:String,enum:["Available","notavailable"],default:"Available"}
}, { timestamps: true });

module.exports = mongoose.model('Lab', labSchema);
