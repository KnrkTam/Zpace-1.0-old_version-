import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    if(!await knex.schema.hasTable("district")){
        throw new Error("missing table district");
    }
    await knex.schema.table("district", (table)=>{
        table.renameColumn("district", "district_name");
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("district", (table)=>{
        table.renameColumn("district_name", "district");
    })
}

