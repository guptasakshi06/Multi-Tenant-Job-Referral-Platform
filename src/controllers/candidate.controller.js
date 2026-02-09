
const prisma = require("../db");
const applicationQueue = require("../queue/application.queue");



// PUBLIC: candidate applies to a job
async function applyToJob(req, res) {
    

  try {
    const { jobId } = req.params;
    const { name, email, resumeUrl , referralId} = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" });
    }
    const job = await prisma.job.findUnique({
        where: { id: jobId },
    });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }


    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        resumeUrl,
        jobId,        
      },
    });
    
    try{
        
    await applicationQueue.add("candidate-applied", {
      candidateId : candidate.id,
      email : candidate.email,
    });
    } catch (err){
      console.error("⚠️ Failed to enqueue candidate-applied job", err);
    }

    if(referralId){
        const referral = await prisma.referral.findUnique({
            where : {id : referralId},
        });
        if(!referral || referral.jobId !== jobId){
            return res.status(400).json({message : "Invalid referralId"});
        }
        
        if (referral.candidateId){
            return res.status(409).json({message : "Referral already used"});
        }

        await prisma.referral.update({
            where : {id : referralId},
            data : {
                candidateId : candidate.id,
            },
        });
        console.log("Referral linked to canidate : ", candidate.id);
    }

    res.status(201).json(candidate);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Already applied to this job" });
    }
    console.error("Apply error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// COMPANY: list candidates for a job
async function listCandidates(req, res) {
  try {
    const { jobId } = req.params;

    const candidates = await prisma.candidate.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
    });

    res.json(candidates);
  } catch (error) {
    console.error("List candidates error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ADMIN: update candidate status
async function updateCandidateStatus(req, res) {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;
    const { userId } = req.context;

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data: { status },
      }),
      prisma.candidateStatusHistory.create({
        data: {
          candidateId,
          fromStatus: candidate.status,
          toStatus: status,
          changedBy: userId,
        },
      }),
    ]);

    if(status === "HIRED"){
        await prisma.referral.updateMany({
            where : {
                candidateId : candidateId,
            },
            data : {
                status : "SUCCESS",
            },
        });
    }


    res.json({ message: "Status updated" });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}





module.exports = {
  applyToJob,
  listCandidates,
  updateCandidateStatus,
};
