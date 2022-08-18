import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("oneoff_open_timeslot")){
        return;
    }
    await knex.schema.createTable("oneoff_open_timeslot", (table)=>{
        table.increments();
        table.date("date");
        table.time("start_time");
        table.time("end_time");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("oneoff_open_timeslot");
}

