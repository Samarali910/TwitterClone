import { Router } from "express";
import { logout, signup,login } from "../controller/auth.controller.js";
import { getMe } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedroute.js";
 
const route = Router();
route.post('/signup',signup)
route.post('/me',protectedRoute,getMe)

route.post('/login', login)

route.post('/logout',logout)

 export default route;