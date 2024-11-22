import { Notification } from "../models/notificication.model.js";
import { User } from "../models/user.model.js";


 export const getAllNotification = async(req,res)=>{
      try {
        const userId = req.user._id;
        const user = await User.findById(userId);
       
        if(!user){
            return res.status(404).json("user not found");
        }

        const notification = await Notification.find({to:userId}).populate({path:'from',model:User})
           
        if(!notification){
            return res.status(404).json("Notification not found");
        }
        await Notification.updateMany({to:userId},{read:true});
        
        return res.status(201).json(notification);
      } catch (error) {
        console.log("comming to error in getUserPost",error)
        res.status(500).json("Internal server error",error);
      }
 }

 export const deleteAllNotification = async (req,res)=>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId})
        res.status(201).json("Notification deleted successfully");
    } catch (error) {
       
        res.status(500).json("Internal server error",error);
    }
 }

 export const deleteNotification = async (req,res)=>{
     try {
        const notificationId = req.params.id;
        const userId = req.user._id;
         const notification = await Notification.findById(notificationId);
         if(!notification){
            return res.status(401).json("notification not found");
         }
         if(notification.to.toString()!==userId.toString()){
             return res.status(401).json("you arew not allowed to delete this notification")
         }
         await Notification.findByIdAndDelete(notificationId);
         return res.status(201).json({messege:"post deleted successfully"});
     } catch (error) {
        console.log("comming to error in getUserPost",error)
        res.status(500).json("Internal server error",error);
     }
 }