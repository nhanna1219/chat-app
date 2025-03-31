# 🧵 Realtime Chat App

A fullstack realtime chat application using:

- 💬 **React + Tailwind CSS** for the frontend
- 🧠 **Spring Boot** for the backend
- ⚡ **Kafka** for real-time messaging
- 🧩 **MongoDB** for message persistence
- 🔌 **WebSocket (STOMP)** for instant chat delivery

![image](https://github.com/user-attachments/assets/44222a12-0e49-4f8a-983d-bb7f92deab87)

---

## 🚀 Features

- Realtime group chat with WebSocket + Kafka
- Dynamic topic/channel support
- Chat history stored in MongoDB
- TailwindCSS for styling
- Backend auto-creates Kafka topics from config
- React STOMP WebSocket client integration

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/)
- [Java 21+](https://adoptium.net/)
- [Apache Kafka](https://kafka.apache.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

---

## 🧪 Setup Instructions
---------------------
### 📈 Kafka

> Make sure Kafka is installed and extracted on your machine.

1.  Navigate to your Kafka folder:

    `cd C:\kafka_2.13-4.0.0`

2.  Format and start Kafka (only once if not formatted):

    `set CLUSTER_ID=chat-cluster
    .\bin\windows\kafka-storage.bat format --standalone -t %CLUSTER_ID% -c config\server.properties`

3.  Start the Kafka server:

    `.\bin\windows\kafka-server-start.bat config\server.properties`

> ✅ Ensure Kafka is running on `localhost:9092`

* * * * *

### 🔧 Backend (Spring Boot)

1.  Navigate to the backend folder:

    `cd chat-backend`

2.  Run the application:

    `mvn spring-boot:run`

* * * * *

### 🎨 Frontend (React + TailwindCSS)

1.  Navigate to the frontend folder:

    `cd chat-frontend`

2.  Install dependencies:

    `npm install`

3.  Start the development server:

    `npm start`
