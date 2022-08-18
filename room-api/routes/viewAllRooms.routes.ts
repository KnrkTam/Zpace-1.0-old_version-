import express from "express";
import ViewAllRoomsController from '../controller/viewAllRooms.controller';
import { isLoggedIn } from '../guards';

export const ViewAllRoomsRoute = (viewAllRoomsController:  ViewAllRoomsController)=>{
    let ViewAllRoomsRoute = express.Router();
    ViewAllRoomsRoute.get("/room-detail/:id",isLoggedIn, viewAllRoomsController.fetchRoomDetail)
    ViewAllRoomsRoute.get("/chart-data",isLoggedIn, viewAllRoomsController.fetchChatData)
    ViewAllRoomsRoute.get("/:id", isLoggedIn, viewAllRoomsController.get)
    ViewAllRoomsRoute.delete("/:id", isLoggedIn, viewAllRoomsController.delete)
    
    return ViewAllRoomsRoute;
}