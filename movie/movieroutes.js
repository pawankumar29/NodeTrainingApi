const express=require('express');
const Router=express.Router();
const {handleerror,validateFile,mid,detailmid}=require('./movievalidate');
const movieclass=require('./moviecontroller');
const obj=new movieclass();

Router.get('/search/:text',mid,handleerror,validateFile,obj.searchmovie);

Router.get('/detail/:id',detailmid,handleerror,validateFile,obj.movieDetails);

module.exports=Router;