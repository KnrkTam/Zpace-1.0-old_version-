import BecomeHostService from '../services/becomeHost.service';
import { Request, Response } from 'express';
import '../models';


class BecomeHostController{
    constructor(private becomeHostService: BecomeHostService){}

    post = async(req: Request, res: Response)=>{
        try{
            
            const agreementInfo = req.body;
            // original command: error occurs
            // const account_id: number = req.user?.id;
            
            // add type undefined - still error
            // const account_id: number | undefined = req.user?.id;
            const account_id: number = req.user!.id;

            await this.becomeHostService.becomeHost(account_id, agreementInfo.agreement);
            if(!account_id || !agreementInfo){
                return res.status(401).json({
                    errors: "missing necessary info"
                })
            }
            return res.status(200).json({
                success: true,
                message: "submit info successfully",
                body: req.body
            })
        } catch(e){
            console.log(e)
            return res.status(500).json(e.toString());
        }
    } 
}

export default BecomeHostController;