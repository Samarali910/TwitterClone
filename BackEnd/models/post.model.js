import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
     },
     text:{
        type:String
     },
     img:{
        type:String
     },
     like:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],
     comments: [
        {
            text:{
                type:String,
                required:true
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            }
        }
     ]
},{timestamps:true})


export const Post = mongoose.model('Post',postSchema);