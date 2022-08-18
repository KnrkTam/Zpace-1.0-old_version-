import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("room_pictures")){
        throw new Error("missing table rooms");
    }
    await knex.schema.table("room_pictures", (table)=>{
        table.string("picture_filename")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("room_pictures");
}

