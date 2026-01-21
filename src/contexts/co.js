// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { toast } from 'react-toastify';

// const RadioContext = createContext();

// export const useRadio = () => {
//   const context = useContext(RadioContext);
//   if (!context) {
//     throw new Error('useRadio must be used within a RadioProvider');
//   }
//   return context;
// };

// // Cache configuration
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// // Cache storage
// const cache = {
//   programs: { data: null, timestamp: null },
//   episodes: { data: null, timestamp: null },
//   podcasts: { data: null, timestamp: null }
// };

// export const RadioProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentProgram, setCurrentProgram] = useState(null);
//   const [nextProgram, setNextProgram] = useState(null);
//   const [volume, setVolume] = useState(0.7);
//   const [currentTrack, setCurrentTrack] = useState({
//     title: 'Radio Stream',
//     artist: 'Live',
//     duration: 0,
//     currentTime: 0
//   });

//   // Socket connection
//   useEffect(() => {
//     const newSocket = io('http://localhost:5000');
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('Connected to radio server');
//     });

//     newSocket.on('disconnect', () => {
//       console.log('Disconnected from radio server');
//     });

//     // Listen for real-time updates
//     newSocket.on('programCreated', (program) => {
//       toast.info(`New program added: ${program.title}`);
//       invalidateCache('programs');
//     });

//     newSocket.on('programUpdated', (program) => {
//       toast.info(`Program updated: ${program.title}`);
//       invalidateCache('programs');
//     });

//     newSocket.on('episodeCreated', (episode) => {
//       toast.info(`New episode: ${episode.title}`);
//       invalidateCache('episodes');
//     });

//     newSocket.on('podcastCreated', (podcast) => {
//       toast.info(`New podcast: ${podcast.title}`);
//       invalidateCache('podcasts');
//     });

//     return () => newSocket.close();
//   }, []);

//   // Cache helper functions
//   const isCacheValid = (cacheKey) => {
//     const cached = cache[cacheKey];
//     if (!cached.data || !cached.timestamp) return false;
//     return Date.now() - cached.timestamp < CACHE_DURATION;
//   };

//   const setCache = (cacheKey, data) => {
//     cache[cacheKey] = {
//       data,
//       timestamp: Date.now()
//     };
//   };

//   const invalidateCache = (cacheKey) => {
//     if (cache[cacheKey]) {
//       cache[cacheKey] = { data: null, timestamp: null };
//     }
//   };

//   // Generic data fetcher with cache
//   const fetchWithCache = async (cacheKey, apiUrl, fallbackData = []) => {
//     // Check cache first
//     if (isCacheValid(cacheKey)) {
//       return cache[cacheKey].data;
//     }

//     try {
//       const response = await axios.get(apiUrl);
//       const data = response.data;
//       setCache(cacheKey, data);
//       return data;
//     } catch (error) {
//       console.error(`Failed to fetch ${cacheKey}:`, error);
//       // Return cached data if available, otherwise fallback
//       return cache[cacheKey].data || fallbackData;
//     }
//   };

//   // Programs API functions
//   const getCurrentProgram = async () => {
//     try {
//       const response = await axios.get('/api/programs/current/now');
//       const program = response.data.program;
//       setCurrentProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get current program:', error);
//       return null;
//     }
//   };

//   const getNextProgram = async () => {
//     try {
//       const response = await axios.get('/api/programs/next/upcoming');
//       const program = response.data.program;
//       setNextProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get next program:', error);
//       return null;
//     }
//   };

//   const getProgramsByDay = async (day) => {
//     return await fetchWithCache('programs', `/api/programs?day=${day}`, []);
//   };

//   const getProgramBySlug = async (slug) => {
//     try {
//       const response = await axios.get(`/api/programs/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get program:', error);
//       return null;
//     }
//   };

//   const getActivePrograms = async () => {
//     return await fetchWithCache('programs', '/api/programs', []);
//   };

//   const getProgramsStats = async () => {
//     try {
//       const programs = await getActivePrograms();
//       const stats = {
//         total: programs.length,
//         active: programs.filter(p => p.isActive).length,
//         featured: programs.filter(p => p.featured).length,
//         categories: [...new Set(programs.map(p => p.category))].length
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get programs stats:', error);
//       return { total: 0, active: 0, featured: 0, categories: 0 };
//     }
//   };

//   const searchPrograms = async (query) => {
//     return await fetchWithCache('programs', `/api/programs?search=${encodeURIComponent(query)}`, []);
//   };

//   const getFullSchedule = async () => {
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const schedule = {};
    
//     for (const day of days) {
//       schedule[day] = await getProgramsByDay(day);
//     }
    
//     return schedule;
//   };

//   // Episodes API functions
//   const getEpisodes = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/episodes${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('episodes', url, { episodes: [], pagination: {} });
//   };

//   const getEpisodeBySlug = async (slug) => {
//     try {
//       const response = await axios.get(`/api/episodes/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episode:', error);
//       return null;
//     }
//   };

//   const getEpisodesByProgram = async (slug) => {
//     try {
//       const response = await axios.get(`/api/episodes/program/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episodes by program:', error);
//       return { episodes: [], program: null };
//     }
//   };

//   const getEpisodesStats = async () => {
//     try {
//       const data = await getEpisodes();
//       const episodes = data.episodes || [];
//       const stats = {
//         total: episodes.length,
//         featured: episodes.filter(e => e.featured).length,
//         totalDuration: episodes.reduce((sum, e) => sum + (e.duration || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get episodes stats:', error);
//       return { total: 0, featured: 0, totalDuration: 0 };
//     }
//   };

//   const searchEpisodes = async (query) => {
//     return await getEpisodes({ search: query });
//   };

//   // Podcasts API functions
//   const getPodcasts = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/podcasts${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('podcasts', url, { podcasts: [], pagination: {} });
//   };

//   const getPodcastBySlug = async (slug) => {
//     try {
//       const response = await axios.get(`/api/podcasts/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get podcast:', error);
//       return null;
//     }
//   };

//   const getPodcastsStats = async () => {
//     try {
//       const data = await getPodcasts();
//       const podcasts = data.podcasts || [];
//       const stats = {
//         total: podcasts.length,
//         featured: podcasts.filter(p => p.featured).length,
//         totalDownloads: podcasts.reduce((sum, p) => sum + (p.downloads || 0), 0),
//         totalLikes: podcasts.reduce((sum, p) => sum + (p.likes || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get podcasts stats:', error);
//       return { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 };
//     }
//   };

//   const searchPodcasts = async (query) => {
//     return await getPodcasts({ search: query });
//   };

//   const likePodcast = async (id) => {
//     try {
//       const response = await axios.post(`/api/podcasts/${id}/like`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to like podcast:', error);
//       return null;
//     }
//   };

//   const downloadPodcast = async (id) => {
//     try {
//       const response = await axios.post(`/api/podcasts/${id}/download`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to record download:', error);
//       return null;
//     }
//   };

//   // Audio player functions
//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const updateVolume = (newVolume) => {
//     setVolume(newVolume);
//   };

//   const updateTrackInfo = (trackInfo) => {
//     setCurrentTrack({ ...currentTrack, ...trackInfo });
//   };

//   // Initialize current and next programs
//   useEffect(() => {
//     getCurrentProgram();
//     getNextProgram();
    
//     // Update every minute
//     const interval = setInterval(() => {
//       getCurrentProgram();
//       getNextProgram();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const value = {
//     // Socket
//     socket,
    
//     // Player state
//     isPlaying,
//     volume,
//     currentTrack,
//     currentProgram,
//     nextProgram,
    
//     // Player controls
//     togglePlay,
//     updateVolume,
//     updateTrackInfo,
    
//     // Programs API
//     getCurrentProgram,
//     getNextProgram,
//     getProgramsByDay,
//     getProgramBySlug,
//     getActivePrograms,
//     getProgramsStats,
//     searchPrograms,
//     getFullSchedule,
    
//     // Episodes API
//     getEpisodes,
//     getEpisodeBySlug,
//     getEpisodesByProgram,
//     getEpisodesStats,
//     searchEpisodes,
    
//     // Podcasts API
//     getPodcasts,
//     getPodcastBySlug,
//     getPodcastsStats,
//     searchPodcasts,
//     likePodcast,
//     downloadPodcast,
    
//     // Cache management
//     invalidateCache
//   };

//   return (
//     <RadioContext.Provider value={value}>
//       {children}
//     </RadioContext.Provider>
//   );
// };


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { toast } from 'react-toastify';

// const RadioContext = createContext();

// export const useRadio = () => {
//   const context = useContext(RadioContext);
//   if (!context) {
//     throw new Error('useRadio must be used within a RadioProvider');
//   }
//   return context;
// };

// // Configuration de la base URL pour les requêtes API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // Configuration axios avec base URL et intercepteurs
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// // Intercepteur pour ajouter le token d'authentification
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Intercepteur pour gérer les erreurs de réponse
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Cache configuration
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// // Cache storage
// const cache = {
//   programs: { data: null, timestamp: null },
//   episodes: { data: null, timestamp: null },
//   podcasts: { data: null, timestamp: null }
// };

// export const RadioProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentProgram, setCurrentProgram] = useState(null);
//   const [nextProgram, setNextProgram] = useState(null);
//   const [volume, setVolume] = useState(0.7);
//   const [currentTrack, setCurrentTrack] = useState({
//     title: 'Radio Stream',
//     artist: 'Live',
//     duration: 0,
//     currentTime: 0
//   });

//   // Socket connection
//   useEffect(() => {
//     const newSocket = io(API_BASE_URL);
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('Connected to radio server');
//     });

//     newSocket.on('disconnect', () => {
//       console.log('Disconnected from radio server');
//     });

//     // Listen for real-time updates
//     newSocket.on('programCreated', (program) => {
//       toast.info(`New program added: ${program.title}`);
//       invalidateCache('programs');
//     });

//     newSocket.on('programUpdated', (program) => {
//       toast.info(`Program updated: ${program.title}`);
//       invalidateCache('programs');
//     });

//     newSocket.on('episodeCreated', (episode) => {
//       toast.info(`New episode: ${episode.title}`);
//       invalidateCache('episodes');
//     });

//     newSocket.on('podcastCreated', (podcast) => {
//       toast.info(`New podcast: ${podcast.title}`);
//       invalidateCache('podcasts');
//     });

//     return () => newSocket.close();
//   }, []);

//   // Cache helper functions
//   const isCacheValid = (cacheKey) => {
//     const cached = cache[cacheKey];
//     if (!cached.data || !cached.timestamp) return false;
//     return Date.now() - cached.timestamp < CACHE_DURATION;
//   };

//   const setCache = (cacheKey, data) => {
//     cache[cacheKey] = {
//       data,
//       timestamp: Date.now()
//     };
//   };

//   const invalidateCache = (cacheKey) => {
//     if (cache[cacheKey]) {
//       cache[cacheKey] = { data: null, timestamp: null };
//     }
//   };

//   // Generic data fetcher with cache
//   const fetchWithCache = async (cacheKey, apiUrl, fallbackData = []) => {
//     if (isCacheValid(cacheKey)) {
//       return cache[cacheKey].data;
//     }

//     try {
//       const response = await apiClient.get(apiUrl);
//       const data = response.data;
//       setCache(cacheKey, data);
//       return data;
//     } catch (error) {
//       console.error(`Failed to fetch ${cacheKey}:`, error);
//       return cache[cacheKey].data || fallbackData;
//     }
//   };

//   // =======================
//   // PROGRAMS API FUNCTIONS
//   // =======================

//   const getPrograms = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/programs${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('programs', url, []);
//   };

//   const getCurrentProgram = async () => {
//     try {
//       const response = await apiClient.get('/api/programs/current/now');
//       const program = response.data.program;
//       setCurrentProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get current program:', error);
//       return null;
//     }
//   };

//   const getNextProgram = async () => {
//     try {
//       const response = await apiClient.get('/api/programs/next/upcoming');
//       const program = response.data.program;
//       setNextProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get next program:', error);
//       return null;
//     }
//   };

//   const getProgramsByDay = async (day) => {
//     return await fetchWithCache('programs', `/api/programs?day=${day}`, []);
//   };

//   const getProgramBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/programs/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get program:', error);
//       return null;
//     }
//   };

//   const getActivePrograms = async () => {
//     return await fetchWithCache('programs', '/api/programs', []);
//   };

//   const createProgram = async (programData) => {
//     try {
//       const response = await apiClient.post('/api/programs', programData);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create program:', error);
//       throw error;
//     }
//   };

//   const updateProgram = async (id, programData) => {
//     try {
//       const response = await apiClient.put(`/api/programs/${id}`, programData);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update program:', error);
//       throw error;
//     }
//   };

//   const deleteProgram = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/programs/${id}`);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete program:', error);
//       throw error;
//     }
//   };

//   const getProgramsStats = async () => {
//     try {
//       const programs = await getActivePrograms();
//       const stats = {
//         total: programs.length,
//         active: programs.filter(p => p.isActive).length,
//         featured: programs.filter(p => p.featured).length,
//         categories: [...new Set(programs.map(p => p.category))].length
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get programs stats:', error);
//       return { total: 0, active: 0, featured: 0, categories: 0 };
//     }
//   };

//   const searchPrograms = async (query) => {
//     return await fetchWithCache('programs', `/api/programs?search=${encodeURIComponent(query)}`, []);
//   };

//   const getFullSchedule = async () => {
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const schedule = {};
    
//     for (const day of days) {
//       schedule[day] = await getProgramsByDay(day);
//     }
    
//     return schedule;
//   };

//   // =======================
//   // EPISODES API FUNCTIONS
//   // =======================

//   const getEpisodes = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/episodes${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('episodes', url, { episodes: [], pagination: {} });
//   };

//   const getEpisodeBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/episodes/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episode:', error);
//       return null;
//     }
//   };

//   const getEpisodesByProgram = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/episodes/program/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episodes by program:', error);
//       return { episodes: [], program: null };
//     }
//   };

//   const createEpisode = async (episodeData) => {
//     try {
//       const response = await apiClient.post('/api/episodes', episodeData);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create episode:', error);
//       throw error;
//     }
//   };

//   const updateEpisode = async (id, episodeData) => {
//     try {
//       const response = await apiClient.put(`/api/episodes/${id}`, episodeData);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update episode:', error);
//       throw error;
//     }
//   };

//   const deleteEpisode = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/episodes/${id}`);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete episode:', error);
//       throw error;
//     }
//   };

//   const getEpisodesStats = async () => {
//     try {
//       const data = await getEpisodes();
//       const episodes = data.episodes || [];
//       const stats = {
//         total: episodes.length,
//         featured: episodes.filter(e => e.featured).length,
//         totalDuration: episodes.reduce((sum, e) => sum + (e.duration || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get episodes stats:', error);
//       return { total: 0, featured: 0, totalDuration: 0 };
//     }
//   };

//   const searchEpisodes = async (query) => {
//     return await getEpisodes({ search: query });
//   };

//   // =======================
//   // PODCASTS API FUNCTIONS
//   // =======================

//   const getPodcasts = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/podcasts${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('podcasts', url, { podcasts: [], pagination: {} });
//   };

//   const getPodcastBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/podcasts/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get podcast:', error);
//       return null;
//     }
//   };

//   const createPodcast = async (podcastData) => {
//     try {
//       const response = await apiClient.post('/api/podcasts', podcastData);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create podcast:', error);
//       throw error;
//     }
//   };

//   const updatePodcast = async (id, podcastData) => {
//     try {
//       const response = await apiClient.put(`/api/podcasts/${id}`, podcastData);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update podcast:', error);
//       throw error;
//     }
//   };

//   const deletePodcast = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/podcasts/${id}`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete podcast:', error);
//       throw error;
//     }
//   };

//   const getPodcastsStats = async () => {
//     try {
//       const data = await getPodcasts();
//       const podcasts = data.podcasts || [];
//       const stats = {
//         total: podcasts.length,
//         featured: podcasts.filter(p => p.featured).length,
//         totalDownloads: podcasts.reduce((sum, p) => sum + (p.downloads || 0), 0),
//         totalLikes: podcasts.reduce((sum, p) => sum + (p.likes || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get podcasts stats:', error);
//       return { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 };
//     }
//   };

//   const searchPodcasts = async (query) => {
//     return await getPodcasts({ search: query });
//   };

//   const likePodcast = async (id) => {
//     try {
//       const response = await apiClient.post(`/api/podcasts/${id}/like`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to like podcast:', error);
//       return null;
//     }
//   };

//   const downloadPodcast = async (id) => {
//     try {
//       const response = await apiClient.post(`/api/podcasts/${id}/download`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to record download:', error);
//       return null;
//     }
//   };

//   // =======================
//   // UPLOAD API FUNCTIONS
//   // =======================

//   const uploadFile = async (file, onProgress = null) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (onProgress) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       };

//       const response = await apiClient.post('/api/upload', formData, config);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload file:', error);
//       throw error;
//     }
//   };

//   const uploadMultipleFiles = async (files, onProgress = null) => {
//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append('files', file);
//       });

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (onProgress) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       };

//       const response = await apiClient.post('/api/upload/multiple', formData, config);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload files:', error);
//       throw error;
//     }
//   };

//   const deleteFile = async (filename) => {
//     try {
//       const response = await apiClient.delete(`/api/upload/${filename}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete file:', error);
//       throw error;
//     }
//   };

//   // =======================
//   // AUDIO PLAYER FUNCTIONS
//   // =======================

//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const updateVolume = (newVolume) => {
//     setVolume(newVolume);
//   };

//   const updateTrackInfo = (trackInfo) => {
//     setCurrentTrack({ ...currentTrack, ...trackInfo });
//   };

//   // Initialize current and next programs
//   useEffect(() => {
//     getCurrentProgram();
//     getNextProgram();
    
//     // Update every minute
//     const interval = setInterval(() => {
//       getCurrentProgram();
//       getNextProgram();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const value = {
//     // Socket
//     socket,
    
//     // Player state
//     isPlaying,
//     volume,
//     currentTrack,
//     currentProgram,
//     nextProgram,
    
//     // Player controls
//     togglePlay,
//     updateVolume,
//     updateTrackInfo,
    
//     // Programs API
//     getPrograms,
//     getCurrentProgram,
//     getNextProgram,
//     getProgramsByDay,
//     getProgramBySlug,
//     getActivePrograms,
//     createProgram,
//     updateProgram,
//     deleteProgram,
//     getProgramsStats,
//     searchPrograms,
//     getFullSchedule,
    
//     // Episodes API
//     getEpisodes,
//     getEpisodeBySlug,
//     getEpisodesByProgram,
//     createEpisode,
//     updateEpisode,
//     deleteEpisode,
//     getEpisodesStats,
//     searchEpisodes,
    
//     // Podcasts API
//     getPodcasts,
//     getPodcastBySlug,
//     createPodcast,
//     updatePodcast,
//     deletePodcast,
//     getPodcastsStats,
//     searchPodcasts,
//     likePodcast,
//     downloadPodcast,
    
//     // Upload API
//     uploadFile,
//     uploadMultipleFiles,
//     deleteFile,
    
//     // Cache management
//     invalidateCache
//   };

//   return (
//     <RadioContext.Provider value={value}>
//       {children}
//     </RadioContext.Provider>
//   );
// };

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { toast } from 'react-toastify';

// const RadioContext = createContext();

// export const useRadio = () => {
//   const context = useContext(RadioContext);
//   if (!context) {
//     throw new Error('useRadio must be used within a RadioProvider');
//   }
//   return context;
// };

// // Configuration de la base URL pour les requêtes API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // Configuration axios avec base URL et intercepteurs
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// // Intercepteur pour ajouter le token d'authentification
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Intercepteur pour gérer les erreurs de réponse
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Cache configuration
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// // Cache storage
// const cache = {
//   programs: { data: null, timestamp: null },
//   episodes: { data: null, timestamp: null },
//   podcasts: { data: null, timestamp: null }
// };

// export const RadioProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentProgram, setCurrentProgram] = useState(null);
//   const [nextProgram, setNextProgram] = useState(null);
//   const [volume, setVolume] = useState(0.7);
  
//   // État pour la musique en cours (métadonnées du stream)
//   const [nowPlaying, setNowPlaying] = useState({
//     title: '',
//     artist: '',
//     cover: '/images/default-cover.png',
//     album: '',
//     genre: ''
//   });

//   const [currentTrack, setCurrentTrack] = useState({
//     title: 'Radio Stream',
//     artist: 'Live',
//     duration: 0,
//     currentTime: 0
//   });

//   // Socket connection avec gestion des métadonnées en temps réel
//   useEffect(() => {
//     const newSocket = io(API_BASE_URL, {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 5
//     });
    
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('✅ Connected to radio server');
//     });

//     newSocket.on('disconnect', () => {
//       console.log('❌ Disconnected from radio server');
//     });

//     // 🎵 Écouter les métadonnées de la musique en cours
//     newSocket.on('nowPlaying', (data) => {
//       console.log('🎵 Now Playing:', data);
      
//       setNowPlaying({
//         title: data.title || 'Titre inconnu',
//         artist: data.artist || 'Artiste inconnu',
//         cover: data.cover || '/images/default-cover.png',
//         album: data.album || '',
//         genre: data.genre || ''
//       });

//       // Mettre à jour aussi currentTrack pour la compatibilité
//       setCurrentTrack(prev => ({
//         ...prev,
//         title: data.title || 'Radio Stream',
//         artist: data.artist || 'Live'
//       }));

//       // Toast élégant pour les changements de musique
//       if (isPlaying && data.title && data.artist) {
//         toast.info(
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             fontFamily: 'DM Sans, sans-serif'
//           }}>
//             <img 
//               src={data.cover || '/images/default-cover.png'} 
//               alt="cover"
//               style={{ 
//                 width: '48px', 
//                 height: '48px', 
//                 borderRadius: '8px',
//                 marginRight: '12px',
//                 objectFit: 'cover'
//               }}
//             />
//             <div>
//               <div style={{ fontWeight: '600', color: '#000', fontSize: '14px' }}>
//                 {data.title}
//               </div>
//               <div style={{ color: '#666', fontSize: '12px' }}>
//                 {data.artist}
//               </div>
//             </div>
//           </div>,
//           {
//             position: "bottom-right",
//             autoClose: 4000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             style: {
//               background: '#fff',
//               borderRadius: '12px',
//               border: '1px solid rgba(0,0,0,0.08)',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
//             }
//           }
//         );
//       }
//     });

//     // Listen for real-time updates
//     newSocket.on('programCreated', (program) => {
//       toast.success(
//         `Nouveau programme ajouté : ${program.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('programs');
//     });

//     newSocket.on('programUpdated', (program) => {
//       toast.info(
//         `Programme mis à jour : ${program.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('programs');
//     });

//     newSocket.on('episodeCreated', (episode) => {
//       toast.success(
//         `Nouvel épisode : ${episode.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('episodes');
//     });

//     newSocket.on('podcastCreated', (podcast) => {
//       toast.success(
//         `Nouveau podcast : ${podcast.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('podcasts');
//     });

//     // Gestion des erreurs de connexion
//     newSocket.on('connect_error', (error) => {
//       console.error('Connection error:', error);
//     });

//     newSocket.on('reconnect', (attemptNumber) => {
//       console.log(`Reconnected after ${attemptNumber} attempts`);
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, [isPlaying]);

//   // Cache helper functions
//   const isCacheValid = (cacheKey) => {
//     const cached = cache[cacheKey];
//     if (!cached.data || !cached.timestamp) return false;
//     return Date.now() - cached.timestamp < CACHE_DURATION;
//   };

//   const setCache = (cacheKey, data) => {
//     cache[cacheKey] = {
//       data,
//       timestamp: Date.now()
//     };
//   };

//   const invalidateCache = (cacheKey) => {
//     if (cache[cacheKey]) {
//       cache[cacheKey] = { data: null, timestamp: null };
//     }
//   };

//   // Generic data fetcher with cache
//   const fetchWithCache = async (cacheKey, apiUrl, fallbackData = []) => {
//     if (isCacheValid(cacheKey)) {
//       return cache[cacheKey].data;
//     }

//     try {
//       const response = await apiClient.get(apiUrl);
//       const data = response.data;
//       setCache(cacheKey, data);
//       return data;
//     } catch (error) {
//       console.error(`Failed to fetch ${cacheKey}:`, error);
//       return cache[cacheKey].data || fallbackData;
//     }
//   };

//   // =======================
//   // PROGRAMS API FUNCTIONS
//   // =======================

//   const getPrograms = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/programs${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('programs', url, []);
//   };

//   const getCurrentProgram = async () => {
//     try {
//       const response = await apiClient.get('/api/programs/current/now');
//       const program = response.data.program;
//       setCurrentProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get current program:', error);
//       return null;
//     }
//   };

//   const getNextProgram = async () => {
//     try {
//       const response = await apiClient.get('/api/programs/next/upcoming');
//       const program = response.data.program;
//       setNextProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get next program:', error);
//       return null;
//     }
//   };

//   const getProgramsByDay = async (day) => {
//     return await fetchWithCache('programs', `/api/programs?day=${day}`, []);
//   };

//   const getProgramBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/programs/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get program:', error);
//       return null;
//     }
//   };

//   const getActivePrograms = async () => {
//     return await fetchWithCache('programs', '/api/programs', []);
//   };

//   const createProgram = async (programData) => {
//     try {
//       const response = await apiClient.post('/api/programs', programData);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create program:', error);
//       throw error;
//     }
//   };

//   const updateProgram = async (id, programData) => {
//     try {
//       const response = await apiClient.put(`/api/programs/${id}`, programData);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update program:', error);
//       throw error;
//     }
//   };

//   const deleteProgram = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/programs/${id}`);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete program:', error);
//       throw error;
//     }
//   };

//   const getProgramsStats = async () => {
//     try {
//       const programs = await getActivePrograms();
//       const stats = {
//         total: programs.length,
//         active: programs.filter(p => p.isActive).length,
//         featured: programs.filter(p => p.featured).length,
//         categories: [...new Set(programs.map(p => p.category))].length
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get programs stats:', error);
//       return { total: 0, active: 0, featured: 0, categories: 0 };
//     }
//   };

//   const searchPrograms = async (query) => {
//     return await fetchWithCache('programs', `/api/programs?search=${encodeURIComponent(query)}`, []);
//   };

//   const getFullSchedule = async () => {
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const schedule = {};
    
//     for (const day of days) {
//       schedule[day] = await getProgramsByDay(day);
//     }
    
//     return schedule;
//   };

//   // =======================
//   // EPISODES API FUNCTIONS
//   // =======================

//   const getEpisodes = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/episodes${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('episodes', url, { episodes: [], pagination: {} });
//   };

//   const getEpisodeBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/episodes/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episode:', error);
//       return null;
//     }
//   };

//   const getEpisodesByProgram = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/episodes/program/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episodes by program:', error);
//       return { episodes: [], program: null };
//     }
//   };

//   const createEpisode = async (episodeData) => {
//     try {
//       const response = await apiClient.post('/api/episodes', episodeData);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create episode:', error);
//       throw error;
//     }
//   };

//   const updateEpisode = async (id, episodeData) => {
//     try {
//       const response = await apiClient.put(`/api/episodes/${id}`, episodeData);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update episode:', error);
//       throw error;
//     }
//   };

//   const deleteEpisode = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/episodes/${id}`);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete episode:', error);
//       throw error;
//     }
//   };

//   const getEpisodesStats = async () => {
//     try {
//       const data = await getEpisodes();
//       const episodes = data.episodes || [];
//       const stats = {
//         total: episodes.length,
//         featured: episodes.filter(e => e.featured).length,
//         totalDuration: episodes.reduce((sum, e) => sum + (e.duration || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get episodes stats:', error);
//       return { total: 0, featured: 0, totalDuration: 0 };
//     }
//   };

//   const searchEpisodes = async (query) => {
//     return await getEpisodes({ search: query });
//   };

//   // =======================
//   // PODCASTS API FUNCTIONS
//   // =======================

//   const getPodcasts = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/podcasts${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('podcasts', url, { podcasts: [], pagination: {} });
//   };

//   const getPodcastBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/podcasts/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get podcast:', error);
//       return null;
//     }
//   };

//   const createPodcast = async (podcastData) => {
//     try {
//       const response = await apiClient.post('/api/podcasts', podcastData);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create podcast:', error);
//       throw error;
//     }
//   };

//   const updatePodcast = async (id, podcastData) => {
//     try {
//       const response = await apiClient.put(`/api/podcasts/${id}`, podcastData);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update podcast:', error);
//       throw error;
//     }
//   };

//   const deletePodcast = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/podcasts/${id}`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete podcast:', error);
//       throw error;
//     }
//   };

//   const getPodcastsStats = async () => {
//     try {
//       const data = await getPodcasts();
//       const podcasts = data.podcasts || [];
//       const stats = {
//         total: podcasts.length,
//         featured: podcasts.filter(p => p.featured).length,
//         totalDownloads: podcasts.reduce((sum, p) => sum + (p.downloads || 0), 0),
//         totalLikes: podcasts.reduce((sum, p) => sum + (p.likes || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get podcasts stats:', error);
//       return { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 };
//     }
//   };

//   const searchPodcasts = async (query) => {
//     return await getPodcasts({ search: query });
//   };

//   const likePodcast = async (id) => {
//     try {
//       const response = await apiClient.post(`/api/podcasts/${id}/like`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to like podcast:', error);
//       return null;
//     }
//   };

//   const downloadPodcast = async (id) => {
//     try {
//       const response = await apiClient.post(`/api/podcasts/${id}/download`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to record download:', error);
//       return null;
//     }
//   };

//   // =======================
//   // UPLOAD API FUNCTIONS
//   // =======================

//   const uploadFile = async (file, onProgress = null) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (onProgress) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       };

//       const response = await apiClient.post('/api/upload', formData, config);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload file:', error);
//       throw error;
//     }
//   };

//   const uploadMultipleFiles = async (files, onProgress = null) => {
//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append('files', file);
//       });

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (onProgress) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       };

//       const response = await apiClient.post('/api/upload/multiple', formData, config);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload files:', error);
//       throw error;
//     }
//   };

//   const deleteFile = async (filename) => {
//     try {
//       const response = await apiClient.delete(`/api/upload/${filename}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete file:', error);
//       throw error;
//     }
//   };

//   // =======================
//   // AUDIO PLAYER FUNCTIONS
//   // =======================

//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const updateVolume = (newVolume) => {
//     setVolume(newVolume);
//   };

//   const updateTrackInfo = (trackInfo) => {
//     setCurrentTrack({ ...currentTrack, ...trackInfo });
//   };

//   // Initialize current and next programs
//   useEffect(() => {
//     getCurrentProgram();
//     getNextProgram();
    
//     // Update every minute
//     const interval = setInterval(() => {
//       getCurrentProgram();
//       getNextProgram();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const value = {
//     // Socket
//     socket,
    
//     // Player state
//     isPlaying,
//     volume,
//     currentTrack,
//     currentProgram,
//     nextProgram,
//     nowPlaying, // 🎵 Nouvelles métadonnées en temps réel
    
//     // Player controls
//     togglePlay,
//     updateVolume,
//     updateTrackInfo,
    
//     // Programs API
//     getPrograms,
//     getCurrentProgram,
//     getNextProgram,
//     getProgramsByDay,
//     getProgramBySlug,
//     getActivePrograms,
//     createProgram,
//     updateProgram,
//     deleteProgram,
//     getProgramsStats,
//     searchPrograms,
//     getFullSchedule,
    
//     // Episodes API
//     getEpisodes,
//     getEpisodeBySlug,
//     getEpisodesByProgram,
//     createEpisode,
//     updateEpisode,
//     deleteEpisode,
//     getEpisodesStats,
//     searchEpisodes,
    
//     // Podcasts API
//     getPodcasts,
//     getPodcastBySlug,
//     createPodcast,
//     updatePodcast,
//     deletePodcast,
//     getPodcastsStats,
//     searchPodcasts,
//     likePodcast,
//     downloadPodcast,
    
//     // Upload API
//     uploadFile,
//     uploadMultipleFiles,
//     deleteFile,
    
//     // Cache management
//     invalidateCache
//   };

//   return (
//     <RadioContext.Provider value={value}>
//       {children}
//     </RadioContext.Provider>
//   );
// };


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { toast } from 'react-toastify';

// const RadioContext = createContext();

// export const useRadio = () => {
//   const context = useContext(RadioContext);
//   if (!context) {
//     throw new Error('useRadio must be used within a RadioProvider');
//   }
//   return context;
// };

// // Configuration de la base URL pour les requêtes API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // Configuration axios avec base URL et intercepteurs
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// // Intercepteur pour ajouter le token d'authentification
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Intercepteur pour gérer les erreurs de réponse
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Cache configuration
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// // Cache storage
// const cache = {
//   programs: { data: null, timestamp: null },
//   episodes: { data: null, timestamp: null },
//   podcasts: { data: null, timestamp: null }
// };

// export const RadioProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentProgram, setCurrentProgram] = useState(null);
//   const [nextProgram, setNextProgram] = useState(null);
//   const [volume, setVolume] = useState(0.7);
  
//   // État pour la musique en cours (métadonnées du stream)
//   const [nowPlaying, setNowPlaying] = useState({
//     title: '',
//     artist: '',
//     cover: '/images/default-cover.png',
//     album: '',
//     genre: ''
//   });

//   const [currentTrack, setCurrentTrack] = useState({
//     title: 'Radio Stream',
//     artist: 'Live',
//     duration: 0,
//     currentTime: 0
//   });

//   // Socket connection avec gestion des métadonnées en temps réel
//   useEffect(() => {
//     const newSocket = io(API_BASE_URL, {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 5
//     });
    
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log('✅ Connected to radio server');
//     });

//     newSocket.on('disconnect', () => {
//       console.log('❌ Disconnected from radio server');
//     });

//     // 🎵 Écouter les métadonnées de la musique en cours
//     // ✅ FIX: Mise à jour TOUJOURS, même si isPlaying = false
//     newSocket.on('nowPlaying', (data) => {
//       console.log('🎵 Now Playing received:', data);
      
//       // ✅ Créer l'objet newTrack AVANT tout
//       const newTrack = {
//         title: data.title || 'Titre inconnu',
//         artist: data.artist || 'Artiste inconnu',
//         cover: data.cover || '/images/default-cover.png',
//         album: data.album || '',
//         genre: data.genre || ''
//       };

//       // ✅ TOUJOURS mettre à jour nowPlaying (indépendamment de isPlaying)
//       setNowPlaying(newTrack);
//       console.log('📣 nowPlaying updated:', newTrack);

//       // Mettre à jour aussi currentTrack pour la compatibilité
//       setCurrentTrack(prev => ({
//         ...prev,
//         title: newTrack.title,
//         artist: newTrack.artist
//       }));

//       // ✅ Toast TOUJOURS affiché (même si pause)
//       // Permet de voir les changements de morceaux en temps réel
//       if (newTrack.title && newTrack.artist) {
//         toast.info(
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             fontFamily: 'DM Sans, sans-serif'
//           }}>
//             <img 
//               src={newTrack.cover} 
//               alt="cover"
//               style={{ 
//                 width: '48px', 
//                 height: '48px', 
//                 borderRadius: '8px',
//                 marginRight: '12px',
//                 objectFit: 'cover'
//               }}
//               onError={(e) => {
//                 e.target.src = '/images/default-cover.png';
//               }}
//             />
//             <div>
//               <div style={{ fontWeight: '600', color: '#000', fontSize: '14px' }}>
//                 {newTrack.title}
//               </div>
//               <div style={{ color: '#666', fontSize: '12px' }}>
//                 {newTrack.artist}
//               </div>
//             </div>
//           </div>,
//           {
//             position: "bottom-right",
//             autoClose: 4000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             style: {
//               background: '#fff',
//               borderRadius: '12px',
//               border: '1px solid rgba(0,0,0,0.08)',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
//             }
//           }
//         );
//       }
//     });

//     // Listen for real-time updates
//     newSocket.on('programCreated', (program) => {
//       toast.success(
//         `Nouveau programme ajouté : ${program.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('programs');
//     });

//     newSocket.on('programUpdated', (program) => {
//       toast.info(
//         `Programme mis à jour : ${program.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('programs');
//     });

//     newSocket.on('episodeCreated', (episode) => {
//       toast.success(
//         `Nouvel épisode : ${episode.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('episodes');
//     });

//     newSocket.on('podcastCreated', (podcast) => {
//       toast.success(
//         `Nouveau podcast : ${podcast.title}`,
//         {
//           style: {
//             background: '#fff',
//             color: '#000',
//             borderRadius: '12px',
//             border: '1px solid rgba(0,0,0,0.08)',
//             fontFamily: 'DM Sans, sans-serif'
//           }
//         }
//       );
//       invalidateCache('podcasts');
//     });

//     // Gestion des erreurs de connexion
//     newSocket.on('connect_error', (error) => {
//       console.error('❌ Socket connection error:', error);
//     });

//     newSocket.on('reconnect', (attemptNumber) => {
//       console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
//     });

//     return () => {
//       console.log('🔌 Closing socket connection');
//       newSocket.close();
//     };
//   }, []); // ✅ FIX: Enlever isPlaying des dépendances pour éviter les reconnexions

//   // Cache helper functions
//   const isCacheValid = (cacheKey) => {
//     const cached = cache[cacheKey];
//     if (!cached.data || !cached.timestamp) return false;
//     return Date.now() - cached.timestamp < CACHE_DURATION;
//   };

//   const setCache = (cacheKey, data) => {
//     cache[cacheKey] = {
//       data,
//       timestamp: Date.now()
//     };
//   };

//   const invalidateCache = (cacheKey) => {
//     if (cache[cacheKey]) {
//       cache[cacheKey] = { data: null, timestamp: null };
//     }
//   };

//   // Generic data fetcher with cache
//   const fetchWithCache = async (cacheKey, apiUrl, fallbackData = []) => {
//     if (isCacheValid(cacheKey)) {
//       return cache[cacheKey].data;
//     }

//     try {
//       const response = await apiClient.get(apiUrl);
//       const data = response.data;
//       setCache(cacheKey, data);
//       return data;
//     } catch (error) {
//       console.error(`Failed to fetch ${cacheKey}:`, error);
//       return cache[cacheKey].data || fallbackData;
//     }
//   };

//   // =======================
//   // PROGRAMS API FUNCTIONS
//   // =======================

//   const getPrograms = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/programs${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('programs', url, []);
//   };

//   const getCurrentProgram = async () => {
//     try {
//       const response = await apiClient.get('/api/programs/current/now');
//       const program = response.data.program;
//       setCurrentProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get current program:', error);
//       return null;
//     }
//   };

//   const getNextProgram = async () => {
//     try {
//       const response = await apiClient.get('/api/programs/next/upcoming');
//       const program = response.data.program;
//       setNextProgram(program);
//       return program;
//     } catch (error) {
//       console.error('Failed to get next program:', error);
//       return null;
//     }
//   };

//   const getProgramsByDay = async (day) => {
//     return await fetchWithCache('programs', `/api/programs?day=${day}`, []);
//   };

//   const getProgramBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/programs/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get program:', error);
//       return null;
//     }
//   };

//   const getActivePrograms = async () => {
//     return await fetchWithCache('programs', '/api/programs', []);
//   };

//   const createProgram = async (programData) => {
//     try {
//       const response = await apiClient.post('/api/programs', programData);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create program:', error);
//       throw error;
//     }
//   };

//   const updateProgram = async (id, programData) => {
//     try {
//       const response = await apiClient.put(`/api/programs/${id}`, programData);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update program:', error);
//       throw error;
//     }
//   };

//   const deleteProgram = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/programs/${id}`);
//       invalidateCache('programs');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete program:', error);
//       throw error;
//     }
//   };

//   const getProgramsStats = async () => {
//     try {
//       const programs = await getActivePrograms();
//       const stats = {
//         total: programs.length,
//         active: programs.filter(p => p.isActive).length,
//         featured: programs.filter(p => p.featured).length,
//         categories: [...new Set(programs.map(p => p.category))].length
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get programs stats:', error);
//       return { total: 0, active: 0, featured: 0, categories: 0 };
//     }
//   };

//   const searchPrograms = async (query) => {
//     return await fetchWithCache('programs', `/api/programs?search=${encodeURIComponent(query)}`, []);
//   };

//   const getFullSchedule = async () => {
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const schedule = {};
    
//     for (const day of days) {
//       schedule[day] = await getProgramsByDay(day);
//     }
    
//     return schedule;
//   };

//   // =======================
//   // EPISODES API FUNCTIONS
//   // =======================

//   const getEpisodes = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/episodes${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('episodes', url, { episodes: [], pagination: {} });
//   };

//   const getEpisodeBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/episodes/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episode:', error);
//       return null;
//     }
//   };

//   const getEpisodesByProgram = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/episodes/program/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get episodes by program:', error);
//       return { episodes: [], program: null };
//     }
//   };

//   const createEpisode = async (episodeData) => {
//     try {
//       const response = await apiClient.post('/api/episodes', episodeData);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create episode:', error);
//       throw error;
//     }
//   };

//   const updateEpisode = async (id, episodeData) => {
//     try {
//       const response = await apiClient.put(`/api/episodes/${id}`, episodeData);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update episode:', error);
//       throw error;
//     }
//   };

//   const deleteEpisode = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/episodes/${id}`);
//       invalidateCache('episodes');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete episode:', error);
//       throw error;
//     }
//   };

//   const getEpisodesStats = async () => {
//     try {
//       const data = await getEpisodes();
//       const episodes = data.episodes || [];
//       const stats = {
//         total: episodes.length,
//         featured: episodes.filter(e => e.featured).length,
//         totalDuration: episodes.reduce((sum, e) => sum + (e.duration || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get episodes stats:', error);
//       return { total: 0, featured: 0, totalDuration: 0 };
//     }
//   };

//   const searchEpisodes = async (query) => {
//     return await getEpisodes({ search: query });
//   };

//   // =======================
//   // PODCASTS API FUNCTIONS
//   // =======================

//   const getPodcasts = async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `/api/podcasts${queryString ? '?' + queryString : ''}`;
//     return await fetchWithCache('podcasts', url, { podcasts: [], pagination: {} });
//   };

//   const getPodcastBySlug = async (slug) => {
//     try {
//       const response = await apiClient.get(`/api/podcasts/${slug}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to get podcast:', error);
//       return null;
//     }
//   };

//   const createPodcast = async (podcastData) => {
//     try {
//       const response = await apiClient.post('/api/podcasts', podcastData);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create podcast:', error);
//       throw error;
//     }
//   };

//   const updatePodcast = async (id, podcastData) => {
//     try {
//       const response = await apiClient.put(`/api/podcasts/${id}`, podcastData);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update podcast:', error);
//       throw error;
//     }
//   };

//   const deletePodcast = async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/podcasts/${id}`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete podcast:', error);
//       throw error;
//     }
//   };

//   const getPodcastsStats = async () => {
//     try {
//       const data = await getPodcasts();
//       const podcasts = data.podcasts || [];
//       const stats = {
//         total: podcasts.length,
//         featured: podcasts.filter(p => p.featured).length,
//         totalDownloads: podcasts.reduce((sum, p) => sum + (p.downloads || 0), 0),
//         totalLikes: podcasts.reduce((sum, p) => sum + (p.likes || 0), 0)
//       };
//       return stats;
//     } catch (error) {
//       console.error('Failed to get podcasts stats:', error);
//       return { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 };
//     }
//   };

//   const searchPodcasts = async (query) => {
//     return await getPodcasts({ search: query });
//   };

//   const likePodcast = async (id) => {
//     try {
//       const response = await apiClient.post(`/api/podcasts/${id}/like`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to like podcast:', error);
//       return null;
//     }
//   };

//   const downloadPodcast = async (id) => {
//     try {
//       const response = await apiClient.post(`/api/podcasts/${id}/download`);
//       invalidateCache('podcasts');
//       return response.data;
//     } catch (error) {
//       console.error('Failed to record download:', error);
//       return null;
//     }
//   };

//   // =======================
//   // UPLOAD API FUNCTIONS
//   // =======================

//   const uploadFile = async (file, onProgress = null) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (onProgress) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       };

//       const response = await apiClient.post('/api/upload', formData, config);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload file:', error);
//       throw error;
//     }
//   };

//   const uploadMultipleFiles = async (files, onProgress = null) => {
//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append('files', file);
//       });

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (onProgress) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       };

//       const response = await apiClient.post('/api/upload/multiple', formData, config);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to upload files:', error);
//       throw error;
//     }
//   };

//   const deleteFile = async (filename) => {
//     try {
//       const response = await apiClient.delete(`/api/upload/${filename}`);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to delete file:', error);
//       throw error;
//     }
//   };

//   // =======================
//   // AUDIO PLAYER FUNCTIONS
//   // =======================

//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const updateVolume = (newVolume) => {
//     setVolume(newVolume);
//   };

//   const updateTrackInfo = (trackInfo) => {
//     setCurrentTrack({ ...currentTrack, ...trackInfo });
//   };

//   // Initialize current and next programs
//   useEffect(() => {
//     getCurrentProgram();
//     getNextProgram();
    
//     // Update every minute
//     const interval = setInterval(() => {
//       getCurrentProgram();
//       getNextProgram();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const value = {
//     // Socket
//     socket,
    
//     // Player state
//     isPlaying,
//     volume,
//     currentTrack,
//     currentProgram,
//     nextProgram,
//     nowPlaying, // 🎵 Métadonnées en temps réel
    
//     // Player controls
//     togglePlay,
//     updateVolume,
//     updateTrackInfo,
    
//     // Programs API
//     getPrograms,
//     getCurrentProgram,
//     getNextProgram,
//     getProgramsByDay,
//     getProgramBySlug,
//     getActivePrograms,
//     createProgram,
//     updateProgram,
//     deleteProgram,
//     getProgramsStats,
//     searchPrograms,
//     getFullSchedule,
    
//     // Episodes API
//     getEpisodes,
//     getEpisodeBySlug,
//     getEpisodesByProgram,
//     createEpisode,
//     updateEpisode,
//     deleteEpisode,
//     getEpisodesStats,
//     searchEpisodes,
    
//     // Podcasts API
//     getPodcasts,
//     getPodcastBySlug,
//     createPodcast,
//     updatePodcast,
//     deletePodcast,
//     getPodcastsStats,
//     searchPodcasts,
//     likePodcast,
//     downloadPodcast,
    
//     // Upload API
//     uploadFile,
//     uploadMultipleFiles,
//     deleteFile,
    
//     // Cache management
//     invalidateCache
//   };

//   return (
//     <RadioContext.Provider value={value}>
//       {children}
//     </RadioContext.Provider>
//   );
// };
