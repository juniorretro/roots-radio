const express = require('express');
const router = express.Router();
const { 
  cleanExistingHistory, 
  addToBlacklist,
  calculateMusicConfidenceScore 
} = require('../services/adFilter');
const PlayHistory = require('../models/PlayHistory');
const { adminAuth } = require('../middleware/auth');


/**
 * @route   POST /api/admin/history/clean-ads
 * @desc    Nettoyer l'historique des publicités
 * @access  Private (Admin)
 */
router.post('/clean-ads', adminAuth, async (req, res) => {
  try {
    // TODO: Ajouter middleware auth admin
    
    const result = await cleanExistingHistory(PlayHistory);
    
    res.json({
      success: true,
      message: `${result.deleted} publicités supprimées`,
      deleted: result.deleted
    });
  } catch (error) {
    console.error('❌ Error cleaning ads:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du nettoyage des publicités'
    });
  }
});

/**
 * @route   POST /api/admin/history/add-blacklist
 * @desc    Ajouter un mot-clé à la liste noire
 * @access  Private (Admin)
 */
router.post('/add-blacklist', adminAuth, async (req, res) => {
  try {
    const { keyword, type } = req.body;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Mot-clé requis'
      });
    }
    
    addToBlacklist(keyword, type || 'keyword');
    
    res.json({
      success: true,
      message: `"${keyword}" ajouté à la liste noire (${type || 'keyword'})`
    });
  } catch (error) {
    console.error('❌ Error adding to blacklist:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout à la liste noire'
    });
  }
});

/**
 * @route   POST /api/admin/history/analyze-track
 * @desc    Analyser un track pour voir son score de confiance
 * @access  Private (Admin)
 */
router.post('/analyze-track', adminAuth, async (req, res) => {
  try {
    const trackData = req.body;
    
    const score = calculateMusicConfidenceScore(trackData);
    
    res.json({
      success: true,
      score,
      isMusic: score >= 50,
      details: {
        title: trackData.title,
        artist: trackData.artist,
        album: trackData.album,
        genre: trackData.genre,
        cover: trackData.cover
      }
    });
  } catch (error) {
    console.error('❌ Error analyzing track:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'analyse'
    });
  }
});

/**
 * @route   GET /api/admin/history/suspicious
 * @desc    Récupérer les tracks suspects (score faible)
 * @access  Private (Admin)
 */
router.get('/suspicious', adminAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const minScore = parseInt(req.query.minScore) || 0;
    const maxScore = parseInt(req.query.maxScore) || 50;
    
    const history = await PlayHistory.find()
      .sort({ playedAt: -1 })
      .limit(limit * 2) // Récupérer plus pour filtrer
      .lean();
    
    // Analyser et filtrer
    const suspicious = history
      .map(track => ({
        ...track,
        score: calculateMusicConfidenceScore(track)
      }))
      .filter(track => track.score >= minScore && track.score <= maxScore)
      .slice(0, limit);
    
    res.json({
      success: true,
      count: suspicious.length,
      tracks: suspicious
    });
  } catch (error) {
    console.error('❌ Error fetching suspicious tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération'
    });
  }
});

/**
 * @route   DELETE /api/admin/history/:id
 * @desc    Supprimer manuellement un track de l'historique
 * @access  Private (Admin)
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await PlayHistory.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Track non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Track supprimé',
      deleted
    });
  } catch (error) {
    console.error('❌ Error deleting track:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

module.exports = router;