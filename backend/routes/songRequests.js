const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// ── Schema inline (simple, no separate model file needed) ─────────────────────
const requestSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true, maxlength: 200 },
  artist:    { type: String, trim: true, maxlength: 200 },
  message:   { type: String, trim: true, maxlength: 500 },
  listener:  { type: String, trim: true, maxlength: 100 },
  status:    { type: String, enum: ['pending', 'played', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const SongRequest = mongoose.models.SongRequest || mongoose.model('SongRequest', requestSchema);

// POST /api/song-requests — submit a request (public)
router.post('/', async (req, res) => {
  try {
    const { title, artist, message, listener } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Le titre est obligatoire.' });

    const request = await SongRequest.create({ title, artist, message, listener });
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/song-requests — list all (admin)
router.get('/', async (req, res) => {
  try {
    const requests = await SongRequest.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, requests });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PATCH /api/song-requests/:id — update status (admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await SongRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Demande introuvable.' });
    res.json({ success: true, request: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/song-requests/:id (admin)
router.delete('/:id', async (req, res) => {
  try {
    await SongRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
