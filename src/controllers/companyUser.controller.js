const prisma = require("../db");

async function addCompanyUser(req, res) {
  try {
    const { userId, role } = req.body;
    const { companyId } = req.params;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role required" });
    }

    const record = await prisma.companyUser.create({
      data: {
        userId,
        companyId,
        role,
      },
    });

    return res.status(201).json(record);
  } catch (err) {
    console.error("ADD COMPANY USER ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { addCompanyUser };
