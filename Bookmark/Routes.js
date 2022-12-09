const class1=require('./Bookmark_controller');
const obj=new class1();
const express=require('express');
const Router=express.Router();
const checkauth=require('../Middlewares/auth');
const{validateFile,addBookmark}=require('./validate');
Router.post('/addBookmark',checkauth,addBookmark,validateFile,obj.addBookmark);
Router.put('/deleteBookmark/:id',checkauth,obj.deleteBookmark);
Router.get('/getBookmark',checkauth,obj.bookmarkList);

module.exports=Router;