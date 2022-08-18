import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    if (!await knex.schema.hasTable("rooms")) {
        throw new Error("missing table rooms")
    }
    await knex.schema.table("rooms", (table) => {
        table.string("space_name").notNullable().alter();
        table.string("district").notNullable().alter();
        table.string("capacity").notNullable().alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("rooms", (table) => {
        table.string("space_name").nullable().alter();
        table.string("district").nullable().alter();
        table.string("capacity").nullable().alter();
})
}
