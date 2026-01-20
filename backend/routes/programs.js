// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const { Program } = require('../models');
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

// // Get all programs
// router.get('/', async (req, res) => {
//   try {
//     const { day, featured, category, search } = req.query;
//     let query = {};

//     if (day) {
//       query['schedule.day'] = day;
//     }
//     if (featured === 'true') {
//       query.featured = true;
//     }
//     if (category) {
//       query.category = category;
//     }
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { host: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const programs = await Program.find(query).sort({ createdAt: -1 });
//     res.json(programs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get program by ID or slug
// router.get('/:identifier', async (req, res) => {
//   try {
//     const { identifier } = req.params;
    
//     // Try to find by ID first, then by slug
//     let program;
//     if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
//       program = await Program.findById(identifier);
//     } else {
//       program = await Program.findOne({ slug: identifier });
//     }

//     if (!program) {
//       return res.status(404).json({ message: 'Program not found' });
//     }

//     res.json(program);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create program (admin only)
// router.post('/', [
//   adminAuth,
//   body('title').trim().notEmpty().withMessage('Title is required'),
//   body('description').trim().notEmpty().withMessage('Description is required'),
//   body('host').trim().notEmpty().withMessage('Host is required'),
//   body('category').trim().notEmpty().withMessage('Category is required')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { title, description, host, category, schedule, featured, tags, image } = req.body;

//     // Create slug from title
//     const slug = createSlug(title);

//     // Check if slug already exists
//     const existingProgram = await Program.findOne({ slug });
//     if (existingProgram) {
//       return res.status(400).json({ message: 'Program with this title already exists' });
//     }

//     const program = new Program({
//       title,
//       slug,
//       description,
//       host,
//       category,
//       schedule: schedule || [],
//       featured: featured || false,
//       tags: tags || [],
//       image: image || '/uploads/placeholder-program.jpg'
//     });

//     await program.save();

//     // Emit socket event
//     req.app.get('io').emit('programCreated', program);

//     res.status(201).json(program);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update program (admin only)
// router.put('/:id', [
//   adminAuth,
//   body('title').optional().trim().notEmpty(),
//   body('description').optional().trim().notEmpty(),
//   body('host').optional().trim().notEmpty(),
//   body('category').optional().trim().notEmpty()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { title, description, host, category, schedule, featured, tags, image, isActive } = req.body;

//     let program = await Program.findById(req.params.id);
//     if (!program) {
//       return res.status(404).json({ message: 'Program not found' });
//     }

//     // Update slug if title changed
//     if (title && title !== program.title) {
//       const newSlug = createSlug(title);
//       const existingProgram = await Program.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
//       if (existingProgram) {
//         return res.status(400).json({ message: 'Program with this title already exists' });
//       }
//       program.slug = newSlug;
//       program.title = title;
//     }

//     if (description) program.description = description;
//     if (host) program.host = host;
//     if (category) program.category = category;
//     if (schedule) program.schedule = schedule;
//     if (featured !== undefined) program.featured = featured;
//     if (tags) program.tags = tags;
//     if (image) program.image = image;
//     if (isActive !== undefined) program.isActive = isActive;

//     await program.save();

//     // Emit socket event
//     req.app.get('io').emit('programUpdated', program);

//     res.json(program);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete program (admin only)
// router.delete('/:id', adminAuth, async (req, res) => {
//   try {
//     const program = await Program.findById(req.params.id);
//     if (!program) {
//       return res.status(404).json({ message: 'Program not found' });
//     }

//     await Program.findByIdAndDelete(req.params.id);

//     // Emit socket event
//     req.app.get('io').emit('programDeleted', req.params.id);

//     res.json({ message: 'Program deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get current program based on time and day
// router.get('/current/now', async (req, res) => {
//   try {
//     const now = new Date();
//     const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//     const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

//     const programs = await Program.find({
//       'schedule.day': currentDay,
//       isActive: true
//     });

//     let currentProgram = null;

//     for (const program of programs) {
//       const schedule = program.schedule.find(s => s.day === currentDay);
//       if (schedule && currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
//         currentProgram = program;
//         break;
//       }
//     }

//     if (!currentProgram) {
//       return res.json({ message: 'No current program', program: null });
//     }

//     res.json({ program: currentProgram });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get next program
// router.get('/next/upcoming', async (req, res) => {
//   try {
//     const now = new Date();
//     const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//     const currentTime = now.toTimeString().slice(0, 5);

//     const programs = await Program.find({
//       'schedule.day': currentDay,
//       isActive: true
//     });

//     let nextProgram = null;
//     let earliestTime = '24:00';

//     for (const program of programs) {
//       const schedule = program.schedule.find(s => s.day === currentDay);
//       if (schedule && schedule.startTime > currentTime && schedule.startTime < earliestTime) {
//         nextProgram = program;
//         earliestTime = schedule.startTime;
//       }
//     }

//     if (!nextProgram) {
//       return res.json({ message: 'No next program today', program: null });
//     }

//     res.json({ program: nextProgram });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// const express = require('express');
// // const Program = require('../models/Program');
// const { Program } = require('../models');
// const { body, validationResult } = require('express-validator');
// const router = express.Router();

// // utilitaire pour générer un slug
// const createSlug = (title) => {
//   return title
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .replace(/^-+|-+$/g, ''); // supprime les tirets au début/fin
// };

// // Récupérer tous les programmes avec pagination, recherche et filtrage
// router.get('/', async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, category, day } = req.query;

//     let query = {};

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { host: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (category) {
//       query.category = category;
//     }

//     if (day) {
//       query['schedule.day'] = day;
//     }

//     const total = await Program.countDocuments(query);

//     const programs = await Program.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     res.json({
//       programs,
//       pagination: {
//         total,
//         totalPages: Math.ceil(total / limit),
//         currentPage: Number(page),
//         limit: Number(limit)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Récupérer un programme par son slug
// router.get('/:slug', async (req, res) => {
//   try {
//     const program = await Program.findOne({ slug: req.params.slug });
//     if (!program) return res.status(404).json({ message: 'Programme non trouvé' });
//     res.json(program);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Créer un programme
// router.post(
//   '/',
//   [
//     body('title').notEmpty().withMessage('Le titre est requis'),
//     body('description').notEmpty().withMessage('La description est requise'),
//     body('host').notEmpty().withMessage('L’animateur est requis')
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//       const { title, description, host, category, schedule } = req.body;

//       const slug = createSlug(title);

//       const program = new Program({
//         title,
//         description,
//         host,
//         category,
//         slug,
//         schedule
//       });

//       await program.save();

//       res.status(201).json(program);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

// // Mettre à jour un programme
// router.put('/:id', async (req, res) => {
//   try {
//     if (req.body.title) {
//       req.body.slug = createSlug(req.body.title);
//     }

//     const program = await Program.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!program) return res.status(404).json({ message: 'Programme non trouvé' });

//     res.json(program);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Supprimer un programme
// router.delete('/:id', async (req, res) => {
//   try {
//     const program = await Program.findByIdAndDelete(req.params.id);
//     if (!program) return res.status(404).json({ message: 'Programme non trouvé' });

//     res.json({ message: 'Programme supprimé avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Program } = require('../models');
const { body, validationResult } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configuration de multer pour les uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/programs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Autoriser les images et fichiers audio
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp3|wav|ogg|m4a|mp4|mpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image et audio sont autorisés'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limite
  },
  fileFilter: fileFilter
});

// Utilitaire pour générer un slug
const createSlug = (title) => {
  return title
    .toLowerCase()
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

// Récupérer tous les programmes avec pagination, recherche et filtrage
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, day } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { host: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (day) {
      query['schedule.day'] = day;
    }

    const total = await Program.countDocuments(query);

    const programs = await Program.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      programs,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Récupérer un programme par son slug
router.get('/:slug', async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug });
    if (!program) {
      return res.status(404).json({ message: 'Programme non trouvé' });
    }
    res.json(program);
  } catch (error) {
    console.error('Erreur lors de la récupération du programme:', error);
    res.status(500).json({ message: error.message });
  }
});

// Créer un programme avec upload de fichiers
router.post(
  '/',
  adminAuth, // Protection admin
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'jingle', maxCount: 1 },
    { name: 'intro', maxCount: 1 }
  ]),
  [
    body('title').notEmpty().withMessage('Le titre est requis'),
    body('description').notEmpty().withMessage('La description est requise'),
    body('host').notEmpty().withMessage('L\'animateur est requis')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Nettoyer les fichiers uploadés en cas d'erreur de validation
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            fs.unlink(file.path, err => {
              if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });
          });
        }
        return res.status(400).json({ 
          message: 'Erreurs de validation',
          errors: errors.array() 
        });
      }

      const { title, description, host, category, schedule } = req.body;

      const slug = createSlug(title);

      // Vérifier si le slug existe déjà
      const existingProgram = await Program.findOne({ slug });
      if (existingProgram) {
        // Nettoyer les fichiers uploadés
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            fs.unlink(file.path, err => {
              if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });
          });
        }
        return res.status(400).json({ message: 'Un programme avec ce titre existe déjà' });
      }

      // Construire l'objet programme
      const programData = {
        title,
        description,
        host,
        category,
        slug,
        schedule: schedule ? JSON.parse(schedule) : undefined
      };

      // Ajouter les URLs des fichiers uploadés
      if (req.files) {
        if (req.files.image) {
          programData.image = `/uploads/programs/${req.files.image[0].filename}`;
        }
        if (req.files.jingle) {
          programData.jingle = `/uploads/programs/${req.files.jingle[0].filename}`;
        }
        if (req.files.intro) {
          programData.intro = `/uploads/programs/${req.files.intro[0].filename}`;
        }
      }

      const program = new Program(programData);
      await program.save();

      // Emettre un événement socket si disponible
      if (req.app.get('io')) {
        req.app.get('io').emit('programCreated', program);
      }

      res.status(201).json({
        message: 'Programme créé avec succès',
        program,
        uploadedFiles: req.files ? Object.keys(req.files).map(key => ({
          field: key,
          filename: req.files[key][0].filename,
          originalName: req.files[key][0].originalname,
          size: req.files[key][0].size,
          url: `/uploads/programs/${req.files[key][0].filename}`
        })) : []
      });
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error);
      
      // Nettoyer les fichiers uploadés en cas d'erreur
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Erreur lors de la suppression du fichier:', err);
          });
        });
      }
      
      res.status(500).json({ message: 'Erreur serveur lors de la création du programme' });
    }
  }
);

// Mettre à jour un programme avec upload de nouveaux fichiers
router.put(
  '/:id',
  adminAuth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'jingle', maxCount: 1 },
    { name: 'intro', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) {
        // Nettoyer les fichiers uploadés
        if (req.files) {
          Object.values(req.files).flat().forEach(file => {
            fs.unlink(file.path, err => {
              if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });
          });
        }
        return res.status(404).json({ message: 'Programme non trouvé' });
      }

      // Préparer les données de mise à jour
      const updateData = { ...req.body };

      // Mettre à jour le slug si le titre a changé
      if (req.body.title && req.body.title !== program.title) {
        const newSlug = createSlug(req.body.title);
        const existingProgram = await Program.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
        if (existingProgram) {
          // Nettoyer les fichiers uploadés
          if (req.files) {
            Object.values(req.files).flat().forEach(file => {
              fs.unlink(file.path, err => {
                if (err) console.error('Erreur lors de la suppression du fichier:', err);
              });
            });
          }
          return res.status(400).json({ message: 'Un programme avec ce titre existe déjà' });
        }
        updateData.slug = newSlug;
      }

      // Parser le schedule s'il est fourni comme string
      if (updateData.schedule && typeof updateData.schedule === 'string') {
        updateData.schedule = JSON.parse(updateData.schedule);
      }

      // Gérer les nouveaux fichiers uploadés
      const oldFiles = [];
      if (req.files) {
        if (req.files.image) {
          if (program.image && program.image.startsWith('/uploads/')) {
            oldFiles.push(path.join(__dirname, '..', program.image));
          }
          updateData.image = `/uploads/programs/${req.files.image[0].filename}`;
        }
        if (req.files.jingle) {
          if (program.jingle && program.jingle.startsWith('/uploads/')) {
            oldFiles.push(path.join(__dirname, '..', program.jingle));
          }
          updateData.jingle = `/uploads/programs/${req.files.jingle[0].filename}`;
        }
        if (req.files.intro) {
          if (program.intro && program.intro.startsWith('/uploads/')) {
            oldFiles.push(path.join(__dirname, '..', program.intro));
          }
          updateData.intro = `/uploads/programs/${req.files.intro[0].filename}`;
        }
      }

      const updatedProgram = await Program.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      // Supprimer les anciens fichiers
      oldFiles.forEach(filePath => {
        fs.unlink(filePath, err => {
          if (err && err.code !== 'ENOENT') {
            console.error('Erreur lors de la suppression de l\'ancien fichier:', err);
          }
        });
      });

      // Emettre un événement socket si disponible
      if (req.app.get('io')) {
        req.app.get('io').emit('programUpdated', updatedProgram);
      }

      res.json({
        message: 'Programme mis à jour avec succès',
        program: updatedProgram,
        uploadedFiles: req.files ? Object.keys(req.files).map(key => ({
          field: key,
          filename: req.files[key][0].filename,
          originalName: req.files[key][0].originalname,
          size: req.files[key][0].size,
          url: `/uploads/programs/${req.files[key][0].filename}`
        })) : []
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du programme:', error);
      
      // Nettoyer les fichiers uploadés en cas d'erreur
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Erreur lors de la suppression du fichier:', err);
          });
        });
      }
      
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du programme' });
    }
  }
);

// Supprimer un programme
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Programme non trouvé' });
    }

    // Supprimer les fichiers associés
    const filesToDelete = [];
    if (program.image && program.image.startsWith('/uploads/')) {
      filesToDelete.push(path.join(__dirname, '..', program.image));
    }
    if (program.jingle && program.jingle.startsWith('/uploads/')) {
      filesToDelete.push(path.join(__dirname, '..', program.jingle));
    }
    if (program.intro && program.intro.startsWith('/uploads/')) {
      filesToDelete.push(path.join(__dirname, '..', program.intro));
    }

    await Program.findByIdAndDelete(req.params.id);

    // Supprimer les fichiers
    filesToDelete.forEach(filePath => {
      fs.unlink(filePath, err => {
        if (err && err.code !== 'ENOENT') {
          console.error('Erreur lors de la suppression du fichier:', err);
        }
      });
    });

    // Emettre un événement socket si disponible
    if (req.app.get('io')) {
      req.app.get('io').emit('programDeleted', req.params.id);
    }

    res.json({ message: 'Programme supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du programme:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du programme' });
  }
});

// Upload de fichier séparé pour un programme existant
router.post('/:id/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      // Supprimer le fichier uploadé si le programme n'existe pas
      fs.unlink(req.file.path, err => {
        if (err) console.error('Erreur lors de la suppression du fichier:', err);
      });
      return res.status(404).json({ message: 'Programme non trouvé' });
    }

    const fileUrl = `/uploads/programs/${req.file.filename}`;
    
    res.json({
      message: 'Fichier téléchargé avec succès',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement', error: error.message });
  }
});

// Supprimer un fichier spécifique d'un programme
router.delete('/:id/file/:field', adminAuth, async (req, res) => {
  try {
    const { id, field } = req.params;
    
    if (!['image', 'jingle', 'intro'].includes(field)) {
      return res.status(400).json({ message: 'Champ de fichier invalide' });
    }

    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ message: 'Programme non trouvé' });
    }

    if (program[field] && program[field].startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', program[field]);
      
      // Supprimer le fichier du système de fichiers
      fs.unlink(filePath, err => {
        if (err && err.code !== 'ENOENT') {
          console.error('Erreur lors de la suppression du fichier:', err);
        }
      });

      // Mettre à jour le programme pour supprimer la référence au fichier
      program[field] = undefined;
      await program.save();

      res.json({ message: `${field} supprimé avec succès` });
    } else {
      res.status(404).json({ message: 'Fichier non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
  }
});

// Middleware de gestion d'erreur pour multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Fichier trop volumineux. Taille maximum : 100MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Trop de fichiers.' });
    }
  }
  
  if (error.message === 'Seuls les fichiers image et audio sont autorisés') {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: 'Erreur de téléchargement', error: error.message });
});


router.get('/current/now', async (req, res) => {
  const now = new Date();
  const currentProgram = await Program.findOne({
    startTime: { $lte: now },
    endTime: { $gte: now }
  });
  if (!currentProgram) return res.status(404).json({ message: 'Aucun programme en cours' });
  res.json(currentProgram);
});

router.get('/next/upcoming', async (req, res) => {
  const now = new Date();
  const nextProgram = await Program.findOne({ startTime: { $gt: now } }).sort('startTime');
  if (!nextProgram) return res.status(404).json({ message: 'Aucun programme à venir' });
  res.json(nextProgram);
});


module.exports = router;