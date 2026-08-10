import { HttpClient } from '@infra/http/HttpClient.ts'

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<HttpClient.Response> {
    const response = await fetch(url)
    const body = await this.parseBody(response)
    return {
      statusCode: response.status,
      body,
    }
  }

  async post(url: string, body: any): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  async put(url: string, body: any): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  async delete(url: string): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    const responseBody = await this.parseBody(response)
    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  private async parseBody(response: Response): Promise<any> {
    const text = await response.text()
    if (!text.length) return
    return JSON.parse(text)
  }
}
