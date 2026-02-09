const { Stats } = require("node:fs");
const prisma = require("../db");

async function getJobAnalytics(req, res) {
  const { companyId } = req.params;

  const jobs = await prisma.job.groupBy({
    by: ["status"],
    where: { companyId },
    _count: {
      _all: true,
    },
  });

  return res.json(jobs);
}

async function getCandidateFunnel(req , res) {
    const {companyId} = req.params;
    const funnel = await prisma.candidate.groupBy({
        by: ["status"],
        where: {
            job: {
                companyId,
            },
        },
        _count : {
            _all :true,
        },
    });

    return res.json(funnel);
}

async function getTopReferrers(req, res) {
  const { companyId } = req.params;

  const referrers = await prisma.referral.groupBy({
    by: ["referrerId"],
    where: {
      job: {
        companyId,
      },
      status: "SUCCESS",
    },
    _count: {
       referrerId: true,
    },
    orderBy: {
      _count: {
        referrerId: "desc",
      },
    },
  });

  return res.json(referrers);
}



module.exports = {
     getJobAnalytics,
     getCandidateFunnel,
     getTopReferrers,
   
    };
