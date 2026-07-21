import { DatabaseConnection } from '@DatabaseConnection.ts'
import { MysqlAdapter } from '@MysqlAdapter.ts'
import axios from 'axios'

axios.defaults.validateStatus = () => true

const baseUrl = 'http://localhost:3001'
let connection: DatabaseConnection

beforeAll(() => {
  connection = new MysqlAdapter(String(process.env.DATABASE_URL))
})

afterAll(async () => {
  await connection.close()
})

test('Deve retornar a lista de bancos (GET /banco)', async () => {
  const bankCode = '559'
  await connection.query(`DELETE FROM banco WHERE codigo = ?`, [bankCode])
  const inputCreate = {
    codigo: bankCode,
    nome: `Test List ${Math.random()}`,
    url: 'teste_list.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const response = await axios.get(`${baseUrl}/banco`)
  const output = response.data
  expect(response.status).toBe(200)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.codigo).toBe(inputCreate.codigo)
  expect(bankData.nome).toBe(inputCreate.nome)
  expect(bankData.url).toBe(inputCreate.url)
  await axios.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve retornar um banco (GET /banco/:ID', async () => {
  const inputCreate = {
    codigo: '559',
    nome: `Test get one`,
    url: 'teste_one.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const response = await axios.get(`${baseUrl}/banco/${bankId}`)
  const output = response.data
  expect(response.status).toBe(200)
  expect(output.id).toBe(bankId)
  expect(output.codigo).toBe(inputCreate.codigo)
  expect(output.nome).toBe(inputCreate.nome)
  expect(output.url).toBe(inputCreate.url)
  await axios.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve criar um banco (POST /banco', async () => {
  await connection.query(`DELETE FROM banco WHERE CODIGO = ?`, ['555'])
  const inputCreate = {
    codigo: '555',
    nome: `Test Name ${Math.random()}`,
    url: 'teste4.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  expect(responseCreate.status).toBe(201)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.codigo).toBe(inputCreate.codigo)
  expect(outputCreate.nome).toBe(inputCreate.nome)
  expect(outputCreate.url).toBe(inputCreate.url)
  const responseGet = await axios.get(`${baseUrl}/banco/${outputCreate.id}`)
  const outputGet = responseGet.data
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.codigo).toBe(inputCreate.codigo)
  expect(outputGet.nome).toBe(inputCreate.nome)
  expect(outputGet.url).toBe(inputCreate.url)
  await axios.delete(`${baseUrl}/banco/${outputCreate.id}`)
})
test('Deve alterar um banco (PUT /banco', async () => {
  const bankCode = '553'
  await connection.query(`DELETE FROM banco WHERE codigo = ?`, [bankCode])
  const inputCreate = {
    codigo: bankCode,
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const randomName = `Name Changed ${Math.random()}`
  const inputUpdate = {
    codigo: bankCode,
    nome: randomName,
    url: 'teste4.changed.com',
  }
  const responseUpdate = await axios.put(
    `${baseUrl}/banco/${bankId}`,
    inputUpdate,
  )
  const outputUpdate = responseUpdate.data
  expect(responseUpdate.status).toBe(200)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo)
  expect(outputUpdate.nome).toBe(inputUpdate.nome)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const responseGet = await axios.get(`${baseUrl}/banco/${outputCreate.id}`)
  const outputGet = responseGet.data
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.codigo).toBe(inputUpdate.codigo)
  expect(outputGet.nome).toBe(inputUpdate.nome)
  expect(outputGet.url).toBe(inputUpdate.url)
  await axios.delete(`${baseUrl}/banco/${outputCreate.id}`)
})
test('Deve deletar um banco (DELETE /banco', async () => {
  const inputCreate = {
    codigo: '551',
    nome: `Test Name Delete`,
    url: 'teste_delete.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const responseDelete = await axios.delete(`${baseUrl}/banco/${bankId}`)
  expect(responseDelete.status).toBe(200)
  const responseGet = await axios.get(`${baseUrl}/banco/${bankId}`)
  expect(responseGet.status).toBe(404)
  expect(responseGet.data?.id).toBeFalsy()
})
