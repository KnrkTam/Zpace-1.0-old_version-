import express from "express";
import BecomeHostController from '../controller/becomeHost.controller';
import { isLoggedIn } from '../guards';

export const BecomeHostRoute = (becomeHostController:  BecomeHostController)=>{
    let BecomeHostRoute = express.Router();
    BecomeHostRoute.post("/", isLoggedIn, becomeHostController.post)
    return BecomeHostRoute;
}