 import { User } from "../models/user.model.js";
 import bcrypt from 'bcrypt'
 import { genreatetocken } from "../utils/genrateAccessTocken.js";
const signup = async(req,res)=>{

      try {
          const {userName,fullName,password,email} = req.body;
           
          if([userName,fullName,password,email].some((field)=>field?.trim==="")){
             res.status.send("All fields are required");
          }
          
          const username = await User.findOne({userName});
          if(username){
           return res.status(400).json("userName already exists")
          }
          const Email = await User.findOne({email});
          if(Email){
            return res.status(400).json("email is allready exists")
          }
           const hashPassword = await bcrypt.hash(password,10);
            
           const createUser = new User({
               userName,
               fullName,
               password:hashPassword,
               email
           })
         
           if(createUser){
              await genreatetocken(createUser._id,res);
              await createUser.save();
           }
           const existsUser = await User.findById(createUser._id).select('-password')
          return res.status(201).json(existsUser)
      } catch (error) {
         return res.status(500).json("Internal server Error Backend")
      }
} 

const login = async (req,res)=>{
    try {
      const {userName,password} = req.body;
       console.log("userName",userName)
       console.log("password",password)
      const user = await User.findOne({userName});

      console.log("user",user)
      if(!user){
       return res.status(401).json({error:"user does not exists"})
      }
      const paswordCorrectOrNot =await bcrypt.compare(password,user.password)
      if(!paswordCorrectOrNot){
         return res.status(401).json({error:"please enter valid password"})
      }
      genreatetocken(user._id,res);
     const exists_User =await User.findById(user._id).select('-password');
     res.status(201).json(exists_User)
    } catch (error) {
       res.status(400).json("interval server error")
    }
}


const getMe = async (req,res)=>{
   try {
      const existsUser = await User.findById(req.user._id).select("-password");
       
      if(!existsUser){
        res.status(401).json("Exists User not found")
      }
    return res.status(201).json({existsUser})

   } catch (error) {
    res.status(500).json("Unauthorised error")
   }
}

const logout = async (req,res)=>{
    try {
      res.cookie("jwt_Tocken","",{maxAge: 0})
      res.status(200).json({messege:"logout successfully"})
    } catch (error) {
      res.status(500).json("internal server error")
    }
}

export {
    signup,
    login,
    logout,
    getMe
}