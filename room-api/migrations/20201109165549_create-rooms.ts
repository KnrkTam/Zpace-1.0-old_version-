import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("rooms")){
        return;
    }
    await knex.schema.createTable("rooms", (table)=>{
        table.increments();
        table.decimal("hourly_price").notNullable();
        table.text("location").notNullable();
        table.string("longitude");
        table.string("latitude");
        table.string("capacity");
        table.boolean("is_active");
        table.text("description");
        table.text("open_time");
        table.string("room_type");
        table.integer("room_owner_id");
        table.foreign("room_owner_id").references("room_owner.id");
        table.integer("district_id");
        table.foreign("district_id").references("district.id");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("rooms");
}


