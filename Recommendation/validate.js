const {body,check,validationResult}=require('express-validator'); // rename file name userValidation.js
const { query } = require('express-validator');

const validate=[
 
  body("movie_id").not().isEmpty().withMessage("please enter the movie id"),
  body("rating").not().isEmpty().withMessage("please enter the rating")




]



const validateFile=(req,res,next)=>{
   
    const errors = validationResult(req)                     
  
    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    
    next();
  }
  
  
  module.exports={validate,validateFile}
  