import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("rooms")){
        throw new Error("missing table rooms");
    }
    await knex.schema.table("rooms", (table)=>{
        table.dropColumn("district_id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("room", (table)=>{
        table.integer("district_id").unsigned();
        table.foreign("district_id").references("district.id");
    })
}


