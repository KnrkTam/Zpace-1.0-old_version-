import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("weekly_open_timeslot")){
        throw new Error("missing table weekly_open_timeslot")
    }
    await knex.schema.table("weekly_open_timeslot", (table)=>{
        table.renameColumn("Monday", "monday")
        table.renameColumn("Tuesday", "tuesday")
        table.renameColumn("Wednesday", "wednesday")
        table.renameColumn("Thursday", "thursday")
        table.renameColumn("Friday", "friday")
        table.renameColumn("Saturday", "saturday")
        table.renameColumn("Sunday", "sunday")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("weekly_open_timeslot", (table)=>{
        table.renameColumn("monday", "Monday")
        table.renameColumn("tuesday", "Tuesday")
        table.renameColumn("wednesday", "Wednesday")
        table.renameColumn("thursday", "Thursday")
        table.renameColumn("friday", "Friday")
        table.renameColumn("saturday", "Saturday")
        table.renameColumn("sunday", "Sunday")
    })
}

