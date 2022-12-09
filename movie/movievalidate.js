
const {validationResult}=require('express-validator'); 
const { query } = require('express-validator');




const handleerror=[
     query('type').not().isEmpty().withMessage("please enter the type ").isNumeric().withMessage("please enter Numeric value as type"),
 
]

const mid=(req,res,next)=>{
     try{
      const text=req.params.text;
        
      if(!text||text.trim()=="") return res.status(404).json({status:0, message:"Please enter the text"});
       
      next();
      

     }catch(error){
    
      res.status(404).json({status:0, message:'failed', error:error.message})}
}



const validateFile=(req,res,next)=>{
   
    const errors = validationResult(req)                    
  
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    
    next();
  }

  const detailmid=(req,res,next)=>{
     try {
      const id=req.params.id;


      if(id.trim()==""||!id)return res.status(404).json({status:0, message:"Please enter the respective id"});

      next();
      
     } catch (error) {
      res.status(404).json({status:422, message:'failed', error:error.message});
     }
  }


module.exports={handleerror,validateFile,mid,detailmid}