const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { Server } = require('socket.io');
require('dotenv').config();

const roomMembersCount = {}; 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
connectDB();
app.use(express.json());
app.use('/api/auth', authRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user joins a room
  socket.on('join_room', (roomCode) => {
    roomMembersCount[roomCode] = roomMembersCount[roomCode] || 0;
    roomMembersCount[roomCode]++;
    socket.join(roomCode);

    io.to(roomCode).emit('active_member_count', roomMembersCount[roomCode]);
    console.log(`User joined room ${roomCode}. Total members: ${roomMembersCount[roomCode]}`);
  });

  // When a user leaves a room
  socket.on('leave_room', (roomCode) => {
    if (roomMembersCount[roomCode]) {
      roomMembersCount[roomCode]--;
      if (roomMembersCount[roomCode] <= 0) {
        delete roomMembersCount[roomCode];
      } else {
        io.to(roomCode).emit('active_member_count', roomMembersCount[roomCode]);
      }
    }
    socket.leave(roomCode);
    console.log(`User left room ${roomCode}. Total members: ${roomMembersCount[roomCode] || 0}`);
  });

  // Handle code sharing
  socket.on('send_code', (code, roomCode) => {
    socket.to(roomCode).emit('receive_code', code);
    console.log(`Code sent in room ${roomCode}: ${code}`);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    const rooms = [...socket.rooms];
    for (const roomCode of rooms) {
      if (roomCode !== socket.id) { 
        roomMembersCount[roomCode]--;
        if (roomMembersCount[roomCode] <= 0) {
          delete roomMembersCount[roomCode];
        } else {
          io.to(roomCode).emit('active_member_count', roomMembersCount[roomCode]);
        }
        socket.leave(roomCode);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
