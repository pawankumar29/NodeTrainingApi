const model=require('./comment_model');
const mongoose=require('mongoose');

class comment{

addComment=async(req,res)=>{
    
    try {
       const data=req.body;
       const resultdata={
          user_id:req.data._id,
          movie_id:data.movie_id,
          comment:data.comment

       }
      
       const data1=await model.create(resultdata);


       const pipeline=[
          {$match:{_id:mongoose.Types.ObjectId(data1._id),user_id:mongoose.Types.ObjectId(resultdata.user_id)}},

          {$lookup:{
            from:"usertables",
            let:{ref_id:"$user_id"},
            pipeline:[
                {$match:
                    {
                         $expr:
                         {
                           $eq:["$_id","$$ref_id"]
                         }
                
                }
            },

            {
                $project:{firstName:1,lastName:1,email:1}
            }
            ],
            as:"user_details"
          }},


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
                        $project: {original_title:1,original_language:1,tmdbId:1,type:1,overview:1,_id:0}
                    }

                   
                ],
                as:"movie_data"

                
            }

          },
       
        

        //   {$addFields:{
        //       "user_details.comment":"$comment",  //for remembering 
              
        //   }},

        {
            $unwind:"$user_details"
          }
          ,
          {
            $unwind:"$movie_data"
          }

         ,
          

          {
            $project:{
                 user_details:1,movie_data:1,_id:0,comment:1
            }
          }
           
         
        
    ]

            const result=await model.aggregate(pipeline);
       

        return res.status(200).json({status:1,msg:"successsful  Comment",Data:result})
        
    } catch (error) {
        return res.status(404).json({status:0, message:'failed', error:error.message})
    }
  




}


editComment=async(req,res)=>{

    try {

        const {comment}=req.body;
        const user_id=req.data._id;
        const _id=req.params.id;

        if(_id.trim()==""||!_id){
    return res.status(200).json({status:0,msg:"please enter the id "});
        }
        
        const data=await model.findOneAndUpdate({_id:_id,user_id:user_id,isdeleted:0},{comment:comment},{new:true});
     
        if(!data) return res.status(401).json({status:1,msg:"no Comment is available"});

        const pipeline=[
            {$match:{_id:mongoose.Types.ObjectId(_id),user_id:mongoose.Types.ObjectId(user_id),movie_id:mongoose.Types.ObjectId(data.movie_id)}},
  
            {$lookup:{
              from:"usertables",
              let:{ref_id:"$user_id"},
              pipeline:[
                  {$match:
                      {
                           $expr:
                           {
                             $eq:["$_id","$$ref_id"]
                           }
                  
                  }
              },
  
              {
                  $project:{firstName:1,lastName:1,email:1}
              }
              ],
              as:"user_details"
            }},
  
  
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
                          $project: {original_title:1,original_language:1,tmdbId:1,type:1,overview:1,_id:0}
                      }
  
                     
                  ],
                  as:"movie_data"
  
                  
              }
  
            },
         
          
  
            {$addFields:{
                "movie_data.comment":"$comment",
                
            }},
            {
                $unwind:"$user_details"
              }
              ,
              {
                $unwind:"$movie_data"
              },

            {$group:{
                _id:"$user_details._id",
                user_data:{$first:"$user_details"},
                Movies:{$first:"$movie_data"}
            }}
           ,
            
              {$unwind:"$Movies"},
            {
              $project:{
                   user_data:1,Movies:1,_id:0
              }
            }
             
            
  
          
      ]

      const result=await model.aggregate(pipeline);
  

        return res.status(200).json({status:1,msg:"Successful",Data:result});


        
    } catch (error) {
        return res.status(404).json({status:0, message:'failed', error:error.message})
    }

}

softDelete=async(req,res)=>{
   try {
   
    const _id=req.params.id;
   const  user_id=req.data._id;

   if(_id.trim()==""||!_id){
    return res.status(200).json({status:0,msg:"please enter the id "});
        }
   

    const data=await model.findOneAndUpdate({_id:_id,user_id:user_id,isdeleted:0},{isdeleted:1},{new:true});

    if(!data) return res.status(401).json({status:1,msg:"no Comment is available to Delete"});

    return res.status(200).json({status:1,msg:"comment Deleted Successful"});
   } catch (error) {
    return res.status(404).json({status:0, message:'failed1', error:error.message})
   }
  


}


getlist=async(req,res)=>{
   try {
        const movie_id=req.params.id;

        if(movie_id.trim()==""||!movie_id){
    return res.status(401).json({status:0,msg:"kindly enter the id "})
        }
        const page=Number(req.query.page)||1;
        const limit=Number(req.query.limit)||10;

       

        const pipeline=[
           {$match:{movie_id:mongoose.Types.ObjectId(movie_id),isdeleted:0}},
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

        {$unwind:"$user_data"},
        {$unwind:"$movie_data"},
        
        {$addFields:{
            "user_data.comment":"$comment",
            
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
                _id:"$movie_data._id",
                Movie:{"$first":"$movie_data"},
                user_details:{"$push":"$user_data"}

            }
        },

      

     

        {
            $project:{Movie:1,user_details:1,_id:0}
        },

        

        ]
       
     

     let result=await model.aggregate(pipeline);
    
     
    if(result.length==0) return res.status(401).json({status:0,Msg:"No comments "});

    return res.status(401).json({status:1,Msg:"Successful ",result});
  
    
   } catch (error) {
    return res.status(404).json({status:0, message:'failed', error:error.message})
   }


}




}


module.exports=comment