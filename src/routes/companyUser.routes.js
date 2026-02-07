const express = require("express");
const { addCompanyUser } = require("../controllers/companyUser.controller");

const router = express.Router();


router.post(
  "/companies/:companyId/users",
  addCompanyUser
);

module.exports = router;
