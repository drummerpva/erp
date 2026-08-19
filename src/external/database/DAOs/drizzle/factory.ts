import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'

export const drizzleDatasourceFactory = async (databaseUrl: string) => {
  const pool = createPool(databaseUrl)
  const dataSource = drizzle({
    client: pool.pool,
  })
  return dataSource
}
