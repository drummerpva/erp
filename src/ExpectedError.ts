export abstract class ExpectedError extends Error {
  abstract readonly code: string
  protected constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}
