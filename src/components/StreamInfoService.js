// StreamInfoService.js
import { useState, useEffect, useCallback } from 'react';

// Service pour récupérer les informations du flux radio
export class StreamInfoService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 secondes
  }

  // Méthode pour récupérer les informations actuelles
  async getCurrentInfo() {
    const cacheKey = 'current-info';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Option 1: API de votre serveur radio
      const response = await fetch(`${this.apiUrl}/current-info`);
      if (!response.ok) throw new Error('Failed to fetch stream info');
      
      const data = await response.json();
      
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching stream info:', error);
      
      // Fallback: essayer avec des APIs publiques si disponibles
      return await this.tryAlternativeApis();
    }
  }

  // Méthodes alternatives pour récupérer les infos
  async tryAlternativeApis() {
    // Option 2: Parser les métadonnées ICY si supportées
    try {
      const response = await fetch(this.streamUrl, {
        headers: {
          'Icy-MetaData': '1'
        }
      });
      
      const icyMetaint = response.headers.get('icy-metaint');
      if (icyMetaint) {
        // Logique pour parser les métadonnées ICY
        return await this.parseIcyMetadata(response, parseInt(icyMetaint));
      }
    } catch (error) {
      console.error('ICY metadata not supported:', error);
    }

    // Option 3: API tierce (exemple avec Radio-Browser API)
    try {
      const response = await fetch('https://de1.api.radio-browser.info/json/stations/byurl/' + encodeURIComponent(this.streamUrl));
      const stations = await response.json();
      
      if (stations && stations.length > 0) {
        const station = stations[0];
        return {
          title: station.name,
          artist: station.tags || '',
          program: {
            title: station.name,
            host: station.tags || 'Radio Host'
          },
          isLive: true
        };
      }
    } catch (error) {
      console.error('Radio-Browser API error:', error);
    }

    // Retour par défaut
    return {
      title: 'Radio Stream',
      artist: 'Live Radio',
      program: {
        title: 'Émission en cours',
        host: 'Radio Host'
      },
      isLive: true
    };
  }

  // Parser les métadonnées ICY (format spécial des radios)
  async parseIcyMetadata(response, metaint) {
    // Cette méthode nécessite une implémentation plus complexe
    // pour parser le format ICY des métadonnées radio
    return null;
  }
}

// Hook React pour utiliser le service
export const useStreamInfo = (streamUrl, updateInterval = 30000) => {
  const [streamInfo, setStreamInfo] = useState({
    title: 'Chargement...',
    artist: '',
    program: null,
    isLive: false,
    isLoading: true,
    error: null
  });

  const [service] = useState(() => new StreamInfoService('https://votre-api.com/api'));

  const fetchStreamInfo = useCallback(async () => {
    try {
      setStreamInfo(prev => ({ ...prev, isLoading: true, error: null }));
      
      const info = await service.getCurrentInfo();
      
      setStreamInfo({
        title: info.title || 'Radio Stream',
        artist: info.artist || '',
        program: info.program || null,
        isLive: info.isLive || false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setStreamInfo(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  }, [service]);

  useEffect(() => {
    // Fetch initial data
    fetchStreamInfo();

    // Set up interval for updates
    const interval = setInterval(fetchStreamInfo, updateInterval);

    return () => clearInterval(interval);
  }, [fetchStreamInfo, updateInterval]);

  return {
    ...streamInfo,
    refresh: fetchStreamInfo
  };
};