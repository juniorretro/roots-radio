// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Podcasts = () => {
//   const { t } = useTranslation();
//   const { getPodcasts, searchPodcasts, playPodcast, likePodcast, downloadPodcast } = useRadio();
  
//   const [podcasts, setPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalPodcasts, setTotalPodcasts] = useState(0);
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedPodcast, setSelectedPodcast] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const sortOptions = [
//     { value: 'newest', label: 'Plus récents' },
//     { value: 'oldest', label: 'Plus anciens' },
//     { value: 'popular', label: 'Plus populaires' },
//     { value: 'title', label: 'Titre A-Z' },
//     { value: 'duration', label: 'Durée' }
//   ];

//   const fetchPodcasts = useCallback(async (page = 1, reset = false) => {
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
//         ...(selectedCategory !== 'all' && { category: selectedCategory }),
//         ...(searchQuery && { search: searchQuery })
//       };

//       const data = await getPodcasts(params);
      
//       if (reset || page === 1) {
//         setPodcasts(data.podcasts || []);
//       } else {
//         setPodcasts(prev => [...prev, ...(data.podcasts || [])]);
//       }
      
//       setTotalPages(data.totalPages || 1);
//       setTotalPodcasts(data.total || 0);
//       setCurrentPage(page);

//       // Extract categories
//       if (data.podcasts && data.podcasts.length > 0) {
//         const uniqueCategories = [...new Set(data.podcasts.map(p => p.category).filter(Boolean))];
//         setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch podcasts:', error);
//       setError('Erreur lors du chargement des podcasts');
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, [getPodcasts, sortBy, selectedCategory, searchQuery]);

//   useEffect(() => {
//     fetchPodcasts(1, true);
//   }, [fetchPodcasts]);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleCategoryFilter = (category) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (sort) => {
//     setSortBy(sort);
//     setCurrentPage(1);
//   };

//   const handleLoadMore = () => {
//     if (currentPage < totalPages && !loadingMore) {
//       fetchPodcasts(currentPage + 1);
//     }
//   };

//   const handlePlayPodcast = async (podcast) => {
//     try {
//       await playPodcast(podcast);
//     } catch (error) {
//       console.error('Failed to play podcast:', error);
//     }
//   };

//   const handleLikePodcast = async (podcastId) => {
//     try {
//       await likePodcast(podcastId);
//       // Update local state
//       setPodcasts(prev => prev.map(p => 
//         p._id === podcastId 
//           ? { ...p, likes: (p.likes || 0) + 1, isLiked: true }
//           : p
//       ));
//     } catch (error) {
//       console.error('Failed to like podcast:', error);
//     }
//   };

//   const handleDownloadPodcast = async (podcast) => {
//     try {
//       await downloadPodcast(podcast._id);
//       // Update download count
//       setPodcasts(prev => prev.map(p => 
//         p._id === podcast._id 
//           ? { ...p, downloads: (p.downloads || 0) + 1 }
//           : p
//       ));
//     } catch (error) {
//       console.error('Failed to download podcast:', error);
//     }
//   };

//   const handleShowDetails = (podcast) => {
//     setSelectedPodcast(podcast);
//     setShowModal(true);
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

//   const renderPodcastCard = (podcast) => (
//     <Col lg={4} md={6} key={podcast._id} className="mb-4">
//       <Card className="h-100 podcast-card">
//         <div className="position-relative">
//           <Card.Img
//             variant="top"
//             src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//             alt={podcast.title}
//             style={{ height: '200px', objectFit: 'cover' }}
//           />
//           <Button
//             variant="success"
//             className="position-absolute top-50 start-50 translate-middle rounded-circle"
//             style={{ width: '60px', height: '60px' }}
//             onClick={() => handlePlayPodcast(podcast)}
//           >
//             <i className="bi bi-play-fill fs-4"></i>
//           </Button>
//           {podcast.featured && (
//             <Badge 
//               bg="warning" 
//               className="position-absolute top-0 end-0 m-2"
//             >
//               <i className="bi bi-star-fill me-1"></i>
//               Vedette
//             </Badge>
//           )}
//         </div>
        
//         <Card.Body className="d-flex flex-column">
//           <div className="mb-2">
//             <Badge bg="secondary" className="me-2">
//               {podcast.category}
//             </Badge>
//             <Badge bg="info">
//               {formatDuration(podcast.duration)}
//             </Badge>
//           </div>
          
//           <Card.Title className="h6">{podcast.title}</Card.Title>
          
//           <Card.Text className="text-muted small mb-2">
//             <i className="bi bi-person me-1"></i>
//             {podcast.host}
//           </Card.Text>
          
//           <Card.Text className="flex-grow-1 small">
//             {podcast.description}
//           </Card.Text>
          
//           <div className="mt-auto">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <small className="text-muted">
//                 <i className="bi bi-calendar3 me-1"></i>
//                 {formatDate(podcast.publishDate)}
//               </small>
//               <div className="d-flex gap-3">
//                 <small className="text-muted">
//                   <i className="bi bi-download me-1"></i>
//                   {podcast.downloads || 0}
//                 </small>
//                 <small className="text-muted">
//                   <i className="bi bi-heart me-1"></i>
//                   {podcast.likes || 0}
//                 </small>
//               </div>
//             </div>
            
//             <div className="d-flex gap-1">
//               <Button 
//                 variant="success" 
//                 size="sm" 
//                 className="flex-grow-1"
//                 onClick={() => handlePlayPodcast(podcast)}
//               >
//                 <i className="bi bi-play-fill me-1"></i>
//                 Écouter
//               </Button>
//               <Button 
//                 variant="outline-secondary" 
//                 size="sm"
//                 onClick={() => handleDownloadPodcast(podcast)}
//                 title="Télécharger"
//               >
//                 <i className="bi bi-download"></i>
//               </Button>
//               <Button 
//                 variant={podcast.isLiked ? "danger" : "outline-danger"} 
//                 size="sm"
//                 onClick={() => handleLikePodcast(podcast._id)}
//                 title="J'aime"
//               >
//                 <i className={podcast.isLiked ? "bi bi-heart-fill" : "bi bi-heart"}></i>
//               </Button>
//               <Button 
//                 variant="outline-secondary" 
//                 size="sm"
//                 onClick={() => handleShowDetails(podcast)}
//                 title="Détails"
//               >
//                 <i className="bi bi-info-circle"></i>
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     </Col>
//   );

//   return (
//     <div className="podcasts-page py-5">
//       <Container>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <h1 className="text-center mb-3">
//               <i className="bi bi-headphones me-2"></i>
//               {t('podcasts')}
//             </h1>
//             <p className="text-center text-muted lead">
//               Explorez notre collection de podcasts exclusifs disponibles à la demande
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
//                       placeholder="Rechercher des podcasts..."
//                       value={searchQuery}
//                       onChange={(e) => handleSearch(e.target.value)}
//                       className="form-control-lg"
//                     />
//                   </Col>
//                 </Row>

//                 {/* Filters Row */}
//                 <Row className="g-3">
//                   <Col md={4}>
//                     <Form.Select
//                       value={selectedCategory}
//                       onChange={(e) => handleCategoryFilter(e.target.value)}
//                     >
//                       <option value="all">Toutes les catégories</option>
//                       {categories.map((category) => (
//                         <option key={category} value={category}>
//                           {category}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
                  
//                   <Col md={4}>
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
                  
//                   <Col md={4}>
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSelectedCategory('all');
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
//                 {totalPodcasts} podcast{totalPodcasts > 1 ? 's' : ''} disponible{totalPodcasts > 1 ? 's' : ''}
//               </h5>
//               <small className="text-muted">
//                 Page {currentPage} sur {totalPages}
//               </small>
//             </div>
//           </Col>
//         </Row>

//         {/* Podcasts Grid */}
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
//             <Spinner animation="border" variant="success" />
//             <p className="mt-3">Chargement des podcasts...</p>
//           </div>
//         ) : (
//           <>
//             {podcasts.length > 0 ? (
//               <>
//                 <Row>
//                   {podcasts.map(renderPodcastCard)}
//                 </Row>

//                 {/* Load More Button */}
//                 {currentPage < totalPages && (
//                   <Row className="mt-4">
//                     <Col className="text-center">
//                       <Button
//                         variant="outline-success"
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
//                             Voir plus de podcasts
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
//                     <i className="bi bi-headphones fs-1 text-muted mb-3"></i>
//                     <h4 className="text-muted">Aucun podcast trouvé</h4>
//                     <p className="text-muted mb-4">
//                       Aucun podcast ne correspond à vos critères de recherche.
//                     </p>
//                     <Button
//                       variant="outline-success"
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSelectedCategory('all');
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

//         {/* Categories Section */}
//         {categories.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
//           <Row className="mt-5">
//             <Col>
//               <Card className="bg-light">
//                 <Card.Body>
//                   <h4 className="mb-3 text-center">
//                     <i className="bi bi-collection me-2"></i>
//                     Parcourir par catégories
//                   </h4>
//                   <div className="d-flex flex-wrap justify-content-center gap-2">
//                     {categories.map((category) => (
//                       <Button
//                         key={category}
//                         variant="outline-success"
//                         onClick={() => handleCategoryFilter(category)}
//                         className="mb-2"
//                       >
//                         <i className="bi bi-tag me-1"></i>
//                         {category}
//                       </Button>
//                     ))}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}
//       </Container>

//       {/* Podcast Details Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-headphones me-2"></i>
//             Détails du podcast
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedPodcast && (
//             <Row>
//               <Col md={4}>
//                 <img
//                   src={selectedPodcast.image || '/uploads/placeholder-podcast.jpg'}
//                   alt={selectedPodcast.title}
//                   className="img-fluid rounded mb-3"
//                 />
//               </Col>
//               <Col md={8}>
//                 <h4>{selectedPodcast.title}</h4>
//                 <p className="text-muted mb-2">
//                   <i className="bi bi-person me-1"></i>
//                   {selectedPodcast.host}
//                 </p>
//                 <div className="mb-3">
//                   <Badge bg="secondary" className="me-2">
//                     {selectedPodcast.category}
//                   </Badge>
//                   <Badge bg="info" className="me-2">
//                     {formatDuration(selectedPodcast.duration)}
//                   </Badge>
//                   {selectedPodcast.featured && (
//                     <Badge bg="warning">
//                       <i className="bi bi-star-fill me-1"></i>
//                       Vedette
//                     </Badge>
//                   )}
//                 </div>
//                 <p>{selectedPodcast.description}</p>
//                 <div className="mb-3">
//                   <small className="text-muted">
//                     <i className="bi bi-calendar3 me-1"></i>
//                     Publié le {formatDate(selectedPodcast.publishDate)}
//                   </small>
//                 </div>
//                 <div className="d-flex gap-2 mb-3">
//                   <div className="text-muted">
//                     <i className="bi bi-download me-1"></i>
//                     {selectedPodcast.downloads || 0} téléchargements
//                   </div>
//                   <div className="text-muted">
//                     <i className="bi bi-heart me-1"></i>
//                     {selectedPodcast.likes || 0} j'aimes
//                   </div>
//                 </div>
//                 {selectedPodcast.tags && selectedPodcast.tags.length > 0 && (
//                   <div>
//                     <strong>Tags :</strong>
//                     <div className="mt-1">
//                       {selectedPodcast.tags.map((tag, index) => (
//                         <Badge key={index} bg="light" text="dark" className="me-1">
//                           #{tag}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Fermer
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={() => {
//               handlePlayPodcast(selectedPodcast);
//               setShowModal(false);
//             }}
//           >
//             <i className="bi bi-play-fill me-1"></i>
//             Écouter
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Podcasts;
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../contexts/RadioContext';
import AudioPlayer from '../components/AudioPlayer';

const Podcasts = () => {
  const { t } = useTranslation();
  const { getPodcasts, searchPodcasts, playPodcast, likePodcast, downloadPodcast } = useRadio();
  
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPodcasts, setTotalPodcasts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'title', label: 'Titre A-Z' },
    { value: 'duration', label: 'Durée' }
  ];

  const fetchPodcasts = useCallback(async (page = 1, reset = false) => {
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
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      };

      const data = await getPodcasts(params);
      
      // Ensure data structure with fallbacks
      const podcastsList = Array.isArray(data?.podcasts) ? data.podcasts : 
                          Array.isArray(data) ? data : [];
      
      if (reset || page === 1) {
        setPodcasts(podcastsList);
      } else {
        setPodcasts(prev => [...prev, ...podcastsList]);
      }
      
      setTotalPages(data?.totalPages || Math.max(1, Math.ceil(podcastsList.length / 12)));
      setTotalPodcasts(data?.total || podcastsList.length);
      setCurrentPage(page);

      // Extract categories safely
      if (Array.isArray(podcastsList) && podcastsList.length > 0) {
        const uniqueCategories = [...new Set(podcastsList
          .map(p => p?.category)
          .filter(cat => cat && cat.trim() !== ''))];
        setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
      }
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
      setError('Erreur lors du chargement des podcasts');
      // Set empty state on error
      if (reset || page === 1) {
        setPodcasts([]);
        setTotalPages(1);
        setTotalPodcasts(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getPodcasts, sortBy, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchPodcasts(1, true);
  }, [fetchPodcasts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchPodcasts(currentPage + 1);
    }
  };

  const handlePlayPodcast = async (podcast) => {
    if (!podcast) return;
    try {
      await playPodcast(podcast);
    } catch (error) {
      console.error('Failed to play podcast:', error);
    }
  };

  const handleLikePodcast = async (podcastId) => {
    if (!podcastId) return;
    try {
      await likePodcast(podcastId);
      // Update local state safely
      setPodcasts(prev => prev.map(p => 
        p && p._id === podcastId 
          ? { ...p, likes: (p.likes || 0) + 1, isLiked: true }
          : p
      ));
    } catch (error) {
      console.error('Failed to like podcast:', error);
    }
  };

  const handleDownloadPodcast = async (podcast) => {
    if (!podcast || !podcast._id) return;
    try {
      await downloadPodcast(podcast._id);
      // Update download count safely
      setPodcasts(prev => prev.map(p => 
        p && p._id === podcast._id 
          ? { ...p, downloads: (p.downloads || 0) + 1 }
          : p
      ));
    } catch (error) {
      console.error('Failed to download podcast:', error);
    }
  };

  const handleShowDetails = (podcast) => {
    if (!podcast) return;
    setSelectedPodcast(podcast);
    setShowModal(true);
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

  const renderPodcastCard = (podcast) => {
    // Safety check for podcast
    if (!podcast || !podcast._id) {
      return null;
    }

    return (
      <Col lg={4} md={6} key={podcast._id} className="mb-4">
        <Card className="h-100 podcast-card">
          <div className="position-relative">
            <Card.Img
              variant="top"
              src={podcast.image || '/uploads/placeholder-podcast.jpg'}
              alt={podcast.title || 'Podcast'}
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Button
              variant="success"
              className="position-absolute top-50 start-50 translate-middle rounded-circle"
              style={{ width: '60px', height: '60px' }}
              onClick={() => handlePlayPodcast(podcast)}
            >
              <i className="bi bi-play-fill fs-4"></i>
            </Button>
            {podcast.featured && (
              <Badge 
                bg="warning" 
                className="position-absolute top-0 end-0 m-2"
              >
                <i className="bi bi-star-fill me-1"></i>
                Vedette
              </Badge>
            )}
          </div>
          
          <Card.Body className="d-flex flex-column">
            <div className="mb-2">
              <Badge bg="secondary" className="me-2">
                {podcast.category || 'Non classé'}
              </Badge>
              <Badge bg="info">
                {formatDuration(podcast.duration)}
              </Badge>
            </div>
            
            <Card.Title className="h6">{podcast.title || 'Sans titre'}</Card.Title>
            
            <Card.Text className="text-muted small mb-2">
              <i className="bi bi-person me-1"></i>
              {podcast.host || 'Animateur inconnu'}
            </Card.Text>
            
            <Card.Text className="flex-grow-1 small">
              {podcast.description || 'Pas de description disponible'}
            </Card.Text>
            
            <div className="mt-auto">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">
                  <i className="bi bi-calendar3 me-1"></i>
                  {formatDate(podcast.publishDate)}
                </small>
                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="bi bi-download me-1"></i>
                    {podcast.downloads || 0}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-heart me-1"></i>
                    {podcast.likes || 0}
                  </small>
                </div>
              </div>
              
              <div className="d-flex gap-1">
                <Button 
                  variant="success" 
                  size="sm" 
                  className="flex-grow-1"
                  onClick={() => handlePlayPodcast(podcast)}
                >
                  <i className="bi bi-play-fill me-1"></i>
                  Écouter
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => handleDownloadPodcast(podcast)}
                  title="Télécharger"
                >
                  <i className="bi bi-download"></i>
                </Button>
                <Button 
                  variant={podcast.isLiked ? "danger" : "outline-danger"} 
                  size="sm"
                  onClick={() => handleLikePodcast(podcast._id)}
                  title="J'aime"
                >
                  <i className={podcast.isLiked ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => handleShowDetails(podcast)}
                  title="Détails"
                >
                  <i className="bi bi-info-circle"></i>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div className="podcasts-page py-5">
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="text-center mb-3">
              <i className="bi bi-headphones me-2"></i>
              {t('podcasts')}
            </h1>
            <p className="text-center text-muted lead">
              Explorez notre collection de podcasts exclusifs disponibles à la demande
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
                      placeholder="Rechercher des podcasts..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="form-control-lg"
                    />
                  </Col>
                </Row>

                {/* Filters Row */}
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryFilter(e.target.value)}
                    >
                      <option value="all">Toutes les catégories</option>
                      {Array.isArray(categories) && categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={4}>
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
                  
                  <Col md={4}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
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
                {totalPodcasts} podcast{totalPodcasts > 1 ? 's' : ''} disponible{totalPodcasts > 1 ? 's' : ''}
              </h5>
              <small className="text-muted">
                Page {currentPage} sur {totalPages}
              </small>
            </div>
          </Col>
        </Row>

        {/* Podcasts Grid */}
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
            <Spinner animation="border" variant="success" />
            <p className="mt-3">Chargement des podcasts...</p>
          </div>
        ) : (
          <>
            {Array.isArray(podcasts) && podcasts.length > 0 ? (
              <>
                <Row>
                  {podcasts.map(renderPodcastCard).filter(Boolean)}
                </Row>

                {/* Load More Button */}
                {currentPage < totalPages && (
                  <Row className="mt-4">
                    <Col className="text-center">
                      <Button
                        variant="outline-success"
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
                            Voir plus de podcasts
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
                    <i className="bi bi-headphones fs-1 text-muted mb-3"></i>
                    <h4 className="text-muted">Aucun podcast trouvé</h4>
                    <p className="text-muted mb-4">
                      Aucun podcast ne correspond à vos critères de recherche.
                    </p>
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
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

        {/* Categories Section */}
        {Array.isArray(categories) && categories.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
          <Row className="mt-5">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <h4 className="mb-3 text-center">
                    <i className="bi bi-collection me-2"></i>
                    Parcourir par catégories
                  </h4>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="outline-success"
                        onClick={() => handleCategoryFilter(category)}
                        className="mb-2"
                      >
                        <i className="bi bi-tag me-1"></i>
                        {category}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Podcast Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-headphones me-2"></i>
            Détails du podcast
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPodcast && (
            <Row>
              <Col md={4}>
                <img
                  src={selectedPodcast.image || '/uploads/placeholder-podcast.jpg'}
                  alt={selectedPodcast.title || 'Podcast'}
                  className="img-fluid rounded mb-3"
                />
              </Col>
              <Col md={8}>
                <h4>{selectedPodcast.title || 'Sans titre'}</h4>
                <p className="text-muted mb-2">
                  <i className="bi bi-person me-1"></i>
                  {selectedPodcast.host || 'Animateur inconnu'}
                </p>
                <div className="mb-3">
                  <Badge bg="secondary" className="me-2">
                    {selectedPodcast.category || 'Non classé'}
                  </Badge>
                  <Badge bg="info" className="me-2">
                    {formatDuration(selectedPodcast.duration)}
                  </Badge>
                  {selectedPodcast.featured && (
                    <Badge bg="warning">
                      <i className="bi bi-star-fill me-1"></i>
                      Vedette
                    </Badge>
                  )}
                </div>
                <p>{selectedPodcast.description || 'Pas de description disponible'}</p>
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    Publié le {formatDate(selectedPodcast.publishDate)}
                  </small>
                </div>
                <div className="d-flex gap-2 mb-3">
                  <div className="text-muted">
                    <i className="bi bi-download me-1"></i>
                    {selectedPodcast.downloads || 0} téléchargements
                  </div>
                  <div className="text-muted">
                    <i className="bi bi-heart me-1"></i>
                    {selectedPodcast.likes || 0} j'aimes
                  </div>
                </div>
                {Array.isArray(selectedPodcast.tags) && selectedPodcast.tags.length > 0 && (
                  <div>
                    <strong>Tags :</strong>
                    <div className="mt-1">
                      {selectedPodcast.tags.map((tag, index) => (
                        <Badge key={index} bg="light" text="dark" className="me-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button 
            variant="success" 
            onClick={() => {
              handlePlayPodcast(selectedPodcast);
              setShowModal(false);
            }}
          >
            <i className="bi bi-play-fill me-1"></i>
            Écouter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Podcasts;