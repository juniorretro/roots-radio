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

    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ message: "Erreur serveur lors de l'authentification." });
  }
};

// Middleware d'authentification admin
// Refactorisé pour chaîner correctement sans Promise manuelle
const adminAuth = (req, res, next) => {
  auth(req, res, (err) => {
    // Si auth a déjà répondu (401/500), on ne fait rien
    if (err) return;

    // À ce stade, req.user est défini
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Accès refusé. Droits administrateur requis.'
      });
    }

    next();
  });
};

// Middleware optionnel pour les routes publiques avec utilisateur optionnel
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        req.user = user || null;
      } catch {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth
};