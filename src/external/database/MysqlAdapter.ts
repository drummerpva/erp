import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'
import { createPool, Pool } from 'mysql2/promise'

export class MysqlAdapter implements DatabaseConnection {
  private connection: Pool
  constructor(databaseUrl: string) {
    this.connection = createPool(databaseUrl)
  }

  async query(statement: string, params: any[]): Promise<any> {
    const normalizedStatement = this.normalizeSql(statement)
    const [rows] = await this.connection.query(normalizedStatement, params)
    return rows
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }

  private normalizeSql(statement: string) {
    return statement.toLowerCase()
  }
}
