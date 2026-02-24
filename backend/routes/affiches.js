const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Affiche = require('../models/Affiche');
const { adminAuth } = require('../middleware/auth');

// ─── GET /api/affiches — Affiches actives (public) ───
router.get('/', async (req, res) => {
  try {
    const affiches = await Affiche.getActiveAffiches();
    res.json({ success: true, affiches });
  } catch (error) {
    console.error('Error fetching affiches:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ─── GET /api/affiches/all — Toutes les affiches (admin) ───
router.get('/all', adminAuth, async (req, res) => {
  try {
    const affiches = await Affiche.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, affiches });
  } catch (error) {
    console.error('Error fetching all affiches:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ─── POST /api/affiches — Créer une affiche (admin) ───
router.post('/', adminAuth, [
  body('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('image').trim().notEmpty().withMessage("L'image est requise"),
  body('link').optional().trim(),
  body('linkText').optional().trim().isLength({ max: 50 }),
  body('order').optional().isInt({ min: 0 }),
  body('startDate').optional().isISO8601().withMessage('Date de début invalide'),
  body('endDate').optional().isISO8601().withMessage('Date de fin invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Erreurs de validation', errors: errors.array() });
    }

    const { title, subtitle, image, link, linkText, order, startDate, endDate, isActive } = req.body;

    const affiche = new Affiche({
      title,
      subtitle: subtitle || '',
      image,
      link: link || '',
      linkText: linkText || 'En savoir plus',
      order: order || 0,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: isActive !== undefined ? isActive : true
    });

    await affiche.save();

    // Notifier via Socket.IO
    const io = req.app.get('io');
    if (io) io.emit('afficheCreated', affiche);

    res.status(201).json({ success: true, message: 'Affiche créée avec succès', affiche });
  } catch (error) {
    console.error('Error creating affiche:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ─── PUT /api/affiches/:id — Modifier une affiche (admin) ───
router.put('/:id', adminAuth, [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('subtitle').optional().trim().isLength({ max: 300 }),
  body('image').optional().trim().notEmpty(),
  body('link').optional().trim(),
  body('linkText').optional().trim().isLength({ max: 50 }),
  body('order').optional().isInt({ min: 0 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const affiche = await Affiche.findById(req.params.id);
    if (!affiche) return res.status(404).json({ success: false, message: 'Affiche non trouvée' });

    const allowedFields = ['title', 'subtitle', 'image', 'link', 'linkText', 'order', 'isActive', 'startDate', 'endDate'];
    allowedFields.forEach(key => {
      if (req.body[key] !== undefined) {
        affiche[key] = key === 'startDate' || key === 'endDate'
          ? (req.body[key] ? new Date(req.body[key]) : null)
          : req.body[key];
      }
    });

    await affiche.save();

    const io = req.app.get('io');
    if (io) io.emit('afficheUpdated', affiche);

    res.json({ success: true, message: 'Affiche mise à jour', affiche });
  } catch (error) {
    console.error('Error updating affiche:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ─── DELETE /api/affiches/:id — Supprimer une affiche (admin) ───
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const affiche = await Affiche.findByIdAndDelete(req.params.id);
    if (!affiche) return res.status(404).json({ success: false, message: 'Affiche non trouvée' });

    const io = req.app.get('io');
    if (io) io.emit('afficheDeleted', req.params.id);

    res.json({ success: true, message: 'Affiche supprimée' });
  } catch (error) {
    console.error('Error deleting affiche:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;