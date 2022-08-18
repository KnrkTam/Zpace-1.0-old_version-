import CreateRoomService from '../services/createRoom.service';
import { Request, Response } from 'express';
import '../models';

class CreateRoomController {
    constructor(private createRoomService: CreateRoomService){}

    post = async(req: Request, res: Response)=>{
        try{
            const postCreateRoomInfo = req.body;
            const address = postCreateRoomInfo.address
            const longitude = postCreateRoomInfo.longitude
            const latitude = postCreateRoomInfo.latitude
            let weekly_time_slot = JSON.parse(postCreateRoomInfo.weekly_time_slot)
            let oneoff_time_slot = JSON.parse(postCreateRoomInfo.oneoff_time_slot)
            const account_id:any = req.user?.id;
            await this.createRoomService.postCreateRoomInfo(address,weekly_time_slot,oneoff_time_slot, longitude, latitude, postCreateRoomInfo, account_id, req.files)
            if(!postCreateRoomInfo.space_name || !postCreateRoomInfo.hourly_price || !postCreateRoomInfo.district || !postCreateRoomInfo.capacity){
                return res.status(401).json({errors: "missing necessary room info"});
            }
            return res.status(200).json({
                success: true,
                message: "upload info successfully",
                body: req.body
            })
        } catch(e){
            return res.status(500).json(e.toString());
        }
    } 
}

export default CreateRoomController;