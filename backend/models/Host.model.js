const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  title:    { type: String, default: 'Animateur' },
  bio:      { type: String, default: '' },
  photo:    { type: String, default: '' },
  program:  { type: String, required: true },
  schedule: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Host', HostSchema);