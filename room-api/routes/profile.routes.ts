import express from 'express';
import ProfileController from '../controller/profile.controller';
import { isLoggedIn } from '../guards';
import { upload } from '../main';



export const ProfileRoute = (profileController: ProfileController) =>{
    let profileRoutes = express.Router();
    
    profileRoutes.get("/detail/:id", isLoggedIn, profileController.fetchProfile);
    profileRoutes.post("/rating/:id", isLoggedIn, profileController.rateUser);
    profileRoutes.post("/edit-description", isLoggedIn, upload.single("profile_picture"), profileController.editProfile);
    profileRoutes.post("/skip-rate/room", isLoggedIn,  profileController.skipRateOnRoom);
    profileRoutes.post("/skip-rate/customer", isLoggedIn, profileController.skipRateOnCustimer);
    profileRoutes.post("/edit-profile-picture", isLoggedIn,upload.single("profile_picture"), profileController.changeProfilePicture);
	profileRoutes.get("/like", isLoggedIn, profileController.getLikeContent);
	profileRoutes.get("/:id", isLoggedIn, profileController.checkProfile);
    return profileRoutes;
}