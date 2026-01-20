// const mongoose = require("mongoose");

// const ProgramSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   slug: { type: String, required: true, unique: true },
//   host: { type: String, required: true },
//   category: { type: String, required: true },
//   image: { type: String },
//   featured: { type: Boolean, default: false },
//   active: { type: Boolean, default: true },
//   schedule: [{
//     day: { type: String, required: true },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     duration: { type: Number }
//   }],
//   tags: [{ type: String }],
//   social: {
//     twitter: String,
//     facebook: String,
//     instagram: String
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// ProgramSchema.pre("save", function (next) {
//   if (this.isModified("title") && !this.slug) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-")
//       .trim("-");
//   }
//   this.updatedAt = new Date();
//   next();
// });

// module.exports = mongoose.model("Program", ProgramSchema);

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  
  host: {
    type: String,
    required: [true, 'L\'animateur est requis'],
    trim: true,
    maxlength: [100, 'Le nom de l\'animateur ne peut pas dépasser 100 caractères']
  },
  
  category: {
    type: String,
    trim: true,
    enum: {
      values: [
        'Actualités',
        'Musique', 
        'Sport',
        'Culture',
        'Divertissement',
        'Éducation',
        'Religion',
        'Santé',
        'Économie',
        'Politique',
        'Société',
        'International',
        'Jeunesse',
        'Femmes',
        'Agriculture',
        'Environnement',
        'Technologies',
        'Histoire',
        'Littérature',
        'Cinéma',
        'Théâtre',
        'Arts',
        'Sciences',
        'Cuisine',
        'Mode',
        'Voyage',
        'Autre'
      ],
      message: 'Catégorie invalide'
    },
    default: 'Autre'
  },
  
  // Fichiers multimédias
  image: {
    type: String,
    trim: true,
    default: '/uploads/placeholder-program.jpg'
  },
  
  jingle: {
    type: String,
    trim: true
  },
  
  intro: {
    type: String,
    trim: true
  },
  
  // Programme de diffusion
  schedule: {
    day: {
      type: [String],
      enum: {
        values: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
        message: 'Jour invalide'
      },
      default: []
    },
    startTime: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Format d\'heure invalide (HH:MM)'
      }
    },
    endTime: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Format d\'heure invalide (HH:MM)'
      }
    },
    duration: {
      type: Number,
      min: [1, 'La durée doit être d\'au moins 1 minute'],
      max: [1440, 'La durée ne peut pas dépasser 1440 minutes (24h)']
    },
    isRecurring: {
      type: Boolean,
      default: true
    }
  },
  
  // Statut du programme
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'suspended', 'archived'],
      message: 'Statut invalide'
    },
    default: 'active'
  },
  
  // Informations supplémentaires
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Un tag ne peut pas dépasser 30 caractères']
  }],
  
  language: {
    type: String,
    trim: true,
    enum: {
      values: ['français', 'anglais', 'ewondo', 'fulfuldé', 'duala', 'bassa', 'autre'],
      message: 'Langue invalide'
    },
    default: 'français'
  },
  
  targetAudience: {
    type: String,
    trim: true,
    enum: {
      values: ['tout public', 'enfants', 'jeunes', 'adultes', 'seniors', 'professionnels'],
      message: 'Public cible invalide'
    },
    default: 'tout public'
  },
  
  // Métadonnées
  featured: {
    type: Boolean,
    default: false
  },
  
  priority: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  
  // Statistiques
  views: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de vues ne peut pas être négatif']
  },
  
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de likes ne peut pas être négatif']
  },
  
  // Informations de contact
  contact: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Format d\'email invalide'
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: 'Format de téléphone invalide'
      }
    },
    social: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      youtube: { type: String, trim: true }
    }
  },
  
  // Informations système
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
programSchema.index({ slug: 1 }, { unique: true });
programSchema.index({ category: 1 });
programSchema.index({ 'schedule.day': 1 });
programSchema.index({ status: 1 });
programSchema.index({ featured: -1 });
programSchema.index({ priority: -1 });
programSchema.index({ createdAt: -1 });

// Index de recherche textuelle
programSchema.index({
  title: 'text',
  description: 'text',
  host: 'text',
  tags: 'text'
});

// Méthodes virtuelles
programSchema.virtual('episodeCount', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'programId',
  count: true
});

// Middleware pour la validation personnalisée
programSchema.pre('save', function(next) {
  // Vérifier que l'heure de fin est après l'heure de début
  if (this.schedule && this.schedule.startTime && this.schedule.endTime) {
    const start = this.schedule.startTime.split(':').map(Number);
    const end = this.schedule.endTime.split(':').map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    if (endMinutes <= startMinutes) {
      const error = new Error('L\'heure de fin doit être après l\'heure de début');
      return next(error);
    }
    
    // Calculer automatiquement la durée
    this.schedule.duration = endMinutes - startMinutes;
  }
  
  next();
});

// Méthodes d'instance
programSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

programSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

programSchema.methods.isActive = function() {
  return this.status === 'active';
};

programSchema.methods.getScheduleDisplay = function() {
  if (!this.schedule || !this.schedule.day || this.schedule.day.length === 0) {
    return 'Horaire non défini';
  }
  
  const days = this.schedule.day.join(', ');
  const time = this.schedule.startTime && this.schedule.endTime 
    ? `${this.schedule.startTime} - ${this.schedule.endTime}`
    : '';
  
  return `${days} ${time}`.trim();
};

// Méthodes statiques
programSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'active' }).sort({ priority: -1, createdAt: -1 });
};

programSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ featured: true, status: 'active' })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit);
};

programSchema.statics.findByDay = function(day) {
  return this.find({ 'schedule.day': day, status: 'active' })
    .sort({ 'schedule.startTime': 1 });
};

programSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'active'
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Program', programSchema);