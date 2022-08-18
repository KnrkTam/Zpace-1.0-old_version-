import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("account")){
        return;
    }
    await knex.schema.createTable("account", (table)=>{
        table.increments();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.text("profile_picture");
        table.string("email");
        table.string("phone_number");
        table.text("description");
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("account");
}

