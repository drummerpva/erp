import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('BANCO', (table: Knex.TableBuilder) => {
    table.increments('BANCO_ID').primary()
    table.string('CODIGO', 10)
    table.string('NOME', 100)
    table.string('URL', 250)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('BANCO')
}
