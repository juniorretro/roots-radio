const User = require('./User');
const Program = require('./Program');
const Episode = require('./Episode');
const Podcast = require('./Podcast');
const Emission = require('./Emission');

module.exports = { User, Program, Episode, Podcast, Emission };

// const mongoose = require('mongoose');
//    const Emission = require('./Emission');

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
//     maxlength: 50
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 50
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8
//   },
//   phone: {
//     type: String,
//     trim: true,
//     match: [/^\+?[\d\s-()]+$/, 'Format de téléphone invalide']
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   },
//   newsletter: {
//     type: Boolean,
//     default: false
//   },
//   avatar: {
//     type: String,
//     default: '/uploads/default-avatar.png'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: {
//     type: Date
//   }
// }, {
//   timestamps: true
// });

// // Program Schema
// const programSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets']
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 2000
//   },
//   host: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation', 'Santé', 'Business']
//   },
//   image: {
//     type: String,
//     default: '/uploads/placeholder-program.jpg'
//   },
//   schedule: [{
//     day: {
//       type: String,
//       enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
//       required: true
//     },
//     startTime: {
//       type: String,
//       required: true,
//       match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
//     },
//     endTime: {
//       type: String,
//       required: true,
//       match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
//     },
//     duration: {
//       type: Number,
//       min: 1,
//       max: 1440 // 24 heures en minutes
//     }
//   }],
//   tags: [{
//     type: String,
//     trim: true,
//     maxlength: 30
//   }],
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, {
//   timestamps: true
// });

// // Episode Schema
// const episodeSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 2000
//   },
//   programId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Program',
//     required: true
//   },
//   season: {
//     type: Number,
//     required: true,
//     min: 1,
//     default: 1
//   },
//   episodeNumber: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   duration: {
//     type: Number,
//     required: true,
//     min: 1 // en secondes
//   },
//   airDate: {
//     type: Date,
//     required: true
//   },
//   audioUrl: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   image: {
//     type: String,
//     default: '/uploads/placeholder-episode.jpg'
//   },
//   transcript: {
//     type: String,
//     trim: true
//   },
//   tags: [{
//     type: String,
//     trim: true,
//     maxlength: 30
//   }],
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'scheduled', 'aired', 'archived'],
//     default: 'draft'
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: {
//     type: Number,
//     default: 0
//   },
//   downloads: {
//     type: Number,
//     default: 0
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, {
//   timestamps: true
// });

// // Podcast Schema
// const podcastSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 2000
//   },
//   host: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation', 'Santé', 'Business']
//   },
//   duration: {
//     type: Number,
//     required: true,
//     min: 1 // en secondes
//   },
//   publishDate: {
//     type: Date,
//     required: true
//   },
//   audioUrl: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   image: {
//     type: String,
//     default: '/uploads/placeholder-podcast.jpg'
//   },
//   transcript: {
//     type: String,
//     trim: true
//   },
//   tags: [{
//     type: String,
//     trim: true,
//     maxlength: 30
//   }],
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'archived'],
//     default: 'draft'
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: {
//     type: Number,
//     default: 0
//   },
//   downloads: {
//     type: Number,
//     default: 0
//   },
//   rating: {
//     average: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5
//     },
//     count: {
//       type: Number,
//       default: 0
//     }
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, {
//   timestamps: true
// });

// // Add compound indexes for better performance
// programSchema.index({ slug: 1 });
// programSchema.index({ category: 1, featured: -1 });
// programSchema.index({ 'schedule.day': 1, 'schedule.startTime': 1 });

// episodeSchema.index({ slug: 1 });
// episodeSchema.index({ programId: 1, season: 1, episodeNumber: 1 });
// episodeSchema.index({ airDate: -1 });
// episodeSchema.index({ featured: -1, airDate: -1 });

// podcastSchema.index({ slug: 1 });
// podcastSchema.index({ category: 1, featured: -1 });
// podcastSchema.index({ publishDate: -1 });

// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

// // Create models
// const User = mongoose.model('User', userSchema);
// const Program = mongoose.model('Program', programSchema);
// const Episode = mongoose.model('Episode', episodeSchema);
// const Podcast = mongoose.model('Podcast', podcastSchema);

// module.exports = {
//   User,
//   Program,
//   Episode,
//   Podcast,
//   Emission
// };
