const express=require('express');
const Router=express.Router();
const data=require('./likecontroller');
const checkauth=require('../Middlewares/auth');
const {val,validateFile}=require('./likevalidate');

const obj=new data();

Router.post('/addlike',checkauth,val,validateFile,obj.addLike);
Router.put('/deletelike/:id',checkauth,obj.deletelike);
Router.get('/getlike/:id',checkauth,obj.likelist);

module.exports=Router;
