// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Button, Form, Badge, Nav, Spinner, Alert } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Episodes = () => {
//   const { t } = useTranslation();
//   const { getEpisodes, getPrograms, searchEpisodes, playEpisode } = useRadio();
  
//   const [episodes, setEpisodes] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedProgram, setSelectedProgram] = useState('all');
//   const [selectedSeason, setSelectedSeason] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalEpisodes, setTotalEpisodes] = useState(0);
//   const [error, setError] = useState('');

//   const sortOptions = [
//     { value: 'newest', label: 'Plus récents' },
//     { value: 'oldest', label: 'Plus anciens' },
//     { value: 'title', label: 'Titre A-Z' },
//     { value: 'season', label: 'Saison' }
//   ];

//   const fetchEpisodes = useCallback(async (page = 1, reset = false) => {
//     if (page === 1) {
//       setLoading(true);
//     } else {
//       setLoadingMore(true);
//     }
//     setError('');

//     try {
//       const params = {
//         page,
//         limit: 12,
//         sort: sortBy,
//         ...(selectedProgram !== 'all' && { programId: selectedProgram }),
//         ...(selectedSeason !== 'all' && { season: selectedSeason }),
//         ...(searchQuery && { search: searchQuery })
//       };

//       const data = await getEpisodes(params);
      
//       if (reset || page === 1) {
//         setEpisodes(data.episodes || []);
//       } else {
//         setEpisodes(prev => [...prev, ...(data.episodes || [])]);
//       }
      
//       setTotalPages(data.totalPages || 1);
//       setTotalEpisodes(data.total || 0);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error('Failed to fetch episodes:', error);
//       setError('Erreur lors du chargement des épisodes');
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, [getEpisodes, sortBy, selectedProgram, selectedSeason, searchQuery]);

//   const fetchPrograms = useCallback(async () => {
//     try {
//       const data = await getPrograms();
//       setPrograms(data || []);
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//     }
//   }, [getPrograms]);

//   useEffect(() => {
//     fetchPrograms();
//   }, [fetchPrograms]);

//   useEffect(() => {
//     fetchEpisodes(1, true);
//   }, [fetchEpisodes]);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleProgramFilter = (programId) => {
//     setSelectedProgram(programId);
//     setCurrentPage(1);
//   };

//   const handleSeasonFilter = (season) => {
//     setSelectedSeason(season);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (sort) => {
//     setSortBy(sort);
//     setCurrentPage(1);
//   };

//   const handleLoadMore = () => {
//     if (currentPage < totalPages && !loadingMore) {
//       fetchEpisodes(currentPage + 1);
//     }
//   };

//   const handlePlayEpisode = async (episode) => {
//     try {
//       await playEpisode(episode);
//     } catch (error) {
//       console.error('Failed to play episode:', error);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds) return '';
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     if (hours > 0) {
//       return `${hours}h ${minutes % 60}m`;
//     }
//     return `${minutes}m`;
//   };

//   const getSeasonOptions = () => {
//     const seasons = [...new Set(episodes.map(ep => ep.season).filter(Boolean))];
//     return seasons.sort((a, b) => b - a);
//   };

//   const renderEpisodeCard = (episode) => (
//     <Col lg={4} md={6} key={episode._id} className="mb-4">
//       <Card className="h-100 episode-card">
//         <div className="position-relative">
//           <Card.Img
//             variant="top"
//             src={episode.image || '/uploads/placeholder-episode.jpg'}
//             alt={episode.title}
//             style={{ height: '200px', objectFit: 'cover' }}
//           />
//           <Button
//             variant="primary"
//             className="position-absolute top-50 start-50 translate-middle rounded-circle"
//             style={{ width: '60px', height: '60px' }}
//             onClick={() => handlePlayEpisode(episode)}
//           >
//             <i className="bi bi-play-fill fs-4"></i>
//           </Button>
//         </div>
        
//         <Card.Body className="d-flex flex-column">
//           <div className="mb-2">
//             <Badge bg="info" className="me-2">
//               S{episode.season}E{episode.episodeNumber}
//             </Badge>
//             {episode.featured && (
//               <Badge bg="warning">
//                 <i className="bi bi-star-fill me-1"></i>
//                 Vedette
//               </Badge>
//             )}
//           </div>
          
//           <Card.Title className="h6">{episode.title}</Card.Title>
          
//           <Card.Text className="text-muted small mb-2">
//             <Link 
//               to={`/programs/${episode.programId?.slug}`}
//               className="text-decoration-none"
//             >
//               <i className="bi bi-tv me-1"></i>
//               {episode.programId?.title}
//             </Link>
//           </Card.Text>
          
//           <Card.Text className="flex-grow-1 small">
//             {episode.description}
//           </Card.Text>
          
//           <div className="mt-auto">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <small className="text-muted">
//                 <i className="bi bi-calendar3 me-1"></i>
//                 {formatDate(episode.airDate)}
//               </small>
//               {episode.duration && (
//                 <small className="text-muted">
//                   <i className="bi bi-clock me-1"></i>
//                   {formatDuration(episode.duration)}
//                 </small>
//               )}
//             </div>
            
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="dark" 
//                 size="sm" 
//                 className="flex-grow-1"
//                 onClick={() => handlePlayEpisode(episode)}
//               >
//                 <i className="bi bi-play-fill me-1"></i>
//                 Écouter
//               </Button>
//               <Button variant="outline-secondary" size="sm">
//                 <i className="bi bi-download"></i>
//               </Button>
//               <Button variant="outline-secondary" size="sm">
//                 <i className="bi bi-heart"></i>
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     </Col>
//   );

//   return (
//     <div className="episodes-page py-5">
//       <Container>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <h1 className="text-center mb-3">
//               <i className="bi bi-collection-play me-2"></i>
//               {t('episodes')}
//             </h1>
//             <p className="text-center text-muted lead">
//               Découvrez tous les épisodes de vos programmes préférés
//             </p>
//           </Col>
//         </Row>

//         {/* Audio Player */}
//         <Row className="mb-4">
//           <Col>
//             <AudioPlayer />
//           </Col>
//         </Row>

//         {/* Filters */}
//         <Row className="mb-4">
//           <Col>
//             <Card className="shadow-sm">
//               <Card.Body>
//                 {/* Search */}
//                 <Row className="mb-3">
//                   <Col md={6} className="mx-auto">
//                     <Form.Control
//                       type="text"
//                       placeholder="Rechercher des épisodes..."
//                       value={searchQuery}
//                       onChange={(e) => handleSearch(e.target.value)}
//                       className="form-control-lg"
//                     />
//                   </Col>
//                 </Row>

//                 {/* Filters Row */}
//                 <Row className="g-3">
//                   <Col md={3}>
//                     <Form.Select
//                       value={selectedProgram}
//                       onChange={(e) => handleProgramFilter(e.target.value)}
//                     >
//                       <option value="all">Tous les programmes</option>
//                       {programs.map((program) => (
//                         <option key={program._id} value={program._id}>
//                           {program.title}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
                  
//                   <Col md={3}>
//                     <Form.Select
//                       value={selectedSeason}
//                       onChange={(e) => handleSeasonFilter(e.target.value)}
//                     >
//                       <option value="all">Toutes les saisons</option>
//                       {getSeasonOptions().map((season) => (
//                         <option key={season} value={season}>
//                           Saison {season}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
                  
//                   <Col md={3}>
//                     <Form.Select
//                       value={sortBy}
//                       onChange={(e) => handleSortChange(e.target.value)}
//                     >
//                       {sortOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
                  
//                   <Col md={3}>
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSelectedProgram('all');
//                         setSelectedSeason('all');
//                         setSortBy('newest');
//                         setCurrentPage(1);
//                       }}
//                       className="w-100"
//                     >
//                       <i className="bi bi-arrow-clockwise me-2"></i>
//                       Réinitialiser
//                     </Button>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Results Info */}
//         <Row className="mb-3">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">
//                 {totalEpisodes} épisode{totalEpisodes > 1 ? 's' : ''} trouvé{totalEpisodes > 1 ? 's' : ''}
//               </h5>
//               <small className="text-muted">
//                 Page {currentPage} sur {totalPages}
//               </small>
//             </div>
//           </Col>
//         </Row>

//         {/* Episodes Grid */}
//         {error && (
//           <Row className="mb-4">
//             <Col>
//               <Alert variant="danger">
//                 <i className="bi bi-exclamation-triangle me-2"></i>
//                 {error}
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {loading ? (
//           <div className="text-center py-5">
//             <Spinner animation="border" variant="dark" />
//             <p className="mt-3">Chargement des épisodes...</p>
//           </div>
//         ) : (
//           <>
//             {episodes.length > 0 ? (
//               <>
//                 <Row>
//                   {episodes.map(renderEpisodeCard)}
//                 </Row>

//                 {/* Load More Button */}
//                 {currentPage < totalPages && (
//                   <Row className="mt-4">
//                     <Col className="text-center">
//                       <Button
//                         variant="outline-dark"
//                         onClick={handleLoadMore}
//                         disabled={loadingMore}
//                         size="lg"
//                       >
//                         {loadingMore ? (
//                           <>
//                             <Spinner
//                               as="span"
//                               animation="border"
//                               size="sm"
//                               role="status"
//                               aria-hidden="true"
//                               className="me-2"
//                             />
//                             Chargement...
//                           </>
//                         ) : (
//                           <>
//                             <i className="bi bi-plus-circle me-2"></i>
//                             Voir plus d'épisodes
//                           </>
//                         )}
//                       </Button>
//                     </Col>
//                   </Row>
//                 )}
//               </>
//             ) : (
//               <Row>
//                 <Col>
//                   <div className="text-center py-5">
//                     <i className="bi bi-collection-play fs-1 text-muted mb-3"></i>
//                     <h4 className="text-muted">Aucun épisode trouvé</h4>
//                     <p className="text-muted mb-4">
//                       Aucun épisode ne correspond à vos critères de recherche.
//                     </p>
//                     <Button
//                       variant="outline-dark"
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSelectedProgram('all');
//                         setSelectedSeason('all');
//                         setSortBy('newest');
//                         setCurrentPage(1);
//                       }}
//                     >
//                       Réinitialiser les filtres
//                     </Button>
//                   </div>
//                 </Col>
//               </Row>
//             )}
//           </>
//         )}

//         {/* Featured Episodes */}
//         {searchQuery === '' && selectedProgram === 'all' && selectedSeason === 'all' && (
//           <Row className="mt-5">
//             <Col>
//               <Card className="bg-light">
//                 <Card.Body className="text-center">
//                   <h4 className="mb-3">
//                     <i className="bi bi-star-fill text-warning me-2"></i>
//                     Épisodes en vedette
//                   </h4>
//                   <p className="text-muted mb-3">
//                     Découvrez une sélection des meilleurs épisodes choisis par notre équipe
//                   </p>
//                   <Button variant="dark" onClick={() => handleSearch('featured')}>
//                     <i className="bi bi-search me-2"></i>
//                     Voir les épisodes vedettes
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default Episodes;
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Nav, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../contexts/RadioContext';
import AudioPlayer from '../components/AudioPlayer';

const Episodes = () => {
  const { t } = useTranslation();
  const { getEpisodes, getPrograms, searchEpisodes, playEpisode } = useRadio();
  
  const [episodes, setEpisodes] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [error, setError] = useState('');

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'title', label: 'Titre A-Z' },
    { value: 'season', label: 'Saison' }
  ];

  const fetchEpisodes = useCallback(async (page = 1, reset = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');

    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
        ...(selectedProgram !== 'all' && { programId: selectedProgram }),
        ...(selectedSeason !== 'all' && { season: selectedSeason }),
        ...(searchQuery && { search: searchQuery })
      };

      const data = await getEpisodes(params);
      
      // Ensure data structure with fallbacks
      const episodesList = Array.isArray(data?.episodes) ? data.episodes : 
                          Array.isArray(data) ? data : [];
      
      if (reset || page === 1) {
        setEpisodes(episodesList);
      } else {
        setEpisodes(prev => [...prev, ...episodesList]);
      }
      
      setTotalPages(data?.totalPages || Math.max(1, Math.ceil(episodesList.length / 12)));
      setTotalEpisodes(data?.total || episodesList.length);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
      setError('Erreur lors du chargement des épisodes');
      // Set empty state on error
      if (reset || page === 1) {
        setEpisodes([]);
        setTotalPages(1);
        setTotalEpisodes(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getEpisodes, sortBy, selectedProgram, selectedSeason, searchQuery]);

  const fetchPrograms = useCallback(async () => {
    try {
      const data = await getPrograms();
      // Ensure programs is always an array
      const programsList = Array.isArray(data) ? data : 
                          Array.isArray(data?.programs) ? data.programs : [];
      setPrograms(programsList);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      setPrograms([]); // Set empty array on error
    }
  }, [getPrograms]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    fetchEpisodes(1, true);
  }, [fetchEpisodes]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleProgramFilter = (programId) => {
    setSelectedProgram(programId);
    setCurrentPage(1);
  };

  const handleSeasonFilter = (season) => {
    setSelectedSeason(season);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchEpisodes(currentPage + 1);
    }
  };

  const handlePlayEpisode = async (episode) => {
    if (!episode) return;
    try {
      await playEpisode(episode);
    } catch (error) {
      console.error('Failed to play episode:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getSeasonOptions = () => {
    if (!Array.isArray(episodes)) return [];
    const seasons = [...new Set(episodes
      .map(ep => ep?.season)
      .filter(season => season != null && season !== ''))];
    return seasons.sort((a, b) => b - a);
  };

  const renderEpisodeCard = (episode) => {
    // Safety check for episode
    if (!episode || !episode._id) {
      return null;
    }

    return (
      <Col lg={4} md={6} key={episode._id} className="mb-4">
        <Card className="h-100 episode-card">
          <div className="position-relative">
            <Card.Img
              variant="top"
              src={episode.image || '/uploads/placeholder-episode.jpg'}
              alt={episode.title || 'Episode'}
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Button
              variant="primary"
              className="position-absolute top-50 start-50 translate-middle rounded-circle"
              style={{ width: '60px', height: '60px' }}
              onClick={() => handlePlayEpisode(episode)}
            >
              <i className="bi bi-play-fill fs-4"></i>
            </Button>
          </div>
          
          <Card.Body className="d-flex flex-column">
            <div className="mb-2">
              {episode.season && episode.episodeNumber && (
                <Badge bg="info" className="me-2">
                  S{episode.season}E{episode.episodeNumber}
                </Badge>
              )}
              {episode.featured && (
                <Badge bg="warning">
                  <i className="bi bi-star-fill me-1"></i>
                  Vedette
                </Badge>
              )}
            </div>
            
            <Card.Title className="h6">{episode.title || 'Sans titre'}</Card.Title>
            
            {episode.programId && (
              <Card.Text className="text-muted small mb-2">
                <Link 
                  to={`/programs/${episode.programId.slug || episode.programId._id}`}
                  className="text-decoration-none"
                >
                  <i className="bi bi-tv me-1"></i>
                  {episode.programId.title || 'Programme'}
                </Link>
              </Card.Text>
            )}
            
            <Card.Text className="flex-grow-1 small">
              {episode.description || 'Pas de description disponible'}
            </Card.Text>
            
            <div className="mt-auto">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  {formatDate(episode.airDate)}
                </small>
                {episode.duration && (
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {formatDuration(episode.duration)}
                  </small>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <Button 
                  variant="dark" 
                  size="sm" 
                  className="flex-grow-1"
                  onClick={() => handlePlayEpisode(episode)}
                >
                  <i className="bi bi-play-fill me-1"></i>
                  Écouter
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-download"></i>
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-heart"></i>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div className="episodes-page py-5">
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="text-center mb-3">
              <i className="bi bi-collection-play me-2"></i>
              {t('episodes')}
            </h1>
            <p className="text-center text-muted lead">
              Découvrez tous les épisodes de vos programmes préférés
            </p>
          </Col>
        </Row>

        {/* Audio Player */}
        <Row className="mb-4">
          <Col>
            <AudioPlayer />
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                {/* Search */}
                <Row className="mb-3">
                  <Col md={6} className="mx-auto">
                    <Form.Control
                      type="text"
                      placeholder="Rechercher des épisodes..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="form-control-lg"
                    />
                  </Col>
                </Row>

                {/* Filters Row */}
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Select
                      value={selectedProgram}
                      onChange={(e) => handleProgramFilter(e.target.value)}
                    >
                      <option value="all">Tous les programmes</option>
                      {Array.isArray(programs) && programs.map((program) => (
                        program && program._id ? (
                          <option key={program._id} value={program._id}>
                            {program.title || 'Programme sans nom'}
                          </option>
                        ) : null
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select
                      value={selectedSeason}
                      onChange={(e) => handleSeasonFilter(e.target.value)}
                    >
                      <option value="all">Toutes les saisons</option>
                      {getSeasonOptions().map((season) => (
                        <option key={season} value={season}>
                          Saison {season}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={3}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedProgram('all');
                        setSelectedSeason('all');
                        setSortBy('newest');
                        setCurrentPage(1);
                      }}
                      className="w-100"
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Réinitialiser
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Results Info */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {totalEpisodes} épisode{totalEpisodes > 1 ? 's' : ''} trouvé{totalEpisodes > 1 ? 's' : ''}
              </h5>
              <small className="text-muted">
                Page {currentPage} sur {totalPages}
              </small>
            </div>
          </Col>
        </Row>

        {/* Episodes Grid */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" />
            <p className="mt-3">Chargement des épisodes...</p>
          </div>
        ) : (
          <>
            {Array.isArray(episodes) && episodes.length > 0 ? (
              <>
                <Row>
                  {episodes.map(renderEpisodeCard).filter(Boolean)}
                </Row>

                {/* Load More Button */}
                {currentPage < totalPages && (
                  <Row className="mt-4">
                    <Col className="text-center">
                      <Button
                        variant="outline-dark"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        size="lg"
                      >
                        {loadingMore ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Chargement...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-2"></i>
                            Voir plus d'épisodes
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <Row>
                <Col>
                  <div className="text-center py-5">
                    <i className="bi bi-collection-play fs-1 text-muted mb-3"></i>
                    <h4 className="text-muted">Aucun épisode trouvé</h4>
                    <p className="text-muted mb-4">
                      Aucun épisode ne correspond à vos critères de recherche.
                    </p>
                    <Button
                      variant="outline-dark"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedProgram('all');
                        setSelectedSeason('all');
                        setSortBy('newest');
                        setCurrentPage(1);
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </>
        )}

        {/* Featured Episodes */}
        {searchQuery === '' && selectedProgram === 'all' && selectedSeason === 'all' && (
          <Row className="mt-5">
            <Col>
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h4 className="mb-3">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    Épisodes en vedette
                  </h4>
                  <p className="text-muted mb-3">
                    Découvrez une sélection des meilleurs épisodes choisis par notre équipe
                  </p>
                  <Button variant="dark" onClick={() => handleSearch('featured')}>
                    <i className="bi bi-search me-2"></i>
                    Voir les épisodes vedettes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Episodes;