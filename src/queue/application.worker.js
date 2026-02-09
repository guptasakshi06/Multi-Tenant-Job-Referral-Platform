
const { Worker } = require("bullmq");
const connection = require("./redis");
const { sendEmail } = require("../utils/mailer");

// const worker = new Worker(
//   "job-applications",
//   async (job) => {
//     if (job.name === "candidate-applied") {
//       console.log("📨 Candidate applied:", job.data);
//     }
//   },
//   { connection }
// );

const worker = new Worker(
  "job-applications",
  async (job) => {
    if (job.name === "candidate-applied") {
       const {email , jobId} = job.data;

      console.log("📨 Sending email to:", email);
      
      await sendEmail({
        to: email,
        subject : "Application received",
        text : `Your application for job ${jobId} has been received .` ,
      });
   
    }
  },
  { connection }
);





worker.on("completed", (job)=>{
    console.log("✅ Job Completed : ", job.id);
});

worker.on("failed" , (job , err)=>{
    console.log(" ❌ Job failed" , job?.id , err);
});