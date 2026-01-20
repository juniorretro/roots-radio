// const jwt = require('jsonwebtoken');
// const { User } = require('../models');

// // Auth middleware
// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) {
//       return res.status(401).json({ message: 'Token is not valid' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// // Admin middleware
// const adminAuth = async (req, res, next) => {
//   try {
//     await auth(req, res, () => {
//       if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: 'Access denied. Admin required.' });
//       }
//       next();
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { auth, adminAuth };

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware d'authentification générale
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token invalide. Utilisateur non trouvé.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
  }
};

// Middleware d'authentification admin
const adminAuth = async (req, res, next) => {
  try {
    // Vérification de l'authentification de base
    await new Promise((resolve, reject) => {
      auth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Vérification du rôle admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Accès refusé. Droits administrateur requis.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'authentification admin.' });
  }
};

// Middleware optionnel pour les routes publiques avec utilisateur optionnel
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        req.user = user;
      } catch (error) {
        // Token invalide ou expiré, mais on continue sans utilisateur
        req.user = null;
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth
};