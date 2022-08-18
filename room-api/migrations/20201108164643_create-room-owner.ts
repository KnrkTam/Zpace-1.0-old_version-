import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("room_owner")){
        return;
    }
    await knex.schema.createTable("room_owner", (table)=>{
        table.increments();
        table.integer("account_id").unsigned();
        table.foreign("account_id").references("account.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("room_owner");
}

