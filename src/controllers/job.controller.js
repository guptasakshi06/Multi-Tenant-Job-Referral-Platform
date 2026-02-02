

const prisma = require("../db");

async function createJob(req , res){
    console.log("CREATE JOB HIT");
    console.log("BODY :", req.body);
    console.log("CONTEXT:" ,req.context);

    try{
        const {title , description} = req.body;
        const {companyId} = req.context;

        if(!title || !description){
            return res.status(400).json({message : "Title and description required"});
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                companyId,
            },
        });

        res.status(201).json(job);
    } catch (error){
        console.log("Create job error :" , error);
        res.status(500).json({message: "Internal server error"});
    }
}


async function listCompanyJobs(req , res){
    try {
        const {companyId} = req.context ;

        const jobs = await prisma.job.findMany({
            where : {companyId},
            orderBy : {createdAt : "desc"},
        });

        res.json(jobs);
    } catch (error){
        console.log("List jobs error :", error);
        res.status(500).json({message : "Internal server error"});
    }
}


async function updateJobStatus(req , res){
    try {
        const {jobId} = req.params;
        const {status} = req.body;
        const {companyId} = req.context;

        if(!["OPEN" ,"CLOSED", "PAUSED"].includes(status)){
            return res.status(400).json({message : "Invalid status"});
        }

        const result = await prisma.job.updateMany({
            where : {id: jobId ,companyId},
            data: {status},
        });

        if(result.count ===0){
            return res.status(404).json({message : "Job not found"});
        }

        res.json({message : "Job  updated"});
    } catch (error){
        console.log("Update job status error :",error);
        res.status(500).json({message : "Internal server error"});
    }
}

async function listPublicJobs(req , res){
    try{
        const jobs = await prisma.job.findMany({
            where : {status : "OPEN"},
            include: {
                company : {
                    select : {
                        id : true ,
                        name : true ,
                }
                },
            },
        });
        res.json(jobs);
    } catch (error){
        console.log("Public jobs error :", error);
        res.status(500).json({message : "Internal server error"});
    }
}

module.exports = {
    createJob,
    listCompanyJobs,
    updateJobStatus,
    listPublicJobs,
};