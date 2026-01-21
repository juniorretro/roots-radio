// import React, { useRef, useEffect } from 'react';
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';

// const AudioPlayer = ({ streamUrl = 'http://ecmanager2.pro-fhi.net:1510/stream' }) => {
//   const { t } = useTranslation();
//   const { 
//     isPlaying, 
//     volume, 
//     currentTrack, 
//     currentProgram,
//     togglePlay, 
//     updateVolume, 
//     updateTrackInfo 
//   } = useRadio();
  
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateTime = () => {
//       updateTrackInfo({
//         currentTime: audio.currentTime,
//         duration: audio.duration || 0
//       });
//     };

//     const handleLoadedMetadata = () => {
//       updateTrackInfo({
//         duration: audio.duration || 0
//       });
//     };

//     audio.addEventListener('timeupdate', updateTime);
//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//     audio.addEventListener('ended', () => {
//       // For live stream, this shouldn't happen, but handle it anyway
//       updateTrackInfo({ currentTime: 0 });
//     });

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//     };
//   }, [updateTrackInfo]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.play().catch(console.error);
//     } else {
//       audio.pause();
//     }
//   }, [isPlaying]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.volume = volume;
//     }
//   }, [volume]);

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     updateVolume(newVolume);
//   };

//   const formatTime = (seconds) => {
//     if (!seconds || !isFinite(seconds)) return '00:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="audio-player mb-4">
//       <audio
//         ref={audioRef}
//         src={streamUrl}
//         preload="none"
//         crossOrigin="anonymous"
//       />
      
//       <Container>
//         <Row className="align-items-center">
//           {/* Play Button */}
//           <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
//             <Button
//               onClick={togglePlay}
//               className="play-button"
//               title={isPlaying ? t('pause') : t('play')}
//             >
//               <i className={`bi bi-${isPlaying ? 'pause' : 'play'}-fill`}></i>
//             </Button>
//           </Col>
          
//           {/* Track Info */}
//           <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
//             <div className="track-info">
//               <h5 className="mb-1 text-white">
//                 {currentProgram?.title || currentTrack.title}
//               </h5>
//               <p className="mb-0 opacity-75">
//                 {currentProgram?.host || currentTrack.artist}
//               </p>
//               {currentProgram && (
//                 <small className="opacity-75">
//                   <i className="bi bi-broadcast me-1"></i>
//                   {t('liveStream')}
//                 </small>
//               )}
//             </div>
//           </Col>
          
//           {/* Controls */}
//           <Col xs={12} md={4}>
//             <Row className="align-items-center">
//               {/* Time Display */}
//               <Col xs={6} className="text-center text-md-start">
//                 <small className="text-white opacity-75">
//                   {currentProgram ? (
//                     <span>
//                       <i className="bi bi-circle-fill text-danger me-1" style={{ fontSize: '0.5rem' }}></i>
//                       LIVE
//                     </span>
//                   ) : (
//                     `${formatTime(currentTrack.currentTime)} / ${formatTime(currentTrack.duration)}`
//                   )}
//                 </small>
//               </Col>
              
//               {/* Volume Control */}
//               <Col xs={6}>
//                 <div className="d-flex align-items-center">
//                   <i className="bi bi-volume-down text-white me-2"></i>
//                   <input
//                     type="range"
//                     min="0"
//                     max="1"
//                     step="0.1"
//                     value={volume}
//                     onChange={handleVolumeChange}
//                     className="form-range volume-control"
//                     title={t('volume')}
//                   />
//                   <i className="bi bi-volume-up text-white ms-2"></i>
//                 </div>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
        
//         {/* Progress Bar for non-live content */}
//         {!currentProgram && currentTrack.duration > 0 && (
//           <Row className="mt-3">
//             <Col>
//               <div className="progress" style={{ height: '4px' }}>
//                 <div
//                   className="progress-bar bg-light"
//                   role="progressbar"
//                   style={{
//                     width: `${(currentTrack.currentTime / currentTrack.duration) * 100}%`
//                   }}
//                   aria-valuenow={currentTrack.currentTime}
//                   aria-valuemin="0"
//                   aria-valuemax={currentTrack.duration}
//                 ></div>
//               </div>
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default AudioPlayer;
// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import { getCurrentProgram, getNextProgram } from './services/radioPrograms';

// const IntegratedAudioPlayer = ({ 
//   streamUrl = 'http://ecmanager2.pro-fhi.net:1510/stream',
//   showProgramInfo = true,
//   showNextProgram = true,
//   metadataUpdateInterval = 30000,
//   programUpdateInterval = 60000 
// }) => {
//   const { t } = useTranslation();
//   const { 
//     isPlaying, 
//     volume, 
//     currentTrack, 
//     togglePlay, 
//     updateVolume, 
//     updateTrackInfo 
//   } = useRadio();
  
//   const audioRef = useRef(null);
  
//   // États pour les programmes et métadonnées
//   const [currentProgram, setCurrentProgram] = useState(null);
//   const [nextProgram, setNextProgram] = useState(null);
//   const [streamMetadata, setStreamMetadata] = useState({
//     title: '',
//     artist: '',
//     album: '',
//     genre: '',
//     bitrate: '',
//     listeners: 0,
//     serverName: ''
//   });
//   const [programLoading, setProgramLoading] = useState(true);
//   const [metadataLoading, setMetadataLoading] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(null);

//   // Fonction pour récupérer les métadonnées du stream
//   const fetchStreamMetadata = useCallback(async () => {
//     if (!streamUrl) return;

//     setMetadataLoading(true);
    
//     try {
//       const baseUrl = streamUrl.replace(/[;?].*$/, '');
//       const endpoints = [
//         '/stats?json=1',
//         '/status-json.xsl',
//         '/admin/stats?json=1'
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(`${baseUrl}${endpoint}`, {
//             mode: 'cors',
//             headers: {
//               'Accept': 'application/json',
//               'Cache-Control': 'no-cache'
//             }
//           });

//           if (response.ok) {
//             const data = await response.json();
            
//             // Parser les données selon le format
//             let metadata = {};
            
//             if (data.songtitle || data.title) {
//               // Format simple
//               metadata = {
//                 title: data.songtitle || data.title || '',
//                 artist: data.artist || '',
//                 album: data.album || '',
//                 genre: data.genre || data.streamgenre || '',
//                 bitrate: data.bitrate || '',
//                 listeners: parseInt(data.listeners) || 0,
//                 serverName: data.server_name || ''
//               };
//             } else if (data.icestats && data.icestats.source) {
//               // Format icestats
//               const source = Array.isArray(data.icestats.source) 
//                 ? data.icestats.source[0] 
//                 : data.icestats.source;
                
//               metadata = {
//                 title: source.title || source.yp_currently_playing || '',
//                 artist: source.artist || '',
//                 genre: source.genre || '',
//                 bitrate: source.bitrate || '',
//                 listeners: parseInt(source.listeners) || 0,
//                 serverName: source.server_name || ''
//               };
//             }

//             setStreamMetadata(metadata);
//             setLastUpdate(new Date());
//             break;
//           }
//         } catch (endpointError) {
//           continue;
//         }
//       }
//     } catch (error) {
//       console.log('Impossible de récupérer les métadonnées:', error);
//     }
    
//     setMetadataLoading(false);
//   }, [streamUrl]);

//   // Fonction pour mettre à jour les programmes
//   const updatePrograms = useCallback(async () => {
//     try {
//       setProgramLoading(true);
//       const [current, next] = await Promise.all([
//         getCurrentProgram(),
//         getNextProgram()
//       ]);
      
//       setCurrentProgram(current);
//       setNextProgram(next);
      
//       // Mettre à jour les informations du track dans le contexte
//       if (current) {
//         updateTrackInfo({
//           title: current.title,
//           artist: current.host,
//           album: current.category
//         });
//       }
      
//     } catch (error) {
//       console.error('Erreur lors de la récupération des programmes:', error);
//     }
    
//     setProgramLoading(false);
//   }, [updateTrackInfo]);

//   // Effets pour les mises à jour périodiques
//   useEffect(() => {
//     // Mise à jour initiale
//     updatePrograms();
    
//     if (isPlaying) {
//       fetchStreamMetadata();
//     }
    
//     // Intervalles de mise à jour
//     const programInterval = setInterval(updatePrograms, programUpdateInterval);
//     const metadataInterval = isPlaying ? 
//       setInterval(fetchStreamMetadata, metadataUpdateInterval) : null;
    
//     return () => {
//       clearInterval(programInterval);
//       if (metadataInterval) clearInterval(metadataInterval);
//     };
//   }, [isPlaying, updatePrograms, fetchStreamMetadata, programUpdateInterval, metadataUpdateInterval]);

//   // Gestion de l'audio
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateTime = () => {
//       updateTrackInfo({
//         currentTime: audio.currentTime,
//         duration: audio.duration || 0
//       });
//     };

//     const handleLoadedMetadata = () => {
//       updateTrackInfo({
//         duration: audio.duration || 0
//       });
//     };

//     const handlePlay = () => {
//       fetchStreamMetadata();
//     };

//     audio.addEventListener('timeupdate', updateTime);
//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//     audio.addEventListener('play', handlePlay);
//     audio.addEventListener('ended', () => {
//       updateTrackInfo({ currentTime: 0 });
//     });

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       audio.removeEventListener('play', handlePlay);
//     };
//   }, [updateTrackInfo, fetchStreamMetadata]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.play().catch(console.error);
//     } else {
//       audio.pause();
//     }
//   }, [isPlaying]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.volume = volume;
//     }
//   }, [volume]);

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     updateVolume(newVolume);
//   };

//   const formatTime = (seconds) => {
//     if (!seconds || !isFinite(seconds)) return '00:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Déterminer les informations à afficher
//   const getDisplayInfo = () => {
//     // Priorité: Programme en cours > Métadonnées du stream > Fallback
//     const title = currentProgram?.title || 
//                   streamMetadata?.title || 
//                   currentTrack.title || 
//                   t('radio_stream');
    
//     const artist = currentProgram?.host || 
//                    streamMetadata?.artist || 
//                    currentTrack.artist || 
//                    t('live_radio');
    
//     const category = currentProgram?.category || 
//                      streamMetadata?.genre || 
//                      'Radio';
    
//     return { title, artist, category };
//   };

//   const displayInfo = getDisplayInfo();

//   return (
//     <div className="integrated-audio-player mb-4">
      
//       <audio
//         ref={audioRef}
//         src={streamUrl}
//         preload="none"
//         crossOrigin="anonymous"
//       />
      
//       <Container >
//         {/* Player principal */}
//           {/* <div style={{  
//             backgroundImage:'url(/images/programs/logo-rootsmusicradio.png)',
//                 height: '300px',
//                 width: '300px',
//                 alignItems: 'center',
//                 alignContent: 'center',
//                 justifyContent: 'center',
//                 marginLeft: '50%',
//                backgroundSize: 'cover',
//                 }}></div> */}
//         <Card className="bg-dark text-white border-0">
//           <Card.Body 
//           >

//             <Row className="align-items-center">
//               {/* Bouton Play */}
//               <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
//                 <Button
//                   onClick={togglePlay}
//                   className="play-button btn-primary rounded-circle p-3"
//                   title={isPlaying ? t('pause') : t('play')}
//                   style={{ width: '60px', height: '60px' }}
//                 >
//                   <i className={`bi bi-${isPlaying ? 'pause' : 'play'}-fill fs-4`}></i>
//                 </Button>
//               </Col>
              
//               {/* Informations de lecture */}
//               <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
//                 <div className="track-info">
//                   <h5 className="mb-1 text-white fw-bold">
//                     {displayInfo.title}
//                     {metadataLoading && (
//                       <Spinner size="sm" className="ms-2" />
//                     )}
//                   </h5>
                  
//                   <p className="mb-2 text-white-50">
//                     {displayInfo.artist}
//                   </p>
                  
//                   <div className="d-flex flex-wrap align-items-center gap-2">
//                     {currentProgram && (
//                       <Badge bg="success" className="d-flex align-items-center">
//                         <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
//                         EN DIRECT
//                       </Badge>
//                     )}
                    
//                     {displayInfo.category && (
//                       <Badge bg="primary">{displayInfo.category}</Badge>
//                     )}
                    
//                     {streamMetadata.bitrate && (
//                       <Badge bg="secondary">{streamMetadata.bitrate} kbps</Badge>
//                     )}
                    
//                     {streamMetadata.listeners > 0 && (
//                       <Badge bg="info">
//                         <i className="bi bi-people-fill me-1"></i>
//                         {streamMetadata.listeners}
//                       </Badge>
//                     )}
//                   </div>

//                   {currentProgram?.schedule?.time && (
//                     <small className="text-white-50 d-block mt-1">
//                       <i className="bi bi-clock me-1"></i>
//                       {currentProgram.schedule.time}
//                     </small>
//                   )}
//                 </div>
//               </Col>
              
//               {/* Contrôles */}
//               <Col xs={12} md={4}>
//                 <Row className="align-items-center">
//                   <Col xs={6} className="text-center text-md-start">
//                     <div className="d-flex align-items-center justify-content-center justify-content-md-start">
//                       <i className="bi bi-circle-fill text-danger me-2" style={{ fontSize: '0.5rem' }}></i>
//                       <span className="text-white fw-bold">LIVE</span>
//                       {lastUpdate && (
//                         <small className="text-white-50 ms-2">
//                           {lastUpdate.toLocaleTimeString().slice(0, 5)}
//                         </small>
//                       )}
//                     </div>
//                   </Col>
                  
//                   <Col xs={6}>
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-volume-down text-white me-2"></i>
//                       <input
//                         type="range"
//                         min="0"
//                         max="1"
//                         step="0.1"
//                         value={volume}
//                         onChange={handleVolumeChange}
//                         className="form-range volume-control flex-grow-1"
//                         title={t('volume')}
//                       />
//                       <i className="bi bi-volume-up text-white ms-2"></i>
//                     </div>
//                   </Col>
//                 </Row>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         {/* Informations étendues du programme */}
//         {showProgramInfo && currentProgram && (
//           <Card className="mt-3 bg-dark text-white border-secondary">
//             <Card.Body className="py-3">
//               <Row>
//                 <Col md={8}>
//                   <h6 className="mb-2">
//                     <i className="bi bi-broadcast me-2"></i>
//                     {currentProgram.title}
//                   </h6>
//                   {currentProgram.description && (
//                     <p className="mb-0 text-white-50 small">
//                       {currentProgram.description}
//                     </p>
//                   )}
//                 </Col>
//                 <Col md={4} className="text-md-end">
//                   <Badge bg="outline-light" className="border border-light">
//                     {currentProgram.category}
//                   </Badge>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Programme suivant */}
//         {showNextProgram && nextProgram && (
//           <Card className="mt-2 bg-transparent border-secondary">
//             <Card.Body className="py-2">
//               <small className="text-white-50">
//                 <i className="bi bi-skip-forward-fill me-2"></i>
//                 <strong>À suivre:</strong> {nextProgram.title}
//                 {nextProgram.host && (
//                   <span className="ms-2">avec {nextProgram.host}</span>
//                 )}
//                 {nextProgram.schedule?.time && (
//                   <span className="ms-2 text-info">({nextProgram.schedule.time})</span>
//                 )}
//               </small>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Debug info (en développement) */}
//         {process.env.NODE_ENV === 'development' && (
//           <Card className="mt-2 bg-secondary">
//             <Card.Body className="py-2">
//               <small>
//                 <strong>Debug:</strong> 
//                 Program: {currentProgram ? '✓' : '✗'} | 
//                 Metadata: {streamMetadata.title ? '✓' : '✗'} | 
//                 Loading: {programLoading ? 'P' : ''}{metadataLoading ? 'M' : ''}
//               </small>
//             </Card.Body>
//           </Card>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default IntegratedAudioPlayer;


// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import { getCurrentProgram, getNextProgram } from './services/radioPrograms';

// const IntegratedAudioPlayer = ({ 
//   streamUrl = 'http://ecmanager2.pro-fhi.net:1510/stream',
//   showProgramInfo = true,
//   showNextProgram = true,
//   metadataUpdateInterval = 30000,
//   programUpdateInterval = 60000 
// }) => {
//   const { t } = useTranslation();
//   const { 
//     isPlaying, 
//     volume, 
//     currentTrack, 
//     togglePlay, 
//     updateVolume, 
//     updateTrackInfo 
//   } = useRadio();
  
//   const audioRef = useRef(null);
  
//   // États pour les programmes et métadonnées
//   const [currentProgram, setCurrentProgram] = useState(null);
//   const [nextProgram, setNextProgram] = useState(null);
//   const [streamMetadata, setStreamMetadata] = useState({
//     title: '',
//     artist: '',
//     album: '',
//     genre: '',
//     bitrate: '',
//     listeners: 0,
//     serverName: ''
//   });
//   const [programLoading, setProgramLoading] = useState(true);
//   const [metadataLoading, setMetadataLoading] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [isHovered, setIsHovered] = useState(false);

//   // Fonction pour récupérer les métadonnées du stream
//   const fetchStreamMetadata = useCallback(async () => {
//     if (!streamUrl) return;

//     setMetadataLoading(true);
    
//     try {
//       const baseUrl = streamUrl.replace(/[;?].*$/, '');
//       const endpoints = [
//         '/stats?json=1',
//         '/status-json.xsl',
//         '/admin/stats?json=1'
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(`${baseUrl}${endpoint}`, {
//             mode: 'cors',
//             headers: {
//               'Accept': 'application/json',
//               'Cache-Control': 'no-cache'
//             }
//           });

//           if (response.ok) {
//             const data = await response.json();
            
//             // Parser les données selon le format
//             let metadata = {};
            
//             if (data.songtitle || data.title) {
//               // Format simple
//               metadata = {
//                 title: data.songtitle || data.title || '',
//                 artist: data.artist || '',
//                 album: data.album || '',
//                 genre: data.genre || data.streamgenre || '',
//                 bitrate: data.bitrate || '',
//                 listeners: parseInt(data.listeners) || 0,
//                 serverName: data.server_name || ''
//               };
//             } else if (data.icestats && data.icestats.source) {
//               // Format icestats
//               const source = Array.isArray(data.icestats.source) 
//                 ? data.icestats.source[0] 
//                 : data.icestats.source;
                
//               metadata = {
//                 title: source.title || source.yp_currently_playing || '',
//                 artist: source.artist || '',
//                 genre: source.genre || '',
//                 bitrate: source.bitrate || '',
//                 listeners: parseInt(source.listeners) || 0,
//                 serverName: source.server_name || ''
//               };
//             }

//             setStreamMetadata(metadata);
//             setLastUpdate(new Date());
//             break;
//           }
//         } catch (endpointError) {
//           continue;
//         }
//       }
//     } catch (error) {
//       console.log('Impossible de récupérer les métadonnées:', error);
//     }
    
//     setMetadataLoading(false);
//   }, [streamUrl]);

//   // Fonction pour mettre à jour les programmes
//   const updatePrograms = useCallback(async () => {
//     try {
//       setProgramLoading(true);
//       const [current, next] = await Promise.all([
//         getCurrentProgram(),
//         getNextProgram()
//       ]);
      
//       setCurrentProgram(current);
//       setNextProgram(next);
      
//       // Mettre à jour les informations du track dans le contexte
//       if (current) {
//         updateTrackInfo({
//           title: current.title,
//           artist: current.host,
//           album: current.category
//         });
//       }
      
//     } catch (error) {
//       console.error('Erreur lors de la récupération des programmes:', error);
//     }
    
//     setProgramLoading(false);
//   }, [updateTrackInfo]);

//   // Effets pour les mises à jour périodiques
//   useEffect(() => {
//     // Mise à jour initiale
//     updatePrograms();
    
//     if (isPlaying) {
//       fetchStreamMetadata();
//     }
    
//     // Intervalles de mise à jour
//     const programInterval = setInterval(updatePrograms, programUpdateInterval);
//     const metadataInterval = isPlaying ? 
//       setInterval(fetchStreamMetadata, metadataUpdateInterval) : null;
    
//     return () => {
//       clearInterval(programInterval);
//       if (metadataInterval) clearInterval(metadataInterval);
//     };
//   }, [isPlaying, updatePrograms, fetchStreamMetadata, programUpdateInterval, metadataUpdateInterval]);

//   // Gestion de l'audio
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateTime = () => {
//       updateTrackInfo({
//         currentTime: audio.currentTime,
//         duration: audio.duration || 0
//       });
//     };

//     const handleLoadedMetadata = () => {
//       updateTrackInfo({
//         duration: audio.duration || 0
//       });
//     };

//     const handlePlay = () => {
//       fetchStreamMetadata();
//     };

//     audio.addEventListener('timeupdate', updateTime);
//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//     audio.addEventListener('play', handlePlay);
//     audio.addEventListener('ended', () => {
//       updateTrackInfo({ currentTime: 0 });
//     });

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       audio.removeEventListener('play', handlePlay);
//     };
//   }, [updateTrackInfo, fetchStreamMetadata]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.play().catch(console.error);
//     } else {
//       audio.pause();
//     }
//   }, [isPlaying]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.volume = volume;
//     }
//   }, [volume]);

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     updateVolume(newVolume);
//   };

//   const formatTime = (seconds) => {
//     if (!seconds || !isFinite(seconds)) return '00:00';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Déterminer les informations à afficher
//   const getDisplayInfo = () => {
//     // Priorité: Programme en cours > Métadonnées du stream > Fallback
//     const title = currentProgram?.title || 
//                   streamMetadata?.title || 
//                   currentTrack.title || 
//                   t('radio_stream');
    
//     const artist = currentProgram?.host || 
//                    streamMetadata?.artist || 
//                    currentTrack.artist || 
//                    t('live_radio');
    
//     const category = currentProgram?.category || 
//                      streamMetadata?.genre || 
//                      'Radio';
    
//     return { title, artist, category };
//   };

//   const displayInfo = getDisplayInfo();

//   return (
//     <div className="integrated-audio-player mb-4">
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
          
//           .volume-control::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 14px;
//             height: 14px;
//             background: #000;
//             border-radius: 50%;
//             cursor: pointer;
//             transition: all 0.3s ease;
//           }
          
//           .volume-control::-webkit-slider-thumb:hover {
//             transform: scale(1.2);
//             box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
//           }
          
//           .volume-control::-moz-range-thumb {
//             width: 14px;
//             height: 14px;
//             background: #000;
//             border: none;
//             border-radius: 50%;
//             cursor: pointer;
//             transition: all 0.3s ease;
//           }
          
//           .volume-control::-moz-range-thumb:hover {
//             transform: scale(1.2);
//             box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
//           }
          
//           .volume-control::-webkit-slider-runnable-track {
//             height: 3px;
//             background: rgba(0,0,0,0.1);
//             border-radius: 2px;
//           }
          
//           .volume-control::-moz-range-track {
//             height: 3px;
//             background: rgba(0,0,0,0.1);
//             border-radius: 2px;
//           }

//           .live-indicator {
//             animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//           }

//           @keyframes pulse {
//             0%, 100% {
//               opacity: 1;
//             }
//             50% {
//               opacity: 0.5;
//             }
//           }
//         `}
//       </style>
      
//       <audio
//         ref={audioRef}
//         src={streamUrl}
//         preload="none"
//         crossOrigin="anonymous"
//       />
      
//       <Container>
//         {/* Player principal - Design Soft et Élégant */}
//         <Card 
//           className="border-0"
//           style={{
//             background: '#fff',
//             borderRadius: '24px',
//             boxShadow: isHovered 
//               ? '0 12px 40px rgba(0,0,0,0.1)' 
//               : '0 4px 20px rgba(0,0,0,0.06)',
//             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//             overflow: 'hidden'
//           }}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <Card.Body style={{ padding: '32px' }}>
//             <Row className="align-items-center g-4">
//               {/* Bouton Play - Design Minimaliste */}
//               <Col xs={12} md={2} className="text-center">
//                 <Button
//                   onClick={togglePlay}
//                   className="border-0"
//                   style={{
//                     width: '64px',
//                     height: '64px',
//                     borderRadius: '50%',
//                     background: isPlaying ? '#000' : '#fff',
//                     color: isPlaying ? '#fff' : '#000',
//                     border: '2px solid #000',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     fontSize: '20px'
//                   }}
//                   title={isPlaying ? t('pause') : t('play')}
//                 >
//                   <i className={`bi bi-${isPlaying ? 'pause' : 'play'}-fill`}></i>
//                 </Button>
//               </Col>
              
//               {/* Informations de lecture */}
//               <Col xs={12} md={6} className="text-center text-md-start">
//                 <div className="track-info">
//                   {/* Badge Live */}
//                   {currentProgram && (
//                     <div 
//                       className="d-inline-flex align-items-center mb-2"
//                       style={{
//                         background: '#000',
//                         color: '#fff',
//                         padding: '4px 12px',
//                         borderRadius: '20px',
//                         fontSize: '10px',
//                         fontWeight: '600',
//                         letterSpacing: '1px',
//                         textTransform: 'uppercase',
//                         fontFamily: 'DM Sans, sans-serif'
//                       }}
//                     >
//                       <i 
//                         className="bi bi-circle-fill me-2 live-indicator" 
//                         style={{ fontSize: '6px' }}
//                       ></i>
//                       EN DIRECT
//                     </div>
//                   )}
                  
//                   <h5 
//                     className="mb-2" 
//                     style={{
//                       color: '#000',
//                       fontWeight: '600',
//                       fontSize: '18px',
//                       fontFamily: 'DM Sans, sans-serif',
//                       letterSpacing: '-0.01em',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       justifyContent: 'md-start'
//                     }}
//                   >
//                     {displayInfo.title}
//                     {metadataLoading && (
//                       <Spinner 
//                         size="sm" 
//                         className="ms-2" 
//                         style={{ color: '#666' }}
//                       />
//                     )}
//                   </h5>
                  
//                   <p 
//                     className="mb-2" 
//                     style={{
//                       color: '#666',
//                       fontSize: '14px',
//                       fontWeight: '400'
//                     }}
//                   >
//                     {displayInfo.artist}
//                   </p>
                  
//                   <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2">
//                     {displayInfo.category && (
//                       <Badge 
//                         style={{
//                           background: 'rgba(0,0,0,0.05)',
//                           color: '#000',
//                           fontWeight: '500',
//                           padding: '4px 10px',
//                           borderRadius: '12px',
//                           fontSize: '11px',
//                           border: '1px solid rgba(0,0,0,0.08)'
//                         }}
//                       >
//                         {displayInfo.category}
//                       </Badge>
//                     )}
                    
//                     {streamMetadata.bitrate && (
//                       <Badge 
//                         style={{
//                           background: 'transparent',
//                           color: '#666',
//                           fontWeight: '500',
//                           padding: '4px 10px',
//                           borderRadius: '12px',
//                           fontSize: '11px',
//                           border: '1px solid rgba(0,0,0,0.12)'
//                         }}
//                       >
//                         {streamMetadata.bitrate} kbps
//                       </Badge>
//                     )}
                    
//                     {streamMetadata.listeners > 0 && (
//                       <Badge 
//                         style={{
//                           background: 'transparent',
//                           color: '#666',
//                           fontWeight: '500',
//                           padding: '4px 10px',
//                           borderRadius: '12px',
//                           fontSize: '11px',
//                           border: '1px solid rgba(0,0,0,0.12)'
//                         }}
//                       >
//                         <i className="bi bi-people-fill me-1"></i>
//                         {streamMetadata.listeners}
//                       </Badge>
//                     )}
//                   </div>

//                   {currentProgram?.schedule?.time && (
//                     <small 
//                       className="d-block mt-2" 
//                       style={{
//                         color: '#999',
//                         fontSize: '12px',
//                         fontFamily: 'Georgia, serif'
//                       }}
//                     >
//                       <i className="bi bi-clock me-1"></i>
//                       {currentProgram.schedule.time}
//                     </small>
//                   )}
//                 </div>
//               </Col>
              
//               {/* Contrôles de volume */}
//               <Col xs={12} md={4}>
//                 <div className="d-flex flex-column gap-3">
//                   {/* Indicateur Live et Heure */}
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center">
//                       <div 
//                         style={{
//                           width: '8px',
//                           height: '8px',
//                           borderRadius: '50%',
//                           background: '#ff3b3b',
//                           marginRight: '8px',
//                           animation: 'pulse 2s ease-in-out infinite'
//                         }}
//                         className="live-indicator"
//                       ></div>
//                       <span 
//                         style={{
//                           color: '#000',
//                           fontWeight: '600',
//                           fontSize: '12px',
//                           letterSpacing: '0.5px',
//                           textTransform: 'uppercase',
//                           fontFamily: 'DM Sans, sans-serif'
//                         }}
//                       >
//                         LIVE
//                       </span>
//                     </div>
//                     {lastUpdate && (
//                       <small 
//                         style={{
//                           color: '#999',
//                           fontSize: '11px',
//                           fontFamily: 'Georgia, serif'
//                         }}
//                       >
//                         {lastUpdate.toLocaleTimeString('fr-FR', { 
//                           hour: '2-digit', 
//                           minute: '2-digit' 
//                         })}
//                       </small>
//                     )}
//                   </div>
                  
//                   {/* Contrôle du volume */}
//                   <div className="d-flex align-items-center gap-2">
//                     <i 
//                       className="bi bi-volume-down" 
//                       style={{ color: '#666', fontSize: '16px' }}
//                     ></i>
//                     <input
//                       type="range"
//                       min="0"
//                       max="1"
//                       step="0.1"
//                       value={volume}
//                       onChange={handleVolumeChange}
//                       className="form-range volume-control flex-grow-1"
//                       title={t('volume')}
//                       style={{
//                         cursor: 'pointer'
//                       }}
//                     />
//                     <i 
//                       className="bi bi-volume-up" 
//                       style={{ color: '#000', fontSize: '16px' }}
//                     ></i>
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         {/* Informations étendues du programme */}
//         {showProgramInfo && currentProgram && (
//           <Card 
//             className="mt-3 border-0" 
//             style={{
//               background: '#fafafa',
//               borderRadius: '20px',
//               border: '1px solid rgba(0,0,0,0.06)'
//             }}
//           >
//             <Card.Body style={{ padding: '20px' }}>
//               <Row className="align-items-center">
//                 <Col md={8}>
//                   <h6 
//                     className="mb-2" 
//                     style={{
//                       color: '#000',
//                       fontWeight: '600',
//                       fontSize: '15px',
//                       fontFamily: 'DM Sans, sans-serif',
//                       letterSpacing: '-0.01em'
//                     }}
//                   >
//                     <i className="bi bi-broadcast me-2" style={{ color: '#666' }}></i>
//                     {currentProgram.title}
//                   </h6>
//                   {currentProgram.description && (
//                     <p 
//                       className="mb-0" 
//                       style={{
//                         color: '#666',
//                         fontSize: '13px',
//                         lineHeight: '1.6'
//                       }}
//                     >
//                       {currentProgram.description}
//                     </p>
//                   )}
//                 </Col>
//                 <Col md={4} className="text-md-end mt-2 mt-md-0">
//                   <Badge 
//                     style={{
//                       background: 'rgba(0,0,0,0.05)',
//                       color: '#000',
//                       fontWeight: '500',
//                       padding: '6px 14px',
//                       borderRadius: '20px',
//                       fontSize: '11px',
//                       border: '1px solid rgba(0,0,0,0.08)'
//                     }}
//                   >
//                     {currentProgram.category}
//                   </Badge>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Programme suivant - Design épuré */}
//         {showNextProgram && nextProgram && (
//           <Card 
//             className="mt-2 border-0" 
//             style={{
//               background: 'transparent',
//               border: '1px solid rgba(0,0,0,0.08)',
//               borderRadius: '16px'
//             }}
//           >
//             <Card.Body style={{ padding: '16px 20px' }}>
//               <div 
//                 style={{
//                   color: '#666',
//                   fontSize: '13px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   flexWrap: 'wrap',
//                   gap: '8px'
//                 }}
//               >
//                 <i className="bi bi-skip-forward-fill" style={{ color: '#999' }}></i>
//                 <strong style={{ color: '#000', fontWeight: '600' }}>À suivre :</strong>
//                 <span style={{ color: '#000' }}>{nextProgram.title}</span>
//                 {nextProgram.host && (
//                   <span style={{ color: '#666' }}>avec {nextProgram.host}</span>
//                 )}
//                 {nextProgram.schedule?.time && (
//                   <span 
//                     style={{
//                       color: '#000',
//                       fontWeight: '500',
//                       fontFamily: 'Georgia, serif'
//                     }}
//                   >
//                     ({nextProgram.schedule.time})
//                   </span>
//                 )}
//               </div>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Debug info (en développement) */}
//         {process.env.NODE_ENV === 'development' && (
//           <Card 
//             className="mt-2 border-0" 
//             style={{
//               background: 'rgba(0,0,0,0.03)',
//               borderRadius: '12px'
//             }}
//           >
//             <Card.Body style={{ padding: '12px 16px' }}>
//               <small style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>
//                 <strong>Debug:</strong> 
//                 Program: {currentProgram ? '✓' : '✗'} | 
//                 Metadata: {streamMetadata.title ? '✓' : '✗'} | 
//                 Loading: {programLoading ? 'P' : ''}{metadataLoading ? 'M' : ''}
//               </small>
//             </Card.Body>
//           </Card>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default IntegratedAudioPlayer;

// import React, { useEffect, useRef } from 'react';
// import { Card, Button } from 'react-bootstrap';
// import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
// import { useRadio } from '../contexts/RadioContext';

// const STREAM_URL = 'http://ecmanager2.pro-fhi.net:1510/stream';

// const AudioPlayer = () => {
//   const audioRef = useRef(null);

//   const {
//     isPlaying,
//     togglePlay,
//     volume,
//     updateVolume,
//     nowPlaying
//   } = useRadio();

//   // ▶️ Play / Pause synchronisé avec le contexte
//   useEffect(() => {
//     if (!audioRef.current) return;

//     if (isPlaying) {
//       audioRef.current
//         .play()
//         .catch(err => console.error('Play error:', err));
//     } else {
//       audioRef.current.pause();
//     }
//   }, [isPlaying]);

//   // 🔊 Volume
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume;
//     }
//   }, [volume]);

//   return (
//     <Card
//       className="shadow-sm border-0"
//       style={{
//         background: '#fff',
//         borderRadius: '20px',
//         padding: '16px'
//       }}
//     >
//       <audio ref={audioRef} src={STREAM_URL} preload="none" />

//       <div className="d-flex align-items-center gap-3">

//         {/* 🎨 Pochette */}
//         <img
//           src={nowPlaying.cover || '/images/default-cover.png'}
//           alt={nowPlaying.title}
//           style={{
//             width: '90px',
//             height: '90px',
//             borderRadius: '16px',
//             objectFit: 'cover',
//             boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
//           }}
//         />

//         {/* 🎵 Infos */}
//         <div className="flex-grow-1">
//           <div
//             style={{
//               fontWeight: 600,
//               fontSize: '16px',
//               color: '#000'
//             }}
//           >
//             {nowPlaying.title || 'Live Radio'}
//           </div>

//           <div
//             style={{
//               fontSize: '14px',
//               color: '#666'
//             }}
//           >
//             {nowPlaying.artist || 'En direct'}
//           </div>
//         </div>

//         {/* ▶️ Controls */}
//         <div className="d-flex align-items-center gap-3">
//           <Button
//             variant="dark"
//             onClick={togglePlay}
//             style={{
//               borderRadius: '50%',
//               width: '48px',
//               height: '48px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//           >
//             {isPlaying ? <FaPause /> : <FaPlay />}
//           </Button>

//           {/* 🔊 Volume */}
//           <div className="d-flex align-items-center gap-2">
//             <FaVolumeUp />
//             <input
//               type="range"
//               min="0"
//               max="1"
//               step="0.01"
//               value={volume}
//               onChange={(e) => updateVolume(Number(e.target.value))}
//             />
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default AudioPlayer;

import React, { useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { useRadio } from '../contexts/RadioContext';

const STREAM_URL = 'http://ecmanager2.pro-fhi.net:1510/stream';

const AudioPlayer = () => {
  const audioRef = useRef(null);

  const {
    isPlaying,
    togglePlay,
    volume,
    updateVolume,
    nowPlaying
  } = useRadio();

  // 🐛 Debug: Log quand nowPlaying change
  useEffect(() => {
    console.log('📣 AudioPlayer - nowPlaying updated:', nowPlaying);
  }, [nowPlaying]);

  // ▶️ Play / Pause synchronisé avec le contexte
  // ✅ FIX: Force la source du stream à chaque changement de isPlaying
  useEffect(() => {
    if (!audioRef.current) return;

    // ✅ IMPORTANT: Forcer la source pour garantir la connexion au stream
    audioRef.current.src = STREAM_URL;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch(err => console.error('❌ Play error:', err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 🔊 Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <Card
      className="shadow-sm border-0"
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '16px'
      }}
    >
      <audio ref={audioRef} src={STREAM_URL} preload="none" />

      <div className="d-flex align-items-center gap-3">

        {/* 🎨 Pochette */}
        <img
          src={nowPlaying.cover || '/images/default-cover.png'}
          alt={nowPlaying.title || 'Album cover'}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '16px',
            objectFit: 'cover',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
          }}
          onError={(e) => {
            // ✅ Fallback si l'image ne charge pas
            e.target.src = '/images/default-cover.png';
          }}
        />

        {/* 🎵 Infos */}
        <div className="flex-grow-1">
          <div
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#000'
            }}
          >
            {nowPlaying.title || 'Live Radio'}
          </div>

          <div
            style={{
              fontSize: '14px',
              color: '#666'
            }}
          >
            {nowPlaying.artist || 'En direct'}
          </div>

          {/* 🐛 Debug: Afficher l'album et le genre si disponibles */}
          {(nowPlaying.album || nowPlaying.genre) && (
            <div
              style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '4px'
              }}
            >
              {nowPlaying.album && `${nowPlaying.album}`}
              {nowPlaying.album && nowPlaying.genre && ' • '}
              {nowPlaying.genre && `${nowPlaying.genre}`}
            </div>
          )}
        </div>

        {/* ▶️ Controls */}
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="dark"
            onClick={togglePlay}
            style={{
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Button>

          {/* 🔊 Volume */}
          <div className="d-flex align-items-center gap-2">
            <FaVolumeUp />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => updateVolume(Number(e.target.value))}
              style={{
                width: '80px'
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;