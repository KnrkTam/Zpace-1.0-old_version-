import BookingService from '../services/booking.service';
import { Request, Response } from 'express';

import '../models';
import { mg } from './customerViewRoom.controller';


class BookingController {
  constructor(private bookingService: BookingService) { }

  checkBookingRecord = async (req: Request, res: Response) => {
    try {
      let check_booking_record = await this.bookingService.getBookingByID(req.params.id as any);
      let checkBookingRecord = check_booking_record
      res.json({ checkBookingRecord })
    } catch (e) {
      res.status(500).json(e.toString())
    }
  }
  checkUserBookingHistory = async (req: Request, res: Response) => {
    try {
      let check_booking_record = await this.bookingService.getUserBookingByID(req.params.id as any);
      let checkBookingRecord = check_booking_record
      res.json({ checkBookingRecord })
    } catch (e) {
      res.status(500).json(e.toString())
    }
  }
  fetchRoomDetail = async (req: Request, res: Response) => {
    try {
      let userInfo = req.body.userInfo
      let roomData = await this.bookingService.fetchRoomDetail(Number(req.params.id))
      let canRate = await this.bookingService.checkCanRateRoom(req.params.id, userInfo)
      res.status(200).json({ roomData, canRate })
    } catch (e) {
      res.status(401).json({ errors: "fail to fetch" })
    }
  }


  checkBookingHistoryList = async (req: Request, res: Response) => {
    try {
      let bookingList = await this.bookingService.getBookingHistoryList(req.params.id as any);
      res.json({ bookingList })
    } catch (e) {
      res.status(500).json(e.toString())
    }
  }
  checkUserBookingHistoryList = async (req: Request, res: Response) => {
    try {
      let bookingList = await this.bookingService.getUserBookingHistoryList(req.params.id as any);
      res.json({ bookingList })
    } catch (e) {
      res.status(500).json(e.toString())
    }
  }
  // post = async(req: Request, res: Response)=>{
  //     try{

  //         const agreementInfo = req.body;
  //         // original command: error occurs
  //         // const account_id: number = req.user?.id;

  //         // add type undefined - still error
  //         // const account_id: number | undefined = req.user?.id;
  //         const account_id: number = req.user!.id;

  //         console.log(account_id);
  //         console.log(agreementInfo.agreement)
  //         await this.becomeHostService.becomeHost(account_id, agreementInfo.agreement);
  //         if(!account_id || !agreementInfo){
  //             return res.status(401).json({
  //                 errors: "missing necessary info"
  //             })
  //         }
  //         return res.status(200).json({
  //             success: true,
  //             message: "submit info successfully",
  //             body: req.body
  //         })
  //     } catch(e){
  //         console.log(e)
  //         return res.status(500).json(e.toString());
  //     }
  // }

  // /booking
  // /booking?page=1
  checkAllRooms = async (req: Request, res: Response) => {
    try {
      const setting = req.body.setting
      const date = setting.date
      const weeks = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const week = new Date(date).getDay()
      const weekDay = weeks[week]
      let roomsInfoMap = await this.bookingService.getRoomPreview(weekDay, date)
      res.status(200).json({ roomsInfoMap })
    } catch (e) {
      res.status(400).json({ error: "fail to fetch" })
    }

  }
  fetchRoomRequest = async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id
      const timeSlot_id = req.params.id
      let { timeSlotInfo, eachTimeSlot, customerInfo, roomPic, roomInfo } = await this.bookingService.getRoomRequestInfo(timeSlot_id)
      if (roomInfo[0].room_owner_id === user_id) {
        return res.status(200).json({ timeSlotInfo, eachTimeSlot, customerInfo, roomPic, roomInfo })
      }
      return res.status(401).json({ message: "failed to fetch" })
    } catch (e) {
      return res.status(400).json({ error: "fail to fetch" })
    }

  }
  timeSlotReject = async (req: Request, res: Response) => {
    try {
      const { timeSlot_id } = req.body
      let { customerInfo, roomInfo } = await this.bookingService.timeSlotReject(timeSlot_id)

      const toCustoemr = {
        from: 'Zpace <zpaceroomrenting@gmail.com>',
        to: `${customerInfo.email}`,
        subject: `Time-Slots request on ${roomInfo.space_name} is rejected`,
        text: 'You may choose another time-slots.'
      };
      mg.messages().send(toCustoemr, function (error: any, body: any) {

      });
      return res.status(401).json({ message: "time-slot is rejected successfully" })
    } catch (e) {
      return res.status(400).json({ error: "fail to fetch" })
    }
  }
  timeSlotAccept = async (req: Request, res: Response) => {
    const time_slotFun = () => {
      const time_slot: any = []
      for (let i = 0; i < 24; i++) {
        let hour
        if (i < 10) {
          hour = `0${i}`
        } else {
          hour = `${i}`
        }

        for (let k = 0; k < 2; k++) {
          let minute
          if (k === 0) {
            minute = `00`
            time_slot.push(`${hour}:${minute}`)
          } else {
            minute = `30`
            time_slot.push(`${hour}:${minute}`)
          }
        }
      }
      return time_slot
    }
    let timeSlotArr = time_slotFun()
    try {
      const { timeSlot_id } = req.body
      let { customerInfo, roomInfo } = await this.bookingService.timeSlotAccept(timeSlot_id, timeSlotArr)

      const toCustoemr = {
        from: 'Zpace <zpaceroomrenting@gmail.com>',
        to: `${customerInfo.email}`,
        subject: `Time-Slots request on ${roomInfo.space_name} is rejected`,
        text: 'You may choose another time-slots.'
      };
      mg.messages().send(toCustoemr, function (error: any, body: any) {
      });
      return res.status(401).json({ message: "time-slot is accepted" })
    } catch (e) {
      return res.status(400).json({ error: "fail to fetch" })
    }
  }
}

export default BookingController;