export interface Queue {
  publish(eventName: string, payload: any): Promise<void>
  consume(eventName: string, callback: Function): Promise<void>
}
