const {  mongoose, Schema } = require("mongoose")
const {ObjectId}=mongoose.Schema;

const userSchema= mongoose.Schema({
    firstName:{type:String,required:true},              // small letters not capital letters for schema
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    address:{type:String},
    follower: [{ type:ObjectId,default:""}],
    following: [{ type:ObjectId, default:""}],
    // created_at: { type: Date, required: true, default: Date.now }

},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports=mongoose.model("userTable",userSchema);