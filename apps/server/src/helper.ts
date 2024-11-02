import prisma from "./config/db.config.js";
import { producer, consumer } from "./config/kafka.config.js";

export const produceMessage = async (topic: string, message: any) => {
  try {
    console.log("Producing message to topic:", topic);
    console.log("Message content:", message);
    topic = "MESSAGES";
    await producer.send({
      topic,
      messages: [{ key: `message-${Date.now()}`, value: JSON.stringify(message) }],
    });
    console.log("Message sent successfully.");
  } catch (error) {
    console.error("Error producing message:", error);
  }
};

// export const consumeMessages = async (topic: string) => {
//   try {
//     console.log("Consuming messages from topic:", topic);
//     console.log("Connecting to Kafka consumer...");
//     await consumer.connect();
//     console.log("Consumer connected successfully.");

//     console.log("Subscribing to topic:", topic);
//     // await consumer.subscribe({ topic });
//     await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
//     console.log("Subscription successful.");

//     await consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         try {
//           console.log("Partition:", partition);
//           const data = JSON.parse(message.value.toString());
//           console.log("Received message data:", data);
//           console.log("Message metadata:", {
//             topic,
//             partition,
//             offset: message.offset,
//           });

//           console.log("Saving message data to database...");
//           await prisma.chats.create({
//             data: data,
//           });
//           console.log("Data saved successfully.");
//         } catch (error) {
//           console.error("Error processing message:", error);
//         }
//       },
//     });
//   } catch (error) {
//     console.error("Error in consumeMessages function:", error);
//   }
// };


export const consumeMessages = async (topic: string) => {
  try {
    console.log("Consuming messages from topic:", topic);
    console.log("Connecting to Kafka consumer...");
    await consumer.connect();
    console.log("Consumer connected successfully.");

    console.log("Subscribing to topic:", topic);
    await consumer.subscribe({ topic: topic, fromBeginning: true });
    console.log("Subscription successful.");

    // Array to accumulate messages
    let messageBuffer = [];
    const batchInterval = 5000; // 5 seconds

    // Set up a timer to commit messages in batch
    setInterval(async () => {
      if (messageBuffer.length > 0) {
        try {
          await prisma.chats.createMany({
            data: messageBuffer.map(text => ({
              id : text.id, // Ensure this matches your message structure
              group_id: text.group_id, // Ensure this matches your message structure
              name: text.name, // Ensure this matches your message structure
              message: text.message, // Ensure this matches your message structure
              created_at: text.created_at, // Ensure this matches your message structure
            })), // Adjust the structure according to your DB schema
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
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (!message.value) return;
          console.log("Partition:", partition);
          console.log("Message:", message.value.toString());
          console.log("topic:", topic);
          const data = JSON.parse(message.value.toString());
          console.log("Received message data:", data);
          console.log("Message metadata:", {
            topic,
            partition,
            offset: message.offset,
          });

          messageBuffer.push(data); // Add message to buffer
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error in consumeMessages function:", error);
  }
};

export default consumer;
