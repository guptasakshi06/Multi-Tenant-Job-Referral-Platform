const prisma = require("../db");

async function tenantContext(req , res , next){
    try{
        const userId = req.headers["x-user-id"];
        const companyId = req.headers["x-company-id"];
          const paramCompanyId = req.params.companyId;
         
        if(!userId){
            return res.status(401).json({message :"User not authenticated"});
        }
        if(!companyId){
            return res.status(400).json({message : "x-company header is required"});    

        }
         
    if (paramCompanyId && paramCompanyId !== companyId) {
      return res.status(403).json({
        message: "Company mismatch between URL and header",
      });
    }

        //check membership

        const companyUser = await prisma.companyUser.findUnique({
            where : {
                userId_companyId : {
                    userId : userId ,
                    companyId ,
                },
            },
        });

        if(!companyUser){
            return res.status(403).json({message : "Access denied to this company"});
        }

        // inject context

        console.log("Tenant Context:" ,{
            userId,
            companyId,
            companyUser,
        });

       req.context = {
        userId,
        companyId,
        role : companyUser.role,
       };
     console.log("🧠 FINAL CONTEXT SET:", req.context);
       next();
    } catch (error){
        console.log("Tenant context error :" , error);
        return res.status(500).json({message : "Internal server error"});
    }
}


module.exports = tenantContext;


