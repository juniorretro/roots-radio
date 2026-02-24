
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
require('dotenv').config();

// Services
const { startStreamMetadata, getCurrentSong } = require('./services/streamMetadata');

// Routes
const emissionRoutes      = require('./routes/emissionRoutes');
const statsRoutes         = require('./routes/statsRoutes');
const authRoutes          = require('./routes/auth');
const programRoutes       = require('./routes/programs');
const episodeRoutes       = require('./routes/episodes');
const podcastRoutes       = require('./routes/podcasts');
const uploadRoutes        = require('./routes/upload');
const historyRoutes       = require('./routes/history');
const streamRoutes        = require('./routes/streamRoutes');
const adminHistoryRoutes  = require('./routes/adminHistoryRoutes');
const combinedHistoryRoutes = require('./routes/combinedHistoryRoutes');

// ─────────────────────────────────────────────
// App & Server
// ─────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ─────────────────────────────────────────────
// 1. SÉCURITÉ — Headers HTTP
//    (helmet UNE SEULE FOIS, en premier)
// ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // permet les uploads d'images
}));

// ─────────────────────────────────────────────
// 2. CORS — restreint à ton frontend uniquement
// ─────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (ex: Postman, mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqué pour l'origine: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─────────────────────────────────────────────
// 3. RATE LIMITING — anti brute-force & DDoS
//    (UNE SEULE fois par route)
// ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes, réessayez dans 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives de login par 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);

// ─────────────────────────────────────────────
// 4. PARSERS & SANITIZATION
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // protège contre les injections NoSQL

// ─────────────────────────────────────────────
// 5. FICHIERS STATIQUES
// ─────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// ─────────────────────────────────────────────
// 6. BASE DE DONNÉES
// ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/radio')
  .then(() => {
    console.log('✅ MongoDB connected');
    startStreamMetadata(io); // démarrer APRÈS la connexion DB
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // quitter si la DB est inaccessible
  });

// ─────────────────────────────────────────────
// 7. SOCKET.IO
// ─────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  socket.emit('nowPlaying', getCurrentSong());

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Rendre io accessible dans les routes
app.set('io', io);

// ─────────────────────────────────────────────
// 8. ROUTES PUBLIQUES (santé)
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    time: new Date(),
    environment: process.env.NODE_ENV,
    currentSong: getCurrentSong()
  });
});

app.get('/api/now-playing', (req, res) => {
  res.json({
    success: true,
    nowPlaying: getCurrentSong()
  });
});

// ─────────────────────────────────────────────
// 9. ROUTES API
//    (chaque route UNE SEULE fois)
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

// ─────────────────────────────────────────────
// 10. GESTIONNAIRES D'ERREURS
//     (toujours EN DERNIER, après toutes les routes)
// ─────────────────────────────────────────────

// 404 — route non trouvée
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`
  });
});

// 500 — erreur globale
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);

  // Ne jamais exposer les détails d'erreur en production
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.statusCode || 500).json({
    success: false,
    message: isDev ? err.message : 'Erreur serveur interne',
    ...(isDev && { stack: err.stack })
  });
});

// ─────────────────────────────────────────────
// 11. DÉMARRAGE DU SERVEUR
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// ─────────────────────────────────────────────
// 12. NETTOYAGE AUTOMATIQUE (optionnel)
// ─────────────────────────────────────────────
if (process.env.AUTO_CLEAN_HISTORY === 'true') {
  // node-schedule n'est pas dans tes dépendances → utiliser setInterval
  const PlayHistory = require('./models/playHistory');
  const Emission    = require('./models/Emission');

  // Toutes les 24h
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    console.log('🧹 Running automatic history cleanup...');
    try {
      await PlayHistory.cleanOldHistory(30);
      await Emission.cleanOldHistory(30);
    } catch (error) {
      console.error('❌ Auto cleanup error:', error.message);
    }
  }, TWENTY_FOUR_HOURS);
}

// ─────────────────────────────────────────────
// 13. GESTION DES ERREURS PROCESS (anti-crash)
// ─────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  // Ne pas quitter le process mais logger l'erreur
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1); // Quitter proprement pour que PM2 redémarre
});

module.exports = { app, server }; // utile pour les tests
