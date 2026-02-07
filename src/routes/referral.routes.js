
const express = require("express");
const tenantContext = require("../middleware/tenantContext");
const requireRole = require("../middleware/requireRole");
const { createReferral } = require("../controllers/referral.controller");


const router = express.Router();

router.post(
    "/companies/:companyId/jobs/:jobId/referrals",
    tenantContext,
    requireRole("EMPLOYEE" ,"ADMIN"),
    createReferral
);

module.exports = router;