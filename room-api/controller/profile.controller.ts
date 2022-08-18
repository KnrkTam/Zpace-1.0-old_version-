import ProfileService from "../services/profile.service"
import { Request, Response } from 'express';
import '../models';


export default class ProfileController {
    constructor(private profileService: ProfileService) { }

    checkProfile = async (req: Request, res: Response) => {
        try {
            // const profileID = req.user?.id as number;
            let user = await this.profileService.getProfileByID(req.params.id as any);
            await this.profileService.requestCheck(req.params.id);
            let { roomRatingArr, customerRatingArr } = await this.profileService.requestCheckIfRated(req.params.id);
            let checkProfile = user[0]
            checkProfile.canEdit = req.params.id === req.user?.id.toString()

            res.json({ checkProfile, roomRatingArr, customerRatingArr })
            // res.json({ checkProfile})
        } catch (e) {
            res.status(500).json(e.toString())
        }
    }
    fetchProfile = async (req: Request, res: Response) => {
        try {
            const host_Id = req.user?.id
            let user = await this.profileService.getProfileByID(req.params.id as any);
            let checkProfile = user[0]
            checkProfile.canEdit = req.params.id === req.user?.id.toString()
            checkProfile.canRate = await this.profileService.checkCanRateUser(req.params.id, host_Id)
            let { userRateAndComment, userRatingAvg } = await this.profileService.fetchRateAndComment(req.params.id)
            res.status(200).json({ checkProfile, userRateAndComment, userRatingAvg })
        } catch (e) {
            res.status(500).json(e.toString())
        }
    }
    editProfile = async (req: Request, res: Response) => {
        try {

            const id: any = req.user?.id

            await this.profileService.editDescription(req.body, id)

            res.status(200).json({ status: "success", profilePic: req.file.filename })
        } catch (e) {
            res.status(401).json({ status: "error" })

            return
        }
    }
    changeProfilePicture = async (req: Request, res: Response) => {
        try {

            if (req.file) {
                req.body.profile_picture = req.file.filename

            }
            const id: any = req.user?.id
            await this.profileService.postProfilePicture(req.body, id)
            res.status(200).json({ status: "success", profilePic: req.file.filename })
        } catch (e) {
            res.status(401).json({ status: "error" })
        }
    }
    rateUser = async (req: Request, res: Response) => {
        try {
            let customer_id = req.params.id
            let host_id = req.user?.id
            let { commentState, ratingState, room_id } = req.body
            let { userInfo } = await this.profileService.toGiveRate(host_id, customer_id, commentState, ratingState, room_id)
            console.log("userInfo", userInfo)
            res.status(200).json({ userInfo, commentState, ratingState })
        } catch (e) {
            res.status(401).json({ message: "fail to rate" })
        }
    }
    getLikeContent = async (req: Request, res: Response) => {
        try {
            if (req.user) {
                let host_id = req.user?.id
				let getLikeResults = await this.profileService.getLikeContent(host_id)
				// console.log(getLikeResults)
                res.status(200).json(getLikeResults)
            }
        } catch (e) {
            res.json(500).json({ message: "failed", error: e })
        }
    }
    skipRateOnRoom = async (req: Request, res: Response) => {
        try{
            let timeSlotID = req.body.id
            console.log("timeSlotIDOnRoom", timeSlotID)
            await this.profileService.skipRateOnRoom(timeSlotID)
        }catch(e){
            res.status(500).json({error: e})
        }
    }
    skipRateOnCustimer = async (req: Request, res: Response) => {
        try{
            let timeSlotID = req.body.id
            await this.profileService.skipRateOnCustimer(timeSlotID)
        }catch(e){
            res.status(500).json({error: e})
        }
    }
}
