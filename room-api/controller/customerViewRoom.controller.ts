import CustomerViewRoomService from '../services/customerViewRoom.service';
import { Request, Response } from 'express';
import "../models";

// import fs from "fs"
import dotenv from "dotenv";
// let mode = process.env.NODE_ENV || "test";
// let envFile = ".env." + mode; 
// let envFileContent = fs.readFileSync(envFile).toString();
// let env = dotenv.parse(envFileContent)
dotenv.config()
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MY_DOMAIN_NAME;
const mailgun = require("mailgun-js");
const DOMAIN = domain;

export const mg = mailgun({apiKey: api_key, domain: DOMAIN});

class CustomerViewRoomsController {
    constructor(private customerViewRoomService:  CustomerViewRoomService){}
    
    get = async(req: Request, res: Response)=>{
        try{
            let room_owner_id:number = req.user!.id
            const getCreateRoomInfo = await this.customerViewRoomService.getCreateRoomInfo(room_owner_id);
            if(getCreateRoomInfo === null){
                return res.json({result: "not able to find any rooms"})
            }
            return res.status(200).json(getCreateRoomInfo)
        } catch(e) {
            return res.status(500).json(e.toString());
        }
    } 
    toLike = async (req: Request, res: Response) =>{
        try{
            let room_id = req.params.room_id
            let customer_id = req.user?.id
            let likeCount = await this.customerViewRoomService.toLike(room_id,customer_id)
            return res.status(200).json({likeCount})
        } catch(e) {
            return res.status(500).json(e.toString());
        }

    }
    toUnLike = async (req: Request, res: Response) =>{
        try{
            let room_id = req.params.room_id
            let customer_id = req.user?.id
            let likeCount = await this.customerViewRoomService.toUnLike(room_id,customer_id)
            return res.status(200).json({likeCount})
        } catch(e) {
            return res.status(500).json(e.toString());
        }
    }
    giveRatingToRoom = async(req: Request, res: Response) => {
        try{
            let room_id = req.params.room_id
            let customer_id = req.user?.id
            let {commentState, ratingState} = req.body
            let {userInfo} = await this.customerViewRoomService.toGiveRate(room_id,customer_id, commentState, ratingState)
            res.status(200).json({userInfo,commentState, ratingState})
        }catch(e){
            res.status(401).json({message: "fail to rate"})
        }
    }
    bookingSuccess = async (req: Request, res: Response) => {
		try {
            const {bookedTimeSlot,room_owner_email, price, ppl, space_name, room_owner_id, rooms_id} = req.body
           let customerEmail = await this.customerViewRoomService.toBookingSuccess(req.user?.id, bookedTimeSlot, ppl ,price, room_owner_id ,rooms_id);
            const toHost = {
                from: 'Zpace <zpaceroomrenting@gmail.com>',
                to: `${room_owner_email}`,
                subject: 'Room Renting request!',
                text: `${customerEmail.username} would like to book ${space_name}, in detail please click here https://zpace.ml/`
            };
            const toCustoemr = {
                from: 'Zpace <zpaceroomrenting@gmail.com>',
                to: customerEmail.email,
                subject: 'Booking request is sent',
                text: 'Booking request sent successfully.'
            };
            mg.messages().send(toHost, function (error:any, body:any) {

            });
            mg.messages().send(toCustoemr, function (error:any, body:any) {
               
            });
			res.status(200).json({message: "request sent successfully", customerEmail})
		}catch (e) {
			res.status(500).json(e.toString())
		}
	}
    fetchLikeOneRoom = async (req: Request, res: Response) =>{
        try{
            let room_id = req.params.room_id
            let likes = await this.customerViewRoomService.toFetchOneLike(req.user?.id,room_id)
            let rating = await this.customerViewRoomService.toFetchRating(room_id)
            return res.status(200).json({likes, rating})
        }catch(e){
            return res.status(401).json(e.toString());
        }
    }
    fetchLikeOneRoomNotLoggedIn = async (req: Request, res: Response) =>{
        try{
            let room_id = req.params.room_id
            let rating = await this.customerViewRoomService.toFetchRating(room_id)
            return res.status(200).json({rating})
        }catch(e){
            return res.status(401).json(e.toString());
        }
    }
}

export default CustomerViewRoomsController
