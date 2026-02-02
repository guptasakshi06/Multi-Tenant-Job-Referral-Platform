

function requireRole(...allowedRoles){
    return (req , res , next) =>{
       const {role} = req.context || {};

       if(!role){
        return res.status(500).json({message : "Role not found in context"});
       }

       if(!allowedRoles.includes(role)){
        return res.status(403).json({message : "Insufficient permissions"});
       }
       next();
    };
}

module.exports = requireRole;