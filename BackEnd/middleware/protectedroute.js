import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protectedRoute = async (req, res, next) => {
  try {
 
    const token = req.cookies.jwt_Tocken   // Check the cookie name
    

    if (!token) {
      return res.status(401).json({ error: "Unauthorized Error" });
    }
    const decodedTocken = jwt.verify(token,process.env.JWT_SECRETE)
    
    if(!decodedTocken){
      res.status(401).json("tocken is not valid")
    }
    const user = await User.findById(decodedTocken.uid)
     if(!user){
       return res.status(401).json("user does not exists");
     }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error:", error.message); // Log the error message
    res.status(500).json("Internal server error"); // Send a generic error response
  }
};
