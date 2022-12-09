const mongoose=require('mongoose');
require("dotenv").config({ path: './.env' });
let connection=async()=>{
    let r1=await mongoose.connect(process.env.DB_URL,{useNewUrlParser:true},(err,data)=>{
        if(!err)
         console.log("mongoose is connected Successfully to the server");
         else
         console.log("error::",err);
    })
   
}

module.exports=connection();