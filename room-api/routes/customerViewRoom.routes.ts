import express from "express";
import CustomerViewRoomsController from '../controller/customerViewRoom.controller';
import { isLoggedIn } from '../guards';

export const CustomerViewRoomsRoute = (customerViewRoomsController:  CustomerViewRoomsController)=>{
    let customerViewRoomsRoute = express.Router();
    customerViewRoomsRoute.get("/like/:room_id", isLoggedIn, customerViewRoomsController.toLike)
    customerViewRoomsRoute.delete("/unlike/:room_id", isLoggedIn, customerViewRoomsController.toUnLike)
    customerViewRoomsRoute.get("/one/like/:room_id", isLoggedIn, customerViewRoomsController.fetchLikeOneRoom)
    customerViewRoomsRoute.get("/non-logged/like/:room_id", customerViewRoomsController.fetchLikeOneRoomNotLoggedIn)
    customerViewRoomsRoute.post("/rating/:room_id", isLoggedIn, customerViewRoomsController.giveRatingToRoom)
    customerViewRoomsRoute.post("/to-success", isLoggedIn , customerViewRoomsController.bookingSuccess)
    customerViewRoomsRoute.get("/:id", isLoggedIn, customerViewRoomsController.get)
    return customerViewRoomsRoute;
}