import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("rating_and_comment_on_room")){
        throw new Error("missing table rooms")
    }
    await knex.schema.table("rating_and_comment_on_room", (table)=>{
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("rating_and_comment_on_room", (table)=>{
    })
}
