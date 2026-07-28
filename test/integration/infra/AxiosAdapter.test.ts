import { AxiosAdapter, HttpClient } from '@HttpClient.ts'
import axios from 'axios'
import nock from 'nock'
import Sinon from 'sinon'

let sut: HttpClient

beforeAll(() => {
  sut = new AxiosAdapter()
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
  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${url}${path}`)
  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${url}${path}`)).toBeTruthy()
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
  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${url}${path}`)
  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${url}${path}`)).toBeTruthy()
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
  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${url}${path}`)
  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${url}${path}`)).toBeTruthy()
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
  const postSpy = Sinon.spy(axios, 'post')
  const response = await sut.post(`${url}${path}`, expectedBody)
  expect(postSpy.calledOnce).toBeTruthy()
  expect(
    postSpy.calledWith(`${url}${path}`, {
      test: expectedBody.test,
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
  const putSpy = Sinon.spy(axios, 'put')
  const response = await sut.put(`${url}${path}`, expectedBody)
  expect(putSpy.calledOnce).toBeTruthy()
  expect(
    putSpy.calledWith(`${url}${path}`, {
      test: expectedBody.test,
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
  const deleteSpy = Sinon.spy(axios, 'delete')
  const response = await sut.delete(`${url}${path}`)
  expect(deleteSpy.calledOnce).toBeTruthy()
  expect(deleteSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})
test('Deve retornar o body vazio quando a chamada retornar o body vazio', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  nock(url).delete(path).reply(expectedCode)
  const deleteSpy = Sinon.spy(axios, 'delete')
  const response = await sut.delete(`${url}${path}`)
  expect(deleteSpy.calledOnce).toBeTruthy()
  expect(deleteSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body).toBeFalsy()
})
