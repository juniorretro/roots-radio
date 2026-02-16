// backend/scripts/seedEmissions.js
// Script pour initialiser des émissions de démonstration

const mongoose = require('mongoose');
require('dotenv').config();

const Emission = require('../models/Emission');
const { Program } = require('../models');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/radio');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const sampleEmissions = [
  {
    title: 'Good Morning Vibes - Édition Spéciale',
    host: 'L\'équipe Roots Radio',
    bio: 'Commencez votre journée en musique ! Le meilleur des hits pour vous réveiller en douceur.',
    program: 'Good Morning Vibes',
    schedule: 'Tous les jours 6h-10h',
    category: 'Matinale',
    cover: '/images/programs/GOOD_MORNING-AFFICHE.jpg',
    duration: 14400, // 4 heures
    audioUrl: '/audio/emissions/good-morning-special.mp3',
    description: 'Une matinée exceptionnelle avec les meilleurs tubes du moment.',
    airedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
    episodes: [
      {
        id: 'ep1',
        title: 'Good Morning Vibes - Lundi 6 Janvier',
        date: new Date('2025-01-06'),
        duration: '4:00:00',
        audioUrl: '/audio/emissions/morning-06-01.mp3',
        cover: '/images/hosts/GOOD_MORNING-AFFICHE.jpg',
        description: 'Démarrez la semaine en musique !'
      }
    ]
  },
  {
    title: 'La Rétro #89 - Golden 80s',
    host: 'Denis',
    bio: 'Denis te plonge dans l\'univers de la musiques urbaine internationales.',
    program: 'La Rétro avec Denis',
    schedule: 'Lun-Ven 20h-21h',
    category: 'Rétro',
    cover: '/images/hosts/denis.jpg',
    duration: 3600, // 1 heure
    audioUrl: '/audio/emissions/retro-89.mp3',
    description: 'Redécouvrez les plus grands tubes des années 80.',
    airedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // Il y a 5 heures
    episodes: [
      {
        id: 'ep1',
        title: 'La Rétro #89 - Golden 80s',
        date: new Date('2025-01-03'),
        duration: '1:00:00',
        audioUrl: '/audio/emissions/retro-89.mp3',
        cover: '/images/hosts/PLAYLIST_WEEKEND_AFFICHE.jpg',
        description: 'Redécouvrez les plus grands tubes des années 80.'
      },
      {
        id: 'ep2',
        title: 'La Rétro #88 - Disco Fever',
        date: new Date('2025-01-02'),
        duration: '1:00:00',
        audioUrl: '/audio/emissions/retro-88.mp3',
        cover: '/images/hosts/PLAYLIST_WEEKEND_AFFICHE.jpg',
        description: 'L\'âge d\'or du disco et du funk.'
      }
    ]
  },
  {
    title: 'Mix Party #125 - Special Afrobeat',
    host: 'Eric 5 Étoiles',
    bio: 'DJ vedette de Mix Party, Eric 5 Étoiles enflamme vos samedis soirs.',
    program: 'Mix Party',
    schedule: 'Samedi 20h-22h',
    category: 'Mix',
    cover: '/images/programs/MIX_PARTY_BY_ERIC_5_ETOILES.png',
    duration: 7200, // 2 heures
    audioUrl: '/audio/emissions/mix-party-125.mp3',
    description: 'Un mix explosif des meilleurs hits afrobeat du moment.',
    airedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Il y a 1 jour
    episodes: [
      {
        id: 'ep1',
        title: 'Mix Party #125 - Special Afrobeat',
        date: new Date('2025-01-04'),
        duration: '2:00:00',
        audioUrl: '/audio/emissions/mix-party-125.mp3',
        cover: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.jpg',
        description: 'Un mix explosif des meilleurs hits afrobeat.'
      }
    ]
  },
  {
    title: 'SELF-LIST #125 - BY-SABRINA',
    host: 'Sabrina',
    bio: 'Découvrez les playlistes de vos artistes préférés.',
    program: 'Self-List',
    schedule: 'Samedi-Dimanche 17h-18h',
    category: 'DJ Set',
    cover: '/images/hosts/SELF-LIST-BY-SABRINA.jpg',
    duration: 953, // 15:53
    audioUrl: '/audio/emissions/SELF-LIST-BY-SABRINA.mp3',
    description: 'La playlist personnelle de Sabrina.',
    airedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
    episodes: [
      {
        id: 'ep1',
        title: 'SELF-LIST #125 - BY-SABRINA',
        date: new Date('2025-01-04'),
        duration: '00:15:53',
        audioUrl: '/audio/emissions/SELF-LIST-BY-SABRINA.mp3',
        cover: '/images/hosts/SELF-LIST-BY-SABRINA.jpg',
        description: 'Episode 01.'
      }
    ]
  }
];

const seedEmissions = async () => {
  try {
    console.log('🌱 Starting emission seeding...');

    await connectDB();

    // Supprimer les anciennes émissions
    await Emission.deleteMany({});
    console.log('🗑️  Old emissions deleted');

    // Chercher les programmes existants pour lier les émissions
    const programs = await Program.find();
    const programMap = new Map();
    programs.forEach(p => {
      programMap.set(p.title, p._id);
    });

    // Créer les nouvelles émissions
    const emissionsToCreate = sampleEmissions.map(emission => ({
      ...emission,
      programId: programMap.get(emission.program) || null
    }));

    const created = await Emission.insertMany(emissionsToCreate);
    console.log(`✅ ${created.length} emissions created`);

    // Afficher les émissions créées
    console.log('\n📋 Created emissions:');
    created.forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.title} (${e.host})`);
      console.log(`     📅 ${e.airedAt.toLocaleString('fr-FR')}`);
      console.log(`     📺 Program: ${e.program || 'None'}`);
      console.log(`     🎵 Episodes: ${e.episodes?.length || 0}`);
    });

    console.log('\n✨ Emission seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedEmissions();
}

module.exports = { seedEmissions };