const model=require('./Rating_model');
const usermodel=require('../User/usermodel');

const mongoose=require('mongoose');


class MovieRating{

add=async(req,res)=>{
    try {
          const data={
            movie_id:req.body.movie_id,
            rating:req.body.rating,
            user_id:req.data._id
          };
          
  if(data.rating>10||data.rating<=0){
     return res.status(404).json({status:0,message:"Rating should be greater or equal to zero and less than or equal to 10"})
  }

          const checkreview=await model.findOne({user_id:data.user_id,movie_id:data.movie_id,isdeleted:0});

          if(checkreview){
            return res.status(200).json({status:1,msg:"you have already rated to it you can rated it once"})
          }

          let userresult =await model.create(data); 
         

    
          const pipeline=[
            {$match:{_id:mongoose.Types.ObjectId(userresult._id),isdeleted:0}},
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
         
        //  {$addFields:{
        //      "user_data.rating":"$rating",
        //      "user_data.review":"$Review",
             
        //  }},
 
 
         {
             $project:{rating:1,review:1,movie_data:1,user_data:1,_id:0}
         },
 
         
 
         ]

     

        const result=await model.aggregate(pipeline);
            
       


        return res.status(200).json({status:1,Message:"Successs",Data:result});
        
    } catch (error) {
        return res.status(404).json({status:0, message:'failed', error:error.message})
    }
}


getList=async(req,res)=>{
 
  try{
         
           const userId=req.data._id;
        
           const limit =Number(req.query.limit)||10
           const page = Number(req.query.page)||1 


           const pipeline=[
            {$match:{user_id:mongoose.Types.ObjectId(userId),isdeleted:0}},
             
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
        
          {$addFields:{
             "movie_data.Rating":"$rating",
             "movie_data.Review":"$review"
          }},
   
         
 
         //pagination
         {
             $skip:(page-1)*limit
         },
         {
             $limit:limit
         },
 
     ///////////////
 
 
         {
             $group:{
                 _id:"$user_data._id",
                 user_details:{"$first":"$user_data"},
                 Movies:{"$push":"$movie_data"}
 
             }
         },
 
       
 
      
 
         {
             $project:{Movies:1,user_details:1,_id:0}
         },
 
         
 
         ]
     
   

              const result=await model.aggregate(pipeline);

              if(result.length==0) return res.status(404).json({status:0,msg:"No Rating is Available"});
             
          
         

         return res.status(200).json({status:1,message:"successful",Data:result});
        
        }catch(error){
            return res.status(404).json({status:0, message:'failed', error:error.message})
        }

}


softDelete=async(req,res)=>{
 
  try{
       const data={
         _id:req.params.id,
         user_id:req.data._id

       }
      

      if(data._id.trim()==""||!data._id){
        return res.status(401).json({
          status:0,
          msg:"please enter the id"
        })
      }

 
      const update=await model.findOneAndUpdate({_id:data._id,user_id:data.user_id,isdeleted:0},{isdeleted:1},{new:true});
       
      if(!update)
      return res.status(200).json({status:0,msg:"Invalid request"});

   

    res.status(200).json({status:1,message:"successfully Deleted"});



  }
  catch(error){
    return res.status(404).json({status:0, message:'failed', error:error.message})
  }
      
}








}

module.exports=MovieRating;