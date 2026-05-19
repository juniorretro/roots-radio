/**
 * update-admin-prod.js — Met à jour les identifiants admin en production
 *
 * Usage (depuis Render Shell) :
 *   node scripts/update-admin-prod.js
 *
 * ⚠️  Supprimer ce fichier après utilisation.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI ou MONGODB_URI manquant');
  process.exit(1);
}

const NEW_EMAIL    = 'admin-roots@gmail.com';
const NEW_PASSWORD = 'Roots@radio2026';
const NEW_USERNAME = 'adminroots';

const UserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  isActive:   { type: Boolean, default: true },
  phone:      { type: String, default: '' },
  newsletter: { type: Boolean, default: false },
  lastLogin:  { type: Date }
}, { timestamps: true });

async function run() {
  console.log('🔌 Connexion à MongoDB Atlas...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connecté');

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  // Chercher l'admin existant (par rôle ou par ancien email)
  let admin = await User.findOne({ role: 'admin' });

  if (!admin) {
    console.log('⚠️  Aucun admin trouvé — création d\'un nouvel admin...');
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(NEW_PASSWORD, salt);

    admin = new User({
      username:  NEW_USERNAME,
      firstName: 'Admin',
      lastName:  'Roots',
      email:     NEW_EMAIL,
      password:  hashed,
      role:      'admin',
      isActive:  true,
    });
    await admin.save();
    console.log('✅ Nouvel admin créé');
  } else {
    console.log(`📋 Admin trouvé : ${admin.email} (${admin.username})`);

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(NEW_PASSWORD, salt);

    admin.email    = NEW_EMAIL;
    admin.password = hashed;
    admin.username = NEW_USERNAME;
    admin.isActive = true;
    admin.role     = 'admin';

    await admin.save();
    console.log('✅ Admin mis à jour');
  }

  console.log('');
  console.log('🎯 Identifiants de connexion :');
  console.log(`   Email    : ${NEW_EMAIL}`);
  console.log(`   Password : ${NEW_PASSWORD}`);
  console.log('');
  console.log('⚠️  Supprime ce fichier maintenant : rm scripts/update-admin-prod.js');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
