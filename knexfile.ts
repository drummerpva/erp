import type { Knex } from 'knex'

export default {
  client: 'pg',
  connection: process.env.DATABASE_URL_PG,
  migrations: {
    directory: './src/infra/database/migrations',
  },
} satisfies Knex.Config
