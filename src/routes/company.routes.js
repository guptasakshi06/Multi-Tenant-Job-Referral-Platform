const express = require("express");
const {createCompany  , getMyCompanies} = require("../controllers/company.controller");

const router = express.Router();

router.post("/" , createCompany);

router.get("/" , getMyCompanies);

module.exports = router;