import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("like")){
        return;
    }
    await knex.schema.createTable("like", (table)=>{
        table.increments();
		table.integer("room_id").unsigned();
		table.foreign("room_id").references("rooms.id");
		table.integer("account_id").unsigned();
		table.foreign("account_id").references("account.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("like");
}

