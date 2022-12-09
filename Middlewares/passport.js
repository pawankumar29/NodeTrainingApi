const passport=require('passport');
const usermodel = require('../User/usermodel');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');

   passport.use('local',new LocalStrategy({
      usernameField:'email',
      passwordField:'password'
   },async(email,password,done)=>{
         try {
         
           const user1=await usermodel.findOne({email});
         
           if(!user1){
            return done(null,false);
           }
        
           if(!await bcrypt.compare(password,user1.password)) return done(null,false);

           return done(null,user1);
           
         } catch (error) {
            
           return  done(`errror::${error}`,false);
         }
   }))
      

    passport.serializeUser((user,done)=>{
         if(user){
            return done(null,user.id);
         }

         return done(null,false)
     
    });
    passport.deserializeUser(async(id,done)=>{
         const user=await usermodel.findById(id);
         if(!user){
            return done (null,false);
         }
        
         return done(null,user);
    })

  