import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("rating_and_comment_on_room")){
        return;
    }
    await knex.schema.createTable("rating_and_comment_on_room", (table)=>{
        table.increments();
        table.text("comment");
        table.timestamp("date");
        table.float("rating");
        table.integer("account_id");
        table.foreign("account_id").references("account.id");
        table.integer("rooms_id");
        table.foreign("rooms_id").references("rooms.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("rating_and_comment_on_room");
}

