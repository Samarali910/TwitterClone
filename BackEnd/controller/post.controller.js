import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Notification } from "../models/notificication.model.js";
import { Model } from "mongoose";

 export const createPost = async (req,res)=>{

     try {
        let {text,img} = req.body;

        const userId = req.user._id.toString();
        if(!text && !img){
            return res.status(401).json("inside post must have img and text")
        }

        if(img){
            const cloudinaryResponce = await cloudinary.uploader.upload(img);
            img = cloudinaryResponce.secure_url
        }

        const currentUser = await User.findById(userId);
        if(!currentUser){
            return res.status(404).json("user not found");
        }
        
        const newPost = new Post({
            user:userId,
            text,
            img
        })
        await newPost.save();
        return res.status(201).json(newPost);
     } catch (error) {
        console.log("comming to error in updatedUser",error)
        res.status(500).json("Internal server error",error);
     }
  }

  export const deletePost = async (req,res)=>{
     try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(401).json('post is not found')
        }
        if(post.user.toString()!==req.user._id.toString()){
            return res.status(401).json('you are not authorised to delete the post')
        }
         
        if(Post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

         const postDelete = await Post.findByIdAndDelete(req.params.id);

         return res.status(201).json("post deleted successfully");

     } catch (error) {
        console.log("comming to error in updatedUser",error)
        res.status(500).json("Internal server error",error);
     }
  }

  export const commentOnPost = async (req,res)=>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
         const post = await Post.findById(postId).populate({path:'user',model:User}).populate({path:'comments.user',model:User})
        console.log("post",postId)
        if(!post){
            return res.status(401).json("post not found");
        }
        const comment = {
            userId,
            user:userId,
            text
        }
        
        post.comments.push(comment);
         
        await post.save();
        return res.status(201).json(post)

    } catch (error) {
        console.log("comming to error in commentOnPost",error)
        res.status(500).json("Internal server error",error);
    }
  }

  export const postLikeUnlike = async (req,res)=>{
       try {
         const postId = req.params.id;
         const userId = req.user._id;
         const post = await Post.findById(postId);

         if(!post){
            return res.status(404).json("post os not found");
         }
         const like = post.like.includes(userId);

          
         if(like){
            await Post.updateOne({_id:postId},{$pull:{like:userId}});
            await User.updateOne({_id:userId},{$pull:{likedposts:postId}})
            const updatelike = post.like.filter((id)=>id.toString()!==userId.toString())
            console.log("updatelike",updatelike)
              
            return res.status(201).json(updatelike);
         }else{
            post.like.push(userId);
            //user ki id ke under likepost fields me postId aani chahiye
            await User.updateOne({_id:userId},{$push:{likedposts:postId}})
            await post.save();
            const newNotification = new Notification({
                 from:userId,
                 to:post.user,
                 type:'like'
            })
             


            await newNotification.save();
         }
         const updatedlike = post.like;
        
         return res.status(201).json(updatedlike);
       } catch (error) {
        console.log("comming to error in updatedUser",error) 
        res.status(500).json("Internal server error",error);
       }
  }

  export const getAllPosts = async (req,res)=>{
      try {
         const post = await Post.find().sort( { createdAt: -1 }).populate({path:'user',model:User}).populate({path:'comments.user',model:User})
         if(post.length===0){
            return res.status(200).json([]);
         }

       return res.status(201).json(post);
      } catch (error) {
        console.log("comming to error in getAllPosts",error)
        res.status(500).json("Internal server error",error);
      }
  }

  export const getLikePost = async (req,res)=>{
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json("User not found");
        }
        const likedPosts = await Post.find({_id:{$in:user.likedposts}})
        .populate({path:'user',model:User})
        .populate({path:"comments.user",model:User})
        return res.status(201).json(likedPosts);
    } catch (error) {
        console.log("comming to error in updatedUser",error) 
        res.status(500).json("Internal server error",error);
    }
  }

  export const followingPost = async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json("user not found");
        }
        const following = user.following;
        const feedPosts = await Post.find({user:{ $in:following }})

        return res.status(201).json(feedPosts);
    } catch (error) {
        console.log("comming to error in updatedUser",error) 
        res.status(500).json("Internal server error",error);
    }
  }

  export const getUserPost = async(req,res)=>{
    try {
         const { userName } = req.params;
        const user = await User.findOne({userName});
        
        if(!user){
            return res.status(404).json("user not found");
        }
        const posts = await Post.find({user:user._id}).populate({path:"user",model:User}).populate({path:"comments.user",model:User});
        if(!posts){
            return res.status(401).json("Posts not found");
        }
        return res.status(201).json(posts);
    } catch (error) {
        console.log("comming to error in getUserPost",error)
        res.status(500).json("Internal server error",error);
    }
  }
