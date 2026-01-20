// scripts/seed.js - Script pour initialiser la base de données avec des données de test
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import des modèles
const User = require('../models/User');
const Program = require('../models/Program');
const Episode = require('../models/Episode');
const Podcast = require('../models/Podcast');

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Données de test
const seedData = {
  users: [
    {
      name: 'Administrateur',
      email: 'admin@rootsmusicradio.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Éditeur Test',
      email: 'editor@rootsmusicradio.com',
      password: 'editor123',
      role: 'editor'
    },
    {
      name: 'Utilisateur Test',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    }
  ],
  
  programs: [
    {
      title: 'Good Morning Vibes',
      description: 'Démarrez votre journée avec les meilleurs hits du moment',
      host: 'DJ Martin',
      category: 'Musique',
      featured: true,
      schedule: [
        { day: 'monday', startTime: '06:00', endTime: '09:00', duration: 180 },
        { day: 'tuesday', startTime: '06:00', endTime: '09:00', duration: 180 },
        { day: 'wednesday', startTime: '06:00', endTime: '09:00', duration: 180 },
        { day: 'thursday', startTime: '06:00', endTime: '09:00', duration: 180 },
        { day: 'friday', startTime: '06:00', endTime: '09:00', duration: 180 }
      ],
      tags: ['morning', 'hits', 'music']
    },
    {
      title: 'Jazz Evening',
      description: 'Une soirée dédiée aux classiques du jazz',
      host: 'Sarah Johnson',
      category: 'Jazz',
      featured: false,
      schedule: [
        { day: 'tuesday', startTime: '20:00', endTime: '22:00', duration: 120 },
        { day: 'thursday', startTime: '20:00', endTime: '22:00', duration: 120 }
      ],
      tags: ['jazz', 'evening', 'classics']
    },
    {
      title: 'Tech Talk',
      description: 'Actualités technologiques et innovations',
      host: 'Alex Kumar',
      category: 'Technologie',
      featured: true,
      schedule: [
        { day: 'wednesday', startTime: '14:00', endTime: '15:00', duration: 60 }
      ],
      tags: ['tech', 'innovation', 'news']
    },
    {
      title: 'Roots Classics',
      description: 'Les grands classiques de la musique africaine',
      host: 'Mama Koko',
      category: 'Afro',
      featured: false,
      schedule: [
        { day: 'saturday', startTime: '16:00', endTime: '18:00', duration: 120 },
        { day: 'sunday', startTime: '16:00', endTime: '18:00', duration: 120 }
      ],
      tags: ['afro', 'classics', 'roots']
    }
  ],
  
  episodes: [
    {
      title: 'Interview avec Burna Boy',
      description: 'Une interview exclusive avec la star de l\'Afrobeat',
      season: 1,
      episodeNumber: 1,
      duration: 2700, // 45 minutes
      airDate: new Date('2024-01-15T14:00:00'),
      status: 'aired',
      featured: true
    },
    {
      title: 'Les nouveautés de la semaine',
      description: 'Découvrez les dernières sorties musicales',
      season: 1,
      episodeNumber: 2,
      duration: 3600, // 60 minutes
      airDate: new Date('2024-01-22T14:00:00'),
      status: 'aired',
      featured: false
    }
  ],
  
  podcasts: [
    {
      title: 'Histoire du Jazz Africain',
      description: 'Un voyage à travers l\'histoire du jazz en Afrique',
      host: 'Dr. Kofi Asante',
      category: 'Culture',
      duration: 2400, // 40 minutes
      publishDate: new Date('2024-01-10'),
      featured: true,
      tags: ['jazz', 'africa', 'history', 'culture']
    },
    {
      title: 'Startup Stories - Episode 1',
      description: 'Rencontre avec des entrepreneurs africains innovants',
      host: 'Lisa Mensah',
      category: 'Business',
      duration: 1800, // 30 minutes
      publishDate: new Date('2024-01-12'),
      featured: false,
      tags: ['startup', 'entrepreneur', 'business', 'innovation']
    },
    {
      title: 'Recettes de Grand-Mère',
      description: 'Les secrets culinaires transmis de génération en génération',
      host: 'Tante Ama',
      category: 'Culture',
      duration: 1500, // 25 minutes
      publishDate: new Date('2024-01-14'),
      featured: false,
      tags: ['cuisine', 'tradition', 'culture', 'family']
    }
  ]
};

// Fonction pour nettoyer la base de données
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Program.deleteMany({});
    await Episode.deleteMany({});
    await Podcast.deleteMany({});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

// Fonction pour créer les utilisateurs
const createUsers = async () => {
  try {
    const users = await User.create(seedData.users);
    console.log(`Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error creating users:', error);
    throw error;
  }
};

// Fonction pour créer les programmes
const createPrograms = async () => {
  try {
    const programs = await Program.create(seedData.programs);
    console.log(`Created ${programs.length} programs`);
    return programs;
  } catch (error) {
    console.error('Error creating programs:', error);
    throw error;
  }
};

// Fonction pour créer les épisodes
const createEpisodes = async (programs) => {
  try {
    // Associer les épisodes aux programmes
    const episodesWithPrograms = seedData.episodes.map((episode, index) => ({
      ...episode,
      programId: programs[index % programs.length]._id // Distribuer les épisodes sur les programmes
    }));
    
    const episodes = await Episode.create(episodesWithPrograms);
    console.log(`Created ${episodes.length} episodes`);
    return episodes;
  } catch (error) {
    console.error('Error creating episodes:', error);
    throw error;
  }
};

// Fonction pour créer les podcasts
const createPodcasts = async () => {
  try {
    const podcasts = await Podcast.create(seedData.podcasts);
    console.log(`Created ${podcasts.length} podcasts`);
    return podcasts;
  } catch (error) {
    console.error('Error creating podcasts:', error);
    throw error;
  }
};

// Fonction principale de seeding
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await connectDB();
    
    // Nettoyer la base de données
    await clearDatabase();
    
    // Créer les données de test
    const users = await createUsers();
    const programs = await createPrograms();
    const episodes = await createEpisodes(programs);
    const podcasts = await createPodcasts();
    
    console.log('Database seeding completed successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@rootsmusicradio.com / admin123');
    console.log('Editor: editor@rootsmusicradio.com / editor123');
    console.log('User: user@example.com / user123');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };