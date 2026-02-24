const mongoose = require('mongoose');

const AfficheSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Le sous-titre ne peut pas dépasser 300 caractères'],
    default: ''
  },
  image: {
    type: String,
    required: [true, "L'image est requise"],
    trim: true
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  linkText: {
    type: String,
    trim: true,
    default: 'En savoir plus',
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Récupérer seulement les affiches actives et dans leur plage de dates
AfficheSchema.statics.getActiveAffiches = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    $or: [
      { startDate: null, endDate: null },
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: null, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: null }
    ]
  }).sort({ order: 1, createdAt: -1 });
};

module.exports = mongoose.model('Affiche', AfficheSchema);