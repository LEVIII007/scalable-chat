This is a monorepo containing a Node.js server for handling Redis and Kafka logic, and a Next.js frontend.
# Scalable Chat Application

This project is a highly scalable chat application designed to handle a large number of simultaneous users and high message throughput. The architecture leverages *Redis* for Pub/Sub, *Kafka* as a message broker, and *PostgreSQL* for data persistence, ensuring efficient, real-time communication while maintaining reliability and scalability.

![System Design Overview](link_to_your_image_here)

## Table of Contents

1. [Introduction](#introduction)
2. [System Design Overview](#system-design-overview)
3. [Components and Their Roles](#components-and-their-roles)
4. [Why Redis and Kafka?](#why-redis-and-kafka)
5. [Drawbacks of Not Using Redis and Kafka](#drawbacks-of-not-using-redis-and-kafka)
6. [Setup and Installation](#setup-and-installation)
7. [Contributing](#contributing)

## Introduction

As the user base for chat applications grows, the volume of concurrent messages can overwhelm a server, leading to poor performance and message delays. This project aims to address these issues by designing a chat system that distributes and balances the load effectively across multiple servers while maintaining real-time communication.

## System Design Overview

The architecture follows a distributed, event-driven approach with the following key components:

1. *Clients (u1, u2, u3, etc.)*: Users who send and receive messages.
2. *Socket.IO Servers*: Servers that handle WebSocket connections, providing a real-time communication channel between clients.
3. *Redis (Pub/Sub)*: Manages inter-server communication by broadcasting messages to other servers subscribed to the same channels.
4. *Kafka (Aiven)*: A distributed message queue used to store messages and ensure reliable delivery to other components.
5. *Consumer*: A service that reads messages from Kafka and processes them as required.
6. *PostgreSQL (Aiven)*: Database for storing messages and other persistent data.

## Components and Their Roles

- *Redis*: Acts as a fast, in-memory Pub/Sub broker between multiple Socket.IO servers. When a user sends a message, it is published to Redis, which then broadcasts it to all subscribed servers. This ensures users connected to different servers still receive messages in real-time.

- *Kafka*: Kafka serves as a reliable message broker, used to queue messages for consumption by various services. Kafka’s durability and partitioning make it ideal for handling large volumes of messages with low latency. In this architecture, messages from Redis are written to Kafka for processing, ensuring fault tolerance and message retention in case of server issues.

- *PostgreSQL*: This is the persistent layer where all messages are stored for future reference, allowing users to retrieve their chat history.

### Message Flow

1. *Event Emit*: Users send a message through WebSocket, which is received by one of the Socket.IO servers.
2. *Redis (Pub/Sub)*: The server that receives the message publishes it to Redis.
3. *Other Servers*: All subscribed servers receive the message from Redis and broadcast it to their connected clients.
4. *Kafka Queue*: Messages are also pushed to Kafka for reliable storage and consumption by downstream services.
5. *Consumer*: Reads messages from Kafka and writes them to PostgreSQL for long-term storage.

## Why Redis and Kafka?

### Redis
Redis is chosen for inter-server Pub/Sub because:
- It allows real-time message broadcasting across multiple servers.
- It’s fast and lightweight, ideal for low-latency communication.
- By using Redis, the application avoids sending the same message multiple times to each server, thus reducing bandwidth and CPU usage.

### Kafka
Kafka is included in this architecture for:
- *Reliability*: Ensures that no messages are lost, even if a server goes down, by retaining messages in a queue.
- *Scalability*: Kafka can handle a high volume of messages, distributing them across partitions.
- *Fault Tolerance*: With message retention, Kafka enables a reliable way to recover messages after any system failure.

## Drawbacks of Not Using Redis and Kafka

Without Redis and Kafka, this chat application would face several challenges:

### Without Redis
- *Inconsistent Messaging*: If messages aren't broadcasted across servers, users connected to different servers might not receive messages in real-time, leading to an inconsistent user experience.
- *High Load on a Single Server*: Without Pub/Sub, the application would have to rely on a single server to handle all messages, making it a bottleneck and reducing scalability.

### Without Kafka
- *Message Loss*: In case of server failure, messages might be lost, as they are not reliably stored in a message queue.
- *Scalability Issues*: Handling large volumes of messages simultaneously without Kafka can overload the system.
- *Lack of Message Persistence*: Without Kafka’s retention capabilities, there's no mechanism to reprocess or store messages effectively, impacting data integrity.

## Setup and Installation

1. Clone this repository.
2. Install Redis and Kafka.
3. Configure Socket.IO, Redis, Kafka, and PostgreSQL based on your environment.
4. Run the application and connect to Redis and Kafka services.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---