
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const io = socketIo(server, {
  cors: {
    origin: "http://192.168.0.109:3000/", 
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);


  socket.on('registerUser', (userId) => {
    if (!userId) {
      return socket.emit('registrationError', 'User ID is required');
    }
    
    users[userId] = socket.id;
    console.log(`User ${userId} registered`);
    socket.emit('registrationSuccess', userId);
  });


 socket.on('sendMessage', (data) => {
    try {
      const { fromUserId, toUserId, message } = data;
      console.log("Message Data:", data);
      console.log("Registered Users:", users);
      
      if (!users[toUserId]) {
     
        setTimeout(() => {
          socket.emit('sendMessage', data);
        }, 2000); 
        return socket.emit('messageError', 'Recipient not found');
      }
  
      if (!message?.trim()) {
        return socket.emit('messageError', 'Message cannot be empty');
      }
  
      const payload = {
        fromUserId,
        text: message,
        timestamp: new Date().toISOString()
      };
  
  
      io.to(users[toUserId]).emit('receiveMessage', payload);
      
      socket.emit('messageDelivered', {
        ...payload,
        status: 'delivered'
      });
  
    } catch (error) {
      console.error('Message handling error:', error);
      socket.emit('messageError', 'Failed to send message');
    }
  });
  
  

  // Handle disconnection
  socket.on('disconnect', () => {
    const disconnectedUser = Object.keys(users).find(key => users[key] === socket.id);
    if (disconnectedUser) {
      delete users[disconnectedUser];
      console.log(`User ${disconnectedUser} disconnected`);
    }
  });
});