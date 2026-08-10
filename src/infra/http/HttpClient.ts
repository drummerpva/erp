export interface HttpClient {
  get(url: string): Promise<HttpClient.Response>
  post(url: string, body: any): Promise<HttpClient.Response>
  put(url: string, body: any): Promise<HttpClient.Response>
  delete(url: string): Promise<HttpClient.Response>
}
export namespace HttpClient {
  export type Response = {
    statusCode: number
    body?: any
  }
}
