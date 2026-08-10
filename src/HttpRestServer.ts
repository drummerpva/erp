export interface HttpRestServer {
  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void
  listen(port: number): void
}
export namespace HttpRestServer {
  export type Request = {
    params?: any
    body?: any
  }
  export type Response = {
    statusCode: HttpRestServer.StatusCode
    body: any
  }
  export const AcceptedMethodsList = ['GET', 'POST', 'PUT', 'DELETE'] as const
  export type AcceptedMethods = (typeof AcceptedMethodsList)[number]
  export enum StatusCode {
    Ok = 200,
    Created = 201,
    BadRequest = 400,
    NotFound = 404,
    UnprocessableEntity = 422,
    ServerError = 500,
  }
}
