const express = require('express');
const router = express.Router();
const Emission = require('../models/Emission');
const { Program } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

// ✅ GET /api/emissions - Récupérer toutes les émissions avec leurs hôtes
router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    // Récupérer toutes les émissions (groupées par hôte)
    const emissions = await Emission.find()
      .populate('programId', 'title slug image')
      .sort({ airedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Grouper les émissions par hôte/animateur
    const hostsMap = new Map();

    emissions.forEach(emission => {
      const hostKey = emission.host || 'Inconnu';
      
      if (!hostsMap.has(hostKey)) {
        hostsMap.set(hostKey, {
          id: emission._id,
          name: emission.host,
          photo: emission.cover || '/images/hosts/placeholder.jpg',
          bio: emission.bio || emission.description || '',
          program: emission.programId?.title || emission.category || 'Émission',
          title: emission.category || 'Animateur',
          schedule: emission.schedule || '',
          episodes: []
        });
      }

      // Ajouter l'épisode au host
      hostsMap.get(hostKey).episodes.push({
        id: emission._id.toString(),
        title: emission.title,
        date: emission.airedAt,
        duration: emission.duration ? `${Math.floor(emission.duration / 60)}:${(emission.duration % 60).toString().padStart(2, '0')}` : '00:00:00',
        audioUrl: emission.audioUrl || '/audio/emissions/default.mp3',
        cover: emission.cover || '/images/default-cover.jpg',
        description: emission.description || 'Aucune description'
      });
    });

    // Convertir Map en array
    const hosts = Array.from(hostsMap.values());

    // Compter le total
    const total = await Emission.countDocuments();

    res.json({
      hosts,
      emissions,
      pagination: {
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching emissions:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Erreur lors de la récupération des émissions' 
    });
  }
});

// ✅ GET /api/emissions/:id - Récupérer une émission spécifique
router.get('/:id', async (req, res) => {
  try {
    const emission = await Emission.findById(req.params.id)
      .populate('programId', 'title slug image description');

    if (!emission) {
      return res.status(404).json({ message: 'Émission non trouvée' });
    }

    res.json(emission);
  } catch (error) {
    console.error('Error fetching emission:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/emissions/host/:host - Récupérer les émissions par animateur
router.get('/host/:host', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const emissions = await Emission.find({ host: req.params.host })
      .populate('programId', 'title slug image')
      .sort({ airedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ emissions });
  } catch (error) {
    console.error('Error fetching emissions by host:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/emissions - Créer une nouvelle émission (Admin uniquement)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      host,
      programId,
      description,
      cover,
      duration,
      category,
      audioUrl,
      bio,
      schedule,
      episodes
    } = req.body;

    // Validation
    if (!title || !host) {
      return res.status(400).json({ 
        message: 'Le titre et l\'animateur sont requis' 
      });
    }

    // Créer l'émission
    const emission = new Emission({
      title,
      host,
      programId: programId || null,
      description: description || '',
      cover: cover || '/images/default-emission.png',
      duration: duration || null,
      category: category || 'Émission',
      audioUrl: audioUrl || '',
      bio: bio || '',
      schedule: schedule || '',
      episodes: episodes || []
    });

    await emission.save();

    res.status(201).json({
      message: 'Émission créée avec succès',
      emission
    });
  } catch (error) {
    console.error('Error creating emission:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT /api/emissions/:id - Mettre à jour une émission (Admin uniquement)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const emission = await Emission.findById(req.params.id);
    
    if (!emission) {
      return res.status(404).json({ message: 'Émission non trouvée' });
    }

    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        emission[key] = req.body[key];
      }
    });

    await emission.save();

    res.json({
      message: 'Émission mise à jour avec succès',
      emission
    });
  } catch (error) {
    console.error('Error updating emission:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE /api/emissions/:id - Supprimer une émission (Admin uniquement)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const emission = await Emission.findByIdAndDelete(req.params.id);
    
    if (!emission) {
      return res.status(404).json({ message: 'Émission non trouvée' });
    }

    res.json({ message: 'Émission supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting emission:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/emissions/recent/:limit - Récupérer les émissions récentes
router.get('/recent/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    
    const emissions = await Emission.getRecentHistory(limit);

    res.json({ emissions });
  } catch (error) {
    console.error('Error fetching recent emissions:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/emissions/today - Récupérer les émissions d'aujourd'hui
router.get('/today', async (req, res) => {
  try {
    const emissions = await Emission.getTodayHistory();

    res.json({ emissions });
  } catch (error) {
    console.error('Error fetching today emissions:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;