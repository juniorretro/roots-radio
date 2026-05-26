

// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');
// const { User } = require('../models');
// const { auth } = require('../middleware/auth');

// const router = express.Router();

// // Register with updated validation
// router.post('/register', [
//   body('firstName').trim().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
//   body('lastName').trim().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
//   body('email').isEmail().withMessage('Veuillez entrer un email valide'),
//   body('password')
//     .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
//   body('phone').optional().matches(/^\+?[\d\s-()]+$/).withMessage('Format de téléphone invalide')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         message: 'Erreurs de validation',
//         errors: errors.array() 
//       });
//     }

//     const { firstName, lastName, email, password, phone, newsletter, role = 'user' } = req.body;

//     // Generate username from first and last name
//     const baseUsername = (firstName + lastName).toLowerCase().replace(/\s+/g, '');
//     let username = baseUsername;
//     let counter = 1;

//     // Ensure unique username
//     while (await User.findOne({ username })) {
//       username = `${baseUsername}${counter}`;
//       counter++;
//     }

//     // Check if email already exists
//     let existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(12);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = new User({
//       username,
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       phone: phone || undefined,
//       newsletter: newsletter || false,
//       role: role === 'admin' ? 'admin' : 'user'
//     });

//     await user.save();

//     // Create token
//     const payload = { userId: user.id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

//     res.status(201).json({
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         newsletter: user.newsletter
//       }
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
//   }
// });

// // Login
// router.post('/login', [
//   body('email').isEmail().withMessage('Veuillez entrer un email valide'),
//   body('password').exists().withMessage('Le mot de passe est requis')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         message: 'Données invalides',
//         errors: errors.array() 
//       });
//     }

//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Identifiants invalides' });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Identifiants invalides' });
//     }

//     // Create token
//     const payload = { userId: user.id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         newsletter: user.newsletter
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
//   }
// });

// // Get current user
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     res.json({
//       user: {
//         id: user.id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         newsletter: user.newsletter
//       }
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const passwordPolicy = (field) =>
  body(field)
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  body('email')
    .isEmail().withMessage('Veuillez entrer un email valide'),
  passwordPolicy('password'),
  body('phone').optional().matches(/^\+?[\d\s-()+]+$/).withMessage('Format de téléphone invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Erreurs de validation',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, phone, newsletter } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Générer un username unique
    const baseUsername = (firstName + lastName).toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    let username = baseUsername || 'user';
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || undefined,
      newsletter: newsletter || false,
      role: 'user' // Toujours 'user' à l'inscription — jamais depuis req.body
    });

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        newsletter: user.newsletter
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().withMessage('Veuillez entrer un email valide'),
  body('password').exists().notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Normaliser l'email en lowercase pour matcher la base
    // NE PAS utiliser normalizeEmail() du validator — il transforme certains domaines
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé. Contactez un administrateur.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Mettre à jour lastLogin
    user.lastLogin = new Date();
    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        newsletter: user.newsletter
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/me — Profil utilisateur connecté
// ─────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        newsletter: req.user.newsletter,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ─────────────────────────────────────────
// PUT /api/auth/profile — Modifier le profil
// ─────────────────────────────────────────
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().matches(/^\+?[\d\s-()+]+$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'newsletter'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, select: '-password' }
    );

    res.json({
      message: 'Profil mis à jour',
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        newsletter: user.newsletter
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ─────────────────────────────────────────
// PUT /api/auth/change-password
// ─────────────────────────────────────────
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
  passwordPolicy('newPassword')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
