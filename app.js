const express=require('express');
const passport = require('passport');
const expressSession=require('express-session');


require("dotenv").config({ path: './.env' });
require('./connection');
const app=express();

app.use(expressSession({secret:process.env.secret,resave:"false",saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/api/v1',require('./comments/comment_Routes'));
app.use('/api/v1',require('./User/userRoutes'));
app.use('/api/v1',require('./movie/movieroutes'));
app.use('/api/v1',require('./Recommendation/Rating_Routes'));
app.use('/api/v1',require('./Bookmark/Routes'));
app.use('/api/v1',require('./Likes/likeroute'));

app.listen(process.env.PORT,()=>{
  
    console.log(`app is listening at ${process.env.PORT}`);
});
     
