import { RabbitMQueueAdapter } from '@external/queue/RabbitMQueueAdapter.ts'
import { BankEventQueueController } from '@infra/controllers/BankEventQueueController.ts'
import { Queue } from '@infra/Queue.ts'

const queue: Queue = new RabbitMQueueAdapter(String(process.env.RABBIT_URL))
await queue.connect()

new BankEventQueueController(queue)

let shuttingDown = false
const gracefullShutdown = async () => {
  if (shuttingDown) return
  shuttingDown = true
  try {
    await queue.disconnect()
    console.log('Application terminated')
  } catch (error: any) {
    console.log(
      `Error on shutdown application: ${error.message}, stack: ${error.stack}`,
    )
  }
}

process.on('SIGTERM', gracefullShutdown)
process.on('SIGINT', gracefullShutdown)
