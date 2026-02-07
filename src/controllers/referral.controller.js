const prisma = require("../db");

async function createReferral(req , res){
    try{
     const {jobId}= req.params;
     const {userId , companyId} = req.context;

     const job = await prisma.job.findUnique({
        where: {
            id: jobId,
            companyId,
        },
     });
     if(!job){
        return res.status(404).json({message :"Job not found in company"});
     }

     const referral = await prisma.referral.create({
        data : {
            jobId,
            referrerId : userId,
        },
     });

     return res.status(201).json({
        referralId : referral.id,
        message : "Referral created successfully",
     });
    }catch (error){
      console.error("CREATE REFFERRAL ERROR :" , error);
      return res.status(500).json({message : "Internal server error"});
    }
}

module.exports = {
    createReferral,
};