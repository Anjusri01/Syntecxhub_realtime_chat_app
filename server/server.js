const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Internal Module Imports
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// 1. Initial Configurations & Environment Variables Loading
dotenv.config();
const app = express();
const server = http.createServer(app);

// 2. Connect to MongoDB Atlas / Local Database Server Engine
connectDB();

// 3. Global Middlewares Architecture Configuration Layers
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Automatically white-lists both Vite React local dev ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Parses incoming request payloads straight into readable JSON objects
app.use(express.urlencoded({ extended: true }));

// 4. REST API Endpoints Route Mappings
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Base Status Route Verification Hook
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Pulse Chat Engine Server Framework API running successfully.' });
});

// 5. Socket.io Web Sockets Real-Time Real-Time Pipeline Setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Dictionary tracking logged-in account IDs mapped explicitly to their active socket IDs
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`📡 New WebSocket pipeline channel established: ${socket.id}`);

  // Flow A: Action event when a user signs online to register their channel
  socket.on('register_user', ({ username }) => {
    if (!username) return;
    
    // Join a private, isolated socket room specifically named after their nickname
    socket.join(username);
    onlineUsers.set(username, socket.id);
    
    console.log(`👤 User [${username}] registered. Pipeline tracking room linked.`);
    
    // Broadcast globally to all linked endpoints that system user lists need updating
    io.emit('user_status_changed', { username, status: 'online' });
  });

  // Flow B: Intercepting direct private chat transmissions between specific clients
  socket.on('send_direct_message', (payload) => {
    const { receiverId, text, senderName } = payload;
    
    if (!receiverId || !text) return;

    const messageBundle = {
      senderId: senderName, // Map your client context variables
      senderName: senderName,
      text: text,
      timestamp: new Date().toISOString()
    };

    // Route message strictly into the recipient's private channel room pipe
    io.to(receiverId).emit('receive_direct_message', messageBundle);
    console.log(`✉ Direct Message routed from [${senderName}] straight to private room [${receiverId}]`);
  });

  // Flow C: Handling graceful closures and network connection disconnect strings
  socket.on('disconnect', () => {
    let disconnectedUser = null;
    
    // Find who owned this socket signature
    for (let [user, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        disconnectedUser = user;
        onlineUsers.delete(user);
        break;
      }
    }

    if (disconnectedUser) {
      console.log(`🛑 User [${disconnectedUser}] pipeline channel disconnected.`);
      io.emit('user_status_changed', { username: disconnectedUser, status: 'offline' });
    }
  });
});

// 6. Launch the Integrated HTTP & WebSocket Listening Server Engine
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\x1b[36m🚀 Pulse Chat Server Engine booted successfully on URL: http://localhost:${PORT}\x1b[0m`);
});
