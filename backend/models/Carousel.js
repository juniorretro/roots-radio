const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  type:     { type: String, enum: ['artist', 'hero'], required: true },
  name:     { type: String, trim: true, maxlength: 100 },
  subtitle: { type: String, trim: true, maxlength: 100 },
  image:    { type: String, required: true, trim: true },
  order:    { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

carouselSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model('Carousel', carouselSchema);
