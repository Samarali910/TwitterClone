import { Router } from "express";
import { protectedRoute } from "../middleware/protectedroute.js";
import { commentOnPost, createPost, deletePost, followingPost, getAllPosts, getLikePost, getUserPost, postLikeUnlike } from "../controller/post.controller.js";
const route = Router();

route.get('/likedpost/:id',protectedRoute,getLikePost);
route.get('/allpost',protectedRoute,getAllPosts);
route.get('/getuserpost/:userName',protectedRoute,getUserPost);
// after will see this router
route.get('/followpost',protectedRoute,followingPost);

route.post('/createpost',protectedRoute,createPost);
route.delete('/deletepost/:id',protectedRoute,deletePost);
route.post('/comment/:id',protectedRoute,commentOnPost);
route.post('/likeunlike/:id',protectedRoute,postLikeUnlike);

export default route;