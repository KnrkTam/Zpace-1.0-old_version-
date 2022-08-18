import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("account")){
        throw new Error("account");
    }
    await knex.schema.table("account", (table)=>{
        table.boolean("is_room_owner")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("account", (table)=>{
        table.dropColumn("is_room_owner");
    })
}

