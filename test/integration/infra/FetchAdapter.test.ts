import { FetchAdapter } from '@FetchAdapter.ts'
import { HttpClient } from '@HttpClient.ts'
import nock from 'nock'
import Sinon from 'sinon'

let sut: HttpClient

beforeAll(() => {
  sut = new FetchAdapter()
})

afterEach(() => {
  Sinon.restore()
  nock.cleanAll()
})

test('Deve chamar axios get corretamente e retornar os dados corretos quando a request GET retornar 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'teste',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve chamar axios get corretamente e retornar os dados corretos quando a request GET retornar 4xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 400
  const expectedBody = {
    test: 'teste',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve chamar axios get corretamente e retornar os dados corretos quando a request GET retornar 5xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 500
  const expectedBody = {
    test: 'teste',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve chamar axios post corretamente e retornar os dados corretos quando a request POST retornar 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 201
  const expectedBody = {
    test: 'teste',
  }
  nock(url).post(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.post(`${url}${path}`, expectedBody)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(
    fetchSpy.calledWith(`${url}${path}`, {
      method: 'POST',
      body: JSON.stringify(expectedBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve chamar axios put corretamente e retornar os dados corretos quando a request PUT retornar 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'teste',
  }
  nock(url).put(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.put(`${url}${path}`, expectedBody)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(
    fetchSpy.calledWith(`${url}${path}`, {
      method: 'PUT',
      body: JSON.stringify(expectedBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve chamar axios put corretamente e retornar os dados corretos quando a request PUT retornar 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'teste',
  }
  nock(url).delete(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.delete(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(
    fetchSpy.calledWith(`${url}${path}`, {
      method: 'DELETE',
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve retornar o body vazio quando a chamada retornar o body vazio', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  nock(url).delete(path).reply(expectedCode)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.delete(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body).toBeFalsy()
})
