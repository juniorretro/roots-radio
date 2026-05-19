// services/adFilter.js

/**
 * Service de filtrage des publicités et contenus non-musicaux
 */

// Liste noire de mots-clés indiquant une publicité
const AD_KEYWORDS = [
  'pub',
  'publicité',
  'advertising',
  'commercial',
  'sponsor',
  'promo',
  'promotion',
  'annonce',
  'message',
  'jingle',
  'jingles',
  'spot',
  'partenaire',
  'offre',
  'produit',
  'service',
  'intro ',
  'top horaire',
  'non stop',
  'indicatif',
  'générique',
  'www.',
  'http',
  '.com',
  '.fr',
  '.net',
  'tel:',
  'telephone',
  'appelez',
  'contactez'
];

// Liste noire d'artistes/sources de pub connus
const AD_ARTISTS = [
  'radio',
  'station',
  'roots radio',
  'publicité',
  'commercial',
  'annonce',
  'jingle',
  'spot',
  'promo'
];

// Durées suspectes (en secondes) - les pubs durent souvent 15, 30 ou 60 secondes
const SUSPICIOUS_DURATIONS = [15, 30, 45, 60];

/**
 * Vérifie si un titre ou artiste contient des mots-clés de publicité
 */
const containsAdKeywords = (text) => {
  if (!text) return false;
  
  const lowerText = text.toLowerCase().trim();
  
  return AD_KEYWORDS.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
};

/**
 * Vérifie si l'artiste est dans la liste noire
 */
const isBlacklistedArtist = (artist) => {
  if (!artist) return false;
  
  const lowerArtist = artist.toLowerCase().trim();
  
  return AD_ARTISTS.some(blocked => 
    lowerArtist.includes(blocked.toLowerCase())
  );
};

/**
 * Détecte si le format ressemble à une pub (ex: "Roots Radio - Publicité")
 */
const hasAdFormat = (title, artist) => {
  if (!title || !artist) return false;
  
  const combined = `${title} ${artist}`.toLowerCase();
  
  // Patterns suspects
  const suspiciousPatterns = [
    /radio\s*-\s*pub/i,
    /station\s*-\s*annonce/i,
    /jingle\s*-/i,
    /spot\s*-/i,
    /^\s*pub\s*-/i,
    /promo\s*\d+/i,
    /offre\s+spéciale/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(combined));
};

/**
 * Vérifie si le titre est trop court ou générique
 */
const isTooGeneric = (title) => {
  if (!title) return true;
  
  const cleanTitle = title.trim();
  
  // Titre trop court (moins de 3 caractères)
  if (cleanTitle.length < 3) return true;
  
  // Titres génériques
  const genericTitles = [
    'unknown',
    'inconnu',
    'stream',
    'live',
    'radio',
    'music',
    'musique',
    'titre',
    'track',
    'song',
    'test'
  ];
  
  return genericTitles.some(generic => 
    cleanTitle.toLowerCase() === generic
  );
};

/**
 * Détection de doublons récents (même artiste/titre dans les X dernières secondes)
 */
const isDuplicateRecent = (title, artist, recentHistory, maxAgeSeconds = 300) => {
  if (!recentHistory || recentHistory.length === 0) return false;
  
  const now = new Date();
  const cutoff = new Date(now - maxAgeSeconds * 1000);
  
  return recentHistory.some(track => {
    const trackDate = new Date(track.playedAt);
    return trackDate >= cutoff &&
           track.title?.toLowerCase() === title?.toLowerCase() &&
           track.artist?.toLowerCase() === artist?.toLowerCase();
  });
};

/**
 * Score de confiance qu'il s'agit d'une vraie chanson (0-100)
 */
const calculateMusicConfidenceScore = (trackData) => {
  let score = 100;
  
  const { title, artist, album, genre, duration, cover } = trackData;
  
  // Pénalités
  if (containsAdKeywords(title)) score -= 40;
  if (containsAdKeywords(artist)) score -= 40;
  if (isBlacklistedArtist(artist)) score -= 50;
  if (hasAdFormat(title, artist)) score -= 35;
  if (isTooGeneric(title)) score -= 25;
  if (!album || album.trim() === '') score -= 10;
  if (!genre || genre.trim() === '') score -= 10;
  if (cover === '/images/default-cover.png') score -= 15;
  
  // Durée suspecte (publicité typique)
  if (duration && SUSPICIOUS_DURATIONS.includes(duration)) {
    score -= 20;
  }
  
  // Bonus si toutes les infos sont présentes
  if (title && artist && album && genre && cover !== '/images/default-cover.png') {
    score += 15;
  }
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Fonction principale : Détermine si un track doit être ajouté à l'historique
 */
const shouldAddToHistory = (trackData, recentHistory = [], options = {}) => {
  const {
    minConfidenceScore = 50, // Score minimum pour être considéré comme musique
    checkDuplicates = true,
    duplicateMaxAge = 300 // 5 minutes
  } = options;
  
  const { title, artist } = trackData;
  
  // Vérifications basiques
  if (!title || !artist) {
    return {
      shouldAdd: false,
      reason: 'Titre ou artiste manquant',
      score: 0
    };
  }
  
  // Vérification des doublons
  if (checkDuplicates && isDuplicateRecent(title, artist, recentHistory, duplicateMaxAge)) {
    return {
      shouldAdd: false,
      reason: 'Doublon récent détecté',
      score: 0
    };
  }
  
  // Calcul du score de confiance
  const score = calculateMusicConfidenceScore(trackData);
  
  if (score < minConfidenceScore) {
    return {
      shouldAdd: false,
      reason: `Score de confiance trop faible (${score}/${minConfidenceScore})`,
      score
    };
  }
  
  return {
    shouldAdd: true,
    reason: 'Track validé',
    score
  };
};

/**
 * Ajouter un mot-clé à la liste noire (pour personnalisation)
 */
const addToBlacklist = (keyword, type = 'keyword') => {
  if (type === 'keyword') {
    if (!AD_KEYWORDS.includes(keyword.toLowerCase())) {
      AD_KEYWORDS.push(keyword.toLowerCase());
    }
  } else if (type === 'artist') {
    if (!AD_ARTISTS.includes(keyword.toLowerCase())) {
      AD_ARTISTS.push(keyword.toLowerCase());
    }
  }
};

/**
 * Nettoyer l'historique existant des publicités
 */
const cleanExistingHistory = async (PlayHistory) => {
  try {
    const allHistory = await PlayHistory.find().lean();
    const toDelete = [];
    
    for (const track of allHistory) {
      const result = shouldAddToHistory(track, [], { minConfidenceScore: 40 });
      if (!result.shouldAdd) {
        toDelete.push(track._id);
      }
    }
    
    if (toDelete.length > 0) {
      await PlayHistory.deleteMany({ _id: { $in: toDelete } });
      console.log(`🧹 Cleaned ${toDelete.length} ads/suspicious tracks from history`);
    }
    
    return { deleted: toDelete.length };
  } catch (error) {
    console.error('❌ Error cleaning history:', error);
    throw error;
  }
};

module.exports = {
  shouldAddToHistory,
  calculateMusicConfidenceScore,
  addToBlacklist,
  cleanExistingHistory,
  containsAdKeywords,
  isBlacklistedArtist,
  hasAdFormat,
  isTooGeneric
};