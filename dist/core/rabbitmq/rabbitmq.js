"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const sendMail_1 = __importDefault(require("core/aws/sendMail"));
class RabbitMQServer {
    constructor(uri) {
        this.uri = uri;
    }
    async start() {
        this.connection = await (0, amqplib_1.connect)(this.uri, {});
        this.channel = await this.connection.createChannel();
    }
    async close() {
        this.connection.close();
    }
    async assertQueue(queue) {
        await this.channel.assertQueue(queue, { durable: false });
    }
    async sendToQueue(queue, messageData) {
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageData)), { persistent: false });
        this.channel.consume(queue, async (message) => {
            if (message !== null) {
                const content = message.content.toString();
                await sendMail_1.default.handle(JSON.parse(content));
                this.channel.ack(message);
            }
        });
    }
}
exports.default = RabbitMQServer;
