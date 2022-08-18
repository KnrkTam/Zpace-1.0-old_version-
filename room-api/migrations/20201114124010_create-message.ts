import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("message")){
        return;
    }
    await knex.schema.createTable("message", (table)=>{
        table.increments();
        table.text("content");
        table.boolean("is_read");
        table.timestamp("send_datetime");
        table.integer("sender_id").unsigned();
        table.foreign("sender_id").references("account.id");
        table.integer("receiver_id").unsigned();
        table.foreign("receiver_id").references("account.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("message");
}

