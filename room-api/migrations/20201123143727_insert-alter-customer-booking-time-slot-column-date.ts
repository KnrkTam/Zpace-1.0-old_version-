import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("customer_booking_time_slot")){
        throw new Error("missing table rooms")
    }
    await knex.schema.table("customer_booking_time_slot", (table)=>{
		table.time("start_time").alter()
		table.time("end_time").alter()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("customer_booking_time_slot", (table)=>{
		table.dateTime("start_time")
		table.time("end_time")
    })
}
