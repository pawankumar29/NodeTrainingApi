const model=require('./model');
const mongoose=require('mongoose')

class bookmark{
 
    addBookmark=async(req,res)=>{
      
        try {
            const data={
            movie_id:req.body.movie_id,
             user_id:req.data._id}

          

            const rdata=await model.find({user_id:data.user_id,movie_id:data.movie_id,isdeleted:0});

             if(rdata&&rdata.length>0){
     return res.status(200).json({status:1,message:"this is already in your Bookmark"})
             }

        const result=await model.create(data);

        const pipeline=[
          {$match:{_id:mongoose.Types.ObjectId(result._id),user_id:mongoose.Types.ObjectId(data.user_id)}},

          {$lookup:{

             from:"usertables",
             let: { ref_id: "$user_id" },

             pipeline:[
                {
                    $match:{
                        $expr:{
                            $eq:["$_id","$$ref_id"]
                        }
                    }
                },
                {
                    $project:{firstName:1,lastName:1,email:1}
                }



             ],

             as:"userData"





          }},


          {$lookup:{

            from:"movietable1",
            let: { ref_id: "$movie_id" },

            pipeline:[
               {
                   $match:{
                       $expr:{
                           $eq:["$_id","$$ref_id"]
                       }
                   }
               },
               {
                $project: {original_title:1,original_language:1,tmdbId:1,type:1,overview:1,_id:0}
            }



            ],

            as:"movieData"





         }}

         ,

         {$unwind:"$userData"},
         {$unwind:"$movieData"}

,
      {
        $project:{"userData":1,"movieData":1,_id:0}
      }



        ]

        const resultData=await model.aggregate(pipeline);
        const user=resultData[0].userData;
        const movie_data=resultData[0].movieData;

        return res.status(200).json({status:1,message:"successful",user,movie_data})


            
        } catch (error) {
            return res.status(404).json({status:0, message:'failed', error:error.message}) 
        }
  





    }
   
  deleteBookmark=async(req,res)=>{
     
    try {

        const data={
            _id:req.params.id,
            user_id:req.data._id
        }
          

          if(data._id.trim()==""||!data._id){
    return res.status(200).json({status:1,"message":"kindly enter the id"});
          }

     

    const result=await model.findOneAndUpdate({_id:data._id,user_id:data.user_id,isdeleted:0},{isdeleted:1});

    if(!result){
        return res.status(200).json({status:1,msg:"Invalid Request"});
    }

     return res.status(200).json({status:1,msg:"Bookmark Deleted Successful"});
        
    } catch (error) {
        return res.status(404).json({status:0, message:'failed', error:error.message})    
    }






  }

   bookmarkList=async(req,res)=>{

     try {
        const page=Number(req.query.page)||1;
        const limit=Number(req.query.limit)||10;
        const data={
            user_id:req.data._id
        }
       

        const pipeline=[
        // {$match:{$and:[{user_id:mongoose.Types.ObjectId(data.user_id)},{isdeleted:0}]}},

        {$match:{user_id:mongoose.Types.ObjectId(data.user_id),isdeleted:0}},

        {
            "$lookup": {
                from: "usertables",
                let: { ref_id: "$user_id" },
                pipeline: [
                    { $match:
                        {
                            $expr:
                            {
                                $eq: ["$_id", "$$ref_id"]
                            }
                        }
                    },
                    {$project: {firstName:1,lastName:1,email:1}}
                ],
                as: "user_data"
            }
        },

        {
            $lookup:
            {
                from:"movietable1",
                let:{ref_id:"$movie_id"},

                pipeline:[
                    {
                        $match:{
                            $expr:
                            {
                                $eq:["$_id","$$ref_id"]
                            }

                        }
                    },


                    {
                        $project: {original_title:1,original_language:1,tmdbId:1,type:1,overview:1}
                    }

                   
                ],
                as:"movie_data"

                
            }

          },

          {$unwind:"$user_data"},
        {$unwind:"$movie_data"},

        {
            $skip:(page-1)*limit
        },
        {
            $limit:limit
        },

        {
            $group:{
                _id:"$user_data._id",
                User:{"$first":"$user_data"},
                Bookmarks:{"$push":"$movie_data"}

            }
        },

        {
            $project:{User:1,Bookmarks:1,_id:0}
        }

        ]

        let result=await model.aggregate(pipeline);
        const user=result[0].User;
        const bookmarks=result[0].Bookmarks;
    
     
        if(result.length==0) return res.status(404).json({status:0,Msg:"No Bookmarks "});
    
        return res.status(200).json({status:1,Msg:"Successful ",user,bookmarks});
        
     } catch (error) {
        return res.status(404).json({status:0, message:'failed', error:error.message}) 
     }


   }






}


module.exports=bookmark;