import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("booking_time_slot")){
        return;
    }
    await knex.schema.createTable("booking_time_slot", (table)=>{
        table.increments();
		table.time("start_time");
		table.time("end_time");
		table.date("date");
		table.integer("customer_booking_time_slot_id").unsigned();
		table.foreign("customer_booking_time_slot_id").references("customer_booking_time_slot.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("booking_time_slot");
}

