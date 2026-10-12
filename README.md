# Realtime Chat App

A beginner-friendly real-time chat application built with React + Vite, Node.js, Express, Socket.IO, and MongoDB.

## Requirements
- Node.js 18 or newer
- MongoDB running locally (or a MongoDB Atlas connection string)

## Run on Windows / VS Code
1. Extract this folder and open it in VS Code.
2. Open a terminal in the `realtime-chat-app` root folder.
3. Install dependencies:
   ```powershell
   npm run install-all
   ```
4. Start MongoDB service if you use local MongoDB:
   ```powershell
   Get-Service MongoDB
   ```
   If it is stopped, run PowerShell as Administrator and use `Start-Service MongoDB`.
5. Start frontend and backend together:
   ```powershell
   npm run dev
   ```
6. Open the Vite URL shown in the terminal, usually http://localhost:5173.

## Features
- Join with a display name and room name
- Live messages using Socket.IO
- Room-based conversations
- Online participant list
- Message timestamps
- Recent message history saved in MongoDB when MongoDB is connected
- Responsive layout and basic input validation

## Configuration
The server reads `server/.env`. Defaults work with a local MongoDB:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/realtime_chat
CLIENT_ORIGIN=http://localhost:5173
```

If MongoDB is unavailable, the server still starts and messages work in real time, but chat history will be kept in memory only and will be lost when the server restarts.

This is a learning project, not production-ready authentication. Display names are not verified identities; do not use sensitive personal information.
