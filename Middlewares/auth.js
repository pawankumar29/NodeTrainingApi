
const jwt=require('jsonwebtoken');
const usermodel = require('../User/usermodel');
const auth=async(req,res,next)=>{
  try{
    const token=req.headers.token;
    const decoded=jwt.verify(token,process.env.secret_key);
 
      req.data=decoded;
    // console.log("rrrrrrrrr",req.data);
      next();
           
           
 
   }catch(err){
            return res.status(422).json({ errors: err });
         }
    }
 

   




module.exports=auth;
