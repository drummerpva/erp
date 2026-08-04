import { DatabaseConnection } from '@DatabaseConnection.ts'
import BetterSQLite, { type Database } from 'better-sqlite3'

export class SQLiteAdapter implements DatabaseConnection {
  private connection: Database
  constructor(fileName: string) {
    this.connection = new BetterSQLite(fileName)
    this.connection.pragma('foreign_keys = ON')
    this.connection.pragma('journal_mode = WAL')
  }

  async query(statement: string, params: any[]): Promise<any> {
    const normalizedStatement = this.normalizeStatement(statement)
    const preparedStatement = this.connection.prepare(normalizedStatement)
    if (preparedStatement.reader) {
      return preparedStatement.all(...params)
    }
    return preparedStatement.run(...params)
  }

  async close(): Promise<void> {
    this.connection.close()
  }

  private normalizeStatement(statement: string): string {
    return statement.toLowerCase()
  }
}
