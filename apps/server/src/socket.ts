import { Server, Socket } from "socket.io";
import { produceMessage } from "./helper.js";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

interface CustomSocket extends Socket {
  room?: string;
}

const redisHost = process.env.REDIS_URI;
if (!redisHost) {
  throw new Error('REDIS_HOST environment variable is not defined');
}

const pub = new Redis(redisHost);
const sub = new Redis(redisHost);

export function setupSocket(io: Server) {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    // * Join the room
    socket.join(socket.room);

    socket.on("message", async (data) => {
      try {
        await pub.publish("MESSAGES", JSON.stringify({ room: socket.room, data }));
      } catch (error) {
        console.log("The Redis publish error is", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  sub.subscribe("MESSAGES");

  sub.on("message", async (channel, message) => {
    if (channel === "MESSAGES") {
      const { room, data } = JSON.parse(message);
      io.to(room).emit("message", data);
      try {
        await produceMessage("chats", data);
      } catch (error) {
        console.log("The Kafka produce error is", error);
      }
    }
  });
}