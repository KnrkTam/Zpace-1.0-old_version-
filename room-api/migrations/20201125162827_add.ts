import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("message")){
        throw new Error("missing table rooms")
    }
    await knex.schema.table("message", (table)=>{
        table.boolean("is_request")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("message", (table)=>{
        table.dropColumn("is_request");
    })
}
