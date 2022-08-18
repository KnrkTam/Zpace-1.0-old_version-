import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable(" rating_and_comment_on_customer")){
        return;
    }
    await knex.schema.createTable(" rating_and_comment_on_customer", (table)=>{
        table.increments();
        table.text("comment")
        table.integer("customer_id").unsigned();
        table.foreign("customer_id").references("account.id");
        table.integer("room_owner_id").unsigned();
        table.foreign("room_owner_id").references("account.id");
        table.integer("rating")
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(" rating_and_comment_on_customer");
}