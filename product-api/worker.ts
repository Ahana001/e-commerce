// import { connectdb } from "./src/data/knex";
// import { processProductStockInquiry } from "./src/module/product/service";
// import { CHANNEL, RabbitMQIncommingMessageProduct, readMessage } from "./src/utilities/rabbitmq_manager";
// import {ConsumeMessage} from 'amqplib';

// async function ProcessMessage(message: ConsumeMessage) {
//   try {
//     if (message.content) {
//         const content: string = message.content.toString();
//         const messageObject = JSON.parse(content);
//         const event = messageObject.event;
//         if(event){
//           if(event === 'PRODUCT'){
//             if(messageObject.action === 'STOCK_INQUIRY'){
//               await processProductStockInquiry(messageObject.data as RabbitMQIncommingMessageProduct['data'])
//             }else{
//             console.log('Invalid action');
//             }
//           }else{
//             console.log('Invalid event');
//           }
//         }else{
//           console.log('Invalid Message Format');
//         }
//     }
//   }
// }

// async function ProcessMessages() {
//   try {
//     const messages = await readMessage(CHANNEL.INPUT_QUEUE);
//     if (messages && messages.length) {
//       const promArray: Promise<void>[] = [];
//       for (let i = 0; i < messages.length; i++) {
//         console.log('Message Found:');
//         promArray.push(ProcessMessage(messages[i]));
//       }
//       // eslint-disable-next-line node/no-unsupported-features/es-builtins
//       await Promise.allSettled(promArray);
//     } else {
//         console.log('No Msg from RabbitMQ');
//     }
//   } catch (error) {
//     console.log('Fetching Messages Error')
//   }
// }

// function wait_for(seconds: number) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve('');
//     }, seconds * 1000);
//   });
// }
// async function app() {
//   await connectdb();
//   await ProcessMessages();
//   const intervalSeconds = +(process.env.WORKER_INTERVAL_IN_SECONDS || 10);
//   for (;;) {
//     await ProcessMessages();
//     await wait_for(intervalSeconds);
//   }
// }
// app();
