import express from 'express';
import LoginController from "../controller/login.controller"


export const LoginRoute = (LoginController: LoginController) =>{
    let loginRoutes = express.Router();
    loginRoutes.post("/", LoginController.post)
    loginRoutes.post("/facebook", LoginController.fbLogin)
    loginRoutes.post("/google", LoginController.loginGoogle)
    return loginRoutes;
}