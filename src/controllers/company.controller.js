const prisma = require("../db");


async function createCompany(req, res) {
  

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 🔒 CRITICAL: verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // 🔒 Transaction = no half data
    const company = await prisma.$transaction(async (tx) => {
      const newCompany = await tx.company.create({
        data: { name },
      });

      await tx.companyUser.create({
        data: {
          userId: user.id,
          companyId: newCompany.id,
          role: "ADMIN",
        },
      });

      return newCompany;
    });

    return res.status(201).json(company);
  } catch (error) {
        console.log("❌❌❌ ERROR TYPE:", error?.constructor?.name);
  console.log("❌❌❌ ERROR MESSAGE:", error?.message);
  console.log("❌❌❌ FULL ERROR:", error);

    console.error("CREATE COMPANY ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
 
/// get mt companies//////////

async function getMyCompanies(req, res) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const companies = await prisma.companyUser.findMany({
      where: {
        userId,
      },
      include : {
        company : true ,
      },
    });
    // shape response 
    const result = companies.map((cu)=>({
        id: cu.company.id,
        name: cu.company.name,
        createdAt: cu.company.createdAt,
        role:cu.role,
    }));

    return res.json(result);
  } catch (error) {
    
    console.error("GET /COMPANIES ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createCompany, getMyCompanies };












console.log("📦 COMPANY CONTROLLER LOADED");












































// const prisma = require("../db");

// async function createCompany(req , res){

// try{
//         const {name} = req.body;

//     if(!name){
//         return res.status(400).json({message: "Company name is required"});
//     }
 
//      // TEMP : fake loggedin user
//      const CURRENT_USER_ID = req.headers["x-user-id"];

//      if(!CURRENT_USER_ID){
//         return res.status(401).json({message : "User not authenticated"});
//      }

//     const company = await prisma.company.create({
//         data: {
//             name ,
//             users:{
//                 create: {
//                     role: "ADMIN",
//                     userId : CURRENT_USER_ID,
//                 },
//             },
//         },
//     });

//     res.status(201).json(company);
// } catch (error){
//     console.error(error);
//     res.status(500).json({message : "Internal server error"});
// }
// }

// async function getMyCompanies(req , res){
//     try{
//         const userId = req.headers["x-user-id"];

//         if(!userId){
//             return res.status(401).json({message :"User not authenticated"});
//         }
//         const companies = await prisma.company.findMany({
//             where :{
//                 users :{
//                     some : {
//                         userId : userId,
//                     },
//                 },
//             },
//         });
//         res.json(companies);

//     } catch (error){
//         console.error(error);
//         res.status(500).json({message : "Internal server error"});
//     }
// }
// module.exports= {createCompany , getMyCompanies} ;