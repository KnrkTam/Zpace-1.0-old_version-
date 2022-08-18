import * as Knex from "knex";



export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("rating_and_comment_on_room")){
        throw new Error("missing table customer_booking_time_slot")
    }
    await knex.schema.table("rating_and_comment_on_room", (table)=>{
        table.dropColumn("date");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("rating_and_comment_on_room", (table)=>{
        table.timestamp("date");
    })

}