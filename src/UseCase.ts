export interface UseCase<Input, Output> {
  execute(input: Input, context?: UseCase.Context): Promise<Output>
}
export namespace UseCase {
  export type Context = any
}
