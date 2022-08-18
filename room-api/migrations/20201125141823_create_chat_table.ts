import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("chat_table")){
        return;
    }
    await knex.schema.createTable("chat_table", (table)=>{
        table.increments();
        table.integer("customer_id").unsigned();
        table.foreign("customer_id").references("account.id");
        table.integer("host_id").unsigned();
        table.foreign("host_id").references("account.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("chat_table");
}


