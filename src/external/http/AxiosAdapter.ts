import { HttpClient } from '@infra/http/HttpClient.ts'
import axios from 'axios'
axios.defaults.validateStatus = () => true

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<HttpClient.Response> {
    const response = await axios.get(url)
    return {
      statusCode: response.status,
      body: response.data,
    }
  }

  async post(url: string, body: any): Promise<HttpClient.Response> {
    const response = await axios.post(url, body)
    return {
      statusCode: response.status,
      body: response.data,
    }
  }

  async put(url: string, body: any): Promise<HttpClient.Response> {
    const response = await axios.put(url, body)
    return {
      statusCode: response.status,
      body: response.data,
    }
  }

  async delete(url: string): Promise<HttpClient.Response> {
    const response = await axios.delete(url)
    return {
      statusCode: response.status,
      body: response.data,
    }
  }
}
