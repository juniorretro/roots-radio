const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const afficheRoutes = require('./routes/affiches');

require('dotenv').config();

// ─────────────────────────────────────────────
// 0. VALIDATION DES VARIABLES D'ENVIRONNEMENT
// ─────────────────────────────────────────────

// Accepte MONGO_URI ou MONGODB_URI (Render utilise MONGODB_URI)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (MONGO_URI) process.env.MONGO_URI = MONGO_URI;

const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Variable d'environnement manquante: ${envVar}`);
    process.exit(1);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET trop court (minimum 32 caractères requis)');
  process.exit(1);
}

const isDev = process.env.NODE_ENV !== 'production';

// Services
const { startStreamMetadata, getCurrentSong } = require('./services/streamMetadata');

// Routes
const emissionRoutes        = require('./routes/emissionRoutes');
const statsRoutes           = require('./routes/statsRoutes');
const authRoutes            = require('./routes/auth');
const programRoutes         = require('./routes/programs');
const episodeRoutes         = require('./routes/episodes');
const podcastRoutes         = require('./routes/podcasts');
const uploadRoutes          = require('./routes/upload');
const historyRoutes         = require('./routes/history');
const streamRoutes          = require('./routes/streamRoutes');
const adminHistoryRoutes    = require('./routes/adminHistoryRoutes');
const combinedHistoryRoutes = require('./routes/combinedHistoryRoutes');
const songRequestRoutes     = require('./routes/songRequests');
const carouselRoutes        = require('./routes/carousel');


// ─────────────────────────────────────────────
// App & Server
// ─────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────
// 1. CORS — doit être AVANT tout le reste
// ─────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(o => {
    o = o.trim();
    // Ajoute https:// si l'origine n'a pas de protocole
    if (o && !o.startsWith('http://') && !o.startsWith('https://')) return `https://${o}`;
    return o;
  });

// En développement : accepter aussi localhost:3001 et 3000
if (isDev) {
  ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'].forEach(o => {
    if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, mobile, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`⚠️  CORS bloqué pour: ${origin}`);
    callback(new Error(`CORS bloqué pour l'origine: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Gérer les requêtes OPTIONS (preflight) explicitement
app.options('*', cors(corsOptions));

// ─────────────────────────────────────────────
// 2. SÉCURITÉ — Headers HTTP
// ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ─────────────────────────────────────────────
// 3. PARSERS & SANITIZATION
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// ─────────────────────────────────────────────
// 4. RATE LIMITING
//    En dev : limites très souples pour ne pas bloquer les tests
//    En prod : limites strictes
// ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 100,      // ← 10000 en dev, 100 en prod
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,              // ← skip complètement en dev
  message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,         // ← 1000 en dev, 10 en prod (était 5, trop peu)
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,              // ← skip complètement en dev
  message: { success: false, message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─────────────────────────────────────────────
// 5. FICHIERS STATIQUES
// ─────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// ─────────────────────────────────────────────
// 6. SOCKET.IO
// ─────────────────────────────────────────────
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ─────────────────────────────────────────────
// 7. BASE DE DONNÉES
// ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startStreamMetadata(io);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────────
// 8. SOCKET.IO EVENTS
// ─────────────────────────────────────────────
// In-memory chat buffer — last 50 messages, reset at midnight
let chatMessages = [];
const MAX_CHAT = 50;

const midnightReset = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  setTimeout(() => { chatMessages = []; io.emit('chatClear'); midnightReset(); }, midnight - now);
};
midnightReset();

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  socket.emit('nowPlaying', getCurrentSong());

  // Send recent chat history to the new connection
  socket.emit('chatHistory', chatMessages);

  // Handle incoming chat message
  socket.on('chatMessage', (data) => {
    if (!data?.text?.trim() || data.text.length > 300) return;
    const msg = {
      id:       Date.now().toString(),
      text:     data.text.trim().slice(0, 300),
      username: (data.username || 'Auditeur').slice(0, 50),
      at:       new Date().toISOString(),
    };
    chatMessages = [...chatMessages.slice(-(MAX_CHAT - 1)), msg];
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.set('io', io);

// ─────────────────────────────────────────────
// 9. ROUTES PUBLIQUES (santé)
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    time: new Date(),
    environment: process.env.NODE_ENV || 'development',
    currentSong: getCurrentSong()
  });
});

app.get('/api/now-playing', (req, res) => {
  res.json({ success: true, nowPlaying: getCurrentSong() });
});

// ─────────────────────────────────────────────
// 10. ROUTES API
// ─────────────────────────────────────────────
app.use('/api/auth',             authRoutes);
app.use('/api/programs',         programRoutes);
app.use('/api/episodes',         episodeRoutes);
app.use('/api/podcasts',         podcastRoutes);
app.use('/api/upload',           uploadRoutes);
app.use('/api/history',          historyRoutes);
app.use('/api/stream',           streamRoutes);
app.use('/api/admin/history',    adminHistoryRoutes);
app.use('/api/combined-history', combinedHistoryRoutes);
app.use('/api/emissions',        emissionRoutes);
app.use('/api/stats',            statsRoutes);
app.use('/api/affiches',         afficheRoutes);
app.use('/api/song-requests',    songRequestRoutes);
app.use('/api/carousel',         carouselRoutes);

// ─────────────────────────────────────────────
// 11. GESTIONNAIRES D'ERREURS
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: isDev ? err.message : 'Erreur serveur interne',
    ...(isDev && { stack: err.stack })
  });
});

// ─────────────────────────────────────────────
// 12. DÉMARRAGE DU SERVEUR
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`🌐 CORS autorisé pour: ${allowedOrigins.join(', ')}`);
});

// ─────────────────────────────────────────────
// 13. NETTOYAGE AUTOMATIQUE
// ─────────────────────────────────────────────
if (process.env.AUTO_CLEAN_HISTORY === 'true') {
  const PlayHistory = require('./models/PlayHistory');
  const Emission    = require('./models/Emission');

  setInterval(async () => {
    console.log('🧹 Running automatic history cleanup...');
    try {
      await PlayHistory.cleanOldHistory(30);
      await Emission.cleanOldHistory(30);
    } catch (error) {
      console.error('❌ Auto cleanup error:', error.message);
    }
  }, 24 * 60 * 60 * 1000);
}

// ─────────────────────────────────────────────
// 14. GESTION DES ERREURS PROCESS
// ─────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = { app, server };
