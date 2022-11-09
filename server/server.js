require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDb = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');

const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes.js');
const messageRoute = require('./routes/messageRoute.js');
const app = express();
const socket = require('socket.io');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDb();
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoute);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.msg);
    }
  });
});
