const express = require('express');


const companyRoutes = require("./routes/company.routes");
function createApp(){
    const app = express();
    
    app.use(express.json());
      
    app.use((req , res , next)=>{
        console.log("➡️ Incoming:", req.method, req.url);
        next();
    });

    app.get('/health', (req ,res)=>{
        res.json({status : 'ok'});
    });

    app.use("/companies", companyRoutes);
    return app;
}

module.exports = { createApp };