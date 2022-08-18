import loginService from '../services/login.service';
import {Request,Response} from 'express';
import jwtSimple from 'jwt-simple';
import jwt from '../jwt';
import { checkPassword, hashPassword} from '../hash';
import fetch from "node-fetch"

class loginController {
    constructor(public loginService: loginService){}
    post = async (req:Request,res:Response)=>{
        try{
            if (!req.body.email || !req.body.password) {
                res.status(401).json({errors:"Wrong Email/Password"});
                return;
            }
            const {email,password} = req.body;
            const user = (await this.loginService.getUserByUsername(email))[0];
            if(!user || !(await checkPassword(password,user.password))){
                res.status(401).json({errors:"Incorrect email or password input"});
                return;
            }
            await this.loginService.requestCheck(user.id);
            let {roomRatingArr, customerRatingArr} = await this.loginService.requestCheckIfRated(user.id);
            const payload = {
                id: user.id,
                username: user.username,
                profile_picture: user.profile_picture,
                created_at: user.created_at,
				is_rooms_owner: user.is_rooms_owner,
				phone_number: user.phone_number || null,
                description: user.description || "",
                roomRatingArr: roomRatingArr,
                customerRatingArr: customerRatingArr
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            return res.json({
                token: token,
                payload: JSON.stringify(payload)
            });
        }catch(e){
            console.log(e)
            return res.status(500).json({errors:e.toString()})
        }
    }

    fbLogin = async (req:Request,res:Response)=>{
        try{
            let payload
            if (!req.body.accessToken) {
                res.status(401).json({errors:"Wrong Email/Password"});
                return;
            }
            const {accessToken} = req.body;
            const fetchResponse = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
            const result = await fetchResponse.json();
            const user = (await this.loginService.getUserByUsername(result.email))[0];
            if(!user){
                const { name,email } = result;
                const picture = result.picture.data.url
                const hashedPassword = await hashPassword(this.makeId(10));
                let fetchedIds = await this.loginService.toCreateAccount(name,hashedPassword,picture,email)
                let ids:any = fetchedIds[0]
                payload = {
                    id: ids.id,
                    username: name,
                    profile_picture: picture,
                    created_at: ids.created_at,
                    roomRatingArr: [],
                    customerRatingArr: []
                    
                };
            } else {
                await this.loginService.requestCheck(user.id);
                let {roomRatingArr, customerRatingArr} = await this.loginService.requestCheckIfRated(user.id);
                payload = {
                    id: user.id,
                    username: user.username,
                    profile_picture: user.profile_picture,
                    created_at: user.created_at,
					is_rooms_owner: user.is_rooms_owner,
					phone_number: user.phone_number || null,
                    description: user.description || "",
                    roomRatingArr: roomRatingArr,
                    customerRatingArr: customerRatingArr
                };
            }
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            return res.json({
                token: token,
                payload: JSON.stringify(payload)
            });
        }catch(e){
            console.log(e)
            return res.status(500).json({errors:e.toString()})
        }
    }
    loginGoogle = async (req:Request,res:Response)=>{
        try{
            if (!req.body.response) {
                res.status(401).json({errors:"Wrong Email/Password"});
                return;
            }
            let payload
            const {response} = req.body;
            const fetchResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.tokenId}`)
            const result = await fetchResponse.json();
            const users = await this.loginService.getUserByUsername(result.email)
            const user = users[0];
            if (!user) {
                const { name, imageUrl, email } = response.profileObj;
                const hashedPassword = await hashPassword(this.makeId(10));
                let userId: any[] = await this.loginService.toCreateAccount(name, hashedPassword, imageUrl, email)
                let ids = userId[0]
                payload = {
                    id: ids.id,
                    username: name,
                    profile_picture: imageUrl,
                    created_at: ids.created_at,
					is_rooms_owner: ids.is_rooms_owner,
					phone_number: null,
                    description: "",
                    customerRatingArr: [],
                    roomRatingArr:[]
                };
            } else {
                await this.loginService.requestCheck(user.id);
                let {roomRatingArr, customerRatingArr} = await this.loginService.requestCheckIfRated(user.id);
                payload = {
                    id: user.id,
                    username: user.username,
                    profile_picture: user.profile_picture,
                    created_at: user.created_at,
					is_rooms_owner: user.is_rooms_owner,
					phone_number: user.phone_number,
                    description: user.description,
                    roomRatingArr: roomRatingArr,
                    customerRatingArr: customerRatingArr
                };
            
        }
        const token = jwtSimple.encode(payload, jwt.jwtSecret);
        return res.json({
            token: token,
            payload: JSON.stringify(payload)
        });
        }catch(e){
            console.log(e)
            return res.status(500).json({errors:e.toString()})
        }
}
    makeId = (length:number) => {
        let result = "";
        let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}

export default loginController