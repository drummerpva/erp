import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('banco', (table: Knex.TableBuilder) => {
    table.index('codigo')
    table.index('nome')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('banco', (table: Knex.TableBuilder) => {
    table.dropIndex('codigo')
    table.dropIndex('nome')
  })
}
