// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// const { User, Program, Episode, Podcast } = require('../models');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radio');
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error);
//     process.exit(1);
//   }
// };

// const createUsers = async () => {
//   try {
//     // Check if admin already exists
//     const existingAdmin = await User.findOne({ email: 'admin@radio.com' });
//     if (!existingAdmin) {
//       const adminPassword = await bcrypt.hash('password123', 10);
//       const admin = new User({
//         username: 'admin',
//         email: 'admin@radio.com',
//         password: adminPassword,
//         role: 'admin'
//       });
//       await admin.save();
//       console.log('Admin user created');
//     }

//     // Check if regular user already exists
//     const existingUser = await User.findOne({ email: 'user@radio.com' });
//     if (!existingUser) {
//       const userPassword = await bcrypt.hash('password123', 10);
//       const user = new User({
//         username: 'user',
//         email: 'user@radio.com',
//         password: userPassword,
//         role: 'user'
//       });
//       await user.save();
//       console.log('Regular user created');
//     }
//   } catch (error) {
//     console.error('Error creating users:', error);
//   }
// };

// const createSamplePrograms = async () => {
//   try {
//     const existingPrograms = await Program.countDocuments();
//     if (existingPrograms === 0) {
//       const programs = [
//         {
//           title: 'Morning Show',
//           slug: 'morning-show',
//           description: 'Commencez votre journée avec les dernières nouvelles, musique et divertissement',
//           host: 'Marie Dubois',
//           category: 'Actualité',
//           schedule: [
//             { day: 'monday', startTime: '07:00', endTime: '10:00', duration: 180 },
//             { day: 'tuesday', startTime: '07:00', endTime: '10:00', duration: 180 },
//             { day: 'wednesday', startTime: '07:00', endTime: '10:00', duration: 180 },
//             { day: 'thursday', startTime: '07:00', endTime: '10:00', duration: 180 },
//             { day: 'friday', startTime: '07:00', endTime: '10:00', duration: 180 }
//           ],
//           featured: true,
//           tags: ['actualité', 'matinal', 'info'],
//           isActive: true
//         },
//         {
//           title: 'Jazz Lounge',
//           slug: 'jazz-lounge',
//           description: 'Les plus grands classiques du jazz et les nouveaux talents',
//           host: 'Pierre Martin',
//           category: 'Musique',
//           schedule: [
//             { day: 'friday', startTime: '20:00', endTime: '22:00', duration: 120 },
//             { day: 'saturday', startTime: '20:00', endTime: '22:00', duration: 120 }
//           ],
//           featured: true,
//           tags: ['jazz', 'musique', 'soirée'],
//           isActive: true
//         },
//         {
//           title: 'Tech Talk',
//           slug: 'tech-talk',
//           description: 'L\'actualité technologique et les innovations du numérique',
//           host: 'Sarah Chen',
//           category: 'Technologie',
//           schedule: [
//             { day: 'wednesday', startTime: '18:00', endTime: '19:00', duration: 60 }
//           ],
//           featured: false,
//           tags: ['technologie', 'innovation', 'numérique'],
//           isActive: true
//         },
//         {
//           title: 'Weekend Vibes',
//           slug: 'weekend-vibes',
//           description: 'Musique décontractée pour bien commencer le week-end',
//           host: 'Thomas Legrand',
//           category: 'Musique',
//           schedule: [
//             { day: 'saturday', startTime: '10:00', endTime: '12:00', duration: 120 },
//             { day: 'sunday', startTime: '10:00', endTime: '12:00', duration: 120 }
//           ],
//           featured: true,
//           tags: ['weekend', 'détente', 'musique'],
//           isActive: true
//         }
//       ];

//       await Program.insertMany(programs);
//       console.log('Sample programs created');
//     }
//   } catch (error) {
//     console.error('Error creating sample programs:', error);
//   }
// };

// const createSampleEpisodes = async () => {
//   try {
//     const existingEpisodes = await Episode.countDocuments();
//     if (existingEpisodes === 0) {
//       const programs = await Program.find();
//       if (programs.length === 0) return;

//       const morningShow = programs.find(p => p.slug === 'morning-show');
//       const jazzLounge = programs.find(p => p.slug === 'jazz-lounge');

//       if (morningShow) {
//         const episodes = [
//           {
//             title: 'Retour sur l\'actualité de la semaine',
//             slug: 'retour-actualite-semaine-ep1',
//             description: 'Analyse des événements marquants de la semaine avec nos invités experts',
//             programId: morningShow._id,
//             audioUrl: '/uploads/sample-episode-1.mp3',
//             duration: 3600,
//             airDate: new Date('2025-01-15'),
//             season: 1,
//             episodeNumber: 1,
//             featured: true,
//             tags: ['actualité', 'analyse', 'débat']
//           },
//           {
//             title: 'Interview avec le maire de la ville',
//             slug: 'interview-maire-ville-ep2',
//             description: 'Entretien exclusif avec le maire sur les projets municipaux',
//             programId: morningShow._id,
//             audioUrl: '/uploads/sample-episode-2.mp3',
//             duration: 2400,
//             airDate: new Date('2025-01-16'),
//             season: 1,
//             episodeNumber: 2,
//             featured: false,
//             tags: ['interview', 'politique locale']
//           }
//         ];

//         await Episode.insertMany(episodes);
//       }

//       if (jazzLounge) {
//         const episodes = [
//           {
//             title: 'Les grands classiques du bebop',
//             slug: 'grands-classiques-bebop-ep1',
//             description: 'Voyage musical à travers l\'âge d\'or du bebop avec Miles Davis et Charlie Parker',
//             programId: jazzLounge._id,
//             audioUrl: '/uploads/sample-jazz-episode-1.mp3',
//             duration: 4200,
//             airDate: new Date('2025-01-12'),
//             season: 1,
//             episodeNumber: 1,
//             featured: true,
//             tags: ['bebop', 'jazz classique', 'histoire']
//           }
//         ];

//         await Episode.insertMany(episodes);
//       }

//       console.log('Sample episodes created');
//     }
//   } catch (error) {
//     console.error('Error creating sample episodes:', error);
//   }
// };

// const createSamplePodcasts = async () => {
//   try {
//     const existingPodcasts = await Podcast.countDocuments();
//     if (existingPodcasts === 0) {
//       const podcasts = [
//         {
//           title: 'Histoire de la Radio',
//           slug: 'histoire-de-la-radio',
//           description: 'Découvrez l\'histoire fascinante de la radio depuis ses débuts jusqu\'à aujourd\'hui',
//           host: 'Laurent Rousseau',
//           category: 'Histoire',
//           audioUrl: '/uploads/podcast-histoire-radio.mp3',
//           duration: 2800,
//           publishDate: new Date('2025-01-10'),
//           featured: true,
//           tags: ['histoire', 'radio', 'média'],
//           downloads: 1250,
//           likes: 89
//         },
//         {
//           title: 'Les Mystères de l\'Univers',
//           slug: 'mysteres-univers',
//           description: 'Explorez les secrets de l\'espace et les dernières découvertes astronomiques',
//           host: 'Dr. Sophie Moreau',
//           category: 'Science',
//           audioUrl: '/uploads/podcast-mysteres-univers.mp3',
//           duration: 3200,
//           publishDate: new Date('2025-01-08'),
//           featured: true,
//           tags: ['astronomie', 'science', 'espace'],
//           downloads: 980,
//           likes: 67
//         },
//         {
//           title: 'Recettes de Grand-Mère',
//           slug: 'recettes-grand-mere',
//           description: 'Redécouvrez les recettes traditionnelles transmises de génération en génération',
//           host: 'Claudine Fournier',
//           category: 'Cuisine',
//           audioUrl: '/uploads/podcast-recettes-grandmere.mp3',
//           duration: 1800,
//           publishDate: new Date('2025-01-05'),
//           featured: false,
//           tags: ['cuisine', 'tradition', 'famille'],
//           downloads: 756,
//           likes: 45
//         },
//         {
//           title: 'Entrepreneuriat Digital',
//           slug: 'entrepreneuriat-digital',
//           description: 'Conseils et stratégies pour réussir dans l\'économie numérique',
//           host: 'Marc Leblanc',
//           category: 'Business',
//           audioUrl: '/uploads/podcast-entrepreneuriat-digital.mp3',
//           duration: 2600,
//           publishDate: new Date('2025-01-03'),
//           featured: true,
//           tags: ['entrepreneuriat', 'digital', 'business'],
//           downloads: 1420,
//           likes: 112
//         }
//       ];

//       await Podcast.insertMany(podcasts);
//       console.log('Sample podcasts created');
//     }
//   } catch (error) {
//     console.error('Error creating sample podcasts:', error);
//   }
// };

// const initializeDatabase = async () => {
//   console.log('🚀 Initializing database...');
  
//   await connectDB();
  
//   console.log('📝 Creating users...');
//   await createUsers();
  
//   console.log('📻 Creating sample programs...');
//   await createSamplePrograms();
  
//   console.log('🎵 Creating sample episodes...');
//   await createSampleEpisodes();
  
//   console.log('🎧 Creating sample podcasts...');
//   await createSamplePodcasts();
  
//   console.log('✅ Database initialization completed!');
//   console.log('\n🔑 Demo accounts created:');
//   console.log('Admin: admin@radio.com / password123');
//   console.log('User: user@radio.com / password123');
  
//   process.exit(0);
// };

// // Run initialization if called directly
// if (require.main === module) {
//   initializeDatabase();
// }

// module.exports = { initializeDatabase };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { User, Program, Episode, Podcast } = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/radio';

// Données enrichies pour les programmes
const samplePrograms = [
  {
    title: 'Morning Show',
    slug: 'morning-show',
    description: 'Votre émission matinale pour bien commencer la journée avec les dernières actualités, de la musique et de la bonne humeur.',
    host: 'Marie Dubois',
    category: 'Actualité',
    schedule: [
      { day: 'monday', startTime: '07:00', endTime: '09:00', duration: 120 },
      { day: 'tuesday', startTime: '07:00', endTime: '09:00', duration: 120 },
      { day: 'wednesday', startTime: '07:00', endTime: '09:00', duration: 120 },
      { day: 'thursday', startTime: '07:00', endTime: '09:00', duration: 120 },
      { day: 'friday', startTime: '07:00', endTime: '09:00', duration: 120 }
    ],
    tags: ['actualité', 'matin', 'news'],
    featured: true,
    isActive: true
  },
  {
    title: 'Jazz Lounge',
    slug: 'jazz-lounge',
    description: 'Une émission dédiée au jazz sous toutes ses formes. Découvrez les classiques et les nouveautés du genre.',
    host: 'Philippe Martin',
    category: 'Musique',
    schedule: [
      { day: 'saturday', startTime: '20:00', endTime: '22:00', duration: 120 },
      { day: 'sunday', startTime: '20:00', endTime: '22:00', duration: 120 }
    ],
    tags: ['jazz', 'musique', 'détente'],
    featured: true,
    isActive: true
  },
  {
    title: 'Tech Talk',
    slug: 'tech-talk',
    description: 'L\'actualité technologique décryptée avec nos experts. Innovations, analyses et débats sur le monde digital.',
    host: 'Sarah Chen',
    category: 'Technologie',
    schedule: [
      { day: 'wednesday', startTime: '19:00', endTime: '20:00', duration: 60 }
    ],
    tags: ['technologie', 'innovation', 'numérique'],
    featured: false,
    isActive: true
  },
  {
    title: 'Sports & Passion',
    slug: 'sports-passion',
    description: 'Toute l\'actualité sportive avec nos chroniqueurs passionnés. Analyses, interviews et débats.',
    host: 'Antoine Lefebvre',
    category: 'Sport',
    schedule: [
      { day: 'monday', startTime: '18:00', endTime: '19:00', duration: 60 },
      { day: 'friday', startTime: '18:00', endTime: '19:00', duration: 60 }
    ],
    tags: ['sport', 'actualité', 'passion'],
    featured: false,
    isActive: true
  },
  {
    title: 'Culture & Découverte',
    slug: 'culture-decouverte',
    description: 'Explorez la richesse culturelle avec nos invités. Art, littérature, cinéma et plus encore.',
    host: 'Isabelle Moreau',
    category: 'Culture',
    schedule: [
      { day: 'thursday', startTime: '21:00', endTime: '22:30', duration: 90 }
    ],
    tags: ['culture', 'art', 'littérature'],
    featured: true,
    isActive: true
  },
  {
    title: 'Weekend Vibes',
    slug: 'weekend-vibes',
    description: 'Musique décontractée pour bien commencer le week-end',
    host: 'Thomas Legrand',
    category: 'Musique',
    schedule: [
      { day: 'saturday', startTime: '10:00', endTime: '12:00', duration: 120 },
      { day: 'sunday', startTime: '10:00', endTime: '12:00', duration: 120 }
    ],
    tags: ['weekend', 'détente', 'musique'],
    featured: true,
    isActive: true
  }
];

// Données enrichies pour les podcasts
const samplePodcasts = [
  {
    title: 'Histoire de la Radio',
    slug: 'histoire-de-la-radio',
    description: 'Un voyage fascinant à travers l\'histoire de la radio, des premières transmissions aux podcasts modernes.',
    host: 'Dr. Jean Radiophile',
    category: 'Éducation',
    duration: 2700, // 45 minutes
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
    audioUrl: '/uploads/sample-audio.mp3',
    tags: ['histoire', 'radio', 'éducation'],
    featured: true,
    status: 'published'
  },
  {
    title: 'Les Secrets du Jazz',
    slug: 'secrets-du-jazz',
    description: 'Plongez dans l\'univers du jazz avec les plus grands musiciens de l\'histoire.',
    host: 'Philippe Martin',
    category: 'Musique',
    duration: 3600, // 1 heure
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
    audioUrl: '/uploads/sample-audio.mp3',
    tags: ['jazz', 'musique', 'histoire'],
    featured: true,
    status: 'published'
  },
  {
    title: 'Innovation Tech 2025',
    slug: 'innovation-tech-2025',
    description: 'Les tendances technologiques qui vont marquer l\'année 2025.',
    host: 'Sarah Chen',
    category: 'Technologie',
    duration: 1800, // 30 minutes
    publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
    audioUrl: '/uploads/sample-audio.mp3',
    tags: ['technologie', 'innovation', '2025'],
    featured: false,
    status: 'published'
  },
  {
    title: 'Les Mystères de l\'Univers',
    slug: 'mysteres-univers',
    description: 'Explorez les secrets de l\'espace et les dernières découvertes astronomiques',
    host: 'Dr. Sophie Moreau',
    category: 'Science',
    audioUrl: '/uploads/podcast-mysteres-univers.mp3',
    duration: 3200,
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
    featured: true,
    tags: ['astronomie', 'science', 'espace'],
    status: 'published'
  },
  {
    title: 'Entrepreneuriat Digital',
    slug: 'entrepreneuriat-digital',
    description: 'Conseils et stratégies pour réussir dans l\'économie numérique',
    host: 'Marc Leblanc',
    category: 'Business',
    audioUrl: '/uploads/podcast-entrepreneuriat-digital.mp3',
    duration: 2600,
    publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
    featured: true,
    tags: ['entrepreneuriat', 'digital', 'business'],
    status: 'published'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const createUsers = async () => {
  try {
    console.log('👥 Creating users...');
    
    // Vérifier si l'admin existe déjà
    let adminUser = await User.findOne({ email: 'admin@radio.com' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      adminUser = new User({
        username: 'admin',
        firstName: 'Admin',
        lastName: 'Système',
        email: 'admin@radio.com',
        password: hashedPassword,
        role: 'admin',
        newsletter: false
      });
      
      await adminUser.save();
      console.log('  ✅ Admin user created (email: admin@radio.com, password: admin123)');
    } else {
      console.log('  ℹ️  Admin user already exists');
    }

    // Créer des utilisateurs de test s'ils n'existent pas
    const testUsers = [
      {
        username: 'mariedubois',
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie@radio.com',
        role: 'user'
      },
      {
        username: 'philippemartin',
        firstName: 'Philippe',
        lastName: 'Martin',
        email: 'philippe@radio.com',
        role: 'user'
      },
      {
        username: 'user',
        firstName: 'User',
        lastName: 'Test',
        email: 'user@radio.com',
        role: 'user'
      }
    ];

    let usersCreated = 0;
    const salt = await bcrypt.genSalt(12);
    
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('password123', salt);
        const user = new User({
          ...userData,
          password: hashedPassword
        });
        await user.save();
        usersCreated++;
      }
    }

    if (usersCreated > 0) {
      console.log(`  ✅ ${usersCreated} test users created`);
    } else {
      console.log('  ℹ️  Test users already exist');
    }

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
};

const createSamplePrograms = async (adminUser) => {
  try {
    console.log('📻 Creating sample programs...');
    
    const existingPrograms = await Program.countDocuments();
    if (existingPrograms > 0) {
      console.log(`  ℹ️  ${existingPrograms} programs already exist, updating stats only`);
      
      // Mettre à jour les statistiques des programmes existants
      const programs = await Program.find({});
      for (const program of programs) {
        if (!program.views || program.views === 0) {
          program.views = Math.floor(Math.random() * 5000) + 1000;
          await program.save();
        }
      }
      console.log('  ✅ Program stats updated');
      return programs;
    }

    const createdPrograms = [];
    for (const programData of samplePrograms) {
      const program = new Program({
        ...programData,
        createdBy: adminUser._id,
        views: Math.floor(Math.random() * 5000) + 1000
      });
      await program.save();
      createdPrograms.push(program);
    }
    
    console.log(`  ✅ ${createdPrograms.length} programs created with stats`);
    return createdPrograms;
  } catch (error) {
    console.error('❌ Error creating sample programs:', error);
    throw error;
  }
};

const createSampleEpisodes = async (programs, adminUser) => {
  try {
    console.log('🎵 Creating sample episodes...');
    
    const existingEpisodes = await Episode.countDocuments();
    if (existingEpisodes > 0) {
      console.log(`  ℹ️  ${existingEpisodes} episodes already exist, updating stats only`);
      
      // Mettre à jour les statistiques des épisodes existants
      const episodes = await Episode.find({});
      for (const episode of episodes) {
        if (!episode.views || episode.views === 0) {
          episode.views = Math.floor(Math.random() * 2000) + 500;
          episode.likes = Math.floor(Math.random() * 200) + 50;
          episode.downloads = Math.floor(Math.random() * 1000) + 100;
          await episode.save();
        }
      }
      console.log('  ✅ Episode stats updated');
      return;
    }

    let totalEpisodes = 0;
    
    for (const program of programs) {
      // Créer 3-5 épisodes par programme
      const numEpisodes = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 1; i <= numEpisodes; i++) {
        const episode = new Episode({
          title: `${program.title} - Épisode ${i}`,
          slug: `${program.slug}-episode-${i}`,
          description: `Épisode ${i} de l'émission ${program.title}. Un contenu riche et passionnant pour nos auditeurs.`,
          programId: program._id,
          season: 1,
          episodeNumber: i,
          duration: Math.floor(Math.random() * 1800) + 1800, // 30-60 minutes
          airDate: new Date(Date.now() - (numEpisodes - i + 1) * 24 * 60 * 60 * 1000),
          audioUrl: '/uploads/sample-audio.mp3',
          tags: program.tags,
          featured: i === 1, // Premier épisode en vedette
          status: 'aired',
          createdBy: adminUser._id,
          // Statistiques réalistes
          views: Math.floor(Math.random() * 2000) + 500,
          likes: Math.floor(Math.random() * 200) + 50,
          downloads: Math.floor(Math.random() * 1000) + 100
        });
        
        await episode.save();
        totalEpisodes++;
      }
    }
    
    console.log(`  ✅ ${totalEpisodes} episodes created with stats`);
  } catch (error) {
    console.error('❌ Error creating sample episodes:', error);
    throw error;
  }
};

const createSamplePodcasts = async (adminUser) => {
  try {
    console.log('🎧 Creating sample podcasts...');
    
    const existingPodcasts = await Podcast.countDocuments();
    if (existingPodcasts > 0) {
      console.log(`  ℹ️  ${existingPodcasts} podcasts already exist, updating stats only`);
      
      // Mettre à jour les statistiques des podcasts existants
      const podcasts = await Podcast.find({});
      for (const podcast of podcasts) {
        if (!podcast.views || podcast.views === 0) {
          podcast.views = Math.floor(Math.random() * 3000) + 800;
          if (!podcast.likes) podcast.likes = Math.floor(Math.random() * 300) + 100;
          if (!podcast.downloads) podcast.downloads = Math.floor(Math.random() * 1500) + 200;
          if (!podcast.rating) {
            podcast.rating = {
              average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 à 5.0
              count: Math.floor(Math.random() * 100) + 20
            };
          }
          await podcast.save();
        }
      }
      console.log('  ✅ Podcast stats updated');
      return;
    }

    for (const podcastData of samplePodcasts) {
      const podcast = new Podcast({
        ...podcastData,
        createdBy: adminUser._id,
        // Statistiques réalistes
        views: Math.floor(Math.random() * 3000) + 800,
        likes: Math.floor(Math.random() * 300) + 100,
        downloads: Math.floor(Math.random() * 1500) + 200,
        rating: {
          average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 à 5.0
          count: Math.floor(Math.random() * 100) + 20
        }
      });
      await podcast.save();
    }
    
    console.log(`  ✅ ${samplePodcasts.length} podcasts created with stats`);
  } catch (error) {
    console.error('❌ Error creating sample podcasts:', error);
    throw error;
  }
};

const generateStatsSummary = async () => {
  try {
    const programCount = await Program.countDocuments();
    const episodeCount = await Episode.countDocuments();
    const podcastCount = await Podcast.countDocuments();
    const userCount = await User.countDocuments();

    // Calculer quelques statistiques globales
    const totalViews = await Program.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const totalEpisodeViews = await Episode.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    return {
      programs: programCount,
      episodes: episodeCount,
      podcasts: podcastCount,
      users: userCount,
      totalProgramViews: totalViews[0]?.total || 0,
      totalEpisodeViews: totalEpisodeViews[0]?.total || 0
    };
  } catch (error) {
    console.error('❌ Error generating stats summary:', error);
    return null;
  }
};

const initializeDatabase = async () => {
  console.log('🚀 Initializing database...');
  console.log('================================');
  
  try {
    await connectDB();
    
    // Créer les utilisateurs
    const adminUser = await createUsers();
    
    // Créer les programmes
    const programs = await createSamplePrograms(adminUser);
    
    // Créer les épisodes
    await createSampleEpisodes(programs, adminUser);
    
    // Créer les podcasts
    await createSamplePodcasts(adminUser);
    
    // Générer le résumé des statistiques
    const stats = await generateStatsSummary();
    
    console.log('\n🎉 INITIALISATION TERMINÉE 🎉');
    console.log('================================');
    if (stats) {
      console.log(`📊 Programmes: ${stats.programs} (${stats.totalProgramViews.toLocaleString()} vues)`);
      console.log(`📻 Épisodes: ${stats.episodes} (${stats.totalEpisodeViews.toLocaleString()} vues)`);
      console.log(`🎧 Podcasts: ${stats.podcasts}`);
      console.log(`👥 Utilisateurs: ${stats.users}`);
    }
    console.log('================================');
    console.log('🔐 IDENTIFIANTS DE CONNEXION:');
    console.log('Admin: admin@radio.com / admin123');
    console.log('User: user@radio.com / password123');
    console.log('================================');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  }
};

// Exécuter l'initialisation si appelé directement
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };