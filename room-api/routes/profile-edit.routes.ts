import express from 'express';
import ProfileEditController from '../controller/profile-edit.controller';
import { isLoggedIn } from '../guards';
import { upload } from "../main"


export const ProfileEditRoute = (profileEditController: ProfileEditController) =>{
    let profileEditRoutes = express.Router();
    // profileEditRoutes.post("/confirm-password", isLoggedIn, profileEditController.get);
    profileEditRoutes.post('/edit', isLoggedIn, upload.single("profileImage"),  profileEditController.post)



    return profileEditRoutes;
}