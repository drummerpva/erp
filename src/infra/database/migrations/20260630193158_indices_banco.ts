import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('banco', (table: Knex.TableBuilder) => {
    table.index('CODIGO')
    table.index('NOME')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('banco', (table: Knex.TableBuilder) => {
    table.dropIndex('CODIGO')
    table.dropIndex('NOME')
  })
}
