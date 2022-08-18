import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("rooms")){
        throw new Error("rooms")
    }
    await knex.schema.table("rooms",(table)=>{
        table.integer("room_owner_id");
        table.foreign("room_owner_id").references("account.id");
    })
}



export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("rooms");
}

