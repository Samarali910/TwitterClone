import { Notification } from "../models/notificication.model.js";
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
 const getUserProfile  = async(req,res)=>{
    try {
         const {userName} = req.params;
         if(!userName){
            return res.status(401).json({messege:"userName does not exists in getUserProfile"})
         }
         const user = await User.findOne({userName}).select('-password');
         return res.status(201).json(user);
    } catch (error) {
         console.log("comming to error in getUserProfile",error.messege)
         res.status(500).json("Internal server error",error.messege);
    }
 }

 const followOrUnfollow = async(req,res)=>{
    try {
      const {id} = req.params;
      
      const userModify = await User.findById(id);
       
      const currentUser = await User.findById(req.user._id);
      
      if(id===req.user._id.toString()){
         return res.status(400).json({messege:"you can not follow or unfollow yoursef"})
      }
     if(!userModify || !currentUser){
      return res.status(401).json("user not found")
     }
      const isfollowing = currentUser.following.includes(id);
       
      if(isfollowing){
         await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
         await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
         return res.status(201).json("User unfollow successfully")
      }else {
         await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
         await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})
          const newNotification = new Notification({
               type:'follow',
               from:req.user._id,
               to:userModify._id,
          })
          await newNotification.save();
          return res.status(201).json("User follow successfully")
      }

    } catch (error) {
      console.log("comming to error in followOrUnfollow",error.messege)
      res.status(500).json("Internal server error",error.messege);
    }
 }

 const suggestUser = async(req,res)=>{
   try {
      const userId = req.user._id;
      
      const userfollowByMe = await User.findById(userId).select('following');
      
      const user =await User.aggregate([
         {
            $match:{
               _id:{$ne:userId}
            }
         },
         {$sample: { size:10 }}
      ])
       

      const filterdUser = user.filter((user)=> !userfollowByMe.following.includes(user._id));
      const suggestedUser = filterdUser.slice(0,4);
      suggestedUser.forEach((user)=>user.passward=null);
       return res.status(201).json(suggestedUser);
     } catch (error) {
      console.log("comming to error in suggestUser",error.messege)
        return res.status(500).json("Internal server error",error.messege);
     }
 }

 const updatedUser = async(req,res)=>{
       try {
         const { userName,fullName,currentpassword,email,newpassword,bio,link } = req.body;
           console.log("userName",userName)
         let { profileImage,coverImage } = req.body;
         console.log("profileImage",profileImage);
          
          const userId = req.user._id;
           
          

          let user = await User.findById(userId);
         
          if(!user){
            return res.status(404).json("user not found");
          }
           
          
          if((!newpassword && currentpassword) || (!currentpassword && newpassword)){
            return res.status(401).json("please provide both current password and newpassword");
          }

          if(currentpassword && newpassword){
            const ismatch = await bcrypt.compare(currentpassword,user.password)
            if(!ismatch){
               return res.status(401).json("current password is incurrect")
            }
            user.password = await bcrypt.hash(newpassword,10)
          }      
          
      if(profileImage){
          
         if(user.profileImage){
            await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);

         }
        
        const uploadedResponse = await cloudinary.uploader.upload(profileImage);
        profileImage = uploadedResponse.secure_url;
        console.log("profileImage",profileImage)
      }
      if(user.coverImage){
         if(coverImage){
            await cloudinary.uploader.destroy(user.profileImage.split('/').pop().split('.')[0]);
         }
         const cloudinaryResponce =await cloudinary.uploader.upload(coverImage);
         profileImage =  cloudinaryResponce.secure_url
      }
        
       user.userName = userName || user.userName;
       console.log("user.userName",user.userName)
       user.fullName = fullName || user.fullName;
       
       user.email = email || user.email;
       user.bio =  bio || user.bio;
       user.link = link || user.link;
       user.profileImage = profileImage || user.profileImage;
		 user.coverImage = coverImage || user.coverImage;
   
        
      user = await user.save()
      user.password=null;
         
      return res.status(201).json(user);

      } catch (error) {
         console.log("comming to error in updatedUser",error)
         res.status(500).json("Internal server error",error);
       }
 }

 

 export {
    getUserProfile,
    followOrUnfollow,
    suggestUser,
    updatedUser
 }