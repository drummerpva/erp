import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import { PrismaClient } from './generated/client.ts'

export async function prismaDatasourceFactory(databaseUrl: string) {
  const adapter = new PrismaMariaDb(databaseUrl)
  const dataSource = new PrismaClient({
    adapter,
  })
  return dataSource
}
