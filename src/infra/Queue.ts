export interface Queue {
  publish(eventName: string, payload: any): Promise<void>
}
