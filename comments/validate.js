const {body,validationResult}=require('express-validator'); // rename file name userValidation.js



const add=[

   // body('user_id').not().isEmpty().withMessage("please enter the user Id").isNumeric().withMessage("user id should be numeric"),
    body('movie_id').not().isEmpty().withMessage("please enter the movie Id"),
 


    body('comment').not().isEmpty().withMessage("please Enter the comment ")
   


]

const edit=[

    body('comment').not().isEmpty().withMessage("please Enter the comment ")
]



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
  

  module.exports={validateFile,add,edit,addBookmark}