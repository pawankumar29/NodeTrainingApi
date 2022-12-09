const {  mongoose, Schema } = require("mongoose")

const movieSchema= mongoose.Schema({
    type:{type:Number,required:true},
    overview:{type:String,default:""},
    tmdbId:{type:Number,required:true},
    original_title:{type:String,required:true},
    original_language:{type:String,default:""},
    poster_path:{type:String,default:""},
    backdrop_path:{type:String,default:""},
    genre_ids:[{type:Number}],
    release_date:{type:Date},
    popularity:{type:Number},
    production_companies:[
        {
            id:{type:Number ,default:null},
            logo_path:{type:String,default:null},
            name:{type:String,default:null},
            origin_country:{type:String,default:null}
        }
    ],

    production_countries:[
        {iso_3166_1:{type:String,default:null},
          name:{type:String,default:null}
        }
    ],

    status:{type:String,default:null},
    tagline:{type:String,default:null}
    

},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });





module.exports=mongoose.model("movieTable1",movieSchema);