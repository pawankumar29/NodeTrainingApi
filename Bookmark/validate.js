const {body,validationResult}=require('express-validator');

const addBookmark=[
    body('movie_id').not().isEmpty().withMessage("Please enter the movie_id")
]

const validateFile=(req,res,next)=>{
   
    const errors = validationResult(req)                     
  
    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    
    next();
  }
  

  module.exports={validateFile,addBookmark}