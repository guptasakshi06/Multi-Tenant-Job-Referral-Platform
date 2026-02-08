const { z } = require("zod");

const createCompanySchema = z
  .object({
    name: z.string().optional(),
  })
  .refine(
    (data) => typeof data.name === "string" && data.name.trim().length > 0,
    {
      path: ["name"],
      message: "Company name is required",
    }
  );

module.exports = { createCompanySchema };
