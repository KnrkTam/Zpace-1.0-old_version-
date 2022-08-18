import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("rooms")){
        throw new Error("missing table rooms")
    }
    await knex.schema.table("rooms", (table)=>{
        table.dropColumn("room_owner_id")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("rooms", (table)=>{
        table.integer("room_owner_id")
        table.foreign("room_owner_id").references("room_owner.id")
    })
}

