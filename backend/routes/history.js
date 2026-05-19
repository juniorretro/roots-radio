// const express = require('express');
// const router = express.Router();
// const PlayHistory = require('../models/PlayHistory');

// /**
//  * @route   GET /api/history
//  * @desc    Récupérer l'historique récent
//  * @query   limit - Nombre de morceaux à récupérer (défaut: 50, max: 200)
//  * @access  Public
//  */
// router.get('/', async (req, res) => {
//   try {
//     const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    
//     const history = await PlayHistory.find()
//       .sort({ playedAt: -1 })
//       .limit(limit)
//       .lean();

//     res.json({
//       success: true,
//       count: history.length,
//       history
//     });
//   } catch (error) {
//     console.error('❌ Error fetching history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération de l\'historique'
//     });
//   }
// });

// /**
//  * @route   GET /api/history/today
//  * @desc    Récupérer l'historique d'aujourd'hui
//  * @access  Public
//  */
// router.get('/today', async (req, res) => {
//   try {
//     const history = await PlayHistory.getTodayHistory();

//     res.json({
//       success: true,
//       count: history.length,
//       history
//     });
//   } catch (error) {
//     console.error('❌ Error fetching today history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération de l\'historique du jour'
//     });
//   }
// });

// /**
//  * @route   GET /api/history/latest
//  * @desc    Récupérer le dernier morceau joué
//  * @access  Public
//  */
// router.get('/latest', async (req, res) => {
//   try {
//     const latest = await PlayHistory.findOne()
//       .sort({ playedAt: -1 })
//       .lean();

//     if (!latest) {
//       return res.json({
//         success: true,
//         latest: null
//       });
//     }

//     res.json({
//       success: true,
//       latest
//     });
//   } catch (error) {
//     console.error('❌ Error fetching latest track:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération du dernier morceau'
//     });
//   }
// });

// /**
//  * @route   GET /api/history/stats
//  * @desc    Récupérer les statistiques de l'historique
//  * @access  Public
//  */
// router.get('/stats', async (req, res) => {
//   try {
//     const stats = await PlayHistory.getStats();

//     res.json({
//       success: true,
//       stats
//     });
//   } catch (error) {
//     console.error('❌ Error fetching stats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération des statistiques'
//     });
//   }
// });

// /**
//  * @route   GET /api/history/search
//  * @desc    Rechercher dans l'historique
//  * @query   q - Terme de recherche (artiste ou titre)
//  * @query   limit - Nombre de résultats (défaut: 20)
//  * @access  Public
//  */
// router.get('/search', async (req, res) => {
//   try {
//     const query = req.query.q;
//     const limit = Math.min(parseInt(req.query.limit) || 20, 100);

//     if (!query || query.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         message: 'Terme de recherche requis'
//       });
//     }

//     const searchRegex = new RegExp(query, 'i');

//     const results = await PlayHistory.find({
//       $or: [
//         { title: searchRegex },
//         { artist: searchRegex },
//         { album: searchRegex }
//       ]
//     })
//       .sort({ playedAt: -1 })
//       .limit(limit)
//       .lean();

//     res.json({
//       success: true,
//       count: results.length,
//       results
//     });
//   } catch (error) {
//     console.error('❌ Error searching history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la recherche'
//     });
//   }
// });

// /**
//  * @route   DELETE /api/history/clean
//  * @desc    Nettoyer l'historique ancien (admin uniquement)
//  * @query   days - Nombre de jours à conserver (défaut: 30)
//  * @access  Private (Admin)
//  */
// router.delete('/clean', async (req, res) => {
//   try {
//     // TODO: Ajouter middleware d'authentification admin
//     const daysToKeep = parseInt(req.query.days) || 30;
    
//     const result = await PlayHistory.cleanOldHistory(daysToKeep);

//     res.json({
//       success: true,
//       message: `${result.deletedCount} entrées supprimées`,
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     console.error('❌ Error cleaning history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors du nettoyage de l\'historique'
//     });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const PlayHistory = require('../models/PlayHistory');
const { adminAuth } = require('../middleware/auth');

// Exclut les entrées contenant des mots-clés de jingles/pubs
const JINGLE_FILTER = {
  title: { $not: /jingle|jingles|pub |publicité|spot|promo|annonce|commercial/i }
};

/**
 * @route   GET /api/history
 * @desc    Récupérer l'historique récent
 * @query   limit - Nombre de morceaux à récupérer (défaut: 50, max: 100)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const history = await PlayHistory.find(JINGLE_FILTER)
      .sort({ playedAt: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'historique"
    });
  }
});

/**
 * @route   GET /api/history/today
 * @desc    Récupérer l'historique d'aujourd'hui
 * @access  Public
 */
router.get('/today', async (req, res) => {
  try {
    const history = await PlayHistory.getTodayHistory();

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('❌ Error fetching today history:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'historique du jour"
    });
  }
});

/**
 * @route   GET /api/history/latest
 * @desc    Récupérer le dernier morceau joué
 * @access  Public
 */
router.get('/latest', async (req, res) => {
  try {
    const latest = await PlayHistory.findOne(JINGLE_FILTER)
      .sort({ playedAt: -1 })
      .lean();

    res.json({
      success: true,
      latest: latest || null
    });
  } catch (error) {
    console.error('❌ Error fetching latest track:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du dernier morceau'
    });
  }
});

/**
 * @route   GET /api/history/stats
 * @desc    Récupérer les statistiques de l'historique
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await PlayHistory.getStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

/**
 * @route   GET /api/history/search
 * @desc    Rechercher dans l'historique
 * @query   q - Terme de recherche (artiste ou titre)
 * @query   limit - Nombre de résultats (défaut: 20, max: 100)
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Terme de recherche requis'
      });
    }

    // Limite la longueur du terme de recherche pour éviter les abus
    if (query.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Terme de recherche trop long (max 100 caractères)'
      });
    }

    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const results = await PlayHistory.find({
      $or: [
        { title: searchRegex },
        { artist: searchRegex },
        { album: searchRegex }
      ]
    })
      .sort({ playedAt: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('❌ Error searching history:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche'
    });
  }
});

/**
 * @route   DELETE /api/history/clean
 * @desc    Nettoyer l'historique ancien
 * @query   days - Nombre de jours à conserver (défaut: 30)
 * @access  Private (Admin) ← CORRIGÉ
 */
router.delete('/clean', adminAuth, async (req, res) => {
  try {
    const daysToKeep = parseInt(req.query.days) || 30;

    if (daysToKeep < 1 || daysToKeep > 365) {
      return res.status(400).json({
        success: false,
        message: 'La valeur de "days" doit être entre 1 et 365'
      });
    }

    const result = await PlayHistory.cleanOldHistory(daysToKeep);

    res.json({
      success: true,
      message: `${result.deletedCount} entrées supprimées`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Error cleaning history:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du nettoyage de l'historique"
    });
  }
});

module.exports = router;