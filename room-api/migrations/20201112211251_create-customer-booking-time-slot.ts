import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("customer_booking_time_slot")){
        return;
    }
    await knex.schema.createTable("customer_booking_time_slot", (table)=>{
        table.increments();
        table.dateTime("start_time");
        table.dateTime("end_time");
        table.enum("status", ["accepted", "rejected", "pending"]);
        table.timestamp("request_date");
        table.float("price");
        table.integer("head_count");
        table.boolean("is_refund");
        table.boolean("request_refund");
        table.text("refund_description");
        table.timestamps(false, true);
        table.integer("rooms_id").unsigned();
        table.foreign("rooms_id").references("rooms.id");
        table.integer("customer_id").unsigned();
        table.foreign("customer_id").references("account.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("customer_booking_time_slot");
}

