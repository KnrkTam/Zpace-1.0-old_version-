import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("message")){
        throw new Error("missing table account")
    }
    await knex.schema.table("message", (table)=>{
        table.dropColumn("receiver_id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("message", (table)=>{
        table.integer("receiver_id").unsigned();
        table.foreign("receiver_id").references("account.id");
    })
}

