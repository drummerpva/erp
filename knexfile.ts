import type { Knex } from 'knex'

export default {
  client: 'better-sqlite3',
  connection: {
    filename: String(process.env.DATABASE_FILENAME),
  },
  migrations: {
    directory: './src/infra/database/migrations',
  },
} satisfies Knex.Config
