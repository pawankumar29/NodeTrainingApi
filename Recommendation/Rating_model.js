const mongoose = require('mongoose')
const ratingReviews = new mongoose.Schema({
    rating:{type:Number},
    review:{type:String,default:""},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"usertables"},
    movie_id:{type:mongoose.Schema.Types.ObjectId,ref:"movietable1"},
    isdeleted:{type:Number,default:0}
}
 )
module.exports = mongoose.model('ratingReviews',ratingReviews)