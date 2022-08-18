import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("account")){
        throw new Error("missing table account")
    }
    await knex.schema.table("account", (table)=>{
        table.boolean("is_rooms_owner").notNullable().defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("account", (table)=>{
        table.dropColumn("is_rooms_owner")
    })
}

