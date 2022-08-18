import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("oneoff_open_timeslot")){
        throw new Error("missing table rooms")
    }
    await knex.schema.table("oneoff_open_timeslot", (table)=>{
        table.integer("rooms_id").unsigned();
        table.foreign("rooms_id").references("rooms.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("oneoff_open_timeslot", (table)=>{
        table.dropColumn("rooms_id");
    })
}

