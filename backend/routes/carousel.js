const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const Carousel = require('../models/Carousel');
const { adminAuth } = require('../middleware/auth');

// GET /api/carousel?type=artist|hero  (public)
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    const items = await Carousel.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/carousel/all  (admin — tous, actifs et inactifs)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const items = await Carousel.find(filter).sort({ type: 1, order: 1 }).lean();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/carousel  (admin)
router.post('/', adminAuth, [
  body('type').isIn(['artist', 'hero']).withMessage('type doit être artist ou hero'),
  body('image').trim().notEmpty().withMessage("L'image est requise"),
  body('name').optional().trim().isLength({ max: 100 }),
  body('subtitle').optional().trim().isLength({ max: 100 }),
  body('order').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { type, name, subtitle, image, order, isActive } = req.body;
    const item = await Carousel.create({ type, name, subtitle, image, order: order || 0, isActive: isActive !== false });
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/carousel/:id  (admin)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ max: 100 }),
  body('subtitle').optional().trim().isLength({ max: 100 }),
  body('image').optional().trim().notEmpty(),
  body('order').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const fields = ['name', 'subtitle', 'image', 'order', 'isActive'];
    const updates = {};
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const item = await Carousel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Élément introuvable' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/carousel/:id  (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Carousel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Élément introuvable' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
