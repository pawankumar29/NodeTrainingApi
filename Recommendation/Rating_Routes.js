const express=require('express');
const Router=express.Router();
const rclass=require('./Rating_Controller')
const {validate,validateFile,listvalidate,softdeletevalidate}=require('./validate');
const checkauth=require('../Middlewares/auth');
const obj=new rclass();

Router.post('/addRating',checkauth,validate,validateFile,obj.add);
Router.get('/getList',checkauth,obj.getList);
Router.put('/softDelete/:id',checkauth,obj.softDelete);

module.exports=Router;