import Knex from 'knex';

class BecomeHostService{
    constructor(private knex: Knex){}

    becomeHost = async (account_id: number, agreement: boolean)=>{
        await this.knex("account").update({
            is_rooms_owner: agreement
        })
        .where("id", account_id)
        .returning("is_rooms_owner")
        return{account_id, agreement}
    }
}

export default BecomeHostService;