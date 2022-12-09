const model=require('./model');
const mongoose=require('mongoose');
class like{

    addLike=async(req,res)=>{
       try {

        const data={
         movie_id:req.body.movie_id,
         user_id:req.data._id}

      

        const result=await model.find({user_id:data.user_id,movie_id:data.movie_id,isdeleted:0});
      
         if(result&&result.length>0){
          return res.status(200).json({status:0,msg:"You Have already Liked it "});
         }

         const resdata=await model.create(data);
          
         const pipeline=[
          {$match:{$and:[{_id:mongoose.Types.ObjectId(resdata._id)},{user_id:mongoose.Types.ObjectId(data.user_id)}]}},

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

   deletelike=async(req,res)=>{
    try {

      const data={
          _id:req.params.id,
          user_id:req.data._id
      }
        

        if(data._id.trim()==""||!data._id){
  return res.status(200).json({status:0,"message":"kindly enter the  id"});
        }



const result=await model.findOneAndUpdate({_id:data._id,user_id:data.user_id,isdeleted:0},{isdeleted:1});

if(!result)return res.status(200).json({status:1,msg:"Invalid request"});
   return res.status(200).json({status:1,msg:"like Deleted Successful"});
      
  } catch (error) {
      return res.status(404).json({status:0, message:'failed', error:error.message})    
  }


   }

   likelist=async(req,res)=>{
    try {
      const page=Number(req.query.page)||1;
      const limit=Number(req.query.limit)||10;
      const data={
          movie_id:req.params.id
      }
     
      if(data.movie_id.trim()==""||!data.movie_id){
      return res.status(200).json({status:0,msg:"Please enter the movie_id"});
      }
     

      const pipeline=[
    //   {$match:{$and:[{movie_id:mongoose.Types.ObjectId(data.movie_id)},{isdeleted:0}]}},
      {$match:{movie_id:mongoose.Types.ObjectId(data.movie_id),isdeleted:0}},

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
              _id:"$movie_data._id",
              Movie:{"$first":"$movie_data"},
              Likes:{"$push":"$user_data"}

          }
      },

      {
          $project:{Movie:1,Likes:1,_id:0}
      }

      ]

      let result=await model.aggregate(pipeline);
      const Movie=result[0].Movie;
      const Likes=result[0].Likes;
      
  
   
      if(result.length==0) return res.status(404).json({status:0,Msg:"No Likes "});
  
      return res.status(200).json({status:1,Msg:"Successful ",Movie,Likes});
      
   } catch (error) {
      return res.status(404).json({status:0, message:'failed', error:error.message}) 
   }

   }








}

module.exports=like;