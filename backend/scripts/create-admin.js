const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Définir le modèle User directement dans ce script
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
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

const createAdmin = async () => {
  try {
    console.log('Connexion à MongoDB...');
    console.log('URI de connexion:', process.env.MONGO_URI || 'mongodb://localhost:27017/radio');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/radio');
    console.log('Connexion réussie à MongoDB');

    // Supprimer l'admin existant s'il y en a un
    await User.deleteOne({ email: 'admin@radio.com' });
    console.log('Ancien admin supprimé (s\'il existait)');

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);
    console.log('Mot de passe hashé:', hashedPassword.substring(0, 20) + '...');

    // Créer l'admin
    const admin = new User({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@radio.com',
      password: hashedPassword,
      role: 'admin',
      newsletter: false,
      phone: '+237123456789'
    });

    const savedAdmin = await admin.save();
    console.log('Admin créé avec succès!');
    console.log('ID:', savedAdmin._id);
    console.log('Username:', savedAdmin.username);
    console.log('Email:', savedAdmin.email);
    console.log('Role:', savedAdmin.role);

    // Créer un utilisateur demo aussi
    await User.deleteOne({ email: 'user@radio.com' });
    
    const demoUserPassword = await bcrypt.hash('password123', salt);
    const demoUser = new User({
      username: 'demouser',
      firstName: 'Demo',
      lastName: 'User',
      email: 'user@radio.com',
      password: demoUserPassword,
      role: 'user',
      newsletter: true,
      phone: '+237987654321'
    });

    const savedUser = await demoUser.save();
    console.log('Utilisateur demo créé avec succès!');
    console.log('Email:', savedUser.email);

    // Vérification finale
    const allUsers = await User.find().select('username email role');
    console.log('\nTous les utilisateurs en base:');
    allUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB');
  }
};

createAdmin();