const mongoose = require("mongoose");
const { Schema } = mongoose;

const examSchema = new Schema({
      name: { type: String, required: true, trim: true },  
  url: { type: String, required: true, trim: true },
  status: { type: String, default: "Stopped" },
  autoMode: { type: Boolean, default: false },
  autoOnTime: { type: String, default: "" },
  autoOffTime: { type: String, default: "" },
  labId: { type: Schema.Types.ObjectId, ref: "Lab", required: true },
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
