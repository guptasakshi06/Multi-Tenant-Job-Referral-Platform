
const { Prisma } = require("@prisma/client");


module.exports = (err , req , res , next)=>{
    console.error("❌GLOBAL Error:", err);

    //Prisma known errors
    // if(err instanceof  Prisma.PrismaClientKnownRequestError){
    //   if(err.code === "P2002"){
    //     return res.status(409).json({
    //         message : "Duplicate record",
    //     });
    //   }   
    // }
    if(err.isOperational){
        return res.status(err.statusCode).json({
            message : err.message,
        });
    }
   
    return res.status(500).json({
        message : "Internal server error",
    });
};
