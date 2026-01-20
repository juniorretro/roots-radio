import api from '../services/api';

// Données locales (fallback) - structure exacte de ton projet
export const radioPrograms = [
  {
    _id: '1',
    id: 'good-morning-vibes',
    slug: 'good-morning-vibes',
    title: 'Good Morning Vibes',
    description: 'Commencez votre journée avec les meilleurs vibes ! Musique, actualités et bonne humeur pour bien démarrer.',
    image: '/images/programs/good-morning-vibes.png',
    category: 'Matinal',
    host: 'L\'équipe matinale',
    schedule: {
      days: 'Tous les jours',
      time: '6h-10h',
      dayOfWeek: [1, 2, 3, 4, 5, 6, 0],
      startTime: '06:00',
      endTime: '10:00'
    },
    duration: 240,
    isActive: true
  },
  {
    _id: '2',
    id: 'selflist',
    slug: 'selflist',
    title: 'Selflist',
    description: 'Votre playlist personnalisée ! Écoutez vos titres préférés sélectionnés par vous.',
    image: '/images/programs/selflist.png',
    category: 'Interactif',
    host: 'DJ Selflist',
    schedule: {
      days: 'Samedi/Dimanche',
      time: '17h-18h',
      dayOfWeek: [6, 0],
      startTime: '17:00',
      endTime: '18:00'
    },
    duration: 60,
    isActive: true
  },
  {
    _id: '3',
    id: 'hit-30',
    slug: 'hit-30',
    title: 'Hit 30',
    description: 'Le Top 30 des hits du moment ! Découvrez les tubes qui font vibrer les ondes.',
    image: '/images/programs/hit-30.png',
    category: 'Charts',
    host: 'Hit Master',
    schedule: {
      days: 'Samedi/Dimanche',
      time: '18h-20h',
      dayOfWeek: [6, 0],
      startTime: '18:00',
      endTime: '20:00'
    },
    duration: 120,
    isActive: true
  },
  {
    _id: '4',
    id: 'roi-afrobeat',
    slug: 'les-roi-de-lafrobeat',
    title: 'Les Roi de l\'Afrobeat',
    description: 'Plongez dans l\'univers riche de l\'Afrobeat avec les plus grands classiques et nouveautés du genre.',
    image: '/images/programs/roi-afrobeat.png',
    category: 'Afrobeat',
    host: 'King Afrobeat',
    schedule: {
      days: 'Lundi à Vendredi',
      time: '19h-20h',
      dayOfWeek: [1, 2, 3, 4, 5],
      startTime: '19:00',
      endTime: '20:00'
    },
    duration: 60,
    isActive: true
  },
  {
    _id: '5',
    id: 'roots-funky',
    slug: 'roots-funky',
    title: 'Roots Funky',
    description: 'Retour aux sources avec le meilleur du funk et de la soul. Grooves garantis !',
    image: '/images/programs/roots-funky.png',
    category: 'Funk/Soul',
    host: 'Funky Master',
    schedule: {
      days: 'Dimanche',
      time: '20h-22h',
      dayOfWeek: [0],
      startTime: '20:00',
      endTime: '22:00'
    },
    duration: 120,
    isActive: true
  },
  {
    _id: '6',
    id: 'roots-classics',
    slug: 'roots-classics',
    title: 'Roots Classics',
    description: 'Les grands classiques qui ont marqué l\'histoire de la musique. Voyage dans le temps musical.',
    image: '/images/programs/roots-classics.png',
    category: 'Classiques',
    host: 'Classic DJ',
    schedule: {
      days: 'Dimanche',
      time: '10h-12h',
      dayOfWeek: [0],
      startTime: '10:00',
      endTime: '12:00'
    },
    duration: 120,
    isActive: true
  },
  {
    _id: '7',
    id: 'top-20-africa',
    slug: 'top-20-africa',
    title: 'TOP 20 AFRICA',
    description: 'Le classement des 20 plus gros hits africains du moment. La musique qui fait danser l\'Afrique !',
    image: '/images/programs/top-20-africa.jpg',
    category: 'Musique Africaine',
    host: 'Africa Sound',
    schedule: {
      days: 'Samedi/Dimanche',
      time: '12h-13h',
      dayOfWeek: [6, 0],
      startTime: '12:00',
      endTime: '13:00'
    },
    duration: 60,
    isActive: true
  },
  {
    _id: '8',
    id: 'mix-party-eric',
    slug: 'mix-party-by-eric-5etoiles',
    title: 'MIX PARTY BY ERIC 5ETOILES',
    description: 'Soirée mix party avec Eric 5étoiles ! Les meilleurs sons pour faire la fête jusqu\'au bout de la nuit.',
    image: '/images/programs/mix-party-eric.jpg',
    category: 'Mix/Party',
    host: 'Eric 5Etoiles',
    schedule: {
      days: 'Tous les Samedi',
      time: '20h-22h',
      dayOfWeek: [6],
      startTime: '20:00',
      endTime: '22:00'
    },
    duration: 120,
    isActive: true
  }
];

// Cache API avec gestion intelligente
let apiProgramsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour récupérer les programmes depuis l'API
export const fetchProgramsFromAPI = async () => {
  try {
    // Vérifier si le cache est encore valide
    if (apiProgramsCache && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log('📋 Utilisation du cache API (valide)');
      return apiProgramsCache;
    }

    console.log('🌐 Récupération des programmes depuis l\'API...');
    const response = await api.get('/api/programs'); // Endpoint adapté à ton API
    
    // Normaliser les données API pour compatibilité avec ton structure
    const normalizedPrograms = response.data.map(program => ({
      _id: program._id || program.id,
      id: program.id || program.slug,
      slug: program.slug || program.id,
      title: program.title || program.name,
      description: program.description || '',
      image: program.image || program.cover || '',
      category: program.category || 'Général',
      host: program.host || program.animator || 'Animateur',
      schedule: {
        days: program.schedule?.days || program.days || '',
        time: program.schedule?.time || program.time || '',
        dayOfWeek: program.schedule?.dayOfWeek || program.dayOfWeek || [],
        startTime: program.schedule?.startTime || program.startTime || '00:00',
        endTime: program.schedule?.endTime || program.endTime || '23:59'
      },
      duration: program.duration || 60,
      isActive: program.isActive !== undefined ? program.isActive : program.active !== undefined ? program.active : true
    }));

    apiProgramsCache = normalizedPrograms;
    lastFetchTime = Date.now();
    
    console.log(`✅ ${normalizedPrograms.length} programmes récupérés depuis l'API`);
    return apiProgramsCache;

  } catch (error) {
    console.error('❌ Erreur API:', error.message);
    return null; // Permettra le fallback vers les données locales
  }
};

// Fonction hybride pour obtenir tous les programmes
const getPrograms = async () => {
  try {
    const apiPrograms = await fetchProgramsFromAPI();
    if (apiPrograms && apiPrograms.length > 0) {
      return apiPrograms;
    }
  } catch (error) {
    console.log('⚠️ Fallback vers les données locales');
  }
  
  // Fallback vers les données locales
  return radioPrograms;
};

// FONCTIONS PRINCIPALES (Interface identique à ton code original)

// Obtenir le programme actuel
export const getCurrentProgram = async () => {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Dimanche, 1=Lundi, etc.
  const currentTime = now.toTimeString().slice(0, 5); // Format HH:MM
  
  const programs = await getPrograms();
  
  return programs.find(program => {
    if (!program.isActive) return false;
    
    const schedule = program.schedule || program;
    const { dayOfWeek, startTime, endTime } = schedule;
    
    // Vérifier si c'est le bon jour
    if (!dayOfWeek || !dayOfWeek.includes(currentDay)) return false;
    
    // Vérifier si c'est la bonne heure (gérer le passage minuit)
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      // Programme qui traverse minuit (ex: 23:00-01:00)
      return currentTime >= startTime || currentTime < endTime;
    }
  });
};

// Obtenir le prochain programme
export const getNextProgram = async () => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);
  
  const programs = await getPrograms();
  
  // Créer une liste de tous les créneaux de la semaine
  const allSlots = [];
  
  programs.filter(p => p.isActive).forEach(program => {
    const schedule = program.schedule || program;
    schedule.dayOfWeek.forEach(day => {
      allSlots.push({
        ...program,
        day: day,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      });
    });
  });
  
  // Trier par jour et heure
  allSlots.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Trouver le prochain programme
  for (let i = 0; i < allSlots.length; i++) {
    const slot = allSlots[i];
    if (slot.day > currentDay || (slot.day === currentDay && slot.startTime > currentTime)) {
      return slot;
    }
  }
  
  // Si aucun programme aujourd'hui, retourner le premier de la semaine prochaine
  return allSlots[0];
};

// Obtenir les programmes d'une journée
export const getProgramsByDay = async (dayOfWeek) => {
  const programs = await getPrograms();
  
  return programs
    .filter(program => {
      if (!program.isActive) return false;
      const schedule = program.schedule || program;
      return schedule.dayOfWeek && schedule.dayOfWeek.includes(dayOfWeek);
    })
    .sort((a, b) => {
      const aSchedule = a.schedule || a;
      const bSchedule = b.schedule || b;
      return aSchedule.startTime.localeCompare(bSchedule.startTime);
    });
};

// Obtenir un programme par slug
export const getProgramBySlug = async (slug) => {
  const programs = await getPrograms();
  return programs.find(program => program.slug === slug || program.id === slug);
};

// Obtenir tous les programmes actifs
export const getActivePrograms = async () => {
  const programs = await getPrograms();
  return programs.filter(program => program.isActive);
};

// FONCTIONS UTILITAIRES

// Formater les jours de diffusion
export const formatScheduleDays = (dayOfWeek) => {
  const dayNames = {
    0: 'Dimanche',
    1: 'Lundi', 
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi'
  };
  
  if (!Array.isArray(dayOfWeek)) return 'Jour inconnu';
  
  if (dayOfWeek.length === 7) return 'Tous les jours';
  if (dayOfWeek.length === 2 && dayOfWeek.includes(6) && dayOfWeek.includes(0)) {
    return 'Weekend';
  }
  if (dayOfWeek.length === 5 && !dayOfWeek.includes(6) && !dayOfWeek.includes(0)) {
    return 'En semaine';
  }
  
  return dayOfWeek.map(day => dayNames[day]).join(', ');
};

// Formater la durée en heures et minutes
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
};

// Vérifier si un programme est en cours
export const isProgramLive = (program) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);
  
  if (!program.isActive) return false;
  
  const schedule = program.schedule || program;
  if (!schedule.dayOfWeek.includes(currentDay)) return false;
  
  if (schedule.startTime <= schedule.endTime) {
    return currentTime >= schedule.startTime && currentTime < schedule.endTime;
  } else {
    return currentTime >= schedule.startTime || currentTime < schedule.endTime;
  }
};

// FONCTIONS DE GESTION DU CACHE

// Invalider le cache (utile après des modifications)
export const invalidateCache = () => {
  apiProgramsCache = null;
  lastFetchTime = null;
  console.log('🧹 Cache invalidé');
};

// Précharger les programmes (à appeler au démarrage de l'app)
export const preloadPrograms = async () => {
  try {
    await fetchProgramsFromAPI();
    console.log('✅ Programmes préchargés depuis l\'API');
    return true;
  } catch (error) {
    console.log('⚠️ Préchargement échoué, utilisation des données locales');
    return false;
  }
};

// Obtenir des statistiques sur les programmes
export const getProgramsStats = async () => {
  const programs = await getPrograms();
  const activePrograms = programs.filter(p => p.isActive);
  
  // Calculer la durée totale par jour
  const weeklyDuration = {};
  for (let day = 0; day < 7; day++) {
    const dayPrograms = await getProgramsByDay(day);
    weeklyDuration[day] = dayPrograms.reduce((total, program) => total + program.duration, 0);
  }
  
  return {
    total: programs.length,
    active: activePrograms.length,
    inactive: programs.length - activePrograms.length,
    categories: [...new Set(activePrograms.map(p => p.category))].sort(),
    hosts: [...new Set(activePrograms.map(p => p.host))].sort(),
    totalDuration: activePrograms.reduce((total, program) => total + program.duration, 0),
    weeklyDuration,
    dataSource: apiProgramsCache ? 'API' : 'Local',
    cacheAge: lastFetchTime ? Math.floor((Date.now() - lastFetchTime) / 1000) : 0
  };
};

// Rechercher un programme par clé/valeur
export const findProgramBy = async (key, value) => {
  const programs = await getPrograms();
  return programs.find(program => program[key] === value);
};

// Rechercher des programmes par terme
export const searchPrograms = async (searchTerm) => {
  const programs = await getPrograms();
  const term = searchTerm.toLowerCase();
  
  return programs.filter(program => 
    program.title.toLowerCase().includes(term) ||
    program.description.toLowerCase().includes(term) ||
    program.category.toLowerCase().includes(term) ||
    program.host.toLowerCase().includes(term)
  );
};

// Obtenir la grille de programmes complète (7 jours)
export const getFullSchedule = async () => {
  const schedule = {};
  
  for (let day = 0; day < 7; day++) {
    schedule[day] = await getProgramsByDay(day);
  }
  
  return schedule;
};

export default radioPrograms;