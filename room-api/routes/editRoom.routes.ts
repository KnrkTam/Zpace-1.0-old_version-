import express from "express";
import EditRoomsController from '../controller/editRooms.controller';
import { isLoggedIn } from '../guards';
import { upload } from '../main';

export const EditRoomsRoute = (editRoomsController:  EditRoomsController)=>{
    let editRoomsRoute = express.Router();
    editRoomsRoute.get("/:id", isLoggedIn, editRoomsController.get)
    editRoomsRoute.post("/:id", upload.array("newPictures"), isLoggedIn, editRoomsController.post)
    // editRoomsRoute.delete("/:picture_id", isLoggedIn, editRoomsController.delete)
    return editRoomsRoute;
} 