import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable("district")){
        return;
    }
    await knex.schema.createTable("district", (table)=>{
        table.increments();
        table.string("district");
    })
}



export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("district");
}

