import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("message")){
        throw new Error("missing table account")
    }
    await knex.schema.table("message", (table)=>{
        table.dropColumn("send_datetime");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("message", (table)=>{
        table.timestamp("send_datetime");
    })
}
