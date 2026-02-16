const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

const resetAdmin = async () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   RÉINITIALISATION ADMIN               ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/radio';
    console.log('🔌 Connexion à MongoDB...');
    console.log(`   URI: ${mongoUri}\n`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB\n');

    // 1. Supprimer tous les anciens admins
    console.log('🗑️  Suppression des anciens admins...');
    const deleteResult = await User.deleteMany({ 
      $or: [
        { email: 'admin@radio.com' },
        { email: 'admin@rootsmusicradio.com' },
        { username: 'admin' }
      ]
    });
    console.log(`   ${deleteResult.deletedCount} ancien(s) admin(s) supprimé(s)\n`);

    // 2. Créer le nouvel admin
    console.log('👤 Création du nouvel administrateur...');
    
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = new User({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@radio.com',
      password: hashedPassword,
      role: 'admin',
      newsletter: false,
      isActive: true,
      phone: '+237123456789'
    });

    await admin.save();
    console.log('✅ Admin créé avec succès !\n');

    // 3. Vérification
    console.log('🔍 Vérification...');
    const verifyAdmin = await User.findOne({ email: 'admin@radio.com' });
    
    if (verifyAdmin) {
      console.log('✅ Vérification réussie\n');
      console.log('📋 Détails de l\'admin :');
      console.log(`   ID       : ${verifyAdmin._id}`);
      console.log(`   Username : ${verifyAdmin.username}`);
      console.log(`   Email    : ${verifyAdmin.email}`);
      console.log(`   Role     : ${verifyAdmin.role}`);
      console.log(`   Active   : ${verifyAdmin.isActive}\n`);

      // 4. Test du mot de passe
      console.log('🔐 Test du mot de passe...');
      const isPasswordValid = await bcrypt.compare('password123', verifyAdmin.password);
      
      if (isPasswordValid) {
        console.log('✅ Mot de passe valide\n');
      } else {
        console.log('❌ ERREUR : Le mot de passe ne fonctionne pas !\n');
      }
    } else {
      console.log('❌ ERREUR : Admin non trouvé après création !\n');
    }

    // 5. Créer un utilisateur de test si nécessaire
    console.log('👤 Vérification utilisateur de test...');
    const testUser = await User.findOne({ email: 'user@radio.com' });
    
    if (!testUser) {
      const testUserPassword = await bcrypt.hash('password123', salt);
      const newTestUser = new User({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'user@radio.com',
        password: testUserPassword,
        role: 'user',
        newsletter: true,
        isActive: true,
        phone: '+237987654321'
      });
      
      await newTestUser.save();
      console.log('✅ Utilisateur de test créé\n');
    } else {
      console.log('ℹ️  Utilisateur de test existe déjà\n');
    }

    // 6. Statistiques finales
    console.log('📊 Statistiques :');
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    
    console.log(`   Total utilisateurs : ${totalUsers}`);
    console.log(`   Administrateurs    : ${totalAdmins}`);
    console.log(`   Utilisateurs       : ${totalRegularUsers}\n`);

    // 7. Afficher tous les utilisateurs
    console.log('👥 Tous les utilisateurs :');
    const allUsers = await User.find().select('username email role isActive');
    allUsers.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      const activeIcon = user.isActive ? '✅' : '❌';
      console.log(`   ${index + 1}. ${roleIcon} ${user.username} (${user.email}) - ${user.role} ${activeIcon}`);
    });

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   RÉINITIALISATION TERMINÉE            ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    console.log('🎉 SUCCÈS ! Vous pouvez maintenant vous connecter\n');
    console.log('📝 IDENTIFIANTS :');
    console.log('   Admin Email    : admin@radio.com');
    console.log('   Admin Password : password123');
    console.log('   User Email     : user@radio.com');
    console.log('   User Password  : password123\n');
    
    console.log('🌐 URL de connexion :');
    console.log('   http://localhost:3000/login\n');
    
    console.log('⚠️  RAPPEL IMPORTANT :');
    console.log('   Vérifiez que votre RadioContext.js utilise :');
    console.log('   const API_URL = "http://localhost:5000" // HTTP pas HTTPS\n');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    
    if (error.code === 11000) {
      console.error('\n💡 Un utilisateur avec cet email existe déjà.');
      console.error('   Supprimez-le manuellement ou utilisez un autre email.\n');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MongoDB n\'est pas démarré.');
      console.error('   Lancez MongoDB avec: mongod --dbpath /path/to/data\n');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB\n');
  }
};

// Exécuter la réinitialisation
resetAdmin();