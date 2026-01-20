const mongoose = require('mongoose');

const playHistorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  cover: {
    type: String,
    default: '/images/default-cover.png'
  },
  album: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    default: ''
  },
  playedAt: {
    type: Date,
    default: Date.now,
    index: true // Index pour recherche rapide
  },
  duration: {
    type: Number, // Durée en secondes (si disponible)
    default: null
  },
  listeners: {
    type: Number, // Nombre d'auditeurs au moment de la diffusion
    default: 0
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
playHistorySchema.index({ playedAt: -1 }); // Tri par date décroissant
playHistorySchema.index({ artist: 1, title: 1 }); // Recherche par artiste/titre

// Méthode statique pour récupérer l'historique récent
playHistorySchema.statics.getRecentHistory = async function(limit = 50) {
  return this.find()
    .sort({ playedAt: -1 })
    .limit(limit)
    .lean();
};

// Méthode statique pour récupérer l'historique d'aujourd'hui
playHistorySchema.statics.getTodayHistory = async function() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return this.find({
    playedAt: { $gte: startOfDay }
  })
    .sort({ playedAt: -1 })
    .lean();
};

// Méthode statique pour éviter les doublons
playHistorySchema.statics.addToHistory = async function(trackData) {
  const { title, artist, cover, album, genre, listeners } = trackData;

  // Vérifier si le même morceau n'a pas été ajouté dans les 5 dernières secondes
  const fiveSecondsAgo = new Date(Date.now() - 5000);
  const recentDuplicate = await this.findOne({
    title,
    artist,
    playedAt: { $gte: fiveSecondsAgo }
  });

  if (recentDuplicate) {
    console.log('⚠️ Duplicate track ignored:', title, 'by', artist);
    return recentDuplicate;
  }

  // Ajouter le morceau
  const historyEntry = new this({
    title,
    artist,
    cover: cover || '/images/default-cover.png',
    album: album || '',
    genre: genre || '',
    listeners: listeners || 0
  });

  await historyEntry.save();
  console.log('✅ Added to history:', title, 'by', artist);
  
  return historyEntry;
};

// Méthode statique pour nettoyer l'historique ancien (optionnel)
playHistorySchema.statics.cleanOldHistory = async function(daysToKeep = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await this.deleteMany({
    playedAt: { $lt: cutoffDate }
  });

  console.log(`🧹 Cleaned ${result.deletedCount} old history entries`);
  return result;
};

// Méthode statique pour les statistiques
playHistorySchema.statics.getStats = async function() {
  const totalTracks = await this.countDocuments();
  
  const topArtists = await this.aggregate([
    {
      $group: {
        _id: '$artist',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const topGenres = await this.aggregate([
    {
      $match: { genre: { $ne: '' } }
    },
    {
      $group: {
        _id: '$genre',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return {
    totalTracks,
    topArtists,
    topGenres
  };
};

const PlayHistory = mongoose.model('PlayHistory', playHistorySchema);

module.exports = PlayHistory;