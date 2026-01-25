// const prisma = require("./db");

// async function printUsers() {
//   const users = await prisma.user.findMany();
//   console.log("USERS IN DB 👉", users);
// }

// printUsers();


require("dotenv").config();


const {createApp} =  require('./app');

const app = createApp();
const PORT = 3000;

app.listen(PORT , ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});















console.log("🚀 SERVER FILE HIT");
































// const prisma = require("./db");

// async function testCompanyFlow(){
     
//     //create user
// const user = await prisma.user.create({
//     data: {
//         email : "admin@company.com",
//         name: "Admin User",
//     },
// });

// const company = await prisma.company.create({
//     data : {
//         name : "Test Company",
//     },
// });

// const companyUser = await prisma.companyUser.create({
//     data : {
//         role : "ADMIN",
//         userId : user.id ,
//         companyId : company.id,
//     },
// });


// console.log("User :" , user );
// console.log("Company:" , company);
// console.log("CompanyUser:" , companyUser);
// }

// testCompanyFlow().catch(console.error);