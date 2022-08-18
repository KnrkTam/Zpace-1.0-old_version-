import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("weekly_open_timeslot")){
        return;
    }
    await knex.schema.createTable("weekly_open_timeslot", (table)=>{
        table.increments();
        table.boolean("Monday");
        table.boolean("Tuesday");
        table.boolean("Wednesday");
        table.boolean("Thursday");
        table.boolean("Friday");
        table.boolean("Saturday");
        table.boolean("Sunday");
        table.time("start_time");
        table.time("end_time");
        table.integer("rooms_id");
        table.foreign("rooms_id").references("rooms.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("weekly_open_timeslot");
}

