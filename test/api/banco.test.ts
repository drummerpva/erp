import { DatabaseConnection } from '@DatabaseConnection.ts'
import { FetchAdapter } from '@FetchAdapter.ts'
import { HttpClient } from '@HttpClient.ts'
import { MysqlAdapter } from '@MysqlAdapter.ts'

const baseUrl = 'http://localhost:3001'
let connection: DatabaseConnection
let httpClient: HttpClient

beforeAll(() => {
  httpClient = new FetchAdapter()
  connection = new MysqlAdapter(String(process.env.DATABASE_URL))
})

afterAll(async () => {
  await connection.close()
})

test('Deve retornar a lista de bancos (GET /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? OR NOME = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste_list.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const response = await httpClient.get(`${baseUrl}/banco`)
  const output = response.body
  expect(response.statusCode).toBe(200)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.codigo).toBe(inputCreate.codigo)
  expect(bankData.nome).toBe(inputCreate.nome)
  expect(bankData.url).toBe(inputCreate.url)
  await httpClient.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve retornar um banco (GET /banco/:ID)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? OR NOME = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste_one.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const response = await httpClient.get(`${baseUrl}/banco/${bankId}`)
  const output = response.body
  expect(response.statusCode).toBe(200)
  expect(output.id).toBe(bankId)
  expect(output.codigo).toBe(inputCreate.codigo)
  expect(output.nome).toBe(inputCreate.nome)
  expect(output.url).toBe(inputCreate.url)
  await httpClient.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve criar um banco (POST /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(3, 6)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? OR NOME = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste4.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.body
  expect(responseCreate.statusCode).toBe(201)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.codigo).toBe(inputCreate.codigo)
  expect(outputCreate.nome).toBe(inputCreate.nome)
  expect(outputCreate.url).toBe(inputCreate.url)
  const responseGet = await httpClient.get(
    `${baseUrl}/banco/${outputCreate.id}`,
  )
  const outputGet = responseGet.body
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.codigo).toBe(inputCreate.codigo)
  expect(outputGet.nome).toBe(inputCreate.nome)
  expect(outputGet.url).toBe(inputCreate.url)
  await httpClient.delete(`${baseUrl}/banco/${outputCreate.id}`)
})
test.each([''])(
  'Não deve criar um banco com nome inválido %s (POST /banco)',
  async (invalidName: any) => {
    const inputCreate = {
      codigo: '555',
      nome: invalidName,
      url: 'teste4.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banco`,
      inputCreate,
    )
    expect(responseCreate.statusCode).toBe(422)
    const outputCreate = responseCreate.body
    expect(outputCreate.code).toBe('DOMAIN_ERROR')
    expect(outputCreate.message).toBe('Nome inválido')
  },
)
test.each(['ABC'])(
  'Não deve criar um banco com código inválido %s (POST /banco)',
  async (invalidCode: any) => {
    const inputCreate = {
      codigo: invalidCode,
      nome: 'Test Name',
      url: 'teste4.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banco`,
      inputCreate,
    )
    expect(responseCreate.statusCode).toBe(422)
    const outputCreate = responseCreate.body
    expect(outputCreate.code).toBe('DOMAIN_ERROR')
    expect(outputCreate.message).toBe('Código inválido')
  },
)
test('Deve alterar um banco (PUT /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? OR NOME = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste4.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const fakeCodeUpdated = `${Math.random()}`.substring(2, 5)
  const fakeNameUpdated = `Name ${Math.random()} changed`
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? OR NOME = ?`, [
    fakeCodeUpdated,
    fakeNameUpdated,
  ])
  const inputUpdate = {
    codigo: fakeCodeUpdated,
    nome: fakeNameUpdated,
    url: 'teste4.changed.com',
  }
  const responseUpdate = await httpClient.put(
    `${baseUrl}/banco/${bankId}`,
    inputUpdate,
  )
  const outputUpdate = responseUpdate.body
  expect(responseUpdate.statusCode).toBe(200)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo)
  expect(outputUpdate.nome).toBe(inputUpdate.nome)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const responseGet = await httpClient.get(
    `${baseUrl}/banco/${outputCreate.id}`,
  )
  const outputGet = responseGet.body
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.codigo).toBe(inputUpdate.codigo)
  expect(outputGet.nome).toBe(inputUpdate.nome)
  expect(outputGet.url).toBe(inputUpdate.url)
  await httpClient.delete(`${baseUrl}/banco/${outputCreate.id}`)
})
test.each(['Test'])(
  'Não deve alterar um banco com nome inválido %s (PUT /banco)',
  async (invalidName: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const fakeName = `Name ${Math.random()}`
    await connection.query(
      `DELETE FROM banco WHERE CODIGO = ? OR NOME = ? OR NOME = ?`,
      [fakeCode, fakeName, invalidName],
    )
    const inputCreate = {
      codigo: fakeCode,
      nome: fakeName,
      url: 'teste4.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banco`,
      inputCreate,
    )
    const outputCreate = responseCreate.body
    const bankId = outputCreate.id
    const inputUpdate = {
      codigo: fakeCode,
      nome: invalidName,
      url: 'teste4.changed.com',
    }
    const responseUpdate = await httpClient.put(
      `${baseUrl}/banco/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.statusCode).toBe(422)
    const outputUpdate = responseUpdate.body
    expect(outputUpdate.code).toBe('DOMAIN_ERROR')
    expect(outputUpdate.message).toBe('Nome inválido')
  },
)
test.each(['Test'])(
  'Não deve alterar um banco com código inválido %s (PUT /banco)',
  async (invalidCode: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    await connection.query(`DELETE FROM banco WHERE CODIGO = ?`, [fakeCode])
    const fakeName = `Test Name ${Math.random()}`
    const inputCreate = {
      codigo: fakeCode,
      nome: fakeName,
      url: 'teste4.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banco`,
      inputCreate,
    )
    const outputCreate = responseCreate.body
    const bankId = outputCreate.id
    const inputUpdate = {
      codigo: invalidCode,
      nome: fakeName,
      url: 'teste4.changed.com',
    }
    const responseUpdate = await httpClient.put(
      `${baseUrl}/banco/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.statusCode).toBe(422)
    const outputUpdate = responseUpdate.body
    expect(outputUpdate.code).toBe('DOMAIN_ERROR')
    expect(outputUpdate.message).toBe('Código inválido')
    await httpClient.delete(`${baseUrl}/banco/${outputCreate.id}`)
  },
)
test('Não deve alterar um banco inexistente (PUT /banco)', async () => {
  const bankId = 9_999_999
  const inputUpdate = {
    codigo: '555',
    nome: 'Test Name',
    url: 'teste4.changed.com',
  }
  const responseUpdate = await httpClient.put(
    `${baseUrl}/banco/${bankId}`,
    inputUpdate,
  )
  expect(responseUpdate.statusCode).toBe(404)
  const outputUpdate = responseUpdate.body
  expect(outputUpdate.code).toBe('NOT_FOUND_ERROR')
  expect(outputUpdate.message).toBe('Banco não encontrado')
})
test('Não deve deletar um banco se não for passado o ID válido(DELETE /banco)', async () => {
  const responseDelete = await httpClient.delete(`${baseUrl}/banco/abc`)
  expect(responseDelete.statusCode).toBe(422)
  expect(responseDelete.body.message).toBe('ID do Banco informado é inválido')
  expect(responseDelete.body.code).toBe('APPLICATION_ERROR')
})
test('Deve deletar um banco (DELETE /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banco WHERE codigo = ? OR nome = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste_delete.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  expect(bankId).toBeTruthy()
  const responseDelete = await httpClient.delete(`${baseUrl}/banco/${bankId}`)
  expect(responseDelete.statusCode).toBe(200)
  const responseGet = await httpClient.get(`${baseUrl}/banco/${bankId}`)
  expect(responseGet.statusCode).toBe(404)
  expect(responseGet.body?.id).toBeFalsy()
})
test('Deve retornar 404 ao não encontrar um banco (GET /banco/:ID)', async () => {
  const responseGet = await httpClient.get(`${baseUrl}/banco/${9_999_99}`)
  expect(responseGet.statusCode).toBe(404)
  const outputGet = responseGet.body
  expect(outputGet.code).toBe('NOT_FOUND_ERROR')
  expect(outputGet.message).toBe('Banco não encontrado')
})
