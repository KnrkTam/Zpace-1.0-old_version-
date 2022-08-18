import EditRoomsService from '../services/editRooms.service';
import { Request, Response } from 'express';
import "../models";

class EditRoomsController {

    constructor(private editRoomsService: EditRoomsService) { }

    get = async (req: Request, res: Response) => {

        try {
            if (req.params.id) {
                let room_id = Number(req.params.id);
                const getRoomOriginalInfo = await this.editRoomsService.getOriginalInfoByRoomId(room_id);
                // console.log(getRoomOriginalInfo)
                if (getRoomOriginalInfo === null) {
                    return res.json({ result: "not able to find the room specified" })
                }
                return res.status(200).json(getRoomOriginalInfo)
            } else {
                return res.status(400).json("error: missing room id/invalid room id")
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json(e.toString())
        }

    }

    post = async (req: Request, res: Response) => {
        try {
            if (req.params.id) {
                let room_id = Number(req.params.id);
                let updateRoomInfo = req.body
                // update text
                const getUpdateRoomInfo = await this.editRoomsService.updateRoomInfo(room_id, updateRoomInfo.newSpaceName,
                    updateRoomInfo.newHourlyPrice, updateRoomInfo.newCapacity, updateRoomInfo.newDescription)

                // update pictures
                let getPictureInfo;
                if (req.files) {
                    getPictureInfo = await this.editRoomsService.addRoomPhotoFromEdit(room_id, req.files)
                }

                // delete weekly timeslot
            
                let deleteWeeklyTimeSlot;
                if(req.body.deleteWeeklyArray && req.body.deleteWeeklyArray.length > 0) {
                    let deleteWeeklyArray = req.body.deleteWeeklyArray 
                    deleteWeeklyTimeSlot = await this.editRoomsService.deleteWeeklyTimeSlot(deleteWeeklyArray)
                }
                
                // delete pictures
                
                let getDeletePicInfo;
                if (req.body.deletePicArray && req.body.deletePicArray.length > 0) {
                    let picture_id_array = req.body.deletePicArray
                    getDeletePicInfo = await this.editRoomsService.deleteRoomPhotosFromEdit(picture_id_array)
                } 

                // update weekly timeslot
                let getWeeklyTimeSlot = req.body.weeklyUpdate;
                if (getWeeklyTimeSlot) {
                    getWeeklyTimeSlot = await this.editRoomsService.updateWeeklyTimeSlot(room_id, req.body.weeklyUpdate)
                }

                // update oneoff timeslot
				let oneOffTimeSlot = req.body.oneOffTimeSlot
				if (oneOffTimeSlot) {
                    oneOffTimeSlot = await this.editRoomsService.updateOneOffTimeSlot(room_id, oneOffTimeSlot)
                }
                
                // delete oneoff timeslot  
                
                if(req.body.deleteOneOffArray && req.body.deleteOneOffArray.length > 0) {
                    let {deleteOneOffArray} = req.body
                    await this.editRoomsService.deleteOneOffTimeSlot(deleteOneOffArray)
                }
                
                return res.status(200).json({ getUpdateRoomInfo, getPictureInfo, getDeletePicInfo, deleteWeeklyTimeSlot })
            } else {
                return res.status(400).json({message: "missing room id"})
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json(e.toString())
        }
    }

    // delete = async (req: Request, res: Response) => {
    //     try {
    //         let picture_id_array = req.body
    //         console.log("delete req.body", picture_id_array)
    //         const deletePhoto = await this.editRoomsService.deleteRoomPhotosFromEdit(picture_id_array)
    //         if (!picture_id_array) {
    //             return;
    //         }
    //         return res.status(200).json(deletePhoto)
    //     } catch (e) {
    //         console.log(e)
    //         return res.status(500).json(e.toString())
    //     }
    // }
}

export default EditRoomsController