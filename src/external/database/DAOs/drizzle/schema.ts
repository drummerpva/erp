import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const bankDrizzlePersistenceModel = mysqlTable('banco', {
  bankId: int('banco_id').autoincrement().primaryKey(),
  name: varchar('nome', { length: 100 }),
  code: varchar('codigo', { length: 30 }),
  url: varchar('url', { length: 200 }),
})
