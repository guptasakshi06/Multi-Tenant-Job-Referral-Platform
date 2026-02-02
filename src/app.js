const express = require('express');


const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");

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
    return app;
}

module.exports = { createApp };