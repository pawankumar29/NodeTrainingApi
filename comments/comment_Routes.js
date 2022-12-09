const express=require('express');
const Router=express.Router();
const comment=require('./comment_Controller');
const checkauth=require('../Middlewares/auth');
const {validateFile,add,edit,soft}=require('./validate');

const obj=new comment();

Router.get('/getComment/:id',checkauth,obj.getlist);
Router.post('/addComment',checkauth,add,validateFile,obj.addComment);

Router.put('/editComment/:id',checkauth,edit,validateFile,obj.editComment);
Router.put('/softCommentDelete/:id',checkauth,obj.softDelete);


module.exports=Router;