import axios from 'axios'

axios.defaults.validateStatus = () => true

const baseUrl = 'http://localhost:3001'

test('Deve retornar a lista de bancos (GET /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: `Test List`,
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
test('Deve retornar um banco (GET /banco/:ID)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
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
test('Deve criar um banco (POST /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: `Test Name`,
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
test.each([''])(
  'Não deve criar um banco com nome inválido %s (POST /banco)',
  async (invalidName: any) => {
    const inputCreate = {
      codigo: '555',
      nome: invalidName,
      url: 'teste4.com',
    }
    const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
    expect(responseCreate.status).toBe(422)
    const outputCreate = responseCreate.data
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
    const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
    expect(responseCreate.status).toBe(422)
    const outputCreate = responseCreate.data
    expect(outputCreate.message).toBe('Código inválido')
  },
)
test('Deve alterar um banco (PUT /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const inputUpdate = {
    codigo: '553',
    nome: 'Test Name Changed',
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
test.each(['Test'])(
  'Não deve alterar um banco com nome inválido %s (PUT /banco)',
  async (invalidName: any) => {
    const bankId = 9_999_999
    const inputUpdate = {
      codigo: '123',
      nome: invalidName,
      url: 'teste4.changed.com',
    }
    const responseUpdate = await axios.put(
      `${baseUrl}/banco/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.status).toBe(422)
    const outputUpdate = responseUpdate.data
    expect(outputUpdate.message).toBe('Nome inválido')
  },
)
test.each(['Test'])(
  'Não deve alterar um banco com código inválido %s (PUT /banco)',
  async (invalidCode: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const inputCreate = {
      codigo: fakeCode,
      nome: `Test Name`,
      url: 'teste4.com',
    }
    const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
    const outputCreate = responseCreate.data
    const bankId = outputCreate.id
    const inputUpdate = {
      codigo: invalidCode,
      nome: 'Test Name',
      url: 'teste4.changed.com',
    }
    const responseUpdate = await axios.put(
      `${baseUrl}/banco/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.status).toBe(422)
    const outputUpdate = responseUpdate.data
    expect(outputUpdate.message).toBe('Código inválido')
    await axios.delete(`${baseUrl}/banco/${outputCreate.id}`)
  },
)
test('Não deve alterar um banco inexistente (PUT /banco)', async () => {
  const bankId = 9_999_999
  const inputUpdate = {
    codigo: '555',
    nome: 'Test Name',
    url: 'teste4.changed.com',
  }
  const responseUpdate = await axios.put(
    `${baseUrl}/banco/${bankId}`,
    inputUpdate,
  )
  expect(responseUpdate.status).toBe(404)
  const outputUpdate = responseUpdate.data
  expect(outputUpdate.message).toBe('Banco não encontrado')
})
test('Deve deletar um banco (DELETE /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: `Test Name Delete`,
    url: 'teste_delete.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banco`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  expect(bankId).toBeTruthy()
  const responseDelete = await axios.delete(`${baseUrl}/banco/${bankId}`)
  expect(responseDelete.status).toBe(200)
  const responseGet = await axios.get(`${baseUrl}/banco/${bankId}`)
  expect(responseGet.status).toBe(404)
  expect(responseGet.data?.id).toBeFalsy()
})
