// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const { Episode, Program } = require('../models');
// const { auth, adminAuth } = require('../middleware/auth');

// const router = express.Router();

// // Helper function to create slug
// const createSlug = (title) => {
//   return title.toLowerCase()
//     .replace(/[àáâãäå]/g, 'a')
//     .replace(/[èéêë]/g, 'e')
//     .replace(/[ìíîï]/g, 'i')
//     .replace(/[òóôõö]/g, 'o')
//     .replace(/[ùúûü]/g, 'u')
//     .replace(/[ç]/g, 'c')
//     .replace(/[ñ]/g, 'n')
//     .replace(/[^a-z0-9 -]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .trim('-');
// };

// // Get all episodes
// router.get('/', async (req, res) => {
//   try {
//     const { programId, featured, search, page = 1, limit = 10 } = req.query;
//     let query = {};

//     if (programId) {
//       query.programId = programId;
//     }
//     if (featured === 'true') {
//       query.featured = true;
//     }
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const episodes = await Episode.find(query)
//       .populate('programId', 'title slug host')
//       .sort({ airDate: -1 })
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Episode.countDocuments(query);

//     res.json({
//       episodes,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         total
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get episode by ID or slug
// router.get('/:identifier', async (req, res) => {
//   try {
//     const { identifier } = req.params;
    
//     let episode;
//     if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
//       episode = await Episode.findById(identifier).populate('programId', 'title slug host');
//     } else {
//       episode = await Episode.findOne({ slug: identifier }).populate('programId', 'title slug host');
//     }

//     if (!episode) {
//       return res.status(404).json({ message: 'Episode not found' });
//     }

//     res.json(episode);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create episode (admin only)
// router.post('/', [
//   adminAuth,
//   body('title').trim().notEmpty().withMessage('Title is required'),
//   body('description').trim().notEmpty().withMessage('Description is required'),
//   body('programId').notEmpty().withMessage('Program ID is required'),
//   body('audioUrl').trim().notEmpty().withMessage('Audio URL is required'),
//   body('duration').isNumeric().withMessage('Duration must be a number'),
//   body('airDate').isISO8601().withMessage('Air date must be a valid date'),
//   body('episodeNumber').isNumeric().withMessage('Episode number must be a number')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { 
//       title, 
//       description, 
//       programId, 
//       audioUrl, 
//       duration, 
//       airDate, 
//       season, 
//       episodeNumber, 
//       featured, 
//       tags, 
//       image 
//     } = req.body;

//     // Check if program exists
//     const program = await Program.findById(programId);
//     if (!program) {
//       return res.status(400).json({ message: 'Program not found' });
//     }

//     // Create slug from title
//     const slug = createSlug(`${title}-ep${episodeNumber}`);

//     // Check if slug already exists
//     const existingEpisode = await Episode.findOne({ slug });
//     if (existingEpisode) {
//       return res.status(400).json({ message: 'Episode with this title already exists' });
//     }

//     const episode = new Episode({
//       title,
//       slug,
//       description,
//       programId,
//       audioUrl,
//       duration: parseInt(duration),
//       airDate: new Date(airDate),
//       season: season || 1,
//       episodeNumber: parseInt(episodeNumber),
//       featured: featured || false,
//       tags: tags || [],
//       image: image || '/uploads/placeholder-episode.jpg'
//     });

//     await episode.save();

//     // Populate program info
//     await episode.populate('programId', 'title slug host');

//     // Emit socket event
//     req.app.get('io').emit('episodeCreated', episode);

//     res.status(201).json(episode);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update episode (admin only)
// router.put('/:id', [
//   adminAuth,
//   body('title').optional().trim().notEmpty(),
//   body('description').optional().trim().notEmpty(),
//   body('audioUrl').optional().trim().notEmpty(),
//   body('duration').optional().isNumeric(),
//   body('airDate').optional().isISO8601(),
//   body('episodeNumber').optional().isNumeric()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { 
//       title, 
//       description, 
//       audioUrl, 
//       duration, 
//       airDate, 
//       season, 
//       episodeNumber, 
//       featured, 
//       tags, 
//       image 
//     } = req.body;

//     let episode = await Episode.findById(req.params.id);
//     if (!episode) {
//       return res.status(404).json({ message: 'Episode not found' });
//     }

//     // Update slug if title or episode number changed
//     if ((title && title !== episode.title) || (episodeNumber && episodeNumber !== episode.episodeNumber)) {
//       const newTitle = title || episode.title;
//       const newEpisodeNumber = episodeNumber || episode.episodeNumber;
//       const newSlug = createSlug(`${newTitle}-ep${newEpisodeNumber}`);
      
//       const existingEpisode = await Episode.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
//       if (existingEpisode) {
//         return res.status(400).json({ message: 'Episode with this title already exists' });
//       }
//       episode.slug = newSlug;
//     }

//     if (title) episode.title = title;
//     if (description) episode.description = description;
//     if (audioUrl) episode.audioUrl = audioUrl;
//     if (duration) episode.duration = parseInt(duration);
//     if (airDate) episode.airDate = new Date(airDate);
//     if (season) episode.season = season;
//     if (episodeNumber) episode.episodeNumber = parseInt(episodeNumber);
//     if (featured !== undefined) episode.featured = featured;
//     if (tags) episode.tags = tags;
//     if (image) episode.image = image;

//     await episode.save();
//     await episode.populate('programId', 'title slug host');

//     // Emit socket event
//     req.app.get('io').emit('episodeUpdated', episode);

//     res.json(episode);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// // const { adminAuth } = require('../middleware/auth'); 

// // Delete episode (admin only)
// router.delete('/:id', adminAuth, async (req, res) => {
//   try {
//     const episode = await Episode.findById(req.params.id);
//     if (!episode) {
//       return res.status(404).json({ message: 'Episode not found' });
//     }

//     await Episode.findByIdAndDelete(req.params.id);

//     // Emit socket event
//     req.app.get('io').emit('episodeDeleted', req.params.id);

//     res.json({ message: 'Episode deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get episodes by program slug
// router.get('/program/:slug', async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const { page = 1, limit = 10 } = req.query;

//     // Find program by slug
//     const program = await Program.findOne({ slug });
//     if (!program) {
//       return res.status(404).json({ message: 'Program not found' });
//     }

//     const episodes = await Episode.find({ programId: program._id })
//       .populate('programId', 'title slug host')
//       .sort({ airDate: -1 })
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Episode.countDocuments({ programId: program._id });

//     res.json({
//       episodes,
//       program: {
//         id: program._id,
//         title: program.title,
//         slug: program.slug,
//         host: program.host
//       },
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         total
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const { Episode, Program } = require('../models');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

const createSlug = (title) => {
  return title.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Validation audioUrl : chemin local ou URL https uniquement
const audioUrlValidator = body('audioUrl')
  .trim()
  .notEmpty().withMessage('Audio URL is required')
  .matches(/^(\/uploads\/|https:\/\/)/).withMessage('audioUrl doit être un chemin /uploads/ ou une URL https://');

// Get all episodes
router.get('/', async (req, res) => {
  try {
    const { programId, featured, search } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    let query = {};
    if (programId) query.programId = programId;
    if (featured === 'true') query.featured = true;
    if (search) {
      // Échapper les caractères spéciaux regex
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    const [episodes, total] = await Promise.all([
      Episode.find(query)
        .populate('programId', 'title slug host')
        .sort({ airDate: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      Episode.countDocuments(query)
    ]);

    res.json({
      episodes,
      pagination: { current: page, pages: Math.ceil(total / limit), total }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get episode by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let episode;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      episode = await Episode.findById(identifier).populate('programId', 'title slug host');
    } else {
      episode = await Episode.findOne({ slug: identifier }).populate('programId', 'title slug host');
    }

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    res.json(episode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create episode (admin only)
router.post('/', [
  adminAuth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('programId').notEmpty().isMongoId().withMessage('Program ID is required'),
  audioUrlValidator,
  body('duration').isInt({ min: 60 }).withMessage('Duration must be at least 60 seconds'),
  body('airDate').isISO8601().withMessage('Air date must be a valid date'),
  body('episodeNumber').isInt({ min: 1 }).withMessage('Episode number must be a positive integer'),
  body('season').optional().isInt({ min: 1 }),
  body('image').optional().trim().matches(/^(\/|https?:\/\/)/).withMessage('Image URL invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, programId, audioUrl, duration, airDate, season, episodeNumber, featured, tags, image } = req.body;

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(400).json({ message: 'Program not found' });
    }

    const slug = createSlug(`${title}-ep${episodeNumber}`);
    const existingEpisode = await Episode.findOne({ slug });
    if (existingEpisode) {
      return res.status(400).json({ message: 'Episode with this title already exists' });
    }

    const episode = new Episode({
      title,
      slug,
      description,
      programId,
      audioUrl,
      duration: parseInt(duration),
      airDate: new Date(airDate),
      season: season || 1,
      episodeNumber: parseInt(episodeNumber),
      featured: featured || false,
      tags: tags || [],
      image: image || '/uploads/placeholder-episode.jpg'
    });

    await episode.save();
    await episode.populate('programId', 'title slug host');

    req.app.get('io').emit('episodeCreated', episode);

    res.status(201).json(episode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update episode (admin only)
router.put('/:id', [
  adminAuth,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('audioUrl').optional().trim().matches(/^(\/uploads\/|https:\/\/)/).withMessage('audioUrl invalide'),
  body('duration').optional().isInt({ min: 60 }),
  body('airDate').optional().isISO8601(),
  body('episodeNumber').optional().isInt({ min: 1 }),
  body('image').optional().trim().matches(/^(\/|https?:\/\/)/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, audioUrl, duration, airDate, season, episodeNumber, featured, tags, image } = req.body;

    let episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    if ((title && title !== episode.title) || (episodeNumber && episodeNumber !== episode.episodeNumber)) {
      const newTitle = title || episode.title;
      const newEpisodeNumber = episodeNumber || episode.episodeNumber;
      const newSlug = createSlug(`${newTitle}-ep${newEpisodeNumber}`);

      const existingEpisode = await Episode.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (existingEpisode) {
        return res.status(400).json({ message: 'Episode with this title already exists' });
      }
      episode.slug = newSlug;
    }

    if (title) episode.title = title;
    if (description) episode.description = description;
    if (audioUrl) episode.audioUrl = audioUrl;
    if (duration) episode.duration = parseInt(duration);
    if (airDate) episode.airDate = new Date(airDate);
    if (season) episode.season = season;
    if (episodeNumber) episode.episodeNumber = parseInt(episodeNumber);
    if (featured !== undefined) episode.featured = featured;
    if (tags) episode.tags = tags;
    if (image) episode.image = image;

    await episode.save();
    await episode.populate('programId', 'title slug host');

    req.app.get('io').emit('episodeUpdated', episode);

    res.json(episode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete episode (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    await Episode.findByIdAndDelete(req.params.id);
    req.app.get('io').emit('episodeDeleted', req.params.id);

    res.json({ message: 'Episode deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get episodes by program slug
router.get('/program/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const program = await Program.findOne({ slug });
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const [episodes, total] = await Promise.all([
      Episode.find({ programId: program._id })
        .populate('programId', 'title slug host')
        .sort({ airDate: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      Episode.countDocuments({ programId: program._id })
    ]);

    res.json({
      episodes,
      program: { id: program._id, title: program.title, slug: program.slug, host: program.host },
      pagination: { current: page, pages: Math.ceil(total / limit), total }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;