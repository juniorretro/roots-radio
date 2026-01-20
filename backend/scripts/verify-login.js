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

const verifyLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/radio');
    console.log('Connexion à MongoDB réussie');

    // Test avec les identifiants admin
    const testEmail = 'admin@radio.com';
    const testPassword = 'password123';

    console.log(`\n🔍 Recherche de l'utilisateur avec email: ${testEmail}`);
    
    // Chercher l'utilisateur
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé avec cet email');
      
      // Lister tous les utilisateurs
      const allUsers = await User.find();
      console.log('\n📋 Tous les utilisateurs en base:');
      allUsers.forEach(u => {
        console.log(`  - Email: ${u.email}, Role: ${u.role}, Password hash: ${u.password ? u.password.substring(0, 20) + '...' : 'Pas de password'}`);
      });
      
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log(`  - ID: ${user._id}`);
    console.log(`  - Username: ${user.username}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role}`);
    console.log(`  - Password hash: ${user.password ? user.password.substring(0, 30) + '...' : 'Pas de password'}`);

    // Vérifier le mot de passe
    if (!user.password) {
      console.log('❌ Aucun mot de passe stocké pour cet utilisateur');
      return;
    }

    console.log(`\n🔐 Test du mot de passe: "${testPassword}"`);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log(`Résultat de la comparaison: ${isMatch ? '✅ MATCH' : '❌ PAS DE MATCH'}`);

    if (!isMatch) {
      console.log('\n🔧 Tentative de création d\'un nouveau hash pour vérification...');
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log(`Nouveau hash: ${newHash.substring(0, 30)}...`);
      
      const testNewHash = await bcrypt.compare(testPassword, newHash);
      console.log(`Test avec nouveau hash: ${testNewHash ? '✅ FONCTIONNE' : '❌ NE FONCTIONNE PAS'}`);
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyLogin();