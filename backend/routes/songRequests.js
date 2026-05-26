const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
const { adminAuth } = require('../middleware/auth');

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
router.post('/', [
  body('title').trim().notEmpty().withMessage('Le titre est obligatoire.').isLength({ max: 200 }),
  body('artist').optional().trim().isLength({ max: 200 }),
  body('message').optional().trim().isLength({ max: 500 }),
  body('listener').optional().trim().isLength({ max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, artist, message, listener } = req.body;

    const request = await SongRequest.create({ title, artist, message, listener });
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/song-requests — list all (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = await SongRequest.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, requests });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PATCH /api/song-requests/:id — update status (admin)
router.patch('/:id', adminAuth, [
  param('id').isMongoId().withMessage('ID invalide.'),
  body('status').isIn(['pending', 'played', 'declined']).withMessage('Statut invalide.'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { status } = req.body;
    const updated = await SongRequest.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Demande introuvable.' });
    res.json({ success: true, request: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/song-requests/:id (admin)
router.delete('/:id', adminAuth, [
  param('id').isMongoId().withMessage('ID invalide.'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    await SongRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
