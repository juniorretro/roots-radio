// const icy = require('icy');
// const { getCoverFromITunes } = require('./coverService');

// let currentSong = {
//   title: '',
//   artist: '',
//   cover: '',
// };

// const startStreamMetadata = (io) => {
//   icy.get(process.env.LIVE_STREAM_URL, (res) => {
//     res.on('metadata', async (metadata) => {
//       const parsed = icy.parse(metadata);

//       if (!parsed.StreamTitle) return;

//       const parts = parsed.StreamTitle.split(' - ');
//       const artist = parts[0]?.trim() || '';
//       const title = parts[1]?.trim() || parts[0];

//       // 🔁 Évite les appels inutiles
//       if (
//         currentSong.title === title &&
//         currentSong.artist === artist
//       ) return;

//       const cover =
//         await getCoverFromITunes(artist, title) ||
//         '/images/default-cover.png';

//       currentSong = { artist, title, cover };

//       console.log('🎵 Now Playing:', currentSong);

//       if (io) {
//         io.emit('nowPlaying', currentSong);
//       }
//     });
//   });
// };

// module.exports = { startStreamMetadata };

const icy = require('icy');
const { getCoverFromITunes } = require('./coverService');
const PlayHistory = require('../models/playHistory');

let currentSong = {
  title: '',
  artist: '',
  cover: '',
  album: '',
  genre: ''
};

// Compteur d'auditeurs connectés
let listenerCount = 0;

const startStreamMetadata = (io) => {
  console.log('🎵 Starting stream metadata listener...');
  
  icy.get(process.env.LIVE_STREAM_URL, (res) => {
    console.log('✅ Connected to stream:', process.env.LIVE_STREAM_URL);

    res.on('metadata', async (metadata) => {
      const parsed = icy.parse(metadata);

      if (!parsed.StreamTitle) {
        console.log('⚠️ No StreamTitle in metadata');
        return;
      }

      // Parser le format "Artist - Title"
      const parts = parsed.StreamTitle.split(' - ');
      const artist = parts[0]?.trim() || '';
      const title = parts[1]?.trim() || parts[0];

      // 🔁 Évite les appels inutiles si c'est le même morceau
      if (
        currentSong.title === title &&
        currentSong.artist === artist
      ) {
        console.log('⏭️ Same track, skipping:', title);
        return;
      }

      console.log('🎵 New track detected:', artist, '-', title);

      // Récupérer la pochette depuis iTunes
      const cover =
        await getCoverFromITunes(artist, title) ||
        '/images/default-cover.png';

      // Mettre à jour le morceau en cours
      currentSong = { 
        artist, 
        title, 
        cover,
        album: '', // On pourrait parser ça depuis iTunes aussi
        genre: ''  // On pourrait parser ça depuis iTunes aussi
      };

      console.log('📣 Broadcasting nowPlaying:', currentSong);

      // 📡 Émettre via Socket.IO (temps réel)
      if (io) {
        io.emit('nowPlaying', {
          ...currentSong,
          listeners: listenerCount
        });
      }

      // 💾 Sauvegarder dans la base de données (persistance)
      try {
        await PlayHistory.addToHistory({
          ...currentSong,
          listeners: listenerCount
        });
        console.log('✅ Saved to database');
      } catch (error) {
        console.error('❌ Error saving to database:', error);
      }
    });

    res.on('error', (error) => {
      console.error('❌ Stream error:', error);
    });

    res.on('end', () => {
      console.log('⚠️ Stream ended, reconnecting...');
      // Reconnexion automatique après 5 secondes
      setTimeout(() => startStreamMetadata(io), 5000);
    });
  }).on('error', (error) => {
    console.error('❌ Connection error:', error);
    // Reconnexion automatique après 5 secondes
    setTimeout(() => startStreamMetadata(io), 5000);
  });

  // Gérer le compteur d'auditeurs
  if (io) {
    io.on('connection', (socket) => {
      listenerCount++;
      console.log(`👤 Listener connected. Total: ${listenerCount}`);
      
      // Envoyer immédiatement le morceau en cours
      socket.emit('nowPlaying', {
        ...currentSong,
        listeners: listenerCount
      });

      socket.on('disconnect', () => {
        listenerCount--;
        console.log(`👤 Listener disconnected. Total: ${listenerCount}`);
      });
    });
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