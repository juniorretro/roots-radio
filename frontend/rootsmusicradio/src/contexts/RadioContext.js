import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import api from '../services/api';
import { notifyNowPlaying } from '../services/pushNotifications';

const RadioContext = createContext();

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) throw new Error('useRadio must be used within a RadioProvider');
  return context;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────
// Helpers d'extraction — s'adaptent à tous
// les formats de réponse du backend :
//   - tableau direct    : [...]
//   - { programs: [...] }
//   - { data: [...] }
// ─────────────────────────────────────────
const extractArray = (data, key) => {
  if (Array.isArray(data))        return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data))  return data.data;
  return [];
};

// Pour episodes/podcasts on garde la forme paginée mais on garantit le tableau interne
const extractPaged = (data, key) => {
  if (Array.isArray(data))        return { [key]: data, totalPages: 1, total: data.length };
  if (Array.isArray(data?.[key])) return data;
  return { [key]: [], totalPages: 1, total: 0 };
};

// ─────────────────────────────────────────
// Fonctions Combined History (exportées)
// ─────────────────────────────────────────
export const getCombinedHistory = async (limit = 50) => {
  try { return (await api.get(`/api/combined-history?limit=${limit}`)).data.history || []; }
  catch { return []; }
};

export const getTodayCombinedHistory = async () => {
  try { return (await api.get('/api/combined-history/today')).data.history || []; }
  catch { return []; }
};

export const addEmissionToHistory = async (emissionData) => {
  try { return (await api.post('/api/combined-history/emission', emissionData)).data.emission; }
  catch (error) { console.error('Failed to add emission:', error); throw error; }
};

export const updateEmissionInHistory = async (id, emissionData) => {
  try { return (await api.put(`/api/combined-history/emission/${id}`, emissionData)).data.emission; }
  catch (error) { console.error('Failed to update emission:', error); throw error; }
};

export const deleteEmissionFromHistory = async (id) => {
  try { return (await api.delete(`/api/combined-history/emission/${id}`)).data; }
  catch (error) { console.error('Failed to delete emission:', error); throw error; }
};

export const deleteTrackFromHistory = async (id) => {
  try { return (await api.delete(`/api/combined-history/track/${id}`)).data; }
  catch (error) { console.error('Failed to delete track:', error); throw error; }
};

export const getCombinedHistoryStats = async () => {
  try { return (await api.get('/api/combined-history/stats')).data.stats; }
  catch { return null; }
};

// ─────────────────────────────────────────
// Cache module-level (survit aux re-renders)
// ─────────────────────────────────────────
const CACHE_DURATION = 5 * 60 * 1000;
const cache = {
  programs: { data: null, timestamp: null },
  episodes: { data: null, timestamp: null },
  podcasts: { data: null, timestamp: null },
  history:  { data: null, timestamp: null },
};

const isCacheValid    = (key) => !!(cache[key].data && cache[key].timestamp && Date.now() - cache[key].timestamp < CACHE_DURATION);
const setCache        = (key, data) => { cache[key] = { data, timestamp: Date.now() }; };
const invalidateKey   = (key) => { cache[key] = { data: null, timestamp: null }; };

// ─────────────────────────────────────────
// Provider
// ─────────────────────────────────────────
export const RadioProvider = ({ children }) => {
  const [socket, setSocket]                 = useState(null);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [nextProgram, setNextProgram]       = useState(null);
  const [volume, setVolume]                 = useState(0.7);
  const [nowPlaying, setNowPlaying]         = useState({
    title: '', artist: '', cover: '/images/default-cover.png', album: '', genre: '', listeners: 0,
  });
  const [playHistory, setPlayHistory]       = useState([]);
  const [currentTrack, setCurrentTrack]     = useState({
    title: 'Radio Stream', artist: 'Live', duration: 0, currentTime: 0,
  });

  const socketRef     = useRef(null);
  const isInitialized = useRef(false);

  // ─── Socket.IO ───
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const newSocket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect',       () => console.log('✅ Connected to radio server'));
    newSocket.on('disconnect',    (r) => console.log('❌ Disconnected:', r));
    newSocket.on('connect_error', (e) => console.error('❌ Socket error:', e));

    newSocket.on('nowPlaying', (data) => {
      const newTrack = {
        title:     data.title     || 'Titre inconnu',
        artist:    data.artist    || 'Artiste inconnu',
        cover:     data.cover     || '/images/default-cover.png',
        album:     data.album     || '',
        genre:     data.genre     || '',
        listeners: data.listeners || 0,
      };
      setNowPlaying(newTrack);
      notifyNowPlaying(newTrack);
      setPlayHistory(prev => {
        const dup = prev[0]?.title === newTrack.title && prev[0]?.artist === newTrack.artist;
        if (dup) return prev;
        return [{ ...newTrack, playedAt: new Date().toISOString(), _id: Date.now().toString() }, ...prev];
      });
      setCurrentTrack(prev => ({ ...prev, title: newTrack.title, artist: newTrack.artist }));
      if (newTrack.title && newTrack.artist) {
        toast.info(
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'DM Sans, sans-serif' }}>
            <img src={newTrack.cover} alt="cover"
              style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12, objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/images/default-cover.png'; }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#000', fontSize: 14 }}>{newTrack.title}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{newTrack.artist}</div>
            </div>
          </div>,
          { position: 'bottom-right', autoClose: 4000,
            style: { background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' } }
        );
      }
    });

    newSocket.on('programCreated', (p) => { toast.success(`Nouveau programme : ${p.title}`); invalidateKey('programs'); });
    newSocket.on('programUpdated', (p) => { toast.info(`Programme mis à jour : ${p.title}`);  invalidateKey('programs'); });
    newSocket.on('programDeleted', ()  => { invalidateKey('programs'); });
    newSocket.on('episodeCreated', (e) => { toast.success(`Nouvel épisode : ${e.title}`);      invalidateKey('episodes'); });
    newSocket.on('podcastCreated', (p) => { toast.success(`Nouveau podcast : ${p.title}`);     invalidateKey('podcasts'); });

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
      isInitialized.current = false;
    };
  }, []);

  // playHistory démarre vide — alimenté uniquement par les events Socket.io en temps réel

  // ─── Polling programme courant/suivant ───
  useEffect(() => {
    getCurrentProgram();
    getNextProgram();
    const id = setInterval(() => { getCurrentProgram(); getNextProgram(); }, 60_000);
    return () => clearInterval(id);
  }, []);

  // ─── Polling now-playing fallback ───
  useEffect(() => {
    getCurrentNowPlaying();
    const id = setInterval(getCurrentNowPlaying, 30_000);
    return () => clearInterval(id);
  }, []);

  // ─────────────────────────────────────────
  // PROGRAMS — retourne TOUJOURS un tableau []
  // ─────────────────────────────────────────
  const getPrograms = async (params = {}) => {
    const qs  = new URLSearchParams(params).toString();
    const url = `/api/programs${qs ? '?' + qs : ''}`;

    if (qs) {
      // Requête avec filtres → pas de cache
      try {
        const res = await api.get(url);
        return extractArray(res.data, 'programs');
      } catch { return []; }
    }

    // Requête sans filtre → cache
    if (isCacheValid('programs')) return extractArray(cache.programs.data, 'programs');
    try {
      const res = await api.get(url);
      setCache('programs', res.data);
      return extractArray(res.data, 'programs');
    } catch {
      return extractArray(cache.programs.data, 'programs');
    }
  };

  const getActivePrograms  = ()     => getPrograms();
  const getProgramsByDay   = (day)  => getPrograms({ day });
  const searchPrograms     = (q)    => getPrograms({ search: q });

  const getProgramBySlug = async (slug) => {
    try { return (await api.get(`/api/programs/${slug}`)).data; } catch { return null; }
  };

  const getCurrentProgram = async () => {
    try {
      const res  = await api.get('/api/programs/current/now');
      const prog = res.data?.program ?? res.data;
      setCurrentProgram(prog);
      return prog;
    } catch { return null; }
  };

  const getNextProgram = async () => {
    try {
      const res  = await api.get('/api/programs/next/upcoming');
      const prog = res.data?.program ?? res.data;
      setNextProgram(prog);
      return prog;
    } catch { return null; }
  };

  const createProgram = async (data) => {
    const res = await api.post('/api/programs', data);
    invalidateKey('programs');
    return res.data;
  };

  const updateProgram = async (id, data) => {
    const res = await api.put(`/api/programs/${id}`, data);
    invalidateKey('programs');
    return res.data;
  };

  const deleteProgram = async (id) => {
    const res = await api.delete(`/api/programs/${id}`);
    invalidateKey('programs');
    return res.data;
  };

  const getProgramsStats = async () => {
    const programs = await getPrograms();
    return {
      total:      programs.length,
      active:     programs.filter(p => p.active || p.isActive).length,
      featured:   programs.filter(p => p.featured).length,
      categories: [...new Set(programs.map(p => p.category).filter(Boolean))].length,
    };
  };

  const getFullSchedule = async () => {
    const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const schedule = {};
    await Promise.all(days.map(async d => { schedule[d] = await getProgramsByDay(d); }));
    return schedule;
  };

  // ─────────────────────────────────────────
  // EPISODES
  // ─────────────────────────────────────────
  const getEpisodes = async (params = {}) => {
    const qs  = new URLSearchParams(params).toString();
    const url = `/api/episodes${qs ? '?' + qs : ''}`;

    if (qs) {
      try {
        const res = await api.get(url);
        return extractPaged(res.data, 'episodes');
      } catch { return { episodes: [], totalPages: 1 }; }
    }

    if (isCacheValid('episodes')) return extractPaged(cache.episodes.data, 'episodes');
    try {
      const res = await api.get(url);
      setCache('episodes', res.data);
      return extractPaged(res.data, 'episodes');
    } catch {
      return extractPaged(cache.episodes.data, 'episodes');
    }
  };

  const getEpisodeBySlug     = async (slug) => { try { return (await api.get(`/api/episodes/${slug}`)).data; } catch { return null; } };
  const getEpisodesByProgram = async (slug) => { try { return (await api.get(`/api/episodes/program/${slug}`)).data; } catch { return { episodes: [], program: null }; } };

  const createEpisode = async (data) => { const res = await api.post('/api/episodes', data); invalidateKey('episodes'); return res.data; };
  const updateEpisode = async (id, data) => { const res = await api.put(`/api/episodes/${id}`, data); invalidateKey('episodes'); return res.data; };
  const deleteEpisode = async (id) => { const res = await api.delete(`/api/episodes/${id}`); invalidateKey('episodes'); return res.data; };
  const searchEpisodes = (q) => getEpisodes({ search: q });

  const getEpisodesStats = async () => {
    const { episodes = [] } = await getEpisodes();
    return {
      total:         episodes.length,
      featured:      episodes.filter(e => e.featured).length,
      totalDuration: episodes.reduce((s, e) => s + (e.duration || 0), 0),
    };
  };

  // ─────────────────────────────────────────
  // PODCASTS
  // ─────────────────────────────────────────
  const getPodcasts = async (params = {}) => {
    const qs  = new URLSearchParams(params).toString();
    const url = `/api/podcasts${qs ? '?' + qs : ''}`;

    if (qs) {
      try {
        const res = await api.get(url);
        return extractPaged(res.data, 'podcasts');
      } catch { return { podcasts: [], totalPages: 1 }; }
    }

    if (isCacheValid('podcasts')) return extractPaged(cache.podcasts.data, 'podcasts');
    try {
      const res = await api.get(url);
      setCache('podcasts', res.data);
      return extractPaged(res.data, 'podcasts');
    } catch {
      return extractPaged(cache.podcasts.data, 'podcasts');
    }
  };

  const getPodcastBySlug  = async (slug) => { try { return (await api.get(`/api/podcasts/${slug}`)).data; } catch { return null; } };
  const createPodcast     = async (data) => { const res = await api.post('/api/podcasts', data); invalidateKey('podcasts'); return res.data; };
  const updatePodcast     = async (id, data) => { const res = await api.put(`/api/podcasts/${id}`, data); invalidateKey('podcasts'); return res.data; };
  const deletePodcast     = async (id) => { const res = await api.delete(`/api/podcasts/${id}`); invalidateKey('podcasts'); return res.data; };
  const searchPodcasts    = (q) => getPodcasts({ search: q });

  const likePodcast = async (id) => {
    try { const res = await api.post(`/api/podcasts/${id}/like`); invalidateKey('podcasts'); return res.data; }
    catch { return null; }
  };

  const downloadPodcast = async (id) => {
    try { const res = await api.post(`/api/podcasts/${id}/download`); invalidateKey('podcasts'); return res.data; }
    catch { return null; }
  };

  const getPodcastsStats = async () => {
    const { podcasts = [] } = await getPodcasts();
    return {
      total:          podcasts.length,
      featured:       podcasts.filter(p => p.featured).length,
      totalDownloads: podcasts.reduce((s, p) => s + (p.downloads || 0), 0),
      totalLikes:     podcasts.reduce((s, p) => s + (p.likes || 0), 0),
    };
  };

  // ─────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────
  const getPlayHistory       = async (limit = 50) => { try { return (await api.get(`/api/history?limit=${limit}`)).data.history || []; } catch { return []; } };
  const getTodayHistory      = async () => { try { return (await api.get('/api/history/today')).data.history || []; } catch { return []; } };
  const getLatestTrack       = async () => { try { return (await api.get('/api/history/latest')).data.latest; } catch { return null; } };
  const searchHistory        = async (q) => { try { return (await api.get(`/api/history/search?q=${encodeURIComponent(q)}`)).data.results || []; } catch { return []; } };
  const getHistoryStats      = async () => { try { return (await api.get('/api/history/stats')).data.stats; } catch { return null; } };

  const getCurrentNowPlaying = async () => {
    try {
      const res = await api.get('/api/stream/now-playing');
      setNowPlaying({
        title:  res.data.title  || '',
        artist: res.data.artist || '',
        cover:  res.data.cover  || '/images/default-cover.png',
        album:  res.data.album  || '',
        genre:  res.data.genre  || '',
      });
      return res.data;
    } catch { return null; }
  };

  // ─────────────────────────────────────────
  // UPLOAD
  // ─────────────────────────────────────────
  const uploadFile = async (file, onProgress = null) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/api/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    });
    return res.data;
  };

  const uploadMultipleFiles = async (files, onProgress = null) => {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    const res = await api.post('/api/upload/multiple', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    });
    return res.data;
  };

  const deleteFile = async (filename) => (await api.delete(`/api/upload/${filename}`)).data;

  // ─── Player ───
  const togglePlay      = () => setIsPlaying(p => !p);
  const updateVolume    = (v) => setVolume(v);
  const updateTrackInfo = (info) => setCurrentTrack(prev => ({ ...prev, ...info }));

  // expose invalidateCache
  const invalidateCache = (key) => invalidateKey(key);

  const value = {
    socket,
    getCombinedHistory, getTodayCombinedHistory, addEmissionToHistory,
    updateEmissionInHistory, deleteEmissionFromHistory, deleteTrackFromHistory, getCombinedHistoryStats,
    isPlaying, volume, currentTrack, currentProgram, nextProgram, nowPlaying, playHistory,
    togglePlay, updateVolume, updateTrackInfo,
    getPrograms, getActivePrograms, getCurrentProgram, getNextProgram,
    getProgramsByDay, getProgramBySlug,
    createProgram, updateProgram, deleteProgram,
    getProgramsStats, searchPrograms, getFullSchedule,
    getEpisodes, getEpisodeBySlug, getEpisodesByProgram,
    createEpisode, updateEpisode, deleteEpisode,
    getEpisodesStats, searchEpisodes,
    getPodcasts, getPodcastBySlug,
    createPodcast, updatePodcast, deletePodcast,
    getPodcastsStats, searchPodcasts, likePodcast, downloadPodcast,
    getPlayHistory, getTodayHistory, getLatestTrack,
    searchHistory, getHistoryStats, getCurrentNowPlaying,
    uploadFile, uploadMultipleFiles, deleteFile,
    invalidateCache,
  };

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
};