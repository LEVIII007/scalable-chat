import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error"],
});

export default prisma;
prisma.$connect()
  .then(() => {
    console.log("Prisma connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to Prisma:", error);
  });