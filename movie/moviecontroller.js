
const moviemodel=require('./moviemodel');
const mongoose=require('mongoose');
const axios=require('axios');





class movieclass{
searchmovie=async(req,res)=>{
    try{  
      
      const query=req.params.text;
      
      const type=req.query.type;
     
      let result ;
      if(type==1){
       result=await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.api_key}&language=hindi&page=1&include_adult=false
      &query=${query}`);}
      else{
       
        result=await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.api_key}&language=hindi&page=1&include_adult=false
        &query=${query}`)

      }

      const adder="https://image.tmdb.org/t/p/w500";

       let data=[];
      const array=result.data.results;
     
 data=await Promise.all (array.map(async(elem )=> {
        let {first_air_date,original_name,poster_path,backdrop_path,genre_ids,id,overview,original_title,original_language,popularity,release_date}=elem;
        if(poster_path)
        poster_path=adder+poster_path;
        else
        poster_path="";
        if(backdrop_path)
        backdrop_path=adder+backdrop_path;
        else
        backdrop_path="";

     let element={
            type:type,
    overview:overview,
    tmdbId:id,
    original_title:original_title||original_name,
    original_language:original_language,
    poster_path:poster_path,
    backdrop_path:backdrop_path,
    genre_ids:genre_ids,
    popularity:popularity,
    release_date:release_date||first_air_date

        }

       
        
        let val=await moviemodel.find({tmdbId:element.tmdbId});
        
      
          if(val.length==0){    
           
         return element;}
         else{
           return null;
         }
       
     
       }));
       
      
     let data2=[];
      data.forEach(element => {
          if(element) data2.push(element);

      }); 
      
      const dbdata=await moviemodel.find({$and:[{ 'original_title' : { '$regex' : query, '$options' : 'i' }},{type:type}]});
       if(data2.length==0)  return res.status(404).json({status:0, message:'Data is Already Present in the Database',Data:dbdata});
   
      
    const moviedata=await moviemodel.create(data2);
  
      res.send({status:1,message:'successful',data:moviedata});
    }catch(error){
      res.status(404).json({status:0, message:'failed', error:error.message})
    }
  
  }


  movieDetails=async(req,res)=>{
      try{
        const data={
          id:req.params.id,
          type:req.query.type
        }
       
        const moviedata1=await moviemodel.find({$and:[{_id:data.id},{type:data.type}]});
        
        if(moviedata1.length==0) return res.status(404).json({status:0, message:'Kindly enter with correct Id and Type '});
       
         //to check if all the values in the objects are filled or not
       
        var flag1=JSON.parse(JSON.stringify(moviedata1)); // we need to convert the data in objects 
           flag1=flag1[0];
         let flag2=true;
       
       const id=flag1.tmdbId;

       console.log("id:",id);

         for (const key in flag1) {
        
              if(flag1[key]==null){
                  flag2=false;
              }
          }
       console.log(flag2);
        if(flag2) return res.status(200).json({status:1,
        message:"successful",Data:moviedata1});
     
        let result;
        if(data.type==1){
          console.log("hello");
          result=await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.api_key}&language=en-US
          `);

          console.log("hello1");
        }
         else{
          
           result=await axios.get(`https://api.themoviedb.org/3/tv/${data.id}?api_key=${process.env.api_key}&language=en-US`)
           
   
         }

       const array=result.data;
     
 
        let {production_companies,production_countries,status,tagline}=array;
         
         let val=await moviemodel.findOneAndUpdate({_id:data.id},{$set:{
                production_companies:production_companies,
                production_countries:production_countries,
                status:status,
                tagline:tagline
         }},{new:true});
             
         res.status(200).json({Status:1,Message:"New Data Updated Successfully",Data:val}); 
        

      }catch(error){
        res.status(404).json({status:0, message:'failed', error:error.message})
      }
        


  }


  
}



module.exports=movieclass;