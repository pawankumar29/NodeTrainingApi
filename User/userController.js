const usermodel=require('./usermodel');      
const {body,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const saltRounds=10;
const mongoose=require('mongoose');
const axios=require('axios');

class User{
//Get the user Details
 getUserData=async(req,res)=>{
    try{
      
      const data={
        id:req.params.id
      }
      let userData;
      if(data.id.trim()===''){
       return res.status(404).json({status:0, message:'Please enter id'})
      }
       


  
      if(data.id!==req.data._id)  return res.status(404).json({status:0, message:'User is not authorized'});

          userData=await usermodel.findById(data.id);
      if(!userData){
        return res.status(404).json({status:0, message:'user does not exist'})
      }
     
      res.status(200).json({status:1,message:"success",data:userData})     
    }
      catch(error){
      

        res.status(404).json({status:0, message:'gud Invalid request', error:error.message})
      }
}




//post User details
 createUser=async(req,res)=>{
    try{
      let PasswordHash = await bcrypt.hash(req.body.password, saltRounds)
        const data={
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          email:req.body.email,
          password:PasswordHash,
          address:req.body.address 
        }

    
       


                                                                            //if email already exist
        let existEmail=await usermodel.findOne({email:data.email})
       
        if(existEmail) {
        return  res.status(404).json({status:0, message:'email already exist'});
        }



          let user=await usermodel.create(data);  
                      
          const token=jwt.sign(user.toJSON(),process.env.secret_key,{expiresIn:'10h'});        


      res.status(200).send({status:1,message:"user created successfully",data,token});
     
    }catch(error){
        res.status(404).json({status:0, message:'cud failed', error:error.message})
     }
}



//delete the user 
 deleteUser=async(req,res)=>{
    try{
      const data={
        id:req.params.id
      }
      if(data.id.trim()===''){
       return res.status(404).json({status:0, message:'Please enter id'})
      }
  

      if(data.id!=req.data._id)  return res.status(404).json({status:0, message:'User is not authorized'});
      
    
     let userData=await usermodel.findByIdAndDelete(data.id);
     if(!userData){
      return res.status(404).json({status:0, message:'user does not exist'})
    }

        res.status(200).send({status:1,message:"user deleted successfully"});
     
    }catch(error){
      
     
       res.status(404).json({status:0, message:'failed', error:error.message})
     }
} 




//update the user
 updateUser=async(req,res)=>{
  
    try{
      const data={
        id:req.params.id
      }
      if(data.id.trim()===''){
       return res.status(404).json({status:0, message:'Please enter id'})
      }
      
      //valid object id
      if(!mongoose.Types.ObjectId.isValid(data.id)){return res.status(404).json({status:0, message:'Please enter valid id'});}
    
      if(data.id!=req.data._id)  return res.status(404).json({status:0, message:'User is not authorized'});
                                                                                 
     let userData=await usermodel.findByIdAndUpdate(data.id,req.body, {new:true}); 
     if(!userData){
      return res.status(404).json({status:0, message:'user does not exist'})
    }                           

    res.status(200).send({status:1,message:"user updated successfully",data:userData})
  }catch(error){
        res.status(404).json({status:0, message:'failed', error:error.message})
     }
}



//login

login=async(req,res)=>{
  try{

    //console.log(req.user); // getting data from deserializer whatever is send from it
    // with the same name returned
    const data={
      _id:req.user._id,
      email:req.user.email
    }
    const userData=await usermodel.findOne({email:req.body.email});

    const jwtData={
      firstName:userData.firstName,
      lastName:userData.lastName,
      _id:req.user._id,
      email:req.user.email
    }
    const token=jwt.sign(jwtData,process.env.secret_key,{expiresIn:'10h'});
   

    return res.status(200).json({status:1,msg:"user login successful",token});
  
  }
  catch(error){
    
    res.status(404).json({status:0, message:'failed', error:error.message})

  }
}

getAllUser=async(req,res)=>{
     try{
      const data=await usermodel.find();
      res.status(200).send({status:1,Data:data});
     }catch(error){
      res.status(404).json({status:0, message:'failed', error:error.message})
     }
}




follow=async(req,res)=>{

  try{
  let data={
    followid:req.params.id,
    selfid:req.data._id

  }
  if(data.followid.trim()===''){
    return res.status(404).json({status:0, message:'Please enter id'})
   }

  if(data.followid==data.selfid) return   res.status(404).json({status:0, message:'Please enter diffrent id'});


    //to check a valid user id or not 
    let user=await usermodel.findById(data.followid);

    if(!user)return   res.status(404).json({status:0, message:'User does not exist'});



  let checkuser=await usermodel.findOne({$and:[{_id:data.followid},{follower:{$in:data.selfid}}]});

  if(checkuser)return   res.status(404).json({status:0, message:'You are already a follower of the user '});

  
  
  let followuser=await usermodel.findOneAndUpdate({$and:[{_id:data.followid},{follower:{$nin:data.selfid}}]},{$push:{follower:data.selfid}},{new:true});
  let rest2=await usermodel.findOneAndUpdate({$and:[{_id:data.selfid},{following:{$nin:data.followid}}]},{$push:{following:data.followid}},{new:true});


  if(data.followid==null||data.selfid==null)
  return   res.status(404).json({status:0, message:'invalid request'});



  res.status(200).send({status:1,message:"Data Updated Successfully",Following:followuser});}
  catch(error){
    res.status(404).json({status:0, message:'failed', error:error.message})
  }

}


unfollow=async(req,res)=>{
 
  try{
    let data={
      followid:req.params.id,
      selfid:req.data._id
  
    }

    


    if(data.followid.trim()===''){
      return res.status(404).json({status:0, message:'Please enter id'})
     }
  
    if(data.followid==data.selfid) return   res.status(404).json({status:0, message:'Please enter diffrent id'});

    //to check a valid user id or not 
   let user=await usermodel.findById(data.followid);

   if(!user)return   res.status(404).json({status:0, message:'User does not exist'});




    //checking user is already not being followed
    let checkuser=await usermodel.findOne({$and:[{_id:data.followid},{follower:{$nin:data.selfid}}]});

    if(checkuser)return   res.status(404).json({status:0, message:'You are Not A follower Of the user'});
  
    
    
    let unfollowUser=await usermodel.findOneAndUpdate({$and:[{_id:data.followid},{follower:{$in:data.selfid}}]},{$pull:{follower:data.selfid}},{new:true});
    let rest2=await usermodel.updateOne({$and:[{_id:data.selfid},{following:{$in:data.followid}}]},{$pull:{following:data.followid}},{new:true});
  
  
    
  
  
  
    res.status(200).send({status:1,message:"Data Updated Successfully"});}
    catch(error){
      res.status(404).json({status:0, message:'failed', error:error.message,Unfollow:unfollowUser})
    }

}

following=async(req,res)=>{
  try{
    const data={
       id:req.data._id,
       limit:req.query.limit||10,
       skip:req.query.page-1||0
    }

    if(!data.skip.trim==='') return res.status(404).json({status:0, message:'Please enter Page'})

    if(data.id.trim()===''||!data.id){
      return res.status(404).json({status:0, message:'Please enter id'})
     }

     let userArray=[];
  const userData=await usermodel.findById(data.id);
    if(!userData){
      return res.status(404).json({status:0, message:'invalid id'})
    }

     const {following}=userData;
     const projection={firstName:1,lastName:1,email:1,_id:0};

//skip picks up page from zero
    userArray=await usermodel.find({_id:{$in:following}}).select(projection).limit(data.limit).skip(data.skip);
     res.status(200).send({status:1,message:"Data Received Successfully",Following:userArray});}
     catch(error){
      res.status(404).json({status:0, message:'failed', error:error.message})
     }

}


follower=async(req,res)=>{
  try{
    const data={
       id:req.data._id,
       limit:req.query.limit||10,
       skip:req.query.page-1||0
    }


    if(data.id.trim()===''||!data.id){
      return res.status(404).json({status:0, message:'Please enter id'})
     }

     let userArray=[];
  const userData=await usermodel.findById(data.id);
    if(!userData){
      return res.status(404).json({status:0, message:'invalid id'})
    }

     const {follower}=userData;
     const projection={firstName:1,lastName:1,email:1,_id:0};

//skip picks up page from zero
    userArray=await usermodel.find({_id:{$in:follower}}).select(projection).limit(data.limit).skip(data.skip);
     res.status(200).send({status:1,message:"Data Received Successfully",Follower:userArray});}
     catch(error){
      res.status(404).json({status:0, message:'failed', error:error.message})
     }

}


userDataCount=async(req,res)=>{

  try{
  const data={
    id:req.params.id
  }
  if(data.id.trim()===''){
    return res.status(404).json({status:0, message:'Please enter id'})
   }

   let userArray=[];
   const userData=await usermodel.findById(data.id);
     if(!userData){
       return res.status(404).json({status:0, message:'invalid id'})
     }

     const {follower,following}=userData;
     const followerlength=follower.length;
     const followinglength=following.length;
   
     res.send({status:1,message:"successful",Data:userData,Follower:followerlength,Following:followinglength});
  }catch(error){
    res.status(404).json({status:0, message:'udfailed', error:error.message})
  }



}



}





module.exports=User;