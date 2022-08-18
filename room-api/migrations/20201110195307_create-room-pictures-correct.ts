import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("room_pictures")){
        return
    } 
    await knex.schema.createTable("room_pictures", (table)=>{
        table.increments();
        table.integer("rooms_id");
        table.foreign("rooms_id").references("rooms.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("room_pictures");
}
