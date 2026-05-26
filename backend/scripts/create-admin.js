/**
 * createAdmin.js — Script de création de l'admin par défaut
 * 
 * Usage : node scripts/createAdmin.js
 * 
 * Crée ou met à jour un administrateur avec ADMIN_EMAIL et ADMIN_PASSWORD.
 * Si l'admin existe déjà, met à jour son mot de passe et son rôle.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Connexion MongoDB ───
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI ou MONGODB_URI est requis.');
  process.exit(1);
}

const requireStrongPassword = (value, name) => {
  if (!value || value.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    console.error(`❌ ${name} est requis et doit contenir au moins 8 caracteres, une majuscule, une minuscule et un chiffre.`);
    process.exit(1);
  }
};

// ─── Schéma User minimal (identique à ton modèle) ───
// On l'importe directement si possible, sinon on le redéfinit
let User;
try {
  const { User: UserModel } = require('../models');
  User = UserModel;
} catch (e) {
  // Fallback : définir le modèle ici si l'import échoue
  const UserSchema = new mongoose.Schema({
    username:    { type: String, required: true, unique: true },
    firstName:   { type: String, required: true },
    lastName:    { type: String, required: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String, required: true },
    role:        { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive:    { type: Boolean, default: true },
    phone:       { type: String, default: '' },
    newsletter:  { type: Boolean, default: false },
    lastLogin:   { type: Date }
  }, { timestamps: true });

  User = mongoose.models.User || mongoose.model('User', UserSchema);
}

// ─── Données admin par défaut ───
requireStrongPassword(process.env.ADMIN_PASSWORD, 'ADMIN_PASSWORD');

const ADMIN_DATA = {
  email:     process.env.ADMIN_EMAIL || 'roots@radio.com',
  password:  process.env.ADMIN_PASSWORD,
  firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
  lastName:  process.env.ADMIN_LAST_NAME || 'Roots',
  username:  process.env.ADMIN_USERNAME || 'admin',
  role:      'admin',
  isActive:  true
};

async function createAdmin() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à MongoDB');

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, salt);

    // Chercher si l'admin existe déjà
    const existing = await User.findOne({ email: ADMIN_DATA.email });

    if (existing) {
      // Mettre à jour mot de passe + rôle si l'user existe
      existing.password = hashedPassword;
      existing.role     = 'admin';
      existing.isActive = true;
      await existing.save();

      console.log('');
      console.log('🔄 Admin mis à jour :');
      console.log(`   Email    : ${ADMIN_DATA.email}`);
      console.log(`   Rôle     : admin`);
      console.log('');
    } else {
      // Vérifier si le username "admin" est déjà pris
      let username = ADMIN_DATA.username;
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        username = 'adminroots';
      }

      // Créer l'admin
      const admin = new User({
        username,
        firstName:  ADMIN_DATA.firstName,
        lastName:   ADMIN_DATA.lastName,
        email:      ADMIN_DATA.email,
        password:   hashedPassword,
        role:       'admin',
        isActive:   true,
        phone:      '',
        newsletter: false
      });

      await admin.save();

      console.log('');
      console.log('✅ Admin créé avec succès !');
      console.log(`   Email    : ${ADMIN_DATA.email}`);
      console.log(`   Username : ${username}`);
      console.log(`   Rôle     : admin`);
      console.log('');
    }

    console.log('🎯 Tu peux maintenant te connecter sur /login avec ces identifiants.');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur :', error.message);
    if (error.code === 11000) {
      console.error('   Un utilisateur avec cet email ou username existe déjà.');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

createAdmin();
