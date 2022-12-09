const mongoose=require('mongoose');

const schema=mongoose.Schema({
  
   user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'usertables'},
    movie_id:{type: mongoose.Schema.Types.ObjectId,required:true,ref:'movietable1'},
  
    comment:{type:String,required:true},
    isdeleted:{type:Number,default:0}},
    {
        timestamps:true
    }
    
)


module.exports=mongoose.model("comment",schema);