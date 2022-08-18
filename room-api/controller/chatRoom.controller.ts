import ChatRoomService from "../services/chatRoom.service";
import { Request, Response } from 'express';
import { io } from "../main";
import { mg } from "./customerViewRoom.controller";
io.on('connect', (socket:any) =>{       
    socket.on('join', (chatDate:any)=>{
        socket.join(`${chatDate.chatData.customer_id}-${chatDate.chatData.id}-${chatDate.chatData.host_id}`);
        
    })
    socket.on("sendMessage", ({chatDate , messageLog}:any)=>{
        socket.to(`${chatDate.customer_id}-${chatDate.id}-${chatDate.host_id}`).emit("message", messageLog)
    })
    socket.on('disconnection', () => {
        socket.disconnect();
    })
    
})

export default class ChatRoomController {
    constructor(public ChatRoomService: ChatRoomService){}
    fetchChatInfo = async (req:Request, res: Response)=>{
        let {requestSLot, chatLog} = await this.ChatRoomService.getChatData(req.user?.id)
        res.status(200).json({requestSLot, chatLog})
    }
    initChatRoom = async (req:Request, res: Response)=>{
        try{
        let customer_id = req.user?.id
        let {initChatInput, host_id, space_name} = req.body
        
        const {hostInfo, customerInfo, chat_table_id}:any = await this.ChatRoomService.initChatData(customer_id,initChatInput, host_id, space_name)
        const toHost = {
            from: 'Zpace <zpaceroomrenting@gmail.com>',
            to: `${hostInfo.email}`,
            subject: `Enquiries on room: ${space_name}`,
            text: `${customerInfo.username}: ${initChatInput}`
        };
        const toCustoemr = {
            from: 'Zpace <zpaceroomrenting@gmail.com>',
            to: `${customerInfo.email}`,
            subject: 'Enquiry is sent successfully',
            text: 'host will answer your enquiry shortly.'
        };
        mg.messages().send(toHost, function (error:any, body:any) {

        });
        mg.messages().send(toCustoemr, function (error:any, body:any) {
        });
            return res.status(200).json({message: "message sent successfully.", chat_table_id})
        }catch(e){
            return res.status(401).json({message: "message is unable to send"})
        }
    }
    fetchRequestPreview = async (req:Request, res: Response)=>{
        try{
            const {customer_id, rooms_id} = req.body
            let fetchPreview = await this.ChatRoomService.requestPreview(customer_id, rooms_id)
                return res.status(200).json({fetchPreview})
            }catch(e){
                return res.status(401).json({message: "failed to fetch"})
            }
    }
    fetchChatPreview  = async (req:Request, res: Response)=>{
        try{
            const {chat_id} = req.body
            let chatPreview = await this.ChatRoomService.requestChatPreview(chat_id,req.user?.id )
                return res.status(200).json({chatPreview})
            }catch(e){
                return res.status(401).json({message: "failed to fetch"})
            }
    }
    fetchChatContent = async (req:Request, res: Response)=>{
        try{
            const {chat_id} = req.body
            let {chatTable,HostPreview,customerPreview, chatContent} = await this.ChatRoomService.fetchChatContent( chat_id)
            if(chatTable.customer_id === req.user?.id || chatTable.host_id === req.user?.id){
                
                await this.ChatRoomService.updateMsgRead(req.user?.id, chatTable)
                return res.status(200).json({chatTable,HostPreview,customerPreview, chatContent})
            } else {
                return res.status(401).json({message: "failed to fetch"})
            }
                
            }catch(e){
                return res.status(401).json({message: "failed to fetch"})
            }
    }
    updateChat = async (req:Request, res: Response)=>{
        try{
            const {messageLog} = req.body
            await this.ChatRoomService.updateChatContent(messageLog)
                return res.status(200).json({message: "update successfully"})
            }catch(e){
                return res.status(401).json({message: "failed to fetch"})
            }
    }
    updateChatRead = async (req:Request, res: Response)=>{
        try{
            const userId = req.user?.id
            const {chatDate, msg} = req.body
            await this.ChatRoomService.updateChatRead(chatDate, msg, userId)
                return res.status(200).json({message: "update successfully"})
            }catch(e){
                return res.status(401).json({message: "failed to fetch"})
            }
    }
}





