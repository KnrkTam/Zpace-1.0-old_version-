import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("room_facility")){
        return;
    }
    await knex.schema.createTable("room_facility", (table)=>{
        table.increments();
        table.boolean("wifi");
        table.boolean("desk");
        table.boolean("socket_plug");
        table.boolean("air_condition");
        table.integer("rooms_id").unsigned();
        table.foreign("rooms_id").references("rooms.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("room_facility");
}

