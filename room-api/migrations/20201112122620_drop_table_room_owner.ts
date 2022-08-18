import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("room_owner")){
        throw new Error("missing table room_owner");
    }
    await knex.schema.dropTable("room_owner")
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.createTable("room_owner", (table)=>{
        table.increments();
        table.integer("account_id");
        table.foreign("account_id").references("account.id");
    })
}
