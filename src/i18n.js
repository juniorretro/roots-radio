import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      programs: 'Programs',
      episodes: 'Episodes',
      podcasts: 'Podcasts',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      admin: 'Admin',
      
      // Audio Player
      play: 'Play',
      pause: 'Pause',
      volume: 'Volume',
      liveStream: 'Live Stream',
      nowPlaying: 'Now Playing',
      
      // Programs
      currentProgram: 'Current Program',
      nextProgram: 'Next Program',
      schedule: 'Schedule',
      host: 'Host',
      category: 'Category',
      duration: 'Duration',
      
      // Episodes
      episode: 'Episode',
      season: 'Season',
      airDate: 'Air Date',
      
      // Podcasts
      podcast: 'Podcast',
      download: 'Download',
      like: 'Like',
      publishDate: 'Publish Date',
      
      // Common
      search: 'Search',
      filter: 'Filter',
      featured: 'Featured',
      all: 'All',
      title: 'Title',
      description: 'Description',
      loading: 'Loading...',
      noResults: 'No results found',
      
      // Forms
      email: 'Email',
      password: 'Password',
      username: 'Username',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      
      // Admin
      dashboard: 'Dashboard',
      stats: 'Statistics',
      manage: 'Manage',
      total: 'Total',
      active: 'Active',
      
      // Days
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      
      // Messages
      welcome: 'Welcome to Radio Streaming',
      noCurrentProgram: 'No current program',
      noNextProgram: 'No next program today'
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      programs: 'Programmes',
      episodes: 'Épisodes',
      podcasts: 'Podcasts',
      about: 'À Propos',
      contact: 'Contact',
      login: 'Connexion',
      register: 'Inscription',
      logout: 'Déconnexion',
      admin: 'Admin',
      
      // Audio Player
      play: 'Lecture',
      pause: 'Pause',
      volume: 'Volume',
      liveStream: 'Stream en Direct',
      nowPlaying: 'En Cours',
      
      // Programs
      currentProgram: 'Programme Actuel',
      nextProgram: 'Prochain Programme',
      schedule: 'Grille',
      host: 'Animateur',
      category: 'Catégorie',
      duration: 'Durée',
      
      // Episodes
      episode: 'Épisode',
      season: 'Saison',
      airDate: 'Date de Diffusion',
      
      // Podcasts
      podcast: 'Podcast',
      download: 'Télécharger',
      like: 'J\'aime',
      publishDate: 'Date de Publication',
      
      // Common
      search: 'Rechercher',
      filter: 'Filtrer',
      featured: 'À la Une',
      all: 'Tous',
      title: 'Titre',
      description: 'Description',
      loading: 'Chargement...',
      noResults: 'Aucun résultat trouvé',
      
      // Forms
      email: 'Email',
      password: 'Mot de passe',
      username: 'Nom d\'utilisateur',
      submit: 'Envoyer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      
      // Admin
      dashboard: 'Tableau de Bord',
      stats: 'Statistiques',
      manage: 'Gérer',
      total: 'Total',
      active: 'Actif',
      
      // Days
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      
      // Messages
      welcome: 'Bienvenue sur Radio Streaming',
      noCurrentProgram: 'Aucun programme en cours',
      noNextProgram: 'Aucun prochain programme aujourd\'hui'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
