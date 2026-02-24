/**
 * createAdmin.js — Script de création de l'admin par défaut
 * 
 * Usage : node scripts/createAdmin.js
 * 
 * Crée l'utilisateur admin roots@radio.com / admin123
 * Si l'admin existe déjà, met à jour son mot de passe et son rôle.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Connexion MongoDB ───
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/roots-radio';

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
const ADMIN_DATA = {
  email:     'roots@radio.com',
  password:  'admin123',
  firstName: 'Admin',
  lastName:  'Roots',
  username:  'admin',
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
      console.log(`   Password : ${ADMIN_DATA.password}`);
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
      console.log(`   Password : ${ADMIN_DATA.password}`);
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