/**
 * fixAdmin.js — Diagnostic + correction de l'admin
 * 
 * Usage: node fixAdmin.js
 * 
 * Ce script :
 * 1. Détecte la bonne variable d'env MongoDB (MONGODB_URI ou MONGO_URI)
 * 2. Liste tous les users existants
 * 3. Supprime l'admin cassé s'il existe
 * 4. Recrée l'admin correctement avec ADMIN_EMAIL et ADMIN_PASSWORD
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── 1. Gérer MONGODB_URI ou MONGO_URI (les deux noms sont utilisés dans ton projet) ───
const MONGO_URI =
  process.env.MONGODB_URI ||   // ← seed.js doc2 utilise celui-ci
  process.env.MONGO_URI;       // ← verifyLogin.js utilise celui-ci

if (!MONGO_URI) {
  console.error('❌ MONGO_URI ou MONGODB_URI est requis.');
  process.exit(1);
}

console.log('🔌 Connexion à MongoDB...');

// ─── 2. Schema complet identique à models/User.js ───
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password:     { type: String, required: true },
  phone:        { type: String, default: '' },
  role:         { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  newsletter:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  lastLogin:    { type: Date },
  profileImage: { type: String, default: null },
  preferences: {
    notifications: { type: Boolean, default: true },
    language:      { type: String, default: 'fr' }
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ─── Identifiants cibles ───
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL || 'roots@radio.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(ADMIN_PASSWORD)) {
  console.error('❌ ADMIN_PASSWORD est requis et doit contenir au moins 8 caracteres, une majuscule, une minuscule et un chiffre.');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connecté à MongoDB\n');

  // ── Lister tous les users ──
  const allUsers = await User.find({}).lean();
  console.log(`📋 Utilisateurs en base (${allUsers.length} total) :`);
  for (const u of allUsers) {
    const hasHash = u.password && u.password.startsWith('$2');
    console.log(`  • ${u.email || '(pas d\'email)'} | role=${u.role || '?'} | password=${hasHash ? '✅ hash bcrypt' : '❌ ' + (u.password ? 'PLAIN TEXT ou vide' : 'manquant')} | isActive=${u.isActive !== false ? '✅' : '❌'} | username=${u.username || '⚠️ manquant'}`);
  }

  // ── Chercher l'admin existant ──
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    console.log(`\n🔍 Admin trouvé: ${existing.email}`);

    // Tester si le mot de passe actuel matche
    if (existing.password && existing.password.startsWith('$2')) {
      const match = await bcrypt.compare(ADMIN_PASSWORD, existing.password);
      if (match) {
        console.log('✅ Mot de passe fourni : CORRECT');
        console.log(`✅ Role: ${existing.role}`);
        console.log(`✅ isActive: ${existing.isActive}`);

        if (existing.role === 'admin' && existing.isActive !== false) {
          console.log('\n🎉 L\'admin est déjà correct.');
          console.log(`   Email    : ${ADMIN_EMAIL}`);
          await mongoose.disconnect();
          return;
        }
      } else {
        console.log('❌ Mot de passe fourni : NE CORRESPOND PAS');
        console.log('   → On va réinitialiser le mot de passe et le rôle');
      }
    } else {
      console.log('❌ Pas de hash bcrypt valide — mot de passe corrompu');
    }

    // Corriger l'admin existant
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    existing.password  = hashedPassword;
    existing.role      = 'admin';
    existing.isActive  = true;
    existing.firstName = existing.firstName || 'Admin';
    existing.lastName  = existing.lastName  || 'Roots';
    existing.username  = existing.username  || 'admin';

    await existing.save();
    console.log('\n✅ Admin corrigé !');

  } else {
    console.log(`\n⚠️  Aucun user avec email "${ADMIN_EMAIL}" trouvé`);
    console.log('   → Création de l\'admin...');

    // Vérifier si username "admin" est pris
    let username = 'admin';
    const takenUsername = await User.findOne({ username });
    if (takenUsername) username = 'adminroots';

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = new User({
      username,
      firstName:  'Admin',
      lastName:   'Roots',
      email:      ADMIN_EMAIL,
      password:   hashedPassword,
      role:       'admin',
      isActive:   true,
      newsletter: false
    });

    await admin.save();
    console.log('✅ Admin créé !');
  }

  console.log('\n══════════════════════════════════');
  console.log('🔐 IDENTIFIANTS ADMIN :');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log('   Password : défini via ADMIN_PASSWORD');
  console.log('══════════════════════════════════');

  // ── Vérification finale ──
  const finalUser = await User.findOne({ email: ADMIN_EMAIL });
  const finalMatch = await bcrypt.compare(ADMIN_PASSWORD, finalUser.password);
  console.log(`\n🧪 Vérification finale bcrypt : ${finalMatch ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
  console.log(`🧪 Role                       : ${finalUser.role === 'admin' ? '✅ admin' : '❌ ' + finalUser.role}`);
  console.log(`🧪 isActive                   : ${finalUser.isActive ? '✅ true' : '❌ false'}`);

  await mongoose.disconnect();
  console.log('\n🔌 Déconnecté. Tu peux maintenant te connecter sur ton app !');
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err.message);
  process.exit(1);
});
