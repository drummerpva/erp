import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('banco', (table: Knex.TableBuilder) => {
    table.increments('banco_id').primary()
    table.string('codigo', 10)
    table.string('nome', 100)
    table.string('url', 250)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('banco')
}
