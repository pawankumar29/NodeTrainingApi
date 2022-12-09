const {body,check,validationResult}=require('express-validator'); // rename file name userValidation.js
const { query } = require('express-validator');




const validate=
    [
    body('firstName').not().isEmpty().withMessage({message:"FirstName is required"} ).isLength({ min: 3 }).withMessage({message:"Length of firstname should be three or more than three"}),
    body('lastName').not().isEmpty().withMessage({message:"LastName is required"} ).isLength({ min: 3 }).withMessage({message:"Length of lastname should be three or more than three"}),
    body('email').not().isEmpty().withMessage("email is required").isEmail().withMessage({message:'Enter valid  email'}),
  body('password').not().isEmpty().withMessage("Password is required").isNumeric().withMessage({message:"Enter valid Numeric Password"}).isLength({min:3}).withMessage({message:"Length of password should be three or more than three"}),
  body('address').not().isEmpty().withMessage({message:"please enter Address"})
]

const loginValidate=[
  body('email').not().isEmpty().withMessage("email is required").isEmail().withMessage({message:'Enter valid  email'}),
  body('password').not().isEmpty().withMessage("Password is required").isNumeric().withMessage({message:"Enter valid Numeric Password"}).isLength({min:3}).withMessage({message:"Length of password should be three or more than three"}),
]

const pageValidate=[
  query('page').not().isEmpty().withMessage("please enter the page"),
]



const validateFile=(req,res,next)=>{
   
  const errors = validationResult(req)                      // make function for error store invalidation 

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  
  next();
}


module.exports={validate,validateFile,loginValidate,pageValidate}