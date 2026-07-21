import { DatabaseConnection } from '@DatabaseConnection.ts'
import { MysqlAdapter } from '@MysqlAdapter.ts'

let sut: DatabaseConnection
beforeAll(() => {
  sut = new MysqlAdapter(String(process.env.DATABASE_URL))
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
