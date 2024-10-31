import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
    brokers: [process.env.KAFKA_URI as string],
    ssl: {
      ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],
    },
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME as string,
      password: process.env.KAFKA_PASSWORD as string,
    },
  });

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

// export async function startMessageConsumer() {
//   console.log("Consumer is running..");
//   const consumer = kafka.consumer({ groupId: "default" });
//   await consumer.connect();
//   await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

//   await consumer.run({
//     autoCommit: true,
//     eachMessage: async ({ message, pause }) => {
//       if (!message.value) return;
//       console.log(`New Message Recv..`);
//       try {
//         await prismaClient.message.create({
//           data: {
//             text: message.value?.toString(),
//           },
//         });
//       } catch (err) {
//         console.log("Something is wrong");
//         pause();
//         setTimeout(() => {
//           consumer.resume([{ topic: "MESSAGES" }]);
//         }, 60 * 1000);
//       }
//     },
//   });
// }


export async function startMessageConsumer() {
    console.log("Consumer is running...");
    const consumer = kafka.consumer({ groupId: "default" });
    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
  
    // Array to accumulate messages
    let messageBuffer: string[] = [];
    const batchInterval = 5000; // 5 seconds
  
    // Set up a timer to commit messages in batch
    setInterval(async () => {
      if (messageBuffer.length > 0) {
        try {
          await prismaClient.message.createMany({
            data: messageBuffer.map(text => ({ text })),
          });
          console.log(`Batch committed ${messageBuffer.length} messages`);
          messageBuffer = []; // Clear the buffer after commit
        } catch (err) {
          console.error("Batch commit error:", err);
        }
      }
    }, batchInterval);
  
    await consumer.run({
      autoCommit: false, // Disable auto-commit to handle manually
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        console.log("Message received:", message.value.toString());
        messageBuffer.push(message.value.toString()); // Add message to buffer
      },
    });
  }
  
export default kafka;