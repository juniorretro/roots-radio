// // const mongoose = require('mongoose');

// // // User Schema
// // const userSchema = new mongoose.Schema({
// //   username: { type: String, required: true, unique: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true },
// //   role: { type: String, enum: ['user', 'admin'], default: 'user' },
// //   createdAt: { type: Date, default: Date.now }
// // });

// // // Program Schema
// // const programSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   slug: { type: String, required: true, unique: true },
// //   description: { type: String, required: true },
// //   host: { type: String, required: true },
// //   category: { type: String, required: true },
// //   image: { type: String, default: '/uploads/placeholder-program.jpg' },
// //   schedule: [{
// //     day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
// //     startTime: String,
// //     endTime: String,
// //     duration: Number // in minutes
// //   }],
// //   isActive: { type: Boolean, default: true },
// //   featured: { type: Boolean, default: false },
// //   tags: [String],
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Episode Schema
// // const episodeSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   slug: { type: String, required: true, unique: true },
// //   description: { type: String, required: true },
// //   programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
// //   audioUrl: { type: String, required: true },
// //   image: { type: String, default: '/uploads/placeholder-episode.jpg' },
// //   duration: { type: Number, required: true }, // in seconds
// //   airDate: { type: Date, required: true },
// //   season: { type: Number, default: 1 },
// //   episodeNumber: { type: Number, required: true },
// //   featured: { type: Boolean, default: false },
// //   tags: [String],
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Podcast Schema
// // const podcastSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   slug: { type: String, required: true, unique: true },
// //   description: { type: String, required: true },
// //   host: { type: String, required: true },
// //   category: { type: String, required: true },
// //   image: { type: String, default: '/uploads/placeholder-podcast.jpg' },
// //   audioUrl: { type: String, required: true },
// //   duration: { type: Number, required: true }, // in seconds
// //   publishDate: { type: Date, required: true },
// //   featured: { type: Boolean, default: false },
// //   tags: [String],
// //   downloads: { type: Number, default: 0 },
// //   likes: { type: Number, default: 0 },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now }
// // });

// // // Middleware to update updatedAt
// // programSchema.pre('save', function(next) {
// //   this.updatedAt = Date.now();
// //   next();
// // });

// // episodeSchema.pre('save', function(next) {
// //   this.updatedAt = Date.now();
// //   next();
// // });

// // podcastSchema.pre('save', function(next) {
// //   this.updatedAt = Date.now();
// //   next();
// // });

// // module.exports = {
// //   User: mongoose.model('User', userSchema),
// //   Program: mongoose.model('Program', programSchema),
// //   Episode: mongoose.model('Episode', episodeSchema),
// //   Podcast: mongoose.model('Podcast', podcastSchema)
// // };
// const mongoose = require('mongoose');

// // User Schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 30
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 2,
//     maxlength: 50
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 2,
//     maxlength: 50
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8
//   },
//   phone: {
//     type: String,
//     trim: true,
//     match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin', 'moderator'],
//     default: 'user'
//   },
//   newsletter: {
//     type: Boolean,
//     default: false
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: {
//     type: Date
//   },
//   profileImage: {
//     type: String,
//     default: null
//   }
// }, {
//   timestamps: true
// });

// // Indexes
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

// // Program Schema
// const programSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   host: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   schedule: {
//     dayOfWeek: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 6 // 0 = Sunday, 6 = Saturday
//     },
//     startTime: {
//       type: String,
//       required: true,
//       match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
//     },
//     endTime: {
//       type: String,
//       required: true,
//       match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
//     }
//   },
//   image: {
//     type: String,
//     default: null
//   },
//   category: {
//     type: String,
//     enum: ['music', 'talk', 'news', 'entertainment', 'education'],
//     default: 'music'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }]
// }, {
//   timestamps: true
// });

// // Podcast Schema
// const podcastSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   host: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   category: {
//     type: String,
//     enum: ['music', 'talk', 'news', 'entertainment', 'education'],
//     default: 'music'
//   },
//   image: {
//     type: String,
//     default: null
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }]
// }, {
//   timestamps: true
// });

// // Episode Schema
// const episodeSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   podcast: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Podcast',
//     required: true
//   },
//   audioUrl: {
//     type: String,
//     required: true
//   },
//   duration: {
//     type: Number, // in seconds
//     required: true
//   },
//   episodeNumber: {
//     type: Number,
//     required: true
//   },
//   season: {
//     type: Number,
//     default: 1
//   },
//   publishedAt: {
//     type: Date,
//     default: Date.now
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   playCount: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true
// });

// // Create models
// const User = mongoose.model('User', userSchema);
// const Program = mongoose.model('Program', programSchema);
// const Podcast = mongoose.model('Podcast', podcastSchema);
// const Episode = mongoose.model('Episode', episodeSchema);

// module.exports = {
//   User,
//   Program,
//   Podcast,
//   Episode
// };

const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Format de téléphone invalide']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: '/uploads/default-avatar.png'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Program Schema
const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  host: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation', 'Santé', 'Business']
  },
  image: {
    type: String,
    default: '/uploads/placeholder-program.jpg'
  },
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
    },
    duration: {
      type: Number,
      min: 1,
      max: 1440 // 24 heures en minutes
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Episode Schema
const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  season: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  episodeNumber: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number,
    required: true,
    min: 1 // en secondes
  },
  airDate: {
    type: Date,
    required: true
  },
  audioUrl: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/uploads/placeholder-episode.jpg'
  },
  transcript: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'aired', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Podcast Schema
const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  host: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation', 'Santé', 'Business']
  },
  duration: {
    type: Number,
    required: true,
    min: 1 // en secondes
  },
  publishDate: {
    type: Date,
    required: true
  },
  audioUrl: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/uploads/placeholder-podcast.jpg'
  },
  transcript: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add compound indexes for better performance
programSchema.index({ slug: 1 });
programSchema.index({ category: 1, featured: -1 });
programSchema.index({ 'schedule.day': 1, 'schedule.startTime': 1 });

episodeSchema.index({ slug: 1 });
episodeSchema.index({ programId: 1, season: 1, episodeNumber: 1 });
episodeSchema.index({ airDate: -1 });
episodeSchema.index({ featured: -1, airDate: -1 });

podcastSchema.index({ slug: 1 });
podcastSchema.index({ category: 1, featured: -1 });
podcastSchema.index({ publishDate: -1 });

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Create models
const User = mongoose.model('User', userSchema);
const Program = mongoose.model('Program', programSchema);
const Episode = mongoose.model('Episode', episodeSchema);
const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = {
  User,
  Program,
  Episode,
  Podcast
};