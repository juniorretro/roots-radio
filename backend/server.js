// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const path = require('path');
// // const http = require('http');
// // const socketIO = require('socket.io');
// // require('dotenv').config();



// // const app = express();
// // const server = http.createServer(app);
// // const io = socketIO(server, {
// //   cors: {
// //     origin: "http://localhost:3000",
// //     methods: ["GET", "POST"]
// //   }
// // });

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // Create uploads directory if it doesn't exist
// // const fs = require('fs');
// // const uploadDir = path.join(__dirname, 'uploads');
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// // // MongoDB connection
// // mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radio')
// //   .then(() => console.log('MongoDB connected'))
// //   .catch(err => console.log('MongoDB connection error:', err));

// // // Socket.IO connection
// // io.on('connection', (socket) => {
// //   console.log('User connected');
  
// //   socket.on('disconnect', () => {
// //     console.log('User disconnected');
// //   });
// // });

// // // Make io accessible to routes
// // app.set('io', io);

// // // Routes
// // app.use('/api/auth', require('./routes/auth'));
// // app.use('/api/programs', require('./routes/programs'));
// // app.use('/api/episodes', require('./routes/episodes'));
// // app.use('/api/podcasts', require('./routes/podcasts'));
// // app.use('/api/upload', require('./routes/upload'));

// // // Health check
// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// // });

// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const http = require('http');
// const socketIO = require('socket.io');
// const fs = require('fs');
// require('dotenv').config();

// // 🔥 Import metadata service (CommonJS)
// const { startStreamMetadata } = require('./services/streamMetadata');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // ▶️ Start stream metadata listener
// startStreamMetadata(io);

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Create uploads directory
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/radio')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB error:', err));

// // Socket.IO
// io.on('connection', (socket) => {
//   console.log('🔌 User connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('❌ User disconnected:', socket.id);
//   });
// });

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/programs', require('./routes/programs'));
// app.use('/api/episodes', require('./routes/episodes'));
// app.use('/api/podcasts', require('./routes/podcasts'));
// app.use('/api/upload', require('./routes/upload'));

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', time: new Date() });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
require('dotenv').config();

// 🔥 Import metadata service
const { startStreamMetadata, getCurrentSong } = require('./services/streamMetadata');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/radio')
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // ▶️ Start stream metadata listener AFTER DB connection
    startStreamMetadata(io);
  })
  .catch(err => console.error('❌ MongoDB error:', err));

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Envoyer immédiatement le morceau en cours
  socket.emit('nowPlaying', getCurrentSong());

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});



// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/episodes', require('./routes/episodes'));
app.use('/api/podcasts', require('./routes/podcasts'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/history', require('./routes/history')); // ✅ Nouvelle route
app.use('/api/stream', require('./routes/streamRoutes')); // ✅ Nouvelle route

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    time: new Date(),
    currentSong: getCurrentSong()
  });
});

// Route pour récupérer le morceau en cours (API REST)
app.get('/api/now-playing', (req, res) => {
  res.json({
    success: true,
    nowPlaying: getCurrentSong()
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Nettoyage automatique de l'historique ancien (optionnel)
// Exécuter tous les jours à minuit
if (process.env.AUTO_CLEAN_HISTORY === 'true') {
  const PlayHistory = require('./models/playHistory');
  const schedule = require('node-schedule');
  
  schedule.scheduleJob('0 0 * * *', async () => {
    console.log('🧹 Running automatic history cleanup...');
    try {
      await PlayHistory.cleanOldHistory(30); // Garder 30 jours
    } catch (error) {
      console.error('❌ Auto cleanup error:', error);
    }
  });
}