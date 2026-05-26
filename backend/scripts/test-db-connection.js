const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI ou MONGODB_URI est requis.');
  process.exit(1);
}

const testConnection = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connexion à MongoDB réussie');

    // Test de création d'un document simple
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    // Créer un document test
    const testDoc = new TestModel({ name: 'Test Connection' });
    await testDoc.save();
    console.log('✅ Document test créé');

    // Lire le document
    const found = await TestModel.findOne({ name: 'Test Connection' });
    console.log('✅ Document trouvé:', found);

    // Nettoyer
    await TestModel.deleteOne({ name: 'Test Connection' });
    console.log('✅ Document test supprimé');

    // Lister toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections existantes:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Compter les utilisateurs
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    console.log(`👤 Nombre d'utilisateurs: ${userCount}`);

    if (userCount > 0) {
      const users = await User.find().select('username email role');
      console.log('👤 Utilisateurs existants:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.email}) - ${user.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Connexion fermée');
  }
};

testConnection();
