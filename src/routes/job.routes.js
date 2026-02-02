const express = require("express");
const tenantContext = require("../middleware/tenantContext");
const requireRole = require("../middleware/requireRole");

const {
  createJob,
  listCompanyJobs,
  updateJobStatus,
  listPublicJobs,
} = require("../controllers/job.controller");

const router = express.Router();

// public
router.get("/public/jobs", listPublicJobs);

// company scoped
router.post(
  "/companies/:companyId/jobs",
  tenantContext,
  requireRole("ADMIN"),
  createJob
);

router.get(
  "/companies/:companyId/jobs",
  tenantContext,
  listCompanyJobs
);

router.patch(
  "/companies/:companyId/jobs/:jobId",
  tenantContext,
  requireRole("ADMIN"),
  updateJobStatus
);

module.exports = router; 
