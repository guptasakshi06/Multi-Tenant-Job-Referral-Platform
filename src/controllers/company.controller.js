const prisma = require("../db");
const AppError = require("../middleware/AppError");

async function createCompany(req, res) {
    const { name } = req.body || {};

  

    const userId = req.auth?.userId;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("Invalid user", 401);
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
  } 
 
/// get mt companies//////////

async function getMyCompanies(req, res) {
  const userId = req.auth?.userId;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
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