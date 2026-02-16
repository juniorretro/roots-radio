const express = require('express');
const router = express.Router();
const PlayHistory = require('../models/playHistory');
const Emission = require('../models/Emission');
const { adminAuth, optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/combined-history
 * @desc    Récupérer l'historique combiné (musique + émissions)
 * @query   limit - Nombre d'éléments (défaut: 50, max: 200)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    
    // Récupérer les morceaux
    const tracks = await PlayHistory.find()
      .sort({ playedAt: -1 })
      .limit(limit)
      .lean();

    // Récupérer les émissions
    const emissions = await Emission.find()
      .populate('programId', 'title slug image')
      .sort({ airedAt: -1 })
      .limit(limit)
      .lean();

    // Combiner et formater
    const combined = [
      ...tracks.map(t => ({
        _id: t._id,
        type: 'track',
        title: t.title,
        artist: t.artist,
        cover: t.cover,
        album: t.album,
        genre: t.genre,
        playedAt: t.playedAt,
        listeners: t.listeners || 0
      })),
      ...emissions.map(e => ({
        _id: e._id,
        type: 'emission',
        title: e.title,
        host: e.host,
        cover: e.cover,
        programId: e.programId,
        description: e.description,
        playedAt: e.airedAt,
        listeners: e.listeners || 0,
        duration: e.duration,
        category: e.category
      }))
    ];

    // Trier par date décroissante
    combined.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

    // Limiter au nombre demandé
    const limited = combined.slice(0, limit);

    res.json({
      success: true,
      count: limited.length,
      history: limited
    });
  } catch (error) {
    console.error('❌ Error fetching combined history:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

/**
 * @route   GET /api/combined-history/today
 * @desc    Récupérer l'historique d'aujourd'hui
 * @access  Public
 */
router.get('/today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const tracks = await PlayHistory.find({
      playedAt: { $gte: startOfDay }
    })
      .sort({ playedAt: -1 })
      .lean();

    const emissions = await Emission.find({
      airedAt: { $gte: startOfDay }
    })
      .populate('programId', 'title slug image')
      .sort({ airedAt: -1 })
      .lean();

    const combined = [
      ...tracks.map(t => ({
        _id: t._id,
        type: 'track',
        title: t.title,
        artist: t.artist,
        cover: t.cover,
        album: t.album,
        genre: t.genre,
        playedAt: t.playedAt,
        listeners: t.listeners || 0
      })),
      ...emissions.map(e => ({
        _id: e._id,
        type: 'emission',
        title: e.title,
        host: e.host,
        cover: e.cover,
        programId: e.programId,
        description: e.description,
        playedAt: e.airedAt,
        listeners: e.listeners || 0,
        duration: e.duration,
        category: e.category
      }))
    ];

    combined.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));

    res.json({
      success: true,
      count: combined.length,
      history: combined
    });
  } catch (error) {
    console.error('❌ Error fetching today history:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique du jour'
    });
  }
});

/**
 * @route   POST /api/combined-history/emission
 * @desc    Ajouter une émission à l'historique
 * @access  Admin
 */
router.post('/emission', adminAuth, async (req, res) => {
  try {
    const { title, programId, host, cover, duration, listeners, category, description } = req.body;

    if (!title || !host) {
      return res.status(400).json({
        success: false,
        message: 'Titre et animateur requis'
      });
    }

    const emission = await Emission.addToHistory({
      title,
      programId,
      host,
      cover,
      duration,
      listeners,
      category,
      description
    });

    res.json({
      success: true,
      emission
    });
  } catch (error) {
    console.error('❌ Error adding emission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'émission'
    });
  }
});

/**
 * @route   PUT /api/combined-history/emission/:id
 * @desc    Modifier une émission
 * @access  Admin
 */
router.put('/emission/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const emission = await Emission.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('programId', 'title slug image');

    if (!emission) {
      return res.status(404).json({
        success: false,
        message: 'Émission non trouvée'
      });
    }

    res.json({
      success: true,
      emission
    });
  } catch (error) {
    console.error('❌ Error updating emission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification'
    });
  }
});

/**
 * @route   DELETE /api/combined-history/emission/:id
 * @desc    Supprimer une émission
 * @access  Admin
 */
router.delete('/emission/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const emission = await Emission.findByIdAndDelete(id);

    if (!emission) {
      return res.status(404).json({
        success: false,
        message: 'Émission non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Émission supprimée'
    });
  } catch (error) {
    console.error('❌ Error deleting emission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

/**
 * @route   DELETE /api/combined-history/track/:id
 * @desc    Supprimer un morceau
 * @access  Admin
 */
router.delete('/track/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const track = await PlayHistory.findByIdAndDelete(id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Morceau non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Morceau supprimé'
    });
  } catch (error) {
    console.error('❌ Error deleting track:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

/**
 * @route   GET /api/combined-history/stats
 * @desc    Statistiques de l'historique
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const [trackCount, emissionCount] = await Promise.all([
      PlayHistory.countDocuments(),
      Emission.countDocuments()
    ]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayTracks, todayEmissions] = await Promise.all([
      PlayHistory.countDocuments({ playedAt: { $gte: startOfDay } }),
      Emission.countDocuments({ airedAt: { $gte: startOfDay } })
    ]);

    res.json({
      success: true,
      stats: {
        totalTracks: trackCount,
        totalEmissions: emissionCount,
        total: trackCount + emissionCount,
        todayTracks,
        todayEmissions,
        today: todayTracks + todayEmissions
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;