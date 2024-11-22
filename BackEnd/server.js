import express from 'express';
import authRouter from './routes/auth.router.js';
import connectDB from './db/index.js';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.router.js"
import postRouter from './routes/post.route.js'
import notificationRouter from './routes/notification.route.js'
import cors from 'cors'
 
import {v2 as cloudinary} from 'cloudinary';
const app = express();
import dotenv from 'dotenv';

 const PORT = process.env.PORT || 5000;

dotenv.config({
    path:'./.env'
})

 
          
cloudinary.config({ 
  cloud_name:  process.env.CLOUDNAME, 
  api_key: process.env.APIKEY, 
  api_secret: process.env.APISECRET
});

app.use(cors());
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true,limit:'5mb'}))
app.use(cookieParser({extended:true}))
 
 

 app.use('/api/auth',authRouter);
 app.use('/api/user',userRouter);
 app.use('/api/post',postRouter);
 app.use('/api/notifications',notificationRouter);


 connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`)
    })
 }).catch((error)=>{
    console.log("Mongodb Connection error",error)
 })

