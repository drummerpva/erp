import { DatabaseConnection } from '@DatabaseConnection.ts'
import pgPromise from 'pg-promise'

export class PgPromiseAdapter implements DatabaseConnection {
  private connection: any
  constructor(databaseUrl: string) {
    this.connection = pgPromise()(databaseUrl)
  }

  async query(statement: string, params: any[]): Promise<any> {
    const normalizedStatement = this.normalizeStatement(statement)
    const rows = await this.connection.query(normalizedStatement, params)
    return rows
  }

  async close(): Promise<void> {
    await this.connection.$pool.end()
  }

  private normalizeStatement(statement: string): string {
    let index = 0
    return statement.toLocaleLowerCase().replace(/\?/gi, () => `$${++index}`)
  }
}
