import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("customer_booking_time_slot")){
        throw new Error("missing table customer_booking_time_slot")
    }
    await knex.schema.table("customer_booking_time_slot", (table)=>{
        table.enum("status", ["accepted", "rejected", "pending", "completed"])
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("customer_booking_time_slot", (table)=>{
        table.dropColumn("status");
    })
}

