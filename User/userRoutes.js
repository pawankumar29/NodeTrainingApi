const express=require('express');
const {validate,validateFile, loginValidate,pageValidate}=require('../validation/userValidation');
const checkauth=require('../Middlewares/auth');
const User=require('../User/userController');
const obj= new User();



 require('../Middlewares/passport');
const passport=require('passport');
                           

 const Router=express.Router();
 

 

//get all user data
Router.get('/getall',obj.getAllUser);


//delete user
Router.delete('/:id',checkauth,obj.deleteUser);

//get user data
Router.get('/user/:id',checkauth,obj.getUserData);

//update user
Router.put('/:id',checkauth,obj.updateUser);

//create user
Router.post('/post',validate,validateFile
,obj.createUser);


Router.post('/login',loginValidate,validateFile,passport.authenticate('local'),obj.login);

//to follow a user

Router.put('/follow/:id',checkauth,obj.follow);

Router.put('/unfollow/:id',checkauth,obj.unfollow);

Router.get('/following',pageValidate,validateFile,checkauth,obj.following);
Router.get('/follower',pageValidate,validateFile,checkauth,obj.follower);
Router.get('/count/:id',checkauth,obj.userDataCount);



module.exports=Router;
