import { Connection, Channel, ConsumeMessage, connect } from 'amqplib'
import sendEmailService from 'core/aws/sendMail'

class RabbitMQServer {
    private connection: Connection;
    private channel: Channel;

    constructor(private uri: string) { }

    async start(): Promise<void> {
        this.connection = await connect(this.uri, {})
        this.channel = await this.connection.createChannel()
    }

    async close(): Promise<void> {
        this.connection.close()
    }

    async assertQueue(queue: string) {
        await this.channel.assertQueue(queue, { durable: false })
    }

    async sendToQueue(queue: string, messageData: any): Promise<void> {
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageData)), { persistent: false })
        this.channel.consume(queue, async (message) => {
            if (message !== null) {
                const content = message.content.toString() as ConsumeMessage | string
                await sendEmailService.handle(JSON.parse(content as string))
                this.channel.ack(message);
            }
        });
    }
}

export default RabbitMQServer