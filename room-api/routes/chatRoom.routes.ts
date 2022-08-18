
import express from "express";
import ChatRoomController from "../controller/chatRoom.controller";
import { isLoggedIn } from "../guards";


export const ChatRoomRoute = (chatRoomController: ChatRoomController)=>{
    let chatRoomRoutes = express.Router();
    chatRoomRoutes.post("/request-preview", isLoggedIn, chatRoomController.fetchRequestPreview)
    chatRoomRoutes.post("/chat-preview", isLoggedIn, chatRoomController.fetchChatPreview)
    chatRoomRoutes.post("/chat-content", isLoggedIn, chatRoomController.fetchChatContent)
    chatRoomRoutes.post("/chat-update", isLoggedIn, chatRoomController.updateChat)
    chatRoomRoutes.post("/chat-read", isLoggedIn, chatRoomController.updateChatRead)
    chatRoomRoutes.post("/chat-room", isLoggedIn, chatRoomController.initChatRoom)
    chatRoomRoutes.get("/", isLoggedIn, chatRoomController.fetchChatInfo)

    return chatRoomRoutes;
}
