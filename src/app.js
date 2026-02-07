const express = require('express');


const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");
const candidateRoutes = require("./routes/candidate.routes");
const referralRoutes = require("./routes/referral.routes");
const companyUserRoutes = require("./routes/companyUser.routes");

function createApp(){
    const app = express();
    
    app.use(express.json());
      
     app.get('/health', (req ,res)=>{
        res.json({status : 'ok'});
    });
    app.use((req , res , next)=>{
        console.log("➡️ Incoming:", req.method, req.url);
        next();
    });

   

    app.use("/companies", companyRoutes);

    app.use( jobRoutes);
    app.use("/", candidateRoutes);
    app.use("/", referralRoutes);
    app.use("/", companyUserRoutes);

    return app;
}

module.exports = { createApp };