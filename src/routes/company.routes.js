const express = require("express");
const validate = require("../middleware/validate");
const {createCompany  , getMyCompanies} = require("../controllers/company.controller");


const tenantContext = require("../middleware/tenantContext");
const requireRole = require("../middleware/requireRole");
const asyncHandler = require("../middleware/asyncHandler");
const { createCompanySchema } = require("../validators/company.schema");
const {getJobAnalytics} = require("../controllers/analytics.controller");
const { getCandidateFunnel } = require("../controllers/analytics.controller");
const { getTopReferrers } = require("../controllers/analytics.controller");


const router = express.Router();

router.post(
    "/" ,
       validate(createCompanySchema),
    asyncHandler(createCompany)    
);

router.get("/" , asyncHandler(getMyCompanies));

// TEST PROTECTED ROUTE
router.get("/:companyId/test" , tenantContext , (req , res)=>{
    res.json({
        message:"Tenant context working" ,
        context : req.context,
    });
});

// ADMIN-only test route

router.get(
    "/:companyId/admin-test",
    tenantContext,
    requireRole("ADMIN"),
    (req , res ) => {
        res.json({
            message : "ADMIN access granted",
            context : req.context,
        });
    }
    
);

router.get(
    "/:companyId/analytics/jobs",
    tenantContext,
    requireRole("ADMIN"),
    getJobAnalytics
);

router.get(
    "/:companyId/analytics/candidates",
    tenantContext,
    requireRole("ADMIN"),
    getCandidateFunnel
);

router.get(
  "/:companyId/analytics/referrers",
  tenantContext,
  requireRole("ADMIN"),
  getTopReferrers
);

module.exports = router;