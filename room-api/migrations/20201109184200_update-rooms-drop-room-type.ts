import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("rooms")){
        throw new Error("missing table rooms");
    }
    await knex.schema.table("rooms", (table)=>{
        table.dropColumn("room_type");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("room", (table)=>{
        table.string("room_type");
    })
}

