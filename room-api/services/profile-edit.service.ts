import Knex from 'knex';
import { checkPassword } from '../hash';
import { User } from '../models';


export default class ProfileEditService {
    constructor(private knex: Knex) {}

    checkPassword = async (id:number, plainPassword: string) => {
        const rows = await this.knex.select("password").from("account").where("id", id);
        return checkPassword(plainPassword, rows[0].password);
        
    }

    
    getProfileByID = async (id:number) => {
        const user = await this.knex.select(["id", "email", "description", "created_at", "phone_number", "profile_picture", "updated_at", "username"]).from("account").where("id", id);
        return user;
    }

    editProfile = async ( id:number, user:User) =>{
        let ids = await this.knex.update(
            user
        ).into("account")
        .where('id',id);
        return ids
    }
}