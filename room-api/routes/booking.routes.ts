import express from "express";
import BookingController from '../controller/booking.controller';
import { isLoggedIn } from "../guards";



export const BookingRoute = (bookingController: BookingController)=>{
    let bookingRoutes = express.Router();
    bookingRoutes.post("/fetch-room",bookingController.checkAllRooms)
	bookingRoutes.get("/history/:id",bookingController.checkBookingRecord)
	bookingRoutes.get("/booking-record/:id",bookingController.checkBookingHistoryList)
	bookingRoutes.get("/user-booking-record/:id",bookingController.checkUserBookingHistoryList)
	bookingRoutes.get("/user-booking-record-history/:id",bookingController.checkUserBookingHistory)
    bookingRoutes.post("/room-detail/:id", bookingController.fetchRoomDetail)
    bookingRoutes.get("/room-request/:id", isLoggedIn, bookingController.fetchRoomRequest)
    bookingRoutes.post("/request-reject", isLoggedIn, bookingController.timeSlotReject)
    bookingRoutes.post("/request-accept", isLoggedIn, bookingController.timeSlotAccept)
    
    return bookingRoutes;
}