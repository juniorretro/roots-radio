
const icy = require('icy');
const { getCoverFromITunes } = require('./coverService');
const PlayHistory = require('../models/PlayHistory');
const { shouldAddToHistory } = require('./adFilter');

let currentSong = {
  title: '',
  artist: '',
  cover: '',
  album: '',
  genre: ''
};

// Compteur d'auditeurs connectés
let listenerCount = 0;

// Cache de l'historique récent pour détection de doublons
let recentHistoryCache = [];

let reconnectAttempts = 0;
const MAX_RECONNECT_DELAY = 30000; // 30s max
let connectionHandlerSetup = false;

const startStreamMetadata = (io) => {
  console.log('🎵 Starting stream metadata listener...');
  
  if (reconnectAttempts === 0) {
    loadRecentHistory();
  }

  const reconnect = () => {
    reconnectAttempts++;
    const delay = Math.min(5000 * reconnectAttempts, MAX_RECONNECT_DELAY);
    console.log(`🔄 Reconnecting in ${delay/1000}s (attempt ${reconnectAttempts})...`);
    setTimeout(() => startStreamMetadata(io), delay);
  };

  icy.get(process.env.LIVE_STREAM_URL, (res) => {
    reconnectAttempts = 0; // reset on successful connection
    console.log('✅ Connected to stream:', process.env.LIVE_STREAM_URL);

    // Consommer le buffer audio pour que les événements metadata continuent d'arriver
    res.resume();

    res.on('metadata', async (metadata) => {
      const parsed = icy.parse(metadata);

      if (!parsed.StreamTitle) return;

      // Parser le format "Artist - Title"
      const parts = parsed.StreamTitle.split(' - ');
      const artist = parts[0]?.trim() || '';
      const title = parts[1]?.trim() || parts[0];

      // Ignorer si c'est le même morceau valide déjà en cours
      if (currentSong.title === title && currentSong.artist === artist && !currentSong.isAd) return;

      console.log('🎵 New track detected:', artist, '-', title);

      // Récupérer la pochette depuis iTunes
      const cover =
        await getCoverFromITunes(artist, title) ||
        '/images/default-cover.png';

      // Données du track
      const trackData = {
        artist,
        title,
        cover,
        album: '', // Peut être enrichi depuis iTunes
        genre: ''  // Peut être enrichi depuis iTunes
      };

      // ✅ FILTRAGE DES PUBLICITÉS
      const filterResult = shouldAddToHistory(trackData, recentHistoryCache, {
        minConfidenceScore: 50, // Score minimum (ajustable)
        checkDuplicates: true,
        duplicateMaxAge: 300 // 5 minutes
      });

      if (!filterResult.shouldAdd) {
        console.log(`🚫 Track rejected: ${filterResult.reason} (score: ${filterResult.score})`);
        console.log(`   "${title}" by "${artist}"`);
        
        // Ne pas diffuser ni sauvegarder, mais on peut garder currentSong
        // pour afficher "Publicité en cours" si besoin
        currentSong = {
          ...trackData,
          isAd: true // Marquer comme publicité
        };
        
        // On peut quand même diffuser pour informer l'UI
        if (io) {
          io.emit('nowPlaying', {
            ...currentSong,
            listeners: listenerCount,
            isFiltered: true,
            filterReason: filterResult.reason
          });
        }
        
        return;
      }

      console.log(`✅ Track validated (score: ${filterResult.score}/100)`);

      // Mettre à jour le morceau en cours
      currentSong = {
        ...trackData,
        isAd: false
      };

      console.log('📣 Broadcasting nowPlaying:', currentSong);

      // 📡 Émettre via Socket.IO (temps réel)
      if (io) {
        io.emit('nowPlaying', {
          ...currentSong,
          listeners: listenerCount,
          isFiltered: false,
          confidenceScore: filterResult.score
        });
      }

      // 💾 Sauvegarder dans la base de données (persistance)
      try {
        const saved = await PlayHistory.addToHistory({
          ...currentSong,
          listeners: listenerCount
        });
        
        if (saved) {
          // Ajouter au cache local
          recentHistoryCache.unshift({
            ...currentSong,
            playedAt: new Date(),
            _id: saved._id
          });
          
          // Garder seulement les 100 derniers dans le cache
          if (recentHistoryCache.length > 100) {
            recentHistoryCache = recentHistoryCache.slice(0, 100);
          }
          
          console.log('✅ Saved to database');
        }
      } catch (error) {
        console.error('❌ Error saving to database:', error);
      }
    });

    res.on('error', (error) => {
      console.error('❌ Stream error:', error);
    });

    res.on('end', () => {
      console.log('⚠️ Stream ended, reconnecting...');
      reconnect();
    });
  }).on('error', (error) => {
    console.error('❌ Connection error:', error.message);
    reconnect();
  });

  // Gérer le compteur d'auditeurs (une seule fois, pas à chaque reconnexion)
  if (io && !connectionHandlerSetup) {
    connectionHandlerSetup = true;
    io.on('connection', (socket) => {
      listenerCount++;
      console.log(`👤 Listener connected. Total: ${listenerCount}`);

      socket.emit('nowPlaying', { ...currentSong, listeners: listenerCount });

      socket.on('disconnect', () => {
        listenerCount--;
        console.log(`👤 Listener disconnected. Total: ${listenerCount}`);
      });
    });
  }
};

// Charger l'historique récent au démarrage
const loadRecentHistory = async () => {
  try {
    recentHistoryCache = await PlayHistory.find()
      .sort({ playedAt: -1 })
      .limit(100)
      .lean();
    console.log(`✅ Loaded ${recentHistoryCache.length} recent tracks to cache`);
  } catch (error) {
    console.error('❌ Error loading recent history:', error);
    recentHistoryCache = [];
  }
};

// Fonction pour récupérer le morceau en cours (pour l'API REST)
const getCurrentSong = () => {
  return {
    ...currentSong,
    listeners: listenerCount
  };
};

module.exports = {
  startStreamMetadata,
  getCurrentSong
};