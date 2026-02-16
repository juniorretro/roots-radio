const express = require('express');
const router = express.Router();
const { User, Program, Episode, Podcast, PlayHistory, Emission } = require('../models');

// ✅ GET /api/stats - Récupérer toutes les statistiques du site
router.get('/', async (req, res) => {
  try {
    // Récupérer les statistiques en parallèle pour plus de performance
    const [
      totalUsers,
      totalPrograms,
      totalEpisodes,
      totalPodcasts,
      totalTracks,
      totalEmissions,
      todayTracks,
      todayEmissions,
      activePrograms,
      featuredPrograms
    ] = await Promise.all([
      User.countDocuments(),
      Program.countDocuments(),
      Episode.countDocuments(),
      Podcast.countDocuments(),
      PlayHistory.countDocuments(),
      Emission.countDocuments(),
      PlayHistory.countDocuments({
        playedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Emission.countDocuments({
        airedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Program.countDocuments({ status: 'active' }),
      Program.countDocuments({ featured: true, status: 'active' })
    ]);

    // Calculer les statistiques d'écoute
    const totalListeningTime = await PlayHistory.aggregate([
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: '$duration' }
        }
      }
    ]);

    const listeningTime = totalListeningTime.length > 0 
      ? totalListeningTime[0].totalSeconds 
      : 0;

    // Top programmes par vues
    const topPrograms = await Program.find({ status: 'active' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views image slug');

    // Top épisodes par vues
    const topEpisodes = await Episode.find({ status: 'aired' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views image programId')
      .populate('programId', 'title');

    // Top podcasts par téléchargements
    const topPodcasts = await Podcast.find({ status: 'published' })
      .sort({ downloads: -1 })
      .limit(5)
      .select('title downloads image');

    // Statistiques par catégorie de programmes
    const programsByCategory = await Program.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Statistiques d'écoute par heure (dernières 24h)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const listeningByHour = await PlayHistory.aggregate([
      {
        $match: {
          playedAt: { $gte: yesterday }
        }
      },
      {
        $group: {
          _id: { $hour: '$playedAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      stats: {
        // Compteurs principaux
        totalListeners: totalUsers,
        totalPrograms,
        totalEpisodes,
        totalPodcasts,
        totalTracks,
        totalEmissions,
        
        // Statistiques du jour
        todayTracks,
        todayEmissions,
        
        // Programmes
        activePrograms,
        featuredPrograms,
        
        // Temps d'écoute total
        listeningTime,
        listeningTimeFormatted: formatDuration(listeningTime),
        
        // Moyennes
        averageTrackDuration: totalTracks > 0 ? Math.floor(listeningTime / totalTracks) : 0,
        
        // Top contenus
        topPrograms,
        topEpisodes,
        topPodcasts,
        
        // Répartitions
        programsByCategory,
        listeningByHour,
        
        // Informations système
        lastUpdate: new Date(),
        isLive: true
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
});

// ✅ GET /api/stats/programs - Statistiques détaillées des programmes
router.get('/programs', async (req, res) => {
  try {
    const totalPrograms = await Program.countDocuments();
    const activePrograms = await Program.countDocuments({ status: 'active' });
    const featuredPrograms = await Program.countDocuments({ featured: true });
    
    const programsByCategory = await Program.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const mostViewedPrograms = await Program.find()
      .sort({ views: -1 })
      .limit(10)
      .select('title views image category');

    res.json({
      total: totalPrograms,
      active: activePrograms,
      featured: featuredPrograms,
      byCategory: programsByCategory,
      mostViewed: mostViewedPrograms
    });
  } catch (error) {
    console.error('Error fetching program stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/stats/episodes - Statistiques des épisodes
router.get('/episodes', async (req, res) => {
  try {
    const totalEpisodes = await Episode.countDocuments();
    const airedEpisodes = await Episode.countDocuments({ status: 'aired' });
    
    const episodesBySeason = await Episode.aggregate([
      {
        $group: {
          _id: '$season',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const mostViewedEpisodes = await Episode.find()
      .sort({ views: -1 })
      .limit(10)
      .select('title views image programId')
      .populate('programId', 'title');

    res.json({
      total: totalEpisodes,
      aired: airedEpisodes,
      bySeason: episodesBySeason,
      mostViewed: mostViewedEpisodes
    });
  } catch (error) {
    console.error('Error fetching episode stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/stats/podcasts - Statistiques des podcasts
router.get('/podcasts', async (req, res) => {
  try {
    const totalPodcasts = await Podcast.countDocuments();
    const publishedPodcasts = await Podcast.countDocuments({ status: 'published' });
    
    const podcastsByCategory = await Podcast.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalDownloads = await Podcast.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$downloads' }
        }
      }
    ]);

    const mostDownloaded = await Podcast.find()
      .sort({ downloads: -1 })
      .limit(10)
      .select('title downloads image category');

    res.json({
      total: totalPodcasts,
      published: publishedPodcasts,
      totalDownloads: totalDownloads.length > 0 ? totalDownloads[0].total : 0,
      byCategory: podcastsByCategory,
      mostDownloaded
    });
  } catch (error) {
    console.error('Error fetching podcast stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/stats/history - Statistiques de l'historique de diffusion
router.get('/history', async (req, res) => {
  try {
    const totalTracks = await PlayHistory.countDocuments();
    const totalEmissions = await Emission.countDocuments();
    
    const todayTracks = await PlayHistory.countDocuments({
      playedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    const todayEmissions = await Emission.countDocuments({
      airedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    // Top artistes
    const topArtists = await PlayHistory.aggregate([
      {
        $group: {
          _id: '$artist',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top titres
    const topTracks = await PlayHistory.aggregate([
      {
        $group: {
          _id: { title: '$title', artist: '$artist' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalTracks,
      totalEmissions,
      todayTracks,
      todayEmissions,
      combined: totalTracks + totalEmissions,
      topArtists,
      topTracks
    });
  } catch (error) {
    console.error('Error fetching history stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/stats/users - Statistiques des utilisateurs
router.get('/users', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });
    const newsletterSubscribers = await User.countDocuments({ newsletter: true });

    // Utilisateurs par rôle
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Inscriptions récentes (7 derniers jours)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      total: totalUsers,
      admins: adminUsers,
      active: activeUsers,
      newsletterSubscribers,
      byRole: usersByRole,
      recentSignups
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fonction utilitaire pour formater la durée
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (secs > 0 || result === '') result += `${secs}s`;
  
  return result.trim();
}

module.exports = router;