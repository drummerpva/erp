import { DatabaseConnection } from '@DatabaseConnection.ts'
import { PgPromiseAdapter } from '@PgPromiseAdapter.ts'

let sut: DatabaseConnection
beforeAll(() => {
  sut = new PgPromiseAdapter(String(process.env.DATABASE_URL_PG))
})
afterAll(async () => {
  await sut.close()
})
test('Deve fazer uma consulta ao banco de dados', async () => {
  const [row] = await sut.query(`SELECT 1 as result`, [])
  expect(row.result).toBe(1)
})
test('Deve usar params no SQL', async () => {
  const param = 3
  const [row] = await sut.query(`SELECT ? as result`, [param])
  expect(row.result).toBe(param)
})
