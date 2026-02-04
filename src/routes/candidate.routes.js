const express = require("express");

const tenantContext = require("../middleware/tenantContext");
const requireRole = require("../middleware/requireRole");

const {
    applyToJob,
    listCandidates,
    updateCandidateStatus,
} = require("../controllers/candidate.controller");

const router = express.Router();

router.post("/public/jobs/:jobId/apply" , applyToJob);

router.get(
    "/companies/:companyId/jobs/:jobId/candidates",
    tenantContext,
    listCandidates
);

router.patch(
    "/companies/:companyId/candidates/:candidateId/status",
    tenantContext,
    requireRole("ADMIN"),
    updateCandidateStatus
);

module.exports = router;