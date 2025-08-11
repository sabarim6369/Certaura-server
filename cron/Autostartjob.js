const cron = require('node-cron');
const Exam = require('../models/Exammodel');
const { sendCommandToLab } = require("../Services/Agentservice");

cron.schedule('* * * * * *', async () => {
  try {
    const now = new Date();

    const autoExams = await Exam.find({ autoMode: true });

    for (const exam of autoExams) {
      const { labId, autoOnTime, autoOffTime, url, status } = exam;

      const onTime = new Date(autoOnTime);
      const offTime = new Date(autoOffTime);

     
      const inActivePeriod = now >= onTime && now < offTime;
      if (inActivePeriod && status !== 'Running') {
       

        console.log(`Auto-starting exam ${exam.name} for lab ${labId}`);

        await Exam.findByIdAndUpdate(exam._id, { status: 'Running' });
        await sendCommandToLab(labId.toString(), { type: 'START_EXAM', url });
      } else if (!inActivePeriod && status === 'Running') {
        console.log(`Auto-stopping exam ${exam.name} for lab ${labId}`);

        await Exam.findByIdAndUpdate(exam._id, { status: 'Stopped' });
        await sendCommandToLab(labId.toString(), { type: 'STOP_EXAM' });
      }
    }
  } catch (err) {
    console.error('Error in auto exam cron job:', err);
  }
});
