import * as Knex from "knex";



export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("message")){
        throw new Error("missing table rooms")
    }
    await knex.schema.table("message", (table)=>{
        table.integer("chat_table_id").unsigned();
        table.foreign("chat_table_id").references("chat_table.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("message", (table)=>{
        table.dropColumn("chat_table_id");
    })
}

