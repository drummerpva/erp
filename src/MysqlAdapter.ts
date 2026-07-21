import { DatabaseConnection } from '@DatabaseConnection.ts'
import { createPool, Pool } from 'mysql2/promise'

export class MysqlAdapter implements DatabaseConnection {
  private connection: Pool
  constructor(databaseUrl: string) {
    this.connection = createPool(databaseUrl)
  }

  async query(statement: string, params: any[]): Promise<any> {
    const [rows] = await this.connection.query(statement, params)
    return rows
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }
}
