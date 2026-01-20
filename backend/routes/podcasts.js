const express = require('express');
const { body, validationResult } = require('express-validator');
const { Podcast } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to create slug
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

// Get all podcasts
router.get('/', async (req, res) => {
  try {
    const { featured, category, search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (featured === 'true') {
      query.featured = true;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { host: { $regex: search, $options: 'i' } }
      ];
    }

    const podcasts = await Podcast.find(query)
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Podcast.countDocuments(query);

    res.json({
      podcasts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get podcast by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let podcast;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      podcast = await Podcast.findById(identifier);
    } else {
      podcast = await Podcast.findOne({ slug: identifier });
    }

    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    res.json(podcast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create podcast (admin only)
router.post('/', [
  adminAuth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('host').trim().notEmpty().withMessage('Host is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('audioUrl').trim().notEmpty().withMessage('Audio URL is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('publishDate').isISO8601().withMessage('Publish date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      description, 
      host, 
      category, 
      audioUrl, 
      duration, 
      publishDate, 
      featured, 
      tags, 
      image 
    } = req.body;

    // Create slug from title
    const slug = createSlug(title);

    // Check if slug already exists
    const existingPodcast = await Podcast.findOne({ slug });
    if (existingPodcast) {
      return res.status(400).json({ message: 'Podcast with this title already exists' });
    }

    const podcast = new Podcast({
      title,
      slug,
      description,
      host,
      category,
      audioUrl,
      duration: parseInt(duration),
      publishDate: new Date(publishDate),
      featured: featured || false,
      tags: tags || [],
      image: image || '/uploads/placeholder-podcast.jpg'
    });

    await podcast.save();

    // Emit socket event
    req.app.get('io').emit('podcastCreated', podcast);

    res.status(201).json(podcast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update podcast (admin only)
router.put('/:id', [
  adminAuth,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('host').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('audioUrl').optional().trim().notEmpty(),
  body('duration').optional().isNumeric(),
  body('publishDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      description, 
      host, 
      category, 
      audioUrl, 
      duration, 
      publishDate, 
      featured, 
      tags, 
      image 
    } = req.body;

    let podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    // Update slug if title changed
    if (title && title !== podcast.title) {
      const newSlug = createSlug(title);
      const existingPodcast = await Podcast.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (existingPodcast) {
        return res.status(400).json({ message: 'Podcast with this title already exists' });
      }
      podcast.slug = newSlug;
      podcast.title = title;
    }

    if (description) podcast.description = description;
    if (host) podcast.host = host;
    if (category) podcast.category = category;
    if (audioUrl) podcast.audioUrl = audioUrl;
    if (duration) podcast.duration = parseInt(duration);
    if (publishDate) podcast.publishDate = new Date(publishDate);
    if (featured !== undefined) podcast.featured = featured;
    if (tags) podcast.tags = tags;
    if (image) podcast.image = image;

    await podcast.save();

    // Emit socket event
    req.app.get('io').emit('podcastUpdated', podcast);

    res.json(podcast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete podcast (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    await Podcast.findByIdAndDelete(req.params.id);

    // Emit socket event
    req.app.get('io').emit('podcastDeleted', req.params.id);

    res.json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    podcast.downloads += 1;
    await podcast.save();

    res.json({ downloads: podcast.downloads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like podcast
router.post('/:id/like', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    podcast.likes += 1;
    await podcast.save();

    res.json({ likes: podcast.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get podcast categories
router.get('/stats/categories', async (req, res) => {
  try {
    const categories = await Podcast.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;