import express from "express";
import RegisterService from "../services/register.service";
import { hashPassword } from "../hash";



class RegisterController {
    constructor(public RegisterService: RegisterService){}
    post = async (req: express.Request, res: express.Response) =>{
    const { email, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(401).json({errors: "password must be matched"})
    }
    let checkEmailAndUsername = await this.RegisterService.toCheckEmailAndUsername(email, username)
    if (checkEmailAndUsername.length >= 1) {
        // console.log("checkEmailandUserName")
        return res.status(401).json({errors: "username or email has already been registered"})
    }
    if (this.validUser(email, password)) {
        const hashedPassword = await hashPassword(password);
        await this.RegisterService.toRegister(username, hashedPassword, req.file?.filename || "anonymous.png", email)
    } else {
        return res.status(401).json({errors: "Password must include lower, upper, number, and special characters"})
    }
        return res.status(200).json({success: "Registered successfully"})
    }
    
    validUser = (email:string, password:string) => {
        const validEmail = typeof email === "string" && email.trim() !== "";
        // const passwordReEx = [/[a-z]/,/[A-Z]/,/[0-9]/,/[^a-zA-Z0-9]/] //起個[^]到等於不是以下類型
        // const checkPassword = passwordReEx.every((pattern)=>{
            // return pattern.test(password)
        // })
        const validPassword =
            typeof password === "string" &&
            password.trim() !== "" &&
            password.trim().length >= 6;
        return validEmail && validPassword;
    };

}



export default RegisterController