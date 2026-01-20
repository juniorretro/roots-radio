// const axios = require('axios');

// const getCoverFromITunes = async (artist, title) => {
//   try {
//     const query = encodeURIComponent(`${artist} ${title}`);
//     const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=1`;

//     const { data } = await axios.get(url);

//     if (data.results && data.results.length > 0) {
//       return data.results[0].artworkUrl100.replace('100x100', '600x600');
//     }

//     return null;
//   } catch (err) {
//     console.error('iTunes cover error:', err.message);
//     return null;
//   }
// };

// module.exports = { getCoverFromITunes };

const axios = require('axios');

/**
 * Récupère la pochette d'album depuis l'API iTunes
 * @param {string} artist - Nom de l'artiste
 * @param {string} title - Titre du morceau
 * @returns {Promise<string|null>} URL de la pochette ou null
 */
const getCoverFromITunes = async (artist, title) => {
  try {
    // Nettoyage des paramètres
    const cleanArtist = artist?.trim() || '';
    const cleanTitle = title?.trim() || '';
    
    if (!cleanArtist && !cleanTitle) {
      console.log('⚠️ Artist and title are empty, skipping iTunes search');
      return null;
    }

    const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
    const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=1`;

    console.log(`🔍 Searching iTunes for: "${cleanArtist} - ${cleanTitle}"`);

    const { data } = await axios.get(url, {
      timeout: 5000 // Timeout après 5 secondes
    });

    if (data.results && data.results.length > 0) {
      // Récupérer l'URL en haute résolution (600x600 au lieu de 100x100)
      const coverUrl = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
      console.log(`✅ Cover found: ${coverUrl}`);
      return coverUrl;
    }

    console.log('❌ No cover found on iTunes');
    return null;
  } catch (err) {
    console.error('❌ iTunes API error:', err.message);
    return null;
  }
};

module.exports = { getCoverFromITunes };