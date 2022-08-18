import  ProfileEditService from "../services/profile-edit.service"
import { Request,Response } from 'express';
import '../models';
import { hashPassword } from '../hash';

class ProfileEditController {
    constructor (private profileEditService: ProfileEditService){}

    post = async (req:Request, res:Response) =>{
        
        
        try {
            const id = req.user?.id as number
            let user = req.body

            if (req.body.password){
                if(!await this.profileEditService.checkPassword(id, req.body.password)){
                    res.status(403).json({errors:"incorrect password"})
                    return
                }
                user.password = await hashPassword(req.body.newPassword)
                delete user.newPassword

            } 
                if (req.file){
                    user.profile_picture = req.file.filename

                }

            await this.profileEditService.editProfile(
                id,
                user
            )
            return res.status(200).json({success: "Changes made successfully", user})
        } catch(e) {
            res.status(500).json(e.toString())
            console.log("error", e)
            return
        }
        
    }
}

export default ProfileEditController;
