import ViewAllRoomsService from '../services/viewAllRooms.service';
import { Request, Response } from 'express';
import "../models";

class ViewAllRoomsController {
    constructor(private viewAllRoomsService: ViewAllRoomsService){}
    
    get = async(req: Request, res: Response)=>{
        try{
            let room_owner_id:number = req.user!.id
            const getCreateRoomInfo = await this.viewAllRoomsService.getCreateRoomInfo(room_owner_id);
            if(getCreateRoomInfo === null){
                return res.json({result: "not able to find any rooms"})
            }
            return res.status(200).json(getCreateRoomInfo)
        } catch(e) {
            return res.status(500).json(e.toString());
        }
    } 

    delete = async(req: Request, res: Response)=>{
        try{
            let roomId = req.body["room-id"]
            await this.viewAllRoomsService.deleteRoomInfo(roomId)
            return res.json({result: "deleted room"})
        } catch(e){
            console.log(e)
            return res.status(500).json(e.toString());
        }
    }
    fetchRoomDetail = async (req: Request, res: Response) =>{
        try {
            let roomData = await this.viewAllRoomsService.fetchRoomDetail(Number(req.params.id))
            res.status(200).json({roomData})
        }catch(e){
            res.status(401).json({errors: "fail to fetch"})
        }
    }
    
    fetchChatData = async (req: Request, res: Response) =>{
        try {
            let data = await this.viewAllRoomsService.fetchChartData(Number(req.user?.id))
            res.status(200).json({data})
        }catch(e){
            res.status(401).json({errors: "fail to fetch"})
        }
    }
}

export default ViewAllRoomsController
