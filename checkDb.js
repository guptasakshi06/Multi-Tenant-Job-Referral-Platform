const prisma = require("./src/db");

async function run() {
  const companies = await prisma.company.findMany({
    include: { users: true },
  });

  console.log(companies);
}

run();

