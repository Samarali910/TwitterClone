import { Router } from "express";
import { followOrUnfollow, getUserProfile, updatedUser } from "../controller/user.controller.js";
import { protectedRoute } from "../middleware/protectedroute.js";
 import { suggestUser } from "../controller/user.controller.js";
const route=Router();

route.get('/profile/:userName',protectedRoute,getUserProfile)
route.post('/followunfollow/:id',protectedRoute,followOrUnfollow)
route.post('/suggest',protectedRoute,suggestUser)
route.post('/update',protectedRoute,updatedUser)

export default route;
