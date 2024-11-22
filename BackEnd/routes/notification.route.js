import { Router } from "express";
import { protectedRoute } from "../middleware/protectedroute.js";
import { deleteNotification, getAllNotification } from "../controller/notification.controller.js";
import { deleteAllNotification } from "../controller/notification.controller.js";

const route = Router();


route.get('/',protectedRoute,getAllNotification)
route.delete('/',protectedRoute,deleteAllNotification)
route.delete('/:id',protectedRoute,deleteNotification)

export default route;