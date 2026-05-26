
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024;
const configuredMaxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10);
const maxFileSize = Math.min(
  Number.isFinite(configuredMaxFileSize) && configuredMaxFileSize > 0
    ? configuredMaxFileSize
    : DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILE_SIZE
);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// File filter - médias uniquement, sans SVG/documents/archives exécutables ou risqués
const fileFilter = (req, file, cb) => {
  const allowedMimeTypesByExtension = {
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.webp': ['image/webp'],
    '.mp3': ['audio/mpeg'],
    '.wav': ['audio/wav', 'audio/x-wav'],
    '.ogg': ['audio/ogg', 'application/ogg'],
    '.m4a': ['audio/mp4', 'audio/x-m4a'],
    '.aac': ['audio/aac', 'audio/aacp'],
    '.flac': ['audio/flac', 'audio/x-flac'],
    '.mp4': ['video/mp4'],
    '.mov': ['video/quicktime'],
    '.webm': ['video/webm']
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = allowedMimeTypesByExtension[ext];

  if (allowedMimeTypes?.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error('Format de fichier non autorisé. Types acceptés: jpg, jpeg, png, gif, webp, mp3, wav, ogg, m4a, aac, flac, mp4, mov, webm.'));
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize,
    files: 10 // Maximum 10 fichiers
  },
  fileFilter: fileFilter
});

// Upload single file
router.post('/', adminAuth , upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier téléchargé' 
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Fichier téléchargé avec succès',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    });

    console.log(`✅ Upload réussi: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);
  } catch (error) {
    console.error('❌ Erreur upload:', error);
    res.status(500).json({ 
      success: false,
      message: 'Échec du téléchargement', 
      error: error.message 
    });
  }
});

// Upload multiple files
router.post('/multiple', adminAuth , upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier téléchargé' 
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: `${files.length} fichier(s) téléchargé(s) avec succès`,
      data: { files }
    });

    console.log(`✅ Upload multiple réussi: ${files.length} fichiers`);
  } catch (error) {
    console.error('❌ Erreur upload multiple:', error);
    res.status(500).json({ 
      success: false,
      message: 'Échec du téléchargement multiple', 
      error: error.message 
    });
  }
});

// Delete file
router.delete('/:filename', adminAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Vérification sécurisée du nom de fichier
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ 
        success: false,
        message: 'Nom de fichier invalide' 
      });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false,
        message: 'Fichier non trouvé' 
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({ 
      success: true,
      message: 'Fichier supprimé avec succès' 
    });

    console.log(`🗑️ Fichier supprimé: ${filename}`);
  } catch (error) {
    console.error('❌ Erreur suppression:', error);
    res.status(500).json({ 
      success: false,
      message: 'Échec de la suppression', 
      error: error.message 
    });
  }
});

// Get file info
router.get('/info/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Vérification sécurisée
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ 
        success: false,
        message: 'Nom de fichier invalide' 
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false,
        message: 'Fichier non trouvé' 
      });
    }

    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      data: {
        filename,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${filename}`,
        extension: path.extname(filename).toLowerCase(),
        type: getFileType(filename)
      }
    });
  } catch (error) {
    console.error('❌ Erreur info fichier:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des informations', 
      error: error.message 
    });
  }
});

// List all uploaded files (admin only)
router.get('/', adminAuth, (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ 
        success: true,
        data: { files: [] }
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type; // 'image', 'audio', 'video', 'document'

    let files = fs.readdirSync(uploadDir)
      .filter(filename => fs.statSync(path.join(uploadDir, filename)).isFile())
      .map(filename => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);
        
        return {
          filename,
          size: stats.size,
          sizeFormatted: formatFileSize(stats.size),
          created: stats.birthtime,
          modified: stats.mtime,
          url: `/uploads/${filename}`,
          extension: path.extname(filename).toLowerCase(),
          type: getFileType(filename)
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created)); // Tri par date de création décroissante

    // Filtrage par type si spécifié
    if (type) {
      files = files.filter(file => file.type === type);
    }

    // Pagination
    const total = files.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFiles = files.slice(startIndex, endIndex);

    res.json({ 
      success: true,
      data: {
        files: paginatedFiles,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('❌ Erreur listage fichiers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors du listage des fichiers', 
      error: error.message 
    });
  }
});

// Get storage statistics
router.get('/stats/storage', adminAuth, (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        data: {
          totalFiles: 0,
          totalSize: 0,
          totalSizeFormatted: '0 B',
          fileTypes: {}
        }
      });
    }

    const files = fs.readdirSync(uploadDir);
    let totalSize = 0;
    const fileTypes = {};

    files.forEach(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
        const type = getFileType(filename);
        fileTypes[type] = (fileTypes[type] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: {
        totalFiles: files.length,
        totalSize,
        totalSizeFormatted: formatFileSize(totalSize),
        fileTypes
      }
    });
  } catch (error) {
    console.error('❌ Erreur stats stockage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques',
      error: error.message
    });
  }
});

// Utility functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return 'image';
  }
  if (['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'].includes(ext)) {
    return 'audio';
  }
  if (['.mp4', '.mov', '.webm'].includes(ext)) {
    return 'video';
  }
  return 'other';
}

// Error handling middleware for multer
router.use((error, req, res, next) => {
  console.error('❌ Erreur Multer:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        message: `Fichier trop volumineux. Taille maximale autorisée: ${formatFileSize(maxFileSize)}.` 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false,
        message: 'Trop de fichiers. Maximum autorisé: 10 fichiers.' 
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        success: false,
        message: 'Champ de fichier inattendu.' 
      });
    }
  }
  
  if (error.message.includes('Format de fichier non autorisé')) {
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }

  res.status(500).json({ 
    success: false,
    message: 'Erreur interne du serveur', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

module.exports = router;
