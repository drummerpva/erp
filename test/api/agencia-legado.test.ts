import { MysqlAdapter } from '@external/database/MysqlAdapter.ts'
import { FetchAdapter } from '@external/http/FetchAdapter.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { BankDAOSQL } from '@infra/database/DAOs/BankDAOSQL.ts'
import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'
import { HttpClient } from '@infra/http/HttpClient.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'

const baseUrl = 'http://localhost:3000'
let httpClient: HttpClient
let connection: DatabaseConnection
let bankDao: BankDAO

beforeAll(async () => {
  httpClient = new FetchAdapter()
  connection = new MysqlAdapter(String(process.env.DATABASE_URL))
  bankDao = new BankDAOSQL(connection)
})

afterAll(async () => {
  await connection.close()
})

test('Deve retornar a lista de agencias (GET /banco-agencia)', async () => {
  const bankCode = '458'
  await bankDao.removeByCode(bankCode)
  const inputCreateBank = {
    codigo: bankCode,
    nome: `Test List ${Math.random()}`,
    url: 'teste_list.com',
  }
  const responseCreateBank = await httpClient.post(
    `${baseUrl}/banco`,
    inputCreateBank,
  )
  expect(responseCreateBank.statusCode).toBe(HttpRestServer.StatusCode.Created)
  const bankId = responseCreateBank.body.id
  const inputCreateAgency = {
    nome: 'Any name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332211',
    contato: 'Any name',
    gerente: 'Any name',
    observacao: 'Any obs',
    banco: {
      id: bankId,
    },
  }
  const responseCreateAgency = await httpClient.post(
    `${baseUrl}/banco-agencia`,
    inputCreateAgency,
  )
  expect(responseCreateAgency.statusCode).toBe(
    HttpRestServer.StatusCode.Created,
  )
  const agencyId = responseCreateAgency.body.id
  const response = await httpClient.get(`${baseUrl}/banco-agencia`)
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const agencyData = output.find((item) => item.id === agencyId)
  expect(agencyData).toBeTruthy()
  expect(agencyData.id).toBe(agencyId)
  expect(agencyData.nome).toBe(inputCreateAgency.nome)
  expect(agencyData.numero).toBe(inputCreateAgency.numero)
  expect(agencyData.digito).toBe(inputCreateAgency.digito)
  expect(agencyData.telefone).toBe(inputCreateAgency.telefone)
  expect(agencyData.contato).toBe(inputCreateAgency.contato)
  expect(agencyData.gerente).toBe(inputCreateAgency.gerente)
  expect(agencyData.observacao).toBe(inputCreateAgency.observacao)
  expect(agencyData.banco.id).toBe(bankId)
  expect(agencyData.banco.nome).toBe(inputCreateBank.nome)
  expect(agencyData.banco.codigo).toBe(inputCreateBank.codigo)
  expect(agencyData.banco.url).toBe(inputCreateBank.url)
  await httpClient.delete(`${baseUrl}/banco-agencia/${agencyId}`)
  await httpClient.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve retornar uma agencia (GET /banco-agencia/:ID)', async () => {
  const bankCode = '459'
  await bankDao.removeByCode(bankCode)
  const inputCreateBank = {
    codigo: bankCode,
    nome: `Test List ${Math.random()}`,
    url: 'teste_list.com',
  }
  const responseCreateBank = await httpClient.post(
    `${baseUrl}/banco`,
    inputCreateBank,
  )
  expect(responseCreateBank.statusCode).toBe(HttpRestServer.StatusCode.Created)
  const bankId = responseCreateBank.body.id
  const inputCreateAgency = {
    nome: 'Any name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332211',
    contato: 'Any name',
    gerente: 'Any name',
    observacao: 'Any obs',
    banco: {
      id: bankId,
    },
  }
  const responseCreateAgency = await httpClient.post(
    `${baseUrl}/banco-agencia`,
    inputCreateAgency,
  )
  expect(responseCreateAgency.statusCode).toBe(
    HttpRestServer.StatusCode.Created,
  )
  const agencyId = responseCreateAgency.body.id
  const response = await httpClient.get(`${baseUrl}/banco-agencia/${agencyId}`)
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output.id).toBe(agencyId)
  expect(output.nome).toBe(inputCreateAgency.nome)
  expect(output.numero).toBe(inputCreateAgency.numero)
  expect(output.digito).toBe(inputCreateAgency.digito)
  expect(output.telefone).toBe(inputCreateAgency.telefone)
  expect(output.contato).toBe(inputCreateAgency.contato)
  expect(output.gerente).toBe(inputCreateAgency.gerente)
  expect(output.observacao).toBe(inputCreateAgency.observacao)
  expect(output.banco.id).toBe(bankId)
  expect(output.banco.nome).toBe(inputCreateBank.nome)
  expect(output.banco.codigo).toBe(inputCreateBank.codigo)
  expect(output.banco.url).toBe(inputCreateBank.url)
  await httpClient.delete(`${baseUrl}/banco-agencia/${agencyId}`)
  await httpClient.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve criar uma agencia (POST /banco-agencia)', async () => {
  const bankCode = '460'
  await bankDao.removeByCode(bankCode)
  const inputCreateBank = {
    codigo: bankCode,
    nome: `Test List ${Math.random()}`,
    url: 'teste_list.com',
  }
  const responseCreateBank = await httpClient.post(
    `${baseUrl}/banco`,
    inputCreateBank,
  )
  expect(responseCreateBank.statusCode).toBe(HttpRestServer.StatusCode.Created)
  const bankId = responseCreateBank.body.id
  const inputCreateAgency = {
    nome: 'Any name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332211',
    contato: 'Any name',
    gerente: 'Any name',
    observacao: 'Any obs',
    banco: {
      id: bankId,
    },
  }
  const responseCreateAgency = await httpClient.post(
    `${baseUrl}/banco-agencia`,
    inputCreateAgency,
  )
  expect(responseCreateAgency.statusCode).toBe(
    HttpRestServer.StatusCode.Created,
  )
  const outputCreate = responseCreateAgency.body
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.nome).toBe(inputCreateAgency.nome)
  expect(outputCreate.numero).toBe(inputCreateAgency.numero)
  expect(outputCreate.digito).toBe(inputCreateAgency.digito)
  expect(outputCreate.telefone).toBe(inputCreateAgency.telefone)
  expect(outputCreate.contato).toBe(inputCreateAgency.contato)
  expect(outputCreate.gerente).toBe(inputCreateAgency.gerente)
  expect(outputCreate.observacao).toBe(inputCreateAgency.observacao)
  expect(outputCreate.banco.id).toBe(bankId)
  expect(outputCreate.banco.nome).toBe(inputCreateBank.nome)
  expect(outputCreate.banco.codigo).toBe(inputCreateBank.codigo)
  expect(outputCreate.banco.url).toBe(inputCreateBank.url)
  const response = await httpClient.get(
    `${baseUrl}/banco-agencia/${outputCreate.id}`,
  )
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output.id).toBe(outputCreate.id)
  expect(output.nome).toBe(inputCreateAgency.nome)
  expect(output.numero).toBe(inputCreateAgency.numero)
  expect(output.digito).toBe(inputCreateAgency.digito)
  expect(output.telefone).toBe(inputCreateAgency.telefone)
  expect(output.contato).toBe(inputCreateAgency.contato)
  expect(output.gerente).toBe(inputCreateAgency.gerente)
  expect(output.observacao).toBe(inputCreateAgency.observacao)
  expect(output.banco.id).toBe(bankId)
  expect(output.banco.nome).toBe(inputCreateBank.nome)
  expect(output.banco.codigo).toBe(inputCreateBank.codigo)
  expect(output.banco.url).toBe(inputCreateBank.url)
  await httpClient.delete(`${baseUrl}/banco-agencia/${outputCreate.id}`)
  await httpClient.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve alterar uma agencia (PUT /banco-agencia)', async () => {
  const bankCode = '461'
  await bankDao.removeByCode(bankCode)
  const inputCreateBank = {
    codigo: bankCode,
    nome: `Test List ${Math.random()}`,
    url: 'teste_list.com',
  }
  const responseCreateBank = await httpClient.post(
    `${baseUrl}/banco`,
    inputCreateBank,
  )
  expect(responseCreateBank.statusCode).toBe(HttpRestServer.StatusCode.Created)
  const bankId = responseCreateBank.body.id
  const inputCreateAgency = {
    nome: 'Any name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332211',
    contato: 'Any name',
    gerente: 'Any name',
    observacao: 'Any obs',
    banco: {
      id: bankId,
    },
  }
  const responseCreateAgency = await httpClient.post(
    `${baseUrl}/banco-agencia`,
    inputCreateAgency,
  )
  expect(responseCreateAgency.statusCode).toBe(
    HttpRestServer.StatusCode.Created,
  )
  const agencyId = responseCreateAgency.body.id
  const inputUpdateAgency = {
    id: agencyId,
    nome: 'Other name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332200',
    contato: 'Other name',
    gerente: 'Other name',
    observacao: 'Other obs',
    banco: {
      id: bankId,
    },
  }
  const responseUpdate = await httpClient.put(
    `${baseUrl}/banco-agencia/${agencyId}`,
    inputUpdateAgency,
  )
  const outputUpdate = responseUpdate.body
  expect(outputUpdate.id).toBeTruthy()
  expect(outputUpdate.nome).toBe(inputUpdateAgency.nome)
  expect(outputUpdate.numero).toBe(inputUpdateAgency.numero)
  expect(outputUpdate.digito).toBe(inputUpdateAgency.digito)
  expect(outputUpdate.telefone).toBe(inputUpdateAgency.telefone)
  expect(outputUpdate.contato).toBe(inputUpdateAgency.contato)
  expect(outputUpdate.gerente).toBe(inputUpdateAgency.gerente)
  expect(outputUpdate.observacao).toBe(inputUpdateAgency.observacao)
  expect(outputUpdate.banco.id).toBe(bankId)
  expect(outputUpdate.banco.nome).toBe(inputCreateBank.nome)
  expect(outputUpdate.banco.codigo).toBe(inputCreateBank.codigo)
  expect(outputUpdate.banco.url).toBe(inputCreateBank.url)
  const response = await httpClient.get(`${baseUrl}/banco-agencia/${agencyId}`)
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output.id).toBe(agencyId)
  expect(output.nome).toBe(inputUpdateAgency.nome)
  expect(output.numero).toBe(inputUpdateAgency.numero)
  expect(output.digito).toBe(inputUpdateAgency.digito)
  expect(output.telefone).toBe(inputUpdateAgency.telefone)
  expect(output.contato).toBe(inputUpdateAgency.contato)
  expect(output.gerente).toBe(inputUpdateAgency.gerente)
  expect(output.observacao).toBe(inputUpdateAgency.observacao)
  expect(output.banco.id).toBe(bankId)
  expect(output.banco.nome).toBe(inputCreateBank.nome)
  expect(output.banco.codigo).toBe(inputCreateBank.codigo)
  expect(output.banco.url).toBe(inputCreateBank.url)
  await httpClient.delete(`${baseUrl}/banco-agencia/${agencyId}`)
  await httpClient.delete(`${baseUrl}/banco/${bankId}`)
})
test('Deve deletar uma agencia (DELETE /banco-agencia/:ID)', async () => {
  const bankCode = '462'
  await bankDao.removeByCode(bankCode)
  const inputCreateBank = {
    codigo: bankCode,
    nome: `Test List ${Math.random()}`,
    url: 'teste_list.com',
  }
  const responseCreateBank = await httpClient.post(
    `${baseUrl}/banco`,
    inputCreateBank,
  )
  expect(responseCreateBank.statusCode).toBe(HttpRestServer.StatusCode.Created)
  const bankId = responseCreateBank.body.id
  const inputCreateAgency = {
    nome: 'Any name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332211',
    contato: 'Any name',
    gerente: 'Any name',
    observacao: 'Any obs',
    banco: {
      id: bankId,
    },
  }
  const responseCreateAgency = await httpClient.post(
    `${baseUrl}/banco-agencia`,
    inputCreateAgency,
  )
  expect(responseCreateAgency.statusCode).toBe(
    HttpRestServer.StatusCode.Created,
  )
  const agencyId = responseCreateAgency.body.id
  const responseDelete = await httpClient.delete(
    `${baseUrl}/banco-agencia/${agencyId}`,
  )
  expect(responseDelete.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  const responseGet = await httpClient.get(
    `${baseUrl}/banco-agencia/${agencyId}`,
  )
  expect(responseGet.statusCode).toBe(HttpRestServer.StatusCode.NotFound)
  expect(responseGet.body?.id).toBeFalsy()
})
