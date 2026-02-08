
module.exports = (req , res , next) =>{
 const userId = req.headers["x-user-id"];

 if(!userId){
    req.auth = null;
    return next();
 }

 req.auth = {
    userId,
 };
 next();

};