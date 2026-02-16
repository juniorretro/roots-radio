const mongoose = require('mongoose');

const emissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: false // Peut être null pour les émissions non liées à un programme
  },
  host: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: '/images/default-emission.png'
  },
  duration: {
    type: Number, // Durée en secondes
    default: null
  },
  airedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  category: {
    type: String,
    default: 'Émission'
  },
  listeners: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['live', 'ended', 'scheduled'],
    default: 'ended'
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
emissionSchema.index({ airedAt: -1 }); // Tri par date décroissant
emissionSchema.index({ programId: 1 });
emissionSchema.index({ status: 1 });

// Méthode statique pour récupérer l'historique récent
emissionSchema.statics.getRecentHistory = async function(limit = 50) {
  return this.find()
    .populate('programId', 'title slug image')
    .sort({ airedAt: -1 })
    .limit(limit)
    .lean();
};

// Méthode statique pour récupérer l'historique d'aujourd'hui
emissionSchema.statics.getTodayHistory = async function() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return this.find({
    airedAt: { $gte: startOfDay }
  })
    .populate('programId', 'title slug image')
    .sort({ airedAt: -1 })
    .lean();
};

// Méthode statique pour ajouter une émission (évite les doublons)
emissionSchema.statics.addToHistory = async function(emissionData) {
  const { title, programId, host, cover, duration, listeners, category } = emissionData;

  // Vérifier si la même émission n'a pas été ajoutée dans les 5 dernières secondes
  const fiveSecondsAgo = new Date(Date.now() - 5000);
  const recentDuplicate = await this.findOne({
    title,
    programId,
    airedAt: { $gte: fiveSecondsAgo }
  });

  if (recentDuplicate) {
    console.log('⚠️ Duplicate emission ignored:', title);
    return recentDuplicate;
  }

  // Ajouter l'émission
  const emission = new this({
    title,
    programId: programId || null,
    host,
    cover: cover || '/images/default-emission.png',
    duration: duration || null,
    listeners: listeners || 0,
    category: category || 'Émission'
  });

  await emission.save();
  console.log('✅ Added emission to history:', title, 'by', host);
  
  return emission;
};

// Méthode statique pour nettoyer l'historique ancien
emissionSchema.statics.cleanOldHistory = async function(daysToKeep = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await this.deleteMany({
    airedAt: { $lt: cutoffDate }
  });

  console.log(`🧹 Cleaned ${result.deletedCount} old emission entries`);
  return result;
};

const Emission = mongoose.model('Emission', emissionSchema);

module.exports = Emission;