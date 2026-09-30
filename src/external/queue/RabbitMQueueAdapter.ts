import { Queue } from '@infra/Queue.ts'
import { ChannelModel, connect, ConsumeMessage } from 'amqplib'

export class RabbitMQueueAdapter implements Queue {
  private connection!: ChannelModel
  constructor(private rabbitMQURL: string) {}

  async publish(eventName: string, payload: any): Promise<void> {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(eventName, { durable: true })
    const message = Buffer.from(JSON.stringify(payload))
    channel.sendToQueue(eventName, message)
  }

  async consume(eventName: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(eventName, { durable: true })
    await channel.consume(eventName, async (message: ConsumeMessage | null) => {
      if (!message) return
      const payload = JSON.parse(message.content.toString())
      try {
        await callback(payload)
        channel.ack(message)
      } catch (error: any) {
        console.error(`Error on consumer: ${error.message}`)
      }
    })
  }

  async connect(): Promise<void> {
    this.connection = await connect(this.rabbitMQURL)
  }

  async disconnect(): Promise<void> {
    await this.connection.close()
  }
}
