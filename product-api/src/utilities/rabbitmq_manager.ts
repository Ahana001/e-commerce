// import * as amqp from 'amqplib';
// import { IProduct } from '../module/product/type';

// export interface RabbitMQIncommingMessageCartInquiry {
//   event: 'CART';
//   action: 'INQUIRY';
//   data: {
//     customer_id: string;
//     product_ids: string[];
//   };
// }

// export interface RabbitMQOutgoingMessageNewOrder {
//   event: 'ORDER';
//   action: 'NEW_ORDER';
//   data: {
//     products: IProduct[];
//   };
// }

// export const CHANNEL = {
//   INPUT_QUEUE: 'product_queue',
//   OUTPUT_QUEUE: 'order_queue',
// };

//  const connectionOptions: amqp.Options.Connect = {
//     protocol: 'amqp',
//     hostname: process.env.RABBITMQ_HOST || 'localhost',
//     port: parseInt(process.env.RABBITMQ_PORT || '5672'),
//     username: process.env.RABBITMQ_USERNAME || 'guest',
//     password: process.env.RABBITMQ_PASSWORD || 'guest',
//   };

// const rabbitmqClient = await amqp.connect(connectionOptions);
// const rabbitmqChannel = await rabbitmqClient.createChannel();


// export async function sendMessage(queue: string, message: {}) {
//     try {
//         const messageContent = JSON.stringify(message);
//         await rabbitmqChannel.assertQueue(queue, { durable: false });
//         rabbitmqChannel.sendToQueue(queue, Buffer.from(messageContent));
//         console.log(`[x] Sent message to ${queue}: ${message}`);
//     } catch (error) {
//         console.error('Error sending message:', error);
//     }
// }

// export async function readMessage(queue: string) {
//     try {
//        await rabbitmqChannel.assertQueue(queue, { durable: false });
//         console.log(`[*] Waiting for messages in ${queue}.`);
//         const messages: amqp.ConsumeMessage[] = [];
//         rabbitmqChannel.consume(queue, (msg) => {
//             if (msg !== null) {
//                 messages.push(msg);
//             }
//         }, { noAck: false });

//         return messages;
//     } catch (error) {
//         console.error('Error reading message:', error);
//     }
// }
