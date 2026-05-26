const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Schema User
const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
  newsletter: Boolean,
  phone: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const VERIFY_EMAIL = process.env.VERIFY_EMAIL || process.env.ADMIN_EMAIL || 'roots@radio.com';
const VERIFY_PASSWORD = process.env.VERIFY_PASSWORD || process.env.ADMIN_PASSWORD;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!VERIFY_PASSWORD) {
  console.error('VERIFY_PASSWORD ou ADMIN_PASSWORD est requis pour tester une connexion.');
  process.exit(1);
}

if (!MONGO_URI) {
  console.error('MONGO_URI ou MONGODB_URI est requis.');
  process.exit(1);
}

const verifyLogin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connexion à MongoDB réussie');

    console.log(`\n🔍 Recherche de l'utilisateur avec email: ${VERIFY_EMAIL}`);
    
    // Chercher l'utilisateur
    const user = await User.findOne({ email: VERIFY_EMAIL });
    
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé avec cet email');
      
      // Lister tous les utilisateurs
      const allUsers = await User.find();
      console.log('\n📋 Tous les utilisateurs en base:');
      allUsers.forEach(u => {
        console.log(`  - Email: ${u.email}, Role: ${u.role}, Password: ${u.password ? 'présent' : 'absent'}`);
      });
      
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log(`  - ID: ${user._id}`);
    console.log(`  - Username: ${user.username}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role}`);
    console.log(`  - Password: ${user.password ? 'présent' : 'absent'}`);

    // Vérifier le mot de passe
    if (!user.password) {
      console.log('❌ Aucun mot de passe stocké pour cet utilisateur');
      return;
    }

    console.log('\n🔐 Test du mot de passe fourni');
    
    const isMatch = await bcrypt.compare(VERIFY_PASSWORD, user.password);
    console.log(`Résultat de la comparaison: ${isMatch ? '✅ MATCH' : '❌ PAS DE MATCH'}`);

    if (!isMatch) {
      console.log('\n🔧 Tentative de création d\'un nouveau hash pour vérification...');
      const newHash = await bcrypt.hash(VERIFY_PASSWORD, 12);
      
      const testNewHash = await bcrypt.compare(VERIFY_PASSWORD, newHash);
      console.log(`Test avec nouveau hash: ${testNewHash ? '✅ FONCTIONNE' : '❌ NE FONCTIONNE PAS'}`);
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyLogin();
