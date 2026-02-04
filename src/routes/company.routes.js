const express = require("express");

const {createCompany  , getMyCompanies} = require("../controllers/company.controller");

const tenantContext = require("../middleware/tenantContext");
const requireRole = require("../middleware/requireRole");


const router = express.Router();

router.post("/" , createCompany);
router.get("/" , getMyCompanies);

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
    (req , res )=>{
        res.json({
            message : "ADMIN access granted",
            context : req.context,
        });
    }
    
);

module.exports = router;