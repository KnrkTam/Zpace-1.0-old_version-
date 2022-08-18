import express from "express";
import CreateRoomController from '../controller/createRoom.controller';
import { isLoggedIn } from '../guards';
import { upload } from "../main";

export const CreateRoomRoute = (createRoomController: CreateRoomController)=>{
    let createRoomRoutes = express.Router();
    // createRoomRoutes.get("/manage-room/create-room", isLoggedIn, createRoomController.get)
    createRoomRoutes.post("/create-room", upload.array("rooms_pictures"), isLoggedIn,createRoomController.post)
    return createRoomRoutes;
}