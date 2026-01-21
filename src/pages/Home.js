// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Home = () => {
//   const { t } = useTranslation();
//   const { 
//     currentProgram, 
//     nextProgram, 
//     getActivePrograms, 
//     getEpisodes, 
//     getPodcasts 
//   } = useRadio();
  
//   const [featuredPrograms, setFeaturedPrograms] = useState([]);
//   const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
//   const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       setLoading(true);
//       try {
//         // Get featured programs
//         const programs = await getActivePrograms();
//         const featured = programs.filter(p => p.featured).slice(0, 3);
//         setFeaturedPrograms(featured);

//         // Get featured episodes
//         const episodesData = await getEpisodes({ featured: true, limit: 3 });
//         setFeaturedEpisodes(episodesData.episodes || []);

//         // Get featured podcasts
//         const podcastsData = await getPodcasts({ featured: true, limit: 3 });
//         setFeaturedPodcasts(podcastsData.podcasts || []);
//       } catch (error) {
//         console.error('Failed to fetch featured content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedContent();
//   }, [getActivePrograms, getEpisodes, getPodcasts]);

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // HH:MM format
//   };

//   const getCurrentSchedule = (program) => {
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//     return program?.schedule?.find(s => s.day === today);
//   };

//   return (
//     <div className="home-page">
//       {/* Audio Player */}
//       <section className="py-4 bg-dark">
//         <Container>
//             {/* <img className='logo' src='/images/programs/logo-rootsmusicradio.png' alt="" sizes="10px" srcset=""
//             style={{width: '500px'}}
//             ></img> */}
//             {/* <div style={{  
//             backgroundImage:'url(/images/programs/logo-rootsmusicradio.png)',
//                 height: '600px',
//                 width: '300px',
//                backgroundSize: 'cover',
//                 backgroundPosition: 'center'}}></div> */}
//                   {/* <img className='logo' src='/images/programs/logo-rootsmusicradio.png' alt="" sizes="10px" srcset=""
//             style={{width: '80px'}}
//             ></img> */}
//           <AudioPlayer 
//           />
//         </Container>
//       </section>

//       {/* Hero Section with Current/Next Programs */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row>
//             <Col lg={6} className="mb-4 mb-lg-0">
//               <div className="p-4 bg-white rounded shadow-sm h-100">
//                 <h4 className="mb-3">
//                   <i className="bi bi-broadcast-pin me-2 text-danger"></i>
//                   {t('currentProgram')}
//                 </h4>
                
//                 {currentProgram ? (
//                   <div className="d-flex align-items-start">
//                     <img
//                       src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                       alt={currentProgram.title}
//                       className="rounded me-3"
//                       style={{ width: '80px', height: '80px', objectFit: 'cover' }}
//                     />
//                     <div className="flex-grow-1">
//                       <h5 className="mb-1">{currentProgram.title}</h5>
//                       <p className="text-muted mb-1">
//                         <i className="bi bi-person me-1"></i>
//                         {currentProgram.host}
//                       </p>
//                       <p className="text-muted mb-2">{currentProgram.description}</p>
//                       {getCurrentSchedule(currentProgram) && (
//                         <Badge bg="success">
//                           {formatTime(getCurrentSchedule(currentProgram).startTime)} - 
//                           {formatTime(getCurrentSchedule(currentProgram).endTime)}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center text-muted py-4">
//                     <i className="bi bi-broadcast fs-1 mb-2"></i>
//                     <p>{t('noCurrentProgram')}</p>
//                   </div>
//                 )}
//               </div>
//             </Col>
            
//             <Col lg={6}>
//               <div className="p-4 bg-white rounded shadow-sm h-100">
//                 <h4 className="mb-3">
//                   <i className="bi bi-clock me-2 text-primary"></i>
//                   {t('nextProgram')}
//                 </h4>
                
//                 {nextProgram ? (
//                   <div className="d-flex align-items-start">
//                     <img
//                       src={nextProgram.image || '/uploads/placeholder-program.jpg'}
//                       alt={nextProgram.title}
//                       className="rounded me-3"
//                       style={{ width: '80px', height: '80px', objectFit: 'cover' }}
//                     />
//                     <div className="flex-grow-1">
//                       <h5 className="mb-1">{nextProgram.title}</h5>
//                       <p className="text-muted mb-1">
//                         <i className="bi bi-person me-1"></i>
//                         {nextProgram.host}
//                       </p>
//                       <p className="text-muted mb-2">{nextProgram.description}</p>
//                       {getCurrentSchedule(nextProgram) && (
//                         <Badge bg="primary">
//                           {formatTime(getCurrentSchedule(nextProgram).startTime)} - 
//                           {formatTime(getCurrentSchedule(nextProgram).endTime)}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center text-muted py-4">
//                     <i className="bi bi-calendar-x fs-1 mb-2"></i>
//                     <p>{t('noNextProgram')}</p>
//                   </div>
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Featured Programs */}
//       {featuredPrograms.length > 0 && (
//         <section className="py-5">
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center">
//                   <i className="bi bi-star-fill me-2 text-warning"></i>
//                   {t('programs')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPrograms.map((program) => (
//                 <Col md={4} key={program._id} className="mb-4">
//                   <Card className="card-custom h-100">
//                     <Card.Img
//                       variant="top"
//                       src={program.image || '/uploads/placeholder-program.jpg'}
//                       alt={program.title}
//                     />
//                     <Card.Body className="d-flex flex-column">
//                       <Card.Title>{program.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small className="text-muted">
//                           <i className="bi bi-person me-1"></i>
//                           {program.host}
//                         </small>
//                         <br />
//                         {program.description}
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge bg="secondary" className="me-2">
//                           {program.category}
//                         </Badge>
//                         <Link 
//                           to={`/programs/${program.slug}`}
//                           className="btn btn-dark-custom btn-sm"
//                         >
//                           Voir plus
//                         </Link>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/programs" className="btn btn-outline-dark-custom">
//                   Voir tous les programmes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Episodes */}
//       {featuredEpisodes.length > 0 && (
//         <section className="py-5 bg-light">
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center">
//                   <i className="bi bi-collection-play me-2 text-primary"></i>
//                   {t('episodes')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredEpisodes.map((episode) => (
//                 <Col md={4} key={episode._id} className="mb-4">
//                   <Card className="card-custom h-100">
//                     <Card.Img
//                       variant="top"
//                       src={episode.image || '/uploads/placeholder-episode.jpg'}
//                       alt={episode.title}
//                     />
//                     <Card.Body className="d-flex flex-column">
//                       <Card.Title>{episode.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small className="text-muted">
//                           <i className="bi bi-tv me-1"></i>
//                           {episode.programId?.title}
//                         </small>
//                         <br />
//                         {episode.description}
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge bg="info" className="me-2">
//                           S{episode.season}E{episode.episodeNumber}
//                         </Badge>
//                         <Button variant="dark" size="sm">
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/episodes" className="btn btn-outline-dark-custom">
//                   Voir tous les épisodes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Podcasts */}
//       {featuredPodcasts.length > 0 && (
//         <section className="py-5">
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center">
//                   <i className="bi bi-headphones me-2 text-success"></i>
//                   {t('podcasts')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPodcasts.map((podcast) => (
//                 <Col md={4} key={podcast._id} className="mb-4">
//                   <Card className="card-custom h-100">
//                     <Card.Img
//                       variant="top"
//                       src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//                       alt={podcast.title}
//                     />
//                     <Card.Body className="d-flex flex-column">
//                       <Card.Title>{podcast.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small className="text-muted">
//                           <i className="bi bi-person me-1"></i>
//                           {podcast.host}
//                         </small>
//                         <br />
//                         {podcast.description}
//                       </Card.Text>
//                       <div className="mt-auto d-flex justify-content-between align-items-center">
//                         <div>
//                           <Badge bg="secondary" className="me-2">
//                             {podcast.category}
//                           </Badge>
//                         </div>
//                         <div>
//                           <small className="text-muted me-2">
//                             <i className="bi bi-download me-1"></i>
//                             {podcast.downloads || 0}
//                           </small>
//                           <Button variant="success" size="sm">
//                             <i className="bi bi-play-fill me-1"></i>
//                             Écouter
//                           </Button>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/podcasts" className="btn btn-outline-dark-custom">
//                   Voir tous les podcasts
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Call to Action */}
//       <section className="py-5 bg-dark text-white">
//         <Container>
//           <Row>
//             <Col lg={8} className="mx-auto text-center">
//               <h2 className="mb-3">
//                 Découvrez notre univers radiophonique
//               </h2>
//               <p className="lead mb-4">
//                 Plongez dans un monde de contenus audio exceptionnels avec nos programmes live, 
//                 épisodes exclusifs et podcasts à la demande. Une expérience d'écoute unique vous attend.
//               </p>
//               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
//                 <Link to="/programs" className="btn btn-light btn-lg">
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Voir la grille
//                 </Link>
//                 <Link to="/about" className="btn btn-outline-light btn-lg">
//                   <i className="bi bi-info-circle me-2"></i>
//                   En savoir plus
//                 </Link>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Stats Section */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-broadcast fs-1 text-danger mb-2"></i>
//                 <h4 className="mb-1">24/7</h4>
//                 <p className="text-muted">Diffusion continue</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-people fs-1 text-primary mb-2"></i>
//                 <h4 className="mb-1">50k+</h4>
//                 <p className="text-muted">Auditeurs actifs</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-collection-play fs-1 text-success mb-2"></i>
//                 <h4 className="mb-1">1000+</h4>
//                 <p className="text-muted">Épisodes disponibles</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div className="p-3">
//                 <i className="bi bi-headphones fs-1 text-warning mb-2"></i>
//                 <h4 className="mb-1">500+</h4>
//                 <p className="text-muted">Podcasts exclusifs</p>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Home = () => {
//   const { t } = useTranslation();
//   const { 
//     currentProgram, 
//     nextProgram, 
//     getActivePrograms, 
//     getEpisodes, 
//     getPodcasts 
//   } = useRadio();
  
//   const [featuredPrograms, setFeaturedPrograms] = useState([]);
//   const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
//   const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Images pour le carrousel (adaptez ces URLs à vos images)
//   const heroImages = [
//     '/images/programs/ROOTS-RADIO-DEDICACE.PNG',
//     '/images/programs/top-20-africa.jpg',
//     '/images/programs/Selflist-By-Roman-Peter.PNG',
//     '/images/programs/Selflist-By-Martins.PNG',
//     '/images/programs/SUMMER-MIX-DJ-MATHIAS.PNG',
//     '/images/programs/Selflist-By-DJ-ZOUMANTO.PNG',
//     '/images/programs/Selflist-By-Eno-on-the-trck.PNG',
//     '/images/programs/Selflist-By-KIng-Arthur.PNG',
//     '/images/programs/Selflist-By-Le-Joker.PNG',
//     '/images/programs/selflist.PNG',
//     '/images/programs/Selflist-By DJ-BDK.PNG',
//     '/images/programs/SELF-LIST-BY.PNG',
//     '/images/programs/Selflist-By-Dashor.PNG',
//   ];

//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       setLoading(true);
//       try {
//         // Get featured programs
//         const programs = await getActivePrograms();
//         const featured = programs.filter(p => p.featured).slice(0, 3);
//         setFeaturedPrograms(featured);

//         // Get featured episodes
//         const episodesData = await getEpisodes({ featured: true, limit: 3 });
//         setFeaturedEpisodes(episodesData.episodes || []);

//         // Get featured podcasts
//         const podcastsData = await getPodcasts({ featured: true, limit: 3 });
//         setFeaturedPodcasts(podcastsData.podcasts || []);
//       } catch (error) {
//         console.error('Failed to fetch featured content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedContent();
//   }, [getActivePrograms, getEpisodes, getPodcasts]);

//   // Gestion du carrousel automatique
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prevSlide) => 
//         (prevSlide + 1) % heroImages.length
//       );
//     }, 5000); // Change d'image toutes les 5 secondes

//     return () => clearInterval(interval);
//   }, [heroImages.length]);

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // HH:MM format
//   };

//   const getCurrentSchedule = (program) => {
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//     return program?.schedule?.find(s => s.day === today);
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="home-page">
//       {/* Hero Section avec carrousel */}
//       <section className="hero-section" style={{ position: 'relative', minHeight: '600px', overflow: 'hidden'}}>
//         {/* Carrousel d'images en arrière-plan */}
//         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
//         }}>
//           {heroImages.map((image, index) => (
//             <div
//               key={index}
//               style={{
//                 position: 'absolute',
//                 top: '0',
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 backgroundImage: `url(${image})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 opacity: index === currentSlide ? 1 : 0,
//                 transition: 'opacity 1s ease-in-out'
//               }}
//             />
//           ))}
//           {/* Overlay sombre pour améliorer la lisibilité */}
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)'
//           }} />
//         </div>

//         {/* Indicateurs de carrousel */}
//         <div style={{
//           position: 'absolute',
//           bottom: '20px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           display: 'flex',
//           gap: '10px',
//           zIndex: 3
//         }}>
//           {heroImages.map((_, index) => (
//             <div
//               key={index}
//               onClick={() => goToSlide(index)}
//               style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 backgroundColor: index === currentSlide ? '#fff' : 'rgba(255, 255, 255, 0.5)',
//                 cursor: 'pointer',
//                 transition: 'background-color 0.3s ease'
//               }}
//             />
//           ))}
//         </div>

//         {/* Contenu du hero */}
//         <Container style={{ position: 'relative', zIndex: 2, paddingTop: '60px', paddingBottom: '60px' }}>
//           <Row className="align-items-center text-white">
//             <Col lg={6}>
//               <div>
//                 <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
//                   Bienvenue sur votre Radio
//                 </h1>
//                 <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
//                   Découvrez nos programmes exceptionnels et écoutez en direct
//                 </p>
//                 <Button variant="primary" size="lg" className="me-3">
//                   Écouter en direct
//                 </Button>
//                 <Button variant="outline-light" size="lg">
//                   Nos programmes
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Audio Player */}
//       <section className="py-4 bg-dark">
//         <Container>
//           <AudioPlayer />
//         </Container>
//       </section>

//       {/* Hero Section with Current/Next Programs */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row>
//             <Col lg={6} className="mb-4 mb-lg-0">
//               <div className="p-4 bg-white rounded shadow-sm h-100">
//                 <h4 className="mb-3">
//                   <i className="bi bi-broadcast-pin me-2 text-danger"></i>
//                   {t('currentProgram')}
//                 </h4>
                
//                 {currentProgram ? (
//                   <div className="d-flex align-items-start">
//                     <img
//                       src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                       alt={currentProgram.title}
//                       className="rounded me-3"
//                       style={{ width: '80px', height: '80px', objectFit: 'cover' }}
//                     />
//                     <div className="flex-grow-1">
//                       <h5 className="mb-1">{currentProgram.title}</h5>
//                       <p className="text-muted mb-1">
//                         <i className="bi bi-person me-1"></i>
//                         {currentProgram.host}
//                       </p>
//                       <p className="text-muted mb-2">{currentProgram.description}</p>
//                       {getCurrentSchedule(currentProgram) && (
//                         <Badge bg="success">
//                           {formatTime(getCurrentSchedule(currentProgram).startTime)} - 
//                           {formatTime(getCurrentSchedule(currentProgram).endTime)}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center text-muted py-4">
//                     <i className="bi bi-broadcast fs-1 mb-2"></i>
//                     <p>{t('noCurrentProgram')}</p>
//                   </div>
//                 )}
//               </div>
//             </Col>
            
//             <Col lg={6}>
//               <div className="p-4 bg-white rounded shadow-sm h-100">
//                 <h4 className="mb-3">
//                   <i className="bi bi-clock me-2 text-primary"></i>
//                   {t('nextProgram')}
//                 </h4>
                
//                 {nextProgram ? (
//                   <div className="d-flex align-items-start">
//                     <img
//                       src={nextProgram.image || '/uploads/placeholder-program.jpg'}
//                       alt={nextProgram.title}
//                       className="rounded me-3"
//                       style={{ width: '80px', height: '80px', objectFit: 'cover' }}
//                     />
//                     <div className="flex-grow-1">
//                       <h5 className="mb-1">{nextProgram.title}</h5>
//                       <p className="text-muted mb-1">
//                         <i className="bi bi-person me-1"></i>
//                         {nextProgram.host}
//                       </p>
//                       <p className="text-muted mb-2">{nextProgram.description}</p>
//                       {getCurrentSchedule(nextProgram) && (
//                         <Badge bg="primary">
//                           {formatTime(getCurrentSchedule(nextProgram).startTime)} - 
//                           {formatTime(getCurrentSchedule(nextProgram).endTime)}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center text-muted py-4">
//                     <i className="bi bi-calendar-x fs-1 mb-2"></i>
//                     <p>{t('noNextProgram')}</p>
//                   </div>
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Featured Programs */}
//       {featuredPrograms.length > 0 && (
//         <section className="py-5">
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center">
//                   <i className="bi bi-star-fill me-2 text-warning"></i>
//                   {t('programs')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPrograms.map((program) => (
//                 <Col md={4} key={program._id} className="mb-4">
//                   <Card className="card-custom h-100">
//                     <Card.Img
//                       variant="top"
//                       src={program.image || '/uploads/placeholder-program.jpg'}
//                       alt={program.title}
//                     />
//                     <Card.Body className="d-flex flex-column">
//                       <Card.Title>{program.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small className="text-muted">
//                           <i className="bi bi-person me-1"></i>
//                           {program.host}
//                         </small>
//                         <br />
//                         {program.description}
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge bg="secondary" className="me-2">
//                           {program.category}
//                         </Badge>
//                         <Link 
//                           to={`/programs/${program.slug}`}
//                           className="btn btn-dark-custom btn-sm"
//                         >
//                           Voir plus
//                         </Link>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/programs" className="btn btn-outline-dark-custom">
//                   Voir tous les programmes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Episodes */}
//       {featuredEpisodes.length > 0 && (
//         <section className="py-5 bg-light">
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center">
//                   <i className="bi bi-collection-play me-2 text-primary"></i>
//                   {t('episodes')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredEpisodes.map((episode) => (
//                 <Col md={4} key={episode._id} className="mb-4">
//                   <Card className="card-custom h-100">
//                     <Card.Img
//                       variant="top"
//                       src={episode.image || '/uploads/placeholder-episode.jpg'}
//                       alt={episode.title}
//                     />
//                     <Card.Body className="d-flex flex-column">
//                       <Card.Title>{episode.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small className="text-muted">
//                           <i className="bi bi-tv me-1"></i>
//                           {episode.programId?.title}
//                         </small>
//                         <br />
//                         {episode.description}
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge bg="info" className="me-2">
//                           S{episode.season}E{episode.episodeNumber}
//                         </Badge>
//                         <Button variant="dark" size="sm">
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/episodes" className="btn btn-outline-dark-custom">
//                   Voir tous les épisodes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Podcasts */}
//       {featuredPodcasts.length > 0 && (
//         <section className="py-5">
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center">
//                   <i className="bi bi-headphones me-2 text-success"></i>
//                   {t('podcasts')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPodcasts.map((podcast) => (
//                 <Col md={4} key={podcast._id} className="mb-4">
//                   <Card className="card-custom h-100">
//                     <Card.Img
//                       variant="top"
//                       src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//                       alt={podcast.title}
//                     />
//                     <Card.Body className="d-flex flex-column">
//                       <Card.Title>{podcast.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small className="text-muted">
//                           <i className="bi bi-person me-1"></i>
//                           {podcast.host}
//                         </small>
//                         <br />
//                         {podcast.description}
//                       </Card.Text>
//                       <div className="mt-auto d-flex justify-content-between align-items-center">
//                         <div>
//                           <Badge bg="secondary" className="me-2">
//                             {podcast.category}
//                           </Badge>
//                         </div>
//                         <div>
//                           <small className="text-muted me-2">
//                             <i className="bi bi-download me-1"></i>
//                             {podcast.downloads || 0}
//                           </small>
//                           <Button variant="success" size="sm">
//                             <i className="bi bi-play-fill me-1"></i>
//                             Écouter
//                           </Button>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/podcasts" className="btn btn-outline-dark-custom">
//                   Voir tous les podcasts
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Call to Action */}
//       <section className="py-5 bg-dark text-white">
//         <Container>
//           <Row>
//             <Col lg={8} className="mx-auto text-center">
//               <h2 className="mb-3">
//                 Découvrez notre univers radiophonique
//               </h2>
//               <p className="lead mb-4">
//                 Plongez dans un monde de contenus audio exceptionnels avec nos programmes live, 
//                 épisodes exclusifs et podcasts à la demande. Une expérience d'écoute unique vous attend.
//               </p>
//               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
//                 <Link to="/programs" className="btn btn-light btn-lg">
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Voir la grille
//                 </Link>
//                 <Link to="/about" className="btn btn-outline-light btn-lg">
//                   <i className="bi bi-info-circle me-2"></i>
//                   En savoir plus
//                 </Link>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Stats Section */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-broadcast fs-1 text-danger mb-2"></i>
//                 <h4 className="mb-1">24/7</h4>
//                 <p className="text-muted">Diffusion continue</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-people fs-1 text-primary mb-2"></i>
//                 <h4 className="mb-1">50k+</h4>
//                 <p className="text-muted">Auditeurs actifs</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-collection-play fs-1 text-success mb-2"></i>
//                 <h4 className="mb-1">1000+</h4>
//                 <p className="text-muted">Épisodes disponibles</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div className="p-3">
//                 <i className="bi bi-headphones fs-1 text-warning mb-2"></i>
//                 <h4 className="mb-1">500+</h4>
//                 <p className="text-muted">Podcasts exclusifs</p>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;



// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Home = () => {
//   const { t } = useTranslation();
//   const { 
//     currentProgram, 
//     nextProgram, 
//     getActivePrograms, 
//     getEpisodes, 
//     getPodcasts 
//   } = useRadio();
  
//   const [featuredPrograms, setFeaturedPrograms] = useState([]);
//   const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
//   const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       setLoading(true);
//       try {
//         // Get featured programs
//         const programs = await getActivePrograms();
//         const featured = programs.filter(p => p.featured).slice(0, 3);
//         setFeaturedPrograms(featured);

//         // Get featured episodes
//         const episodesData = await getEpisodes({ featured: true, limit: 3 });
//         setFeaturedEpisodes(episodesData.episodes || []);

//         // Get featured podcasts
//         const podcastsData = await getPodcasts({ featured: true, limit: 3 });
//         setFeaturedPodcasts(podcastsData.podcasts || []);
//       } catch (error) {
//         console.error('Failed to fetch featured content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedContent();
//   }, [getActivePrograms, getEpisodes, getPodcasts]);

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // HH:MM format
//   };

//   const getCurrentSchedule = (program) => {
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//     return program?.schedule?.find(s => s.day === today);
//   };

//   return (
//     <div className="home-page" style={{ 
//       background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
//       minHeight: '100vh',
//       color: 'white',
//       paddingBottom: '100px' // Space for fixed audio player
//     }}>
//       {/* Fixed Audio Player Bar */}
//       <div 
//         className="fixed-bottom" 
//         style={{ 
//           background: 'linear-gradient(to right, rgba(139, 69, 19, 0.95), rgba(160, 82, 45, 0.95))',
//           borderTop: '1px solid rgba(255,255,255,0.2)',
//           backdropFilter: 'blur(10px)',
//           zIndex: 1000,
//           height: '80px'
//         }}
//       >
//         <Container fluid className="h-100">
//           <div className="d-flex align-items-center justify-content-between h-100 px-3">
//             {/* ON AIR Badge */}
//             <div className="d-flex align-items-center">
//               <div 
//                 className="px-3 py-1 rounded-pill me-3 text-white fw-bold"
//                 style={{ 
//                   background: '#ff4444',
//                   fontSize: '12px'
//                 }}
//               >
//                 ON AIR
//               </div>
              
//               {/* Current Track Info */}
//               {currentProgram && (
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                     alt={currentProgram.title}
//                     className="rounded me-3"
//                     style={{ 
//                       width: '50px', 
//                       height: '50px', 
//                       objectFit: 'cover'
//                     }}
//                   />
//                   <div>
//                     <h6 className="mb-0 text-white fw-bold" style={{fontSize: '14px'}}>
//                       {currentProgram.title}
//                     </h6>
//                     <small className="text-light opacity-75">
//                       {currentProgram.host}
//                     </small>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Center Controls */}
//             <div className="d-flex align-items-center justify-content-center flex-grow-1 mx-4">
//               <AudioPlayer />
//             </div>
            
//             {/* Right side - Volume/Options */}
//             <div className="d-flex align-items-center">
//               <button 
//                 className="btn btn-link text-white p-2"
//                 style={{ fontSize: '20px' }}
//               >
//                 <i className="bi bi-volume-up"></i>
//               </button>
//               <button 
//                 className="btn btn-link text-white p-2"
//                 style={{ fontSize: '18px' }}
//               >
//                 <i className="bi bi-three-dots"></i>
//               </button>
//             </div>
//           </div>
//         </Container>
//       </div>

//       {/* Hero Section with Current/Next Programs */}
//       <section className="py-5" style={{ 
//         background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//       }}>
//         <Container>
//           <Row>
//             <Col lg={6} className="mb-4 mb-lg-0">
//               <div className="p-4 h-100 rounded shadow-lg" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)'
//               }}>
//                 <h4 className="mb-3 text-white">
//                   <i className="bi bi-broadcast-pin me-2" style={{color: '#ff4444'}}></i>
//                   {t('currentProgram')}
//                 </h4>
                
//                 {currentProgram ? (
//                   <div className="d-flex align-items-start">
//                     <img
//                       src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                       alt={currentProgram.title}
//                       className="rounded me-3"
//                       style={{ 
//                         width: '80px', 
//                         height: '80px', 
//                         objectFit: 'cover',
//                         border: '2px solid rgba(255,255,255,0.2)'
//                       }}
//                     />
//                     <div className="flex-grow-1">
//                       <h5 className="mb-1 text-white">{currentProgram.title}</h5>
//                       <p className="mb-1" style={{color: '#ccc'}}>
//                         <i className="bi bi-person me-1"></i>
//                         {currentProgram.host}
//                       </p>
//                       <p className="mb-2" style={{color: '#bbb'}}>{currentProgram.description}</p>
//                       {getCurrentSchedule(currentProgram) && (
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #00ff88, #00cc66)',
//                           color: 'black',
//                           fontWeight: 'bold'
//                         }}>
//                           {formatTime(getCurrentSchedule(currentProgram).startTime)} - 
//                           {formatTime(getCurrentSchedule(currentProgram).endTime)}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-4" style={{color: '#888'}}>
//                     <i className="bi bi-broadcast fs-1 mb-2"></i>
//                     <p>{t('noCurrentProgram')}</p>
//                   </div>
//                 )}
//               </div>
//             </Col>
            
//             <Col lg={6}>
//               <div className="p-4 h-100 rounded shadow-lg" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)'
//               }}>
//                 <h4 className="mb-3 text-white">
//                   <i className="bi bi-clock me-2" style={{color: '#4488ff'}}></i>
//                   {t('nextProgram')}
//                 </h4>
                
//                 {nextProgram ? (
//                   <div className="d-flex align-items-start">
//                     <img
//                       src={nextProgram.image || '/uploads/placeholder-program.jpg'}
//                       alt={nextProgram.title}
//                       className="rounded me-3"
//                       style={{ 
//                         width: '80px', 
//                         height: '80px', 
//                         objectFit: 'cover',
//                         border: '2px solid rgba(255,255,255,0.2)'
//                       }}
//                     />
//                     <div className="flex-grow-1">
//                       <h5 className="mb-1 text-white">{nextProgram.title}</h5>
//                       <p className="mb-1" style={{color: '#ccc'}}>
//                         <i className="bi bi-person me-1"></i>
//                         {nextProgram.host}
//                       </p>
//                       <p className="mb-2" style={{color: '#bbb'}}>{nextProgram.description}</p>
//                       {getCurrentSchedule(nextProgram) && (
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #4488ff, #3366cc)',
//                           color: 'white',
//                           fontWeight: 'bold'
//                         }}>
//                           {formatTime(getCurrentSchedule(nextProgram).startTime)} - 
//                           {formatTime(getCurrentSchedule(nextProgram).endTime)}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-4" style={{color: '#888'}}>
//                     <i className="bi bi-calendar-x fs-1 mb-2"></i>
//                     <p>{t('noNextProgram')}</p>
//                   </div>
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Featured Programs */}
//       {featuredPrograms.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-star-fill me-2" style={{color: '#ffcc00'}}></i>
//                   {t('programs')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPrograms.map((program) => (
//                 <Col md={4} key={program._id} className="mb-4">
//                   <Card className="h-100" style={{
//                     background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                     e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}>
//                     <Card.Img
//                       variant="top"
//                       src={program.image || '/uploads/placeholder-program.jpg'}
//                       alt={program.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{program.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-person me-1"></i>
//                           {program.host}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{program.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #666, #444)',
//                           color: 'white'
//                         }} className="me-2">
//                           {program.category}
//                         </Badge>
//                         <Link 
//                           to={`/programs/${program.slug}`}
//                           className="btn btn-sm"
//                           style={{
//                             background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                             color: 'black',
//                             border: 'none',
//                             fontWeight: 'bold',
//                             transition: 'all 0.3s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = 'linear-gradient(45deg, #f0f0f0, #d0d0d0)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = 'linear-gradient(45deg, #ffffff, #e0e0e0)';
//                           }}
//                         >
//                           Voir plus
//                         </Link>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/programs" className="btn" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '10px 30px',
//                   fontWeight: 'bold',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = 'white';
//                   e.target.style.color = 'black';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = 'white';
//                 }}>
//                   Voir tous les programmes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Episodes */}
//       {featuredEpisodes.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-collection-play me-2" style={{color: '#4488ff'}}></i>
//                   {t('episodes')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredEpisodes.map((episode) => (
//                 <Col md={4} key={episode._id} className="mb-4">
//                   <Card className="h-100" style={{
//                     background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                     e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}>
//                     <Card.Img
//                       variant="top"
//                       src={episode.image || '/uploads/placeholder-episode.jpg'}
//                       alt={episode.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{episode.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-tv me-1"></i>
//                           {episode.programId?.title}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{episode.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #44aaff, #3388cc)',
//                           color: 'white'
//                         }} className="me-2">
//                           S{episode.season}E{episode.episodeNumber}
//                         </Badge>
//                         <Button size="sm" style={{
//                           background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                           color: 'black',
//                           border: 'none',
//                           fontWeight: 'bold'
//                         }}>
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/episodes" className="btn" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '10px 30px',
//                   fontWeight: 'bold',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = 'white';
//                   e.target.style.color = 'black';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = 'white';
//                 }}>
//                   Voir tous les épisodes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Podcasts */}
//       {featuredPodcasts.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-headphones me-2" style={{color: '#00ff88'}}></i>
//                   {t('podcasts')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPodcasts.map((podcast) => (
//                 <Col md={4} key={podcast._id} className="mb-4">
//                   <Card className="h-100" style={{
//                     background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                     e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}>
//                     <Card.Img
//                       variant="top"
//                       src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//                       alt={podcast.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{podcast.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-person me-1"></i>
//                           {podcast.host}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{podcast.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto d-flex justify-content-between align-items-center">
//                         <div>
//                           <Badge style={{
//                             background: 'linear-gradient(45deg, #666, #444)',
//                             color: 'white'
//                           }} className="me-2">
//                             {podcast.category}
//                           </Badge>
//                         </div>
//                         <div>
//                           <small className="me-2" style={{color: '#ccc'}}>
//                             <i className="bi bi-download me-1"></i>
//                             {podcast.downloads || 0}
//                           </small>
//                           <Button size="sm" style={{
//                             background: 'linear-gradient(45deg, #00ff88, #00cc66)',
//                             color: 'black',
//                             border: 'none',
//                             fontWeight: 'bold'
//                           }}>
//                             <i className="bi bi-play-fill me-1"></i>
//                             Écouter
//                           </Button>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/podcasts" className="btn" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '10px 30px',
//                   fontWeight: 'bold',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = 'white';
//                   e.target.style.color = 'black';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = 'white';
//                 }}>
//                   Voir tous les podcasts
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Call to Action */}
//       <section className="py-5" style={{
//         background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.8))',
//         borderTop: '1px solid #333'
//       }}>
//         <Container>
//           <Row>
//             <Col lg={8} className="mx-auto text-center">
//               <h2 className="mb-3 text-white">
//                 Découvrez notre univers radiophonique
//               </h2>
//               <p className="lead mb-4" style={{color: '#ccc'}}>
//                 Plongez dans un monde de contenus audio exceptionnels avec nos programmes live, 
//                 épisodes exclusifs et podcasts à la demande. Une expérience d'écoute unique vous attend.
//               </p>
//               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
//                 <Link to="/programs" className="btn btn-lg" style={{
//                   background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                   color: 'black',
//                   border: 'none',
//                   fontWeight: 'bold',
//                   padding: '12px 30px'
//                 }}>
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Voir la grille
//                 </Link>
//                 <Link to="/about" className="btn btn-lg" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '12px 30px',
//                   fontWeight: 'bold'
//                 }}>
//                   <i className="bi bi-info-circle me-2"></i>
//                   En savoir plus
//                 </Link>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Stats Section */}
//       <section className="py-5" style={{
//         background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//       }}>
//         <Container>
//           <Row>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-broadcast fs-1 mb-2" style={{color: '#ff4444'}}></i>
//                 <h4 className="mb-1 text-white">24/7</h4>
//                 <p style={{color: '#ccc'}}>Diffusion continue</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-people fs-1 mb-2" style={{color: '#4488ff'}}></i>
//                 <h4 className="mb-1 text-white">50k+</h4>
//                 <p style={{color: '#ccc'}}>Auditeurs actifs</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-collection-play fs-1 mb-2" style={{color: '#00ff88'}}></i>
//                 <h4 className="mb-1 text-white">1000+</h4>
//                 <p style={{color: '#ccc'}}>Épisodes disponibles</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div className="p-3">
//                 <i className="bi bi-headphones fs-1 mb-2" style={{color: '#ffcc00'}}></i>
//                 <h4 className="mb-1 text-white">500+</h4>
//                 <p style={{color: '#ccc'}}>Podcasts exclusifs</p>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Home = () => {
//   const { t } = useTranslation();
//   const { 
//     currentProgram, 
//     nextProgram, 
//     getActivePrograms, 
//     getEpisodes, 
//     getPodcasts 
//   } = useRadio();
  
//   const [featuredPrograms, setFeaturedPrograms] = useState([]);
//   const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
//   const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // État pour le carrousel de DJ
//   const [currentDJIndex, setCurrentDJIndex] = useState(0);
//   // const heroImages = [
//   //   '/dj-photos/dj1.jpg',
//   //   '/dj-photos/dj2.jpg', 
//   //   '/dj-photos/dj3.jpg',
//   //   '/dj-photos/dj4.jpg',
//   //   '/dj-photos/dj5.jpg'
//   // ];
// const heroImages = [
//     '/images/programs/ROOTS-RADIO-DEDICACE.PNG',
//     '/images/programs/top-20-africa.jpg',
//     '/images/programs/Selflist-By-Roman-Peter.PNG',
//     '/images/programs/Selflist-By-Martins.PNG',
//     '/images/programs/SUMMER-MIX-DJ-MATHIAS.PNG',
//     '/images/programs/Selflist-By-DJ-ZOUMANTO.PNG',
//     '/images/programs/Selflist-By-Eno-on-the-trck.PNG',
//     '/images/programs/Selflist-By-KIng-Arthur.PNG',
//     '/images/programs/Selflist-By-Le-Joker.PNG',
//     '/images/programs/selflist.PNG',
//     '/images/programs/Selflist-By DJ-BDK.PNG',
//     '/images/programs/SELF-LIST-BY.PNG',
//     '/images/programs/Selflist-By-Dashor.PNG',
//   ];
//   // État pour la playlist
//   const [playlist, setPlaylist] = useState([
//     { id: 1, title: 'SABRINA_MARTIN', artist: 'Sabrina', src: '/music/sabrina/SAINTTROPEZ.mp3', duration:'3:45' },
//     { id: 2, title: 'A MINUTE', artist: 'Sabrina', src: '/music/sabrina/A_MINUTE.mp3', duration: '4:12' },
//     { id: 3, title: 'AGILITY', artist: 'Sabrina', src: '/music/sabrina/AGILITY.mp3', duration: '3:28' },
//     { id: 4, title: 'ALONE', artist: 'Sabrina', src: '/music/sabrina/ALONE.mp3', duration: '4:05' },
//     { id: 5, title: 'DONT CALL ME', artist: 'Sabrina', src: '/music/sabrina/DONT_CALL_ME.mp3', duration: '3:52' },
//     { id: 6, title: 'FARAWAY', artist: 'Sabrina', src: '/music/sabrina/FARAWAY.mp3', duration: '4:05' },
//     { id: 7, title: 'JEJELY', artist: 'Sabrina', src: '/music/sabrina/JEJELY.mp3', duration: '4:05' },
//     { id: 8, title: 'LOSE', artist: 'Sabrina', src: '/music/sabrina/LOSE.mp3', duration: '4:05' },
//     { id: 9, title: 'MY AFRICA', artist: 'Sabrina', src: '/music/sabrina/MY_AFRICA.mp3', duration: '4:05' },
//     { id: 10, title: 'ONLY ONE', artist: 'Sabrina', src: '/music/sabrina/ONLY_ONE.mp3', duration: '4:05' },
//     { id: 11, title: 'PAPARAZZI', artist: 'Sabrina', src: '/music/sabrina/PAPARAZZI.mp3', duration: '4:05' },
//     { id: 12, title: 'PEACE OF MIND', artist: 'Sabrina', src: '/music/sabrina/PEACE_OF_MIND.mp3', duration: '4:05' },
//     { id: 13, title: 'RIDE OR DIE', artist: 'Sabrina', src: '/music/sabrina/RIDE_OR_DIE.mp3', duration: '4:05' },
//   ]);
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audio] = useState(new Audio());

//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       setLoading(true);
//       try {
//         // Get featured programs
//         const programs = await getActivePrograms();
//         const featured = programs.filter(p => p.featured).slice(0, 3);
//         setFeaturedPrograms(featured);

//         // Get featured episodes
//         const episodesData = await getEpisodes({ featured: true, limit: 3 });
//         setFeaturedEpisodes(episodesData.episodes || []);

//         // Get featured podcasts
//         const podcastsData = await getPodcasts({ featured: true, limit: 3 });
//         setFeaturedPodcasts(podcastsData.podcasts || []);
//       } catch (error) {
//         console.error('Failed to fetch featured content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedContent();
//   }, [getActivePrograms, getEpisodes, getPodcasts]);

//   // Carrousel automatique pour les photos de DJ
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDJIndex((prevIndex) => 
//         prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [heroImages.length]);

//   // Gestion audio pour la playlist
//   useEffect(() => {
//     const handleTrackEnd = () => {
//       setIsPlaying(false);
//       setCurrentTrack(null);
//     };

//     audio.addEventListener('ended', handleTrackEnd);
//     return () => {
//       audio.removeEventListener('ended', handleTrackEnd);
//       audio.pause();
//     };
//   }, [audio]);

//   const playTrack = (track) => {
//     if (currentTrack && currentTrack.id === track.id && isPlaying) {
//       // Pause la piste actuelle
//       audio.pause();
//       setIsPlaying(false);
//     } else {
//       // Jouer une nouvelle piste
//       if (currentTrack && currentTrack.id !== track.id) {
//         audio.pause();
//       }
//       audio.src = track.src;
//       audio.play().catch(console.error);
//       setCurrentTrack(track);
//       setIsPlaying(true);
//     }
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // HH:MM format
//   };

//   const getCurrentSchedule = (program) => {
//     const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//     return program?.schedule?.find(s => s.day === today);
//   };

//   return (
//     <div className="home-page" style={{ 
//       background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
//       minHeight: '100vh',
//       color: 'white',
//       paddingBottom: '100px' // Space for fixed audio player
//     }}>
//       {/* Fixed Audio Player Bar */}
//       <div 
//         className="fixed-bottom" 
//         style={{ 
//           background: 'linear-gradient(to right, rgba(139, 69, 19, 0.95), rgba(160, 82, 45, 0.95))',
//           borderTop: '1px solid rgba(255,255,255,0.2)',
//           backdropFilter: 'blur(10px)',
//           zIndex: 1000,
//           height: '80px'
//         }}
//       >
//         <Container fluid className="h-100">
//           <div className="d-flex align-items-center justify-content-between h-100 px-3">
//             {/* ON AIR Badge */}
//             <div className="d-flex align-items-center">
//               <div 
//                 className="px-3 py-1 rounded-pill me-3 text-white fw-bold"
//                 style={{ 
//                   background: '#ff4444',
//                   fontSize: '12px'
//                 }}
//               >
//                 ON AIR
//               </div>
              
//               {/* Current Track Info */}
//               {currentProgram && (
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                     alt={currentProgram.title}
//                     className="rounded me-3"
//                     style={{ 
//                       width: '50px', 
//                       height: '50px', 
//                       objectFit: 'cover'
//                     }}
//                   />
//                   <div>
//                     <h6 className="mb-0 text-white fw-bold" style={{fontSize: '14px'}}>
//                       {currentProgram.title}
//                     </h6>
//                     <small className="text-light opacity-75">
//                       {currentProgram.host}
//                     </small>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Center Controls */}
//             <div className="d-flex align-items-center justify-content-center flex-grow-1 mx-4">
//               <AudioPlayer />
//             </div>
            
//             {/* Right side - Volume/Options */}
//             <div className="d-flex align-items-center">
//               <button 
//                 className="btn btn-link text-white p-2"
//                 style={{ fontSize: '20px' }}
//               >
//                 <i className="bi bi-volume-up"></i>
//               </button>
//               <button 
//                 className="btn btn-link text-white p-2"
//                 style={{ fontSize: '18px' }}
//               >
//                 <i className="bi bi-three-dots"></i>
//               </button>
//             </div>
//           </div>
//         </Container>
//       </div>

//       {/* Hero Section with DJ Carousel and Playlist */}
//       <section className="py-5" style={{ 
//         background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//       }}>
//         <Container>
//           <Row>
//             {/* DJ Carousel Section - Plus grande */}
//             <Col lg={7} className="mb-4 mb-lg-0">
//               <div className="h-100 rounded shadow-lg position-relative overflow-hidden" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)',
//                 minHeight: '400px'
//               }}>
//                 {/* Carrousel Background */}
//                 <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
//                   {heroImages.map((photo, index) => (
//                     <div
//                       key={index}
//                       className="position-absolute w-100 h-100 transition-opacity"
//                       style={{
//                         backgroundImage: `url(${photo})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                         opacity: index === currentDJIndex ? 1 : 0,
//                         transition: 'opacity 1s ease-in-out',
//                         filter: 'brightness(0.6)'
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {/* Overlay Content */}
//                 <div className="position-absolute w-100 h-100 p-4 d-flex flex-column justify-content-between" style={{ zIndex: 2 }}>
//                   <div>
//                     <h3 className="mb-3 text-white fw-bold">
//                       <i className="bi bi-broadcast-pin me-2" style={{color: '#ff4444'}}></i>
//                       Programme Actuel - DJ Live
//                     </h3>
//                   </div>

//                   {/* Mini Audio Player dans le carrousel */}
//                   <div className="mt-auto">
//                     <div className="p-3 rounded" style={{
//                       background: 'rgba(0,0,0,0.7)',
//                       backdropFilter: 'blur(10px)'
//                     }}>
//                       <div className="d-flex align-items-center justify-content-between mb-2">
//                         <div className="text-white">
//                           <h6 className="mb-0">En cours de diffusion</h6>
//                           <small className="text-light opacity-75">DJ Mix Live Session</small>
//                         </div>
//                         <div className="d-flex align-items-center gap-2">
//                           <button className="btn btn-sm" style={{
//                             background: '#ff4444',
//                             border: 'none',
//                             color: 'white',
//                             borderRadius: '50%',
//                             width: '40px',
//                             height: '40px'
//                           }}>
//                             <i className="bi bi-pause-fill"></i>
//                           </button>
//                         </div>
//                       </div>
                      
//                       {/* Progress Bar */}
//                       <div className="progress mb-2" style={{ height: '4px' }}>
//                         <div 
//                           className="progress-bar bg-danger" 
//                           style={{ width: '45%' }}
//                         ></div>
//                       </div>
                      
//                       <div className="d-flex justify-content-between small text-light opacity-75">
//                         <span>2:34</span>
//                         <span>5:47</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Indicateurs du carrousel */}
//                 <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2" style={{ zIndex: 3 }}>
//                   <div className="d-flex gap-2">
//                     {heroImages.map((_, index) => (
//                       <button
//                         key={index}
//                         className="btn p-0"
//                         style={{
//                           width: '8px',
//                           height: '8px',
//                           borderRadius: '50%',
//                           background: index === currentDJIndex ? '#ff4444' : 'rgba(255,255,255,0.4)',
//                           border: 'none'
//                         }}
//                         onClick={() => setCurrentDJIndex(index)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </Col>
            
//             {/* Playlist Section */}
//             <Col lg={5}>
//               <div className="p-4 h-100 rounded shadow-lg" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)',
//                 minHeight: '400px'
//               }}>
//                 <h4 className="mb-3 text-white">
//                   <i className="bi bi-music-note-list me-2" style={{color: '#00ff88'}}></i>
//                   Playlist du Moment
//                 </h4>
                
//                 <div className="playlist-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
//                   {playlist.map((track, index) => (
//                     <div 
//                       key={track.id} 
//                       className="d-flex align-items-center p-2 mb-2 rounded hover-item"
//                       style={{
//                         background: currentTrack?.id === track.id ? 
//                           'rgba(0,255,136,0.2)' : 
//                           'rgba(255,255,255,0.05)',
//                         border: currentTrack?.id === track.id ? 
//                           '1px solid rgba(0,255,136,0.5)' : 
//                           '1px solid transparent',
//                         cursor: 'pointer',
//                         transition: 'all 0.3s ease'
//                       }}
//                       onMouseEnter={(e) => {
//                         if (currentTrack?.id !== track.id) {
//                           e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (currentTrack?.id !== track.id) {
//                           e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
//                         }
//                       }}
//                     >
//                       <div className="me-2 text-white fw-bold" style={{ minWidth: '25px', fontSize: '12px' }}>
//                         {String(index + 1).padStart(2, '0')}
//                       </div>
                      
//                       <button
//                         className="btn btn-sm me-3"
//                         style={{
//                           background: currentTrack?.id === track.id && isPlaying ? 
//                             '#ff4444' : '#00ff88',
//                           border: 'none',
//                           color: currentTrack?.id === track.id && isPlaying ? 
//                             'white' : 'black',
//                           borderRadius: '50%',
//                           width: '30px',
//                           height: '30px',
//                           minWidth: '30px'
//                         }}
//                         onClick={() => playTrack(track)}
//                       >
//                         <i className={`bi ${
//                           currentTrack?.id === track.id && isPlaying ? 
//                             'bi-pause-fill' : 'bi-play-fill'
//                         }`} style={{ fontSize: '12px' }}></i>
//                       </button>
                      
//                       <div className="flex-grow-1 min-width-0">
//                         <div className="text-white fw-bold text-truncate" style={{ fontSize: '14px' }}>
//                           {track.title}
//                         </div>
//                         <div className="text-light opacity-75 text-truncate" style={{ fontSize: '12px' }}>
//                           {track.artist}
//                         </div>
//                       </div>
                      
//                       <div className="text-light opacity-75" style={{ fontSize: '12px' }}>
//                         {track.duration}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 {/* Contrôles playlist */}
//                 <div className="mt-3 pt-3 border-top border-secondary">
//                   <div className="d-flex justify-content-center gap-2">
//                     <button className="btn btn-sm" style={{
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       color: 'white'
//                     }}>
//                       <i className="bi bi-shuffle"></i>
//                     </button>
//                     <button className="btn btn-sm" style={{
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       color: 'white'
//                     }}>
//                       <i className="bi bi-arrow-repeat"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Featured Programs */}
//       {featuredPrograms.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-star-fill me-2" style={{color: '#ffcc00'}}></i>
//                   {t('programs')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPrograms.map((program) => (
//                 <Col md={4} key={program._id} className="mb-4">
//                   <Card className="h-100" style={{
//                     background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                     e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}>
//                     <Card.Img
//                       variant="top"
//                       src={program.image || '/uploads/placeholder-program.jpg'}
//                       alt={program.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{program.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-person me-1"></i>
//                           {program.host}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{program.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #666, #444)',
//                           color: 'white'
//                         }} className="me-2">
//                           {program.category}
//                         </Badge>
//                         <Link 
//                           to={`/programs/${program.slug}`}
//                           className="btn btn-sm"
//                           style={{
//                             background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                             color: 'black',
//                             border: 'none',
//                             fontWeight: 'bold',
//                             transition: 'all 0.3s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.background = 'linear-gradient(45deg, #f0f0f0, #d0d0d0)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.background = 'linear-gradient(45deg, #ffffff, #e0e0e0)';
//                           }}
//                         >
//                           Voir plus
//                         </Link>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/programs" className="btn" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '10px 30px',
//                   fontWeight: 'bold',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = 'white';
//                   e.target.style.color = 'black';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = 'white';
//                 }}>
//                   Voir tous les programmes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Episodes */}
//       {featuredEpisodes.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-collection-play me-2" style={{color: '#4488ff'}}></i>
//                   {t('episodes')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredEpisodes.map((episode) => (
//                 <Col md={4} key={episode._id} className="mb-4">
//                   <Card className="h-100" style={{
//                     background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                     e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}>
//                     <Card.Img
//                       variant="top"
//                       src={episode.image || '/uploads/placeholder-episode.jpg'}
//                       alt={episode.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{episode.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-tv me-1"></i>
//                           {episode.programId?.title}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{episode.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #44aaff, #3388cc)',
//                           color: 'white'
//                         }} className="me-2">
//                           S{episode.season}E{episode.episodeNumber}
//                         </Badge>
//                         <Button size="sm" style={{
//                           background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                           color: 'black',
//                           border: 'none',
//                           fontWeight: 'bold'
//                         }}>
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/episodes" className="btn" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '10px 30px',
//                   fontWeight: 'bold',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = 'white';
//                   e.target.style.color = 'black';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = 'white';
//                 }}>
//                   Voir tous les épisodes
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Podcasts */}
//       {featuredPodcasts.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-headphones me-2" style={{color: '#00ff88'}}></i>
//                   {t('podcasts')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPodcasts.map((podcast) => (
//                 <Col md={4} key={podcast._id} className="mb-4">
//                   <Card className="h-100" style={{
//                     background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(10px)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'translateY(-5px)';
//                     e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}>
//                     <Card.Img
//                       variant="top"
//                       src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//                       alt={podcast.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{podcast.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-person me-1"></i>
//                           {podcast.host}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{podcast.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto d-flex justify-content-between align-items-center">
//                         <div>
//                           <Badge style={{
//                             background: 'linear-gradient(45deg, #666, #444)',
//                             color: 'white'
//                           }} className="me-2">
//                             {podcast.category}
//                           </Badge>
//                         </div>
//                         <div>
//                           <small className="me-2" style={{color: '#ccc'}}>
//                             <i className="bi bi-download me-1"></i>
//                             {podcast.downloads || 0}
//                           </small>
//                           <Button size="sm" style={{
//                             background: 'linear-gradient(45deg, #00ff88, #00cc66)',
//                             color: 'black',
//                             border: 'none',
//                             fontWeight: 'bold'
//                           }}>
//                             <i className="bi bi-play-fill me-1"></i>
//                             Écouter
//                           </Button>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <Link to="/podcasts" className="btn" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '10px 30px',
//                   fontWeight: 'bold',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = 'white';
//                   e.target.style.color = 'black';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = 'transparent';
//                   e.target.style.color = 'white';
//                 }}>
//                   Voir tous les podcasts
//                 </Link>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Call to Action */}
//       <section className="py-5" style={{
//         background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.8))',
//         borderTop: '1px solid #333'
//       }}>
//         <Container>
//           <Row>
//             <Col lg={8} className="mx-auto text-center">
//               <h2 className="mb-3 text-white">
//                 Découvrez notre univers radiophonique
//               </h2>
//               <p className="lead mb-4" style={{color: '#ccc'}}>
//                 Plongez dans un monde de contenus audio exceptionnels avec nos programmes live, 
//                 épisodes exclusifs et podcasts à la demande. Une expérience d'écoute unique vous attend.
//               </p>
//               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
//                 <Link to="/programs" className="btn btn-lg" style={{
//                   background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                   color: 'black',
//                   border: 'none',
//                   fontWeight: 'bold',
//                   padding: '12px 30px'
//                 }}>
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Voir la grille
//                 </Link>
//                 <Link to="/about" className="btn btn-lg" style={{
//                   background: 'transparent',
//                   border: '2px solid white',
//                   color: 'white',
//                   padding: '12px 30px',
//                   fontWeight: 'bold'
//                 }}>
//                   <i className="bi bi-info-circle me-2"></i>
//                   En savoir plus
//                 </Link>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Stats Section */}
//       <section className="py-5" style={{
//         background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//       }}>
//         <Container>
//           <Row>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-broadcast fs-1 mb-2" style={{color: '#ff4444'}}></i>
//                 <h4 className="mb-1 text-white">24/7</h4>
//                 <p style={{color: '#ccc'}}>Diffusion continue</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-people fs-1 mb-2" style={{color: '#4488ff'}}></i>
//                 <h4 className="mb-1 text-white">50k+</h4>
//                 <p style={{color: '#ccc'}}>Auditeurs actifs</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-collection-play fs-1 mb-2" style={{color: '#00ff88'}}></i>
//                 <h4 className="mb-1 text-white">1000+</h4>
//                 <p style={{color: '#ccc'}}>Épisodes disponibles</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div className="p-3">
//                 <i className="bi bi-headphones fs-1 mb-2" style={{color: '#ffcc00'}}></i>
//                 <h4 className="mb-1 text-white">500+</h4>
//                 <p style={{color: '#ccc'}}>Podcasts exclusifs</p>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// const Home = () => {
//   const { t } = useTranslation();
//   const { 
//     currentProgram, 
//     nextProgram, 
//     getActivePrograms, 
//     getEpisodes, 
//     getPodcasts 
//   } = useRadio();
  
//   const [featuredPrograms, setFeaturedPrograms] = useState([]);
//   const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
//   const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // État pour le carrousel de DJ
//   const [currentDJIndex, setCurrentDJIndex] = useState(0);
//   const heroImages = [
//     '/images/programs/ROOTS-RADIO-DEDICACE.PNG',
//     '/images/programs/top-20-africa.jpg',
//     '/images/programs/Selflist-By-Roman-Peter.PNG',
//     '/images/programs/Selflist-By-Martins.PNG',
//     '/images/programs/SUMMER-MIX-DJ-MATHIAS.PNG',
//     '/images/programs/Selflist-By-DJ-ZOUMANTO.PNG',
//     '/images/programs/Selflist-By-Eno-on-the-trck.PNG',
//     '/images/programs/Selflist-By-KIng-Arthur.PNG',
//     '/images/programs/Selflist-By-Le-Joker.PNG',
//     '/images/programs/selflist.PNG',
//     '/images/programs/Selflist-By DJ-BDK.PNG',
//     '/images/programs/SELF-LIST-BY.PNG',
//     '/images/programs/Selflist-By-Dashor.PNG',
//   ];

//   // État pour la playlist
//   const [playlist] = useState([
//     { id: 1, title: 'SABRINA_MARTIN', artist: 'Sabrina', src: '/music/sabrina/SAINTTROPEZ.mp3', duration:'3:45' },
//     { id: 2, title: 'A MINUTE', artist: 'Sabrina', src: '/music/sabrina/A_MINUTE.mp3', duration: '4:12' },
//     { id: 3, title: 'AGILITY', artist: 'Sabrina', src: '/music/sabrina/AGILITY.mp3', duration: '3:28' },
//     { id: 4, title: 'ALONE', artist: 'Sabrina', src: '/music/sabrina/ALONE.mp3', duration: '4:05' },
//     { id: 5, title: 'DONT CALL ME', artist: 'Sabrina', src: '/music/sabrina/DONT_CALL_ME.mp3', duration: '3:52' },
//     { id: 6, title: 'FARAWAY', artist: 'Sabrina', src: '/music/sabrina/FARAWAY.mp3', duration: '4:05' },
//     { id: 7, title: 'JEJELY', artist: 'Sabrina', src: '/music/sabrina/JEJELY.mp3', duration: '4:05' },
//     { id: 8, title: 'LOSE', artist: 'Sabrina', src: '/music/sabrina/LOSE.mp3', duration: '4:05' },
//     { id: 9, title: 'MY AFRICA', artist: 'Sabrina', src: '/music/sabrina/MY_AFRICA.mp3', duration: '4:05' },
//     { id: 10, title: 'ONLY ONE', artist: 'Sabrina', src: '/music/sabrina/ONLY_ONE.mp3', duration: '4:05' },
//     { id: 11, title: 'PAPARAZZI', artist: 'Sabrina', src: '/music/sabrina/PAPARAZZI.mp3', duration: '4:05' },
//     { id: 12, title: 'PEACE OF MIND', artist: 'Sabrina', src: '/music/sabrina/PEACE_OF_MIND.mp3', duration: '4:05' },
//     { id: 13, title: 'RIDE OR DIE', artist: 'Sabrina', src: '/music/sabrina/RIDE_OR_DIE.mp3', duration: '4:05' },
//   ]);
  
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
  
//   const audioRef = useRef(null);

//   useEffect(() => {
//     audioRef.current = new Audio();
    
//     const handleTrackEnd = () => {
//       setIsPlaying(false);
//       setCurrentTrack(null);
//     };

//     audioRef.current.addEventListener('ended', handleTrackEnd);
    
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.removeEventListener('ended', handleTrackEnd);
//         audioRef.current.pause();
//         audioRef.current.src = '';
//         audioRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       setLoading(true);
//       try {
//         const programs = await getActivePrograms();
//         const featured = programs.filter(p => p.featured).slice(0, 3);
//         setFeaturedPrograms(featured);

//         const episodesData = await getEpisodes({ featured: true, limit: 3 });
//         setFeaturedEpisodes(episodesData.episodes || []);

//         const podcastsData = await getPodcasts({ featured: true, limit: 3 });
//         setFeaturedPodcasts(podcastsData.podcasts || []);
//       } catch (error) {
//         console.error('Failed to fetch featured content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedContent();
//   }, [getActivePrograms, getEpisodes, getPodcasts]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDJIndex((prevIndex) => 
//         prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [heroImages.length]);

//   const playTrack = (track) => {
//     if (!audioRef.current) return;

//     if (currentTrack && currentTrack.id === track.id && isPlaying) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       if (currentTrack && currentTrack.id !== track.id) {
//         audioRef.current.pause();
//       }
//       audioRef.current.src = track.src;
//       audioRef.current.play().catch(console.error);
//       setCurrentTrack(track);
//       setIsPlaying(true);
//     }
//   };

//   const HoverCard = ({ children, className = '', style = {} }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//       <Card 
//         className={className}
//         style={{
//           ...style,
//           transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
//           boxShadow: isHovered 
//             ? '0 20px 60px rgba(0,0,0,0.12)' 
//             : '0 2px 12px rgba(0,0,0,0.06)',
//           transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {children}
//       </Card>
//     );
//   };

//   const HoverLink = ({ children, baseStyle, hoverStyle, ...props }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//       <Link
//         {...props}
//         style={isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {children}
//       </Link>
//     );
//   };

//   const PlaylistItem = ({ track, index, currentTrack, isPlaying, onPlay }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const isCurrentTrack = currentTrack?.id === track.id;

//     return (
//       <div 
//         className="d-flex align-items-center p-3 mb-2"
//         style={{
//           background: isCurrentTrack 
//             ? 'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.02) 100%)' 
//             : isHovered 
//             ? 'rgba(0,0,0,0.02)' 
//             : 'transparent',
//           borderRadius: '12px',
//           cursor: 'pointer',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           borderLeft: isCurrentTrack ? '3px solid #000' : '3px solid transparent'
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div 
//           className="me-3 fw-normal" 
//           style={{ 
//             minWidth: '32px', 
//             fontSize: '13px',
//             color: '#999',
//             fontFamily: 'Georgia, serif'
//           }}
//         >
//           {String(index + 1).padStart(2, '0')}
//         </div>
        
//         <button
//           className="btn btn-sm me-3"
//           style={{
//             background: isCurrentTrack && isPlaying ? '#000' : '#fff',
//             border: '1.5px solid #e0e0e0',
//             color: isCurrentTrack && isPlaying ? '#fff' : '#000',
//             borderRadius: '50%',
//             width: '36px',
//             height: '36px',
//             minWidth: '36px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//             boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
//           }}
//           onClick={() => onPlay(track)}
//         >
//           <i 
//             className={`bi ${isCurrentTrack && isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`} 
//             style={{ fontSize: '11px' }}
//           ></i>
//         </button>
        
//         <div className="flex-grow-1 min-width-0">
//           <div 
//             className="fw-medium text-truncate" 
//             style={{ 
//               fontSize: '14px',
//               color: '#1a1a1a',
//               fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
//               letterSpacing: '-0.01em'
//             }}
//           >
//             {track.title}
//           </div>
//           <div 
//             className="text-truncate" 
//             style={{ 
//               fontSize: '12px',
//               color: '#666',
//               marginTop: '2px'
//             }}
//           >
//             {track.artist}
//           </div>
//         </div>
        
//         <div 
//           style={{ 
//             fontSize: '12px',
//             color: '#999',
//             fontFamily: 'Georgia, serif'
//           }}
//         >
//           {track.duration}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ 
//       background: '#fafafa',
//       minHeight: '100vh',
//       paddingBottom: '100px',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
//     }}>
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
          
//           .playlist-container::-webkit-scrollbar {
//             width: 6px;
//           }
//           .playlist-container::-webkit-scrollbar-track {
//             background: rgba(0,0,0,0.03);
//             border-radius: 10px;
//           }
//           .playlist-container::-webkit-scrollbar-thumb {
//             background: rgba(0,0,0,0.15);
//             border-radius: 10px;
//           }
//           .playlist-container::-webkit-scrollbar-thumb:hover {
//             background: rgba(0,0,0,0.25);
//           }
//         `}
//       </style>

//       {/* Fixed Audio Player Bar - Design Épuré */}
//       <div 
//         className="fixed-bottom" 
//         style={{ 
//           // background: 'rgba(255, 255, 255, 0.98)',
//           borderTop: '1px solid rgba(0,0,0,0.06)',
//           backdropFilter: 'blur(20px)',
//           zIndex: 1000,
//           height: '80px',
//           boxShadow: '0 -2px 20px rgba(0,0,0,0.04)'
//         }}
//       >
//         <Container fluid className="h-100">
//           <div className="d-flex align-items-center justify-content-between h-100 px-4">
//             <div className="d-flex align-items-center">
//               <div 
//                 className="px-3 py-1 me-4"
//                 style={{ 
//                   backgroundColor: '#000',
//                   color: '#fff',
//                   fontSize: '10px',
//                   letterSpacing: '1.5px',
//                   textTransform: 'uppercase',
//                   fontWeight: '600',
//                   borderRadius: '20px',
//                   fontFamily: 'DM Sans, sans-serif'
//                 }}
//               >
//                 ● EN DIRECT
//               </div>
              
//               {currentProgram && (
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                     alt={currentProgram.title}
//                     className="me-3"
//                     style={{ 
//                       width: '48px', 
//                       height: '48px', 
//                       objectFit: 'cover',
//                       borderRadius: '8px',
//                       border: '1px solid rgba(0,0,0,0.08)'
//                     }}
//                   />
//                   <div>
//                     <h6 
//                       className="mb-0" 
//                       style={{
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: '#000',
//                         letterSpacing: '-0.02em'
//                       }}
//                     >
//                       {currentProgram.title}
//                     </h6>
//                     <small style={{ color: '#666', fontSize: '12px' }}>
//                       {currentProgram.host}
//                     </small>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="d-flex align-items-center justify-content-center flex-grow-1 mx-5">
//               <AudioPlayer />
//             </div>
            
//             <div className="d-flex align-items-center gap-2">
//               <button 
//                 className="btn btn-link p-2"
//                 style={{ color: '#000', fontSize: '18px' }}
//               >
//                 <i className="bi bi-volume-up"></i>
//               </button>
//               <button 
//                 className="btn btn-link p-2"
//                 style={{ color: '#000', fontSize: '16px' }}
//               >
//                 <i className="bi bi-three-dots"></i>
//               </button>
//             </div>
//           </div>
//         </Container>
//       </div>

//       {/* Hero Section - Design Soft et Élégant */}
//       <section style={{ 
//         padding: '80px 0 60px',
//         background: '#fff'
//       }}>
//         <Container>
//           {/* Titre principal avec typographie élégante */}
//           <div className="text-center mb-5" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
//             <h1 
//               style={{
//                 fontSize: '9.5rem',
//                 fontWeight: '600',
//                 color: '#000',
//                 fontFamily: 'Cormorant Garamond, serif',
//                 letterSpacing: '-0.03em',
//                 marginBottom: '16px',
//                 lineHeight: '1.1'
//               }}
//             >
//               Roots Radio <br /> 
              
//               <p 
//               style={{
//                 fontSize: '2.5rem',
//                 fontWeight: '200',
//                 color: '#000',
//                 fontFamily: 'Cormorant Garamond, serif',
//                 letterSpacing: '-0.03em',
//                 marginBottom: '16px',
//                 lineHeight: '1.1'
//               }}
//             >
//                Where Everything starts
//             </p>
             
//             </h1>
//             <br />
//             <p 
//               style={{
//                 fontSize: '15px',
//                 color: '#666',
//                 fontWeight: '400',
//                 letterSpacing: '0.5px',
//                 textTransform: 'uppercase',
//                 fontFamily: 'DM Sans, sans-serif'
//               }}
//             >
//               Émissions · Podcasts · Musique
//             </p>
//           </div>

//           <Row className="g-4">
//             {/* Section Carrousel DJ */}
//             <Col lg={7}>
//               <div 
//                 className="position-relative overflow-hidden" 
//                 style={{
//                   background: '#fff',
//                   borderRadius: '24px',
//                   minHeight: '480px',
//                   border: '1px solid rgba(0,0,0,0.08)',
//                   boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
//                 }}
//               >
//                 {/* Carrousel Background avec transition douce */}
//                 <div className="position-absolute w-100 h-100">
//                   {heroImages.map((photo, index) => (
//                     <div
//                       key={index}
//                       className="position-absolute w-100 h-100"
//                       style={{
//                         backgroundImage: `url(${photo})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                         opacity: index === currentDJIndex ? 1 : 0,
//                         transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
//                         filter: 'grayscale(20%) brightness(0.85)'
//                       }}
//                     />
//                   ))}
//                   {/* Overlay gradient doux */}
//                   <div 
//                     className="position-absolute w-100 h-100"
//                     style={{
//                       background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
//                     }}
//                   />
//                 </div>

//                 {/* Contenu overlay */}
//                 <div className="position-absolute w-100 h-100 p-4 d-flex flex-column justify-content-end">
//                   <div 
//                     className="p-4" 
//                     style={{
//                       background: 'rgba(255,255,255,0.95)',
//                       backdropFilter: 'blur(20px)',
//                       borderRadius: '16px',
//                       border: '1px solid rgba(0,0,0,0.08)'
//                     }}
//                   >
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div>
//                         <h5 
//                           className="mb-1" 
//                           style={{
//                             fontSize: '16px',
//                             fontWeight: '600',
//                             color: '#000',
//                             letterSpacing: '-0.01em'
//                           }}
//                         >
//                           En cours de diffusion
//                         </h5>
//                         <small style={{ color: '#666', fontSize: '13px' }}>
//                           Session DJ Live
//                         </small>
//                       </div>
//                       <button 
//                         className="btn" 
//                         style={{
//                           background: '#000',
//                           border: 'none',
//                           color: '#fff',
//                           borderRadius: '50%',
//                           width: '44px',
//                           height: '44px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           transition: 'all 0.3s ease'
//                         }}
//                       >
//                         <i className="bi bi-pause-fill"></i>
//                       </button>
//                     </div>
                    
//                     <div className="mb-2" style={{ 
//                       height: '2px', 
//                       background: 'rgba(0,0,0,0.08)',
//                       borderRadius: '2px',
//                       overflow: 'hidden'
//                     }}>
//                       <div 
//                         style={{ 
//                           width: '45%',
//                           height: '100%',
//                           background: '#000',
//                           transition: 'width 0.3s ease'
//                         }}
//                       ></div>
//                     </div>
                    
//                     <div className="d-flex justify-content-between" style={{ 
//                       fontSize: '11px',
//                       color: '#999',
//                       fontFamily: 'Georgia, serif'
//                     }}>
//                       <span>2:34</span>
//                       <span>5:47</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Indicateurs minimalistes */}
//                 <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
//                   <div className="d-flex gap-2">
//                     {heroImages.map((_, index) => (
//                       <button
//                         key={index}
//                         className="btn p-0"
//                         style={{
//                           width: index === currentDJIndex ? '24px' : '6px',
//                           height: '6px',
//                           borderRadius: '3px',
//                           background: index === currentDJIndex 
//                             ? 'rgba(255,255,255,0.9)' 
//                             : 'rgba(255,255,255,0.4)',
//                           border: 'none',
//                           transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//                         }}
//                         onClick={() => setCurrentDJIndex(index)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </Col>
            
//             {/* Section Playlist avec design épuré */}
//             <Col lg={5}>
//               <div 
//                 className="p-4 h-100" 
//                 style={{
//                   background: '#fff',
//                   borderRadius: '24px',
//                   minHeight: '480px',
//                   border: '1px solid rgba(0,0,0,0.08)',
//                   boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
//                 }}
//               >
//                 <div className="d-flex align-items-center justify-content-between mb-4">
//                   <h4 
//                     className="mb-0" 
//                     style={{
//                       fontSize: '20px',
//                       fontWeight: '600',
//                       color: '#000',
//                       fontFamily: 'DM Sans, sans-serif',
//                       letterSpacing: '-0.02em'
//                     }}
//                   >
//                     Playlist en cours
//                   </h4>
//                   <Badge 
//                     style={{
//                       background: 'rgba(0,0,0,0.05)',
//                       color: '#000',
//                       fontWeight: '500',
//                       padding: '6px 12px',
//                       borderRadius: '20px',
//                       fontSize: '11px',
//                       letterSpacing: '0.5px'
//                     }}
//                   >
//                     {playlist.length} TITRES
//                   </Badge>
//                 </div>
                
//                 <div className="playlist-container" style={{ 
//                   maxHeight: '340px', 
//                   overflowY: 'auto',
//                   paddingRight: '8px'
//                 }}>
//                   {playlist.map((track, index) => (
//                     <PlaylistItem
//                       key={track.id}
//                       track={track}
//                       index={index}
//                       currentTrack={currentTrack}
//                       isPlaying={isPlaying}
//                       onPlay={playTrack}
//                     />
//                   ))}
//                 </div>
                
//                 <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
//                   <div className="d-flex justify-content-center gap-3">
//                     <button 
//                       className="btn btn-sm" 
//                       style={{
//                         background: 'transparent',
//                         border: '1.5px solid rgba(0,0,0,0.12)',
//                         color: '#000',
//                         borderRadius: '20px',
//                         padding: '8px 16px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         transition: 'all 0.3s ease'
//                       }}
//                     >
//                       <i className="bi bi-shuffle me-2"></i>
//                       Aléatoire
//                     </button>
//                     <button 
//                       className="btn btn-sm" 
//                       style={{
//                         background: 'transparent',
//                         border: '1.5px solid rgba(0,0,0,0.12)',
//                         color: '#000',
//                         borderRadius: '20px',
//                         padding: '8px 16px',
//                         fontSize: '12px',
//                         fontWeight: '500',
//                         transition: 'all 0.3s ease'
//                       }}
//                     >
//                       <i className="bi bi-arrow-repeat me-2"></i>
//                       Répéter
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Featured Programs - Design Cards Élégantes */}
//       {featuredPrograms.length > 0 && (
//         <section style={{ padding: '60px 0', background: '#fafafa' }}>
//           <Container>
//             <div className="text-center mb-5">
//               <h2 
//                 style={{
//                   fontSize: '2.5rem',
//                   fontWeight: '300',
//                   color: '#000',
//                   fontFamily: 'Cormorant Garamond, serif',
//                   letterSpacing: '-0.02em',
//                   marginBottom: '12px'
//                 }}
//               >
//                 Programmes à la une
//               </h2>
//               <div 
//                 style={{
//                   width: '60px',
//                   height: '2px',
//                   background: '#000',
//                   margin: '0 auto'
//                 }}
//               />
//             </div>
            
//             <Row className="g-4">
//               {featuredPrograms.map((program) => (
//                 <Col md={4} key={program._id}>
//                   <HoverCard
//                     className="h-100 border-0"
//                     style={{
//                       background: '#fff',
//                       borderRadius: '20px',
//                       overflow: 'hidden'
//                     }}
//                   >
//                     <div style={{ position: 'relative', overflow: 'hidden' }}>
//                       <Card.Img
//                         variant="top"
//                         src={program.image || '/uploads/placeholder-program.jpg'}
//                         alt={program.title}
//                         style={{
//                           height: '280px',
//                           objectFit: 'cover',
//                           filter: 'grayscale(10%)'
//                         }}
//                       />
//                       <div 
//                         style={{
//                           position: 'absolute',
//                           top: '16px',
//                           right: '16px',
//                           background: 'rgba(255,255,255,0.95)',
//                           backdropFilter: 'blur(10px)',
//                           padding: '6px 14px',
//                           borderRadius: '20px',
//                           fontSize: '11px',
//                           fontWeight: '600',
//                           letterSpacing: '0.5px',
//                           textTransform: 'uppercase',
//                           color: '#000'
//                         }}
//                       >
//                         À LA UNE
//                       </div>
//                     </div>
//                     <Card.Body className="p-4">
//                       <Card.Title 
//                         style={{
//                           fontSize: '20px',
//                           fontWeight: '600',
//                           color: '#000',
//                           marginBottom: '12px',
//                           letterSpacing: '-0.01em',
//                           fontFamily: 'DM Sans, sans-serif'
//                         }}
//                       >
//                         {program.title}
//                       </Card.Title>
//                       <Card.Text>
//                         <div 
//                           style={{
//                             fontSize: '13px',
//                             color: '#666',
//                             marginBottom: '8px',
//                             display: 'flex',
//                             alignItems: 'center'
//                           }}
//                         >
//                           <i className="bi bi-person me-2"></i>
//                           {program.host}
//                         </div>
//                         <p 
//                           style={{
//                             fontSize: '14px',
//                             color: '#888',
//                             lineHeight: '1.6',
//                             marginBottom: '20px'
//                           }}
//                         >
//                           {program.description}
//                         </p>
//                       </Card.Text>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <Badge 
//                           style={{
//                             background: 'rgba(0,0,0,0.05)',
//                             color: '#000',
//                             fontWeight: '500',
//                             padding: '6px 12px',
//                             borderRadius: '20px',
//                             fontSize: '11px'
//                           }}
//                         >
//                           {program.category}
//                         </Badge>
//                         <HoverLink
//                           to={`/programs/${program.slug}`}
//                           className="btn btn-sm"
//                           baseStyle={{
//                             background: '#000',
//                             color: '#fff',
//                             border: 'none',
//                             fontWeight: '500',
//                             padding: '8px 20px',
//                             borderRadius: '20px',
//                             fontSize: '12px',
//                             transition: 'all 0.3s ease',
//                             textDecoration: 'none'
//                           }}
//                           hoverStyle={{
//                             background: '#333',
//                             transform: 'translateY(-2px)'
//                           }}
//                         >
//                           Découvrir
//                         </HoverLink>
//                       </div>
//                     </Card.Body>
//                   </HoverCard>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-5">
//               <Col className="text-center">
//                 <HoverLink
//                   to="/programs"
//                   baseStyle={{
//                     display: 'inline-block',
//                     background: 'transparent',
//                     border: '1.5px solid #000',
//                     color: '#000',
//                     padding: '12px 32px',
//                     fontWeight: '500',
//                     borderRadius: '30px',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//                     textDecoration: 'none'
//                   }}
//                   hoverStyle={{
//                     background: '#000',
//                     color: '#fff'
//                   }}
//                 >
//                   Tous les programmes
//                 </HoverLink>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Episodes */}
//       {featuredEpisodes.length > 0 && (
//         <section style={{ padding: '60px 0', background: '#fff' }}>
//           <Container>
//             <div className="text-center mb-5">
//               <h2 
//                 style={{
//                   fontSize: '2.5rem',
//                   fontWeight: '300',
//                   color: '#000',
//                   fontFamily: 'Cormorant Garamond, serif',
//                   letterSpacing: '-0.02em',
//                   marginBottom: '12px'
//                 }}
//               >
//                 Épisodes récents
//               </h2>
//               <div 
//                 style={{
//                   width: '60px',
//                   height: '2px',
//                   background: '#000',
//                   margin: '0 auto'
//                 }}
//               />
//             </div>
            
//             <Row className="g-4">
//               {featuredEpisodes.map((episode) => (
//                 <Col md={4} key={episode._id}>
//                   <HoverCard
//                     className="h-100 border-0"
//                     style={{
//                       background: '#fff',
//                       borderRadius: '20px',
//                       overflow: 'hidden',
//                       border: '1px solid rgba(0,0,0,0.08)'
//                     }}
//                   >
//                     <div style={{ position: 'relative' }}>
//                       <Card.Img
//                         variant="top"
//                         src={episode.image || '/uploads/placeholder-episode.jpg'}
//                         alt={episode.title}
//                         style={{
//                           height: '280px',
//                           objectFit: 'cover',
//                           filter: 'grayscale(10%)'
//                         }}
//                       />
//                     </div>
//                     <Card.Body className="p-4">
//                       <Card.Title 
//                         style={{
//                           fontSize: '20px',
//                           fontWeight: '600',
//                           color: '#000',
//                           marginBottom: '12px',
//                           letterSpacing: '-0.01em',
//                           fontFamily: 'DM Sans, sans-serif'
//                         }}
//                       >
//                         {episode.title}
//                       </Card.Title>
//                       <Card.Text>
//                         <div 
//                           style={{
//                             fontSize: '13px',
//                             color: '#666',
//                             marginBottom: '8px',
//                             display: 'flex',
//                             alignItems: 'center'
//                           }}
//                         >
//                           <i className="bi bi-tv me-2"></i>
//                           {episode.programId?.title}
//                         </div>
//                         <p 
//                           style={{
//                             fontSize: '14px',
//                             color: '#888',
//                             lineHeight: '1.6',
//                             marginBottom: '20px'
//                           }}
//                         >
//                           {episode.description}
//                         </p>
//                       </Card.Text>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <Badge 
//                           style={{
//                             background: 'rgba(0,0,0,0.05)',
//                             color: '#000',
//                             fontWeight: '500',
//                             padding: '6px 12px',
//                             borderRadius: '20px',
//                             fontSize: '11px'
//                           }}
//                         >
//                           S{episode.season}E{episode.episodeNumber}
//                         </Badge>
//                         <Button 
//                           size="sm" 
//                           style={{
//                             background: '#000',
//                             color: '#fff',
//                             border: 'none',
//                             fontWeight: '500',
//                             padding: '8px 20px',
//                             borderRadius: '20px',
//                             fontSize: '12px'
//                           }}
//                         >
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </HoverCard>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-5">
//               <Col className="text-center">
//                 <HoverLink
//                   to="/episodes"
//                   baseStyle={{
//                     display: 'inline-block',
//                     background: 'transparent',
//                     border: '1.5px solid #000',
//                     color: '#000',
//                     padding: '12px 32px',
//                     fontWeight: '500',
//                     borderRadius: '30px',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//                     textDecoration: 'none'
//                   }}
//                   hoverStyle={{
//                     background: '#000',
//                     color: '#fff'
//                   }}
//                 >
//                   Tous les épisodes
//                 </HoverLink>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Podcasts */}
//       {featuredPodcasts.length > 0 && (
//         <section style={{ padding: '60px 0', background: '#fafafa' }}>
//           <Container>
//             <div className="text-center mb-5">
//               <h2 
//                 style={{
//                   fontSize: '2.5rem',
//                   fontWeight: '300',
//                   color: '#000',
//                   fontFamily: 'Cormorant Garamond, serif',
//                   letterSpacing: '-0.02em',
//                   marginBottom: '12px'
//                 }}
//               >
//                 Podcasts populaires
//               </h2>
//               <div 
//                 style={{
//                   width: '60px',
//                   height: '2px',
//                   background: '#000',
//                   margin: '0 auto'
//                 }}
//               />
//             </div>
            
//             <Row className="g-4">
//               {featuredPodcasts.map((podcast) => (
//                 <Col md={4} key={podcast._id}>
//                   <HoverCard
//                     className="h-100 border-0"
//                     style={{
//                       background: '#fff',
//                       borderRadius: '20px',
//                       overflow: 'hidden'
//                     }}
//                   >
//                     <div style={{ position: 'relative' }}>
//                       <Card.Img
//                         variant="top"
//                         src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//                         alt={podcast.title}
//                         style={{
//                           height: '280px',
//                           objectFit: 'cover',
//                           filter: 'grayscale(10%)'
//                         }}
//                       />
//                     </div>
//                     <Card.Body className="p-4">
//                       <Card.Title 
//                         style={{
//                           fontSize: '20px',
//                           fontWeight: '600',
//                           color: '#000',
//                           marginBottom: '12px',
//                           letterSpacing: '-0.01em',
//                           fontFamily: 'DM Sans, sans-serif'
//                         }}
//                       >
//                         {podcast.title}
//                       </Card.Title>
//                       <Card.Text>
//                         <div 
//                           style={{
//                             fontSize: '13px',
//                             color: '#666',
//                             marginBottom: '8px',
//                             display: 'flex',
//                             alignItems: 'center'
//                           }}
//                         >
//                           <i className="bi bi-person me-2"></i>
//                           {podcast.host}
//                         </div>
//                         <p 
//                           style={{
//                             fontSize: '14px',
//                             color: '#888',
//                             lineHeight: '1.6',
//                             marginBottom: '20px'
//                           }}
//                         >
//                           {podcast.description}
//                         </p>
//                       </Card.Text>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <div className="d-flex align-items-center gap-2">
//                           <Badge 
//                             style={{
//                               background: 'rgba(0,0,0,0.05)',
//                               color: '#000',
//                               fontWeight: '500',
//                               padding: '6px 12px',
//                               borderRadius: '20px',
//                               fontSize: '11px'
//                             }}
//                           >
//                             {podcast.category}
//                           </Badge>
//                           <small style={{ color: '#999', fontSize: '12px' }}>
//                             <i className="bi bi-download me-1"></i>
//                             {podcast.downloads || 0}
//                           </small>
//                         </div>
//                         <Button 
//                           size="sm" 
//                           style={{
//                             background: '#000',
//                             color: '#fff',
//                             border: 'none',
//                             fontWeight: '500',
//                             padding: '8px 20px',
//                             borderRadius: '20px',
//                             fontSize: '12px'
//                           }}
//                         >
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </HoverCard>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-5">
//               <Col className="text-center">
//                 <HoverLink
//                   to="/podcasts"
//                   baseStyle={{
//                     display: 'inline-block',
//                     background: 'transparent',
//                     border: '1.5px solid #000',
//                     color: '#000',
//                     padding: '12px 32px',
//                     fontWeight: '500',
//                     borderRadius: '30px',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//                     textDecoration: 'none'
//                   }}
//                   hoverStyle={{
//                     background: '#000',
//                     color: '#fff'
//                   }}
//                 >
//                   Tous les podcasts
//                 </HoverLink>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

      

//       {/* Call to Action - Section Minimaliste */}
//       <section style={{ padding: '100px 0', background: '#000', color: '#fff' }}>
//         <Container>
//           <Row>
//             <Col lg={8} className="mx-auto text-center">
//               <h2 
//                 className="mb-4" 
//                 style={{
//                   fontSize: '3.5rem',
//                   fontWeight: '300',
//                   fontFamily: 'Cormorant Garamond, serif',
//                   lineHeight: '1.2',
//                   letterSpacing: '-0.03em'
//                 }}
//               >
//                 Rejoignez notre univers sonore
//               </h2>
//               <p 
//                 className="mb-5" 
//                 style={{
//                   color: 'rgba(255,255,255,0.7)',
//                   fontSize: '16px',
//                   lineHeight: '1.8',
//                   maxWidth: '600px',
//                   margin: '0 auto 48px',
//                   fontWeight: '400'
//                 }}
//               >
//                 Découvrez nos programmes live, nos épisodes exclusifs et notre collection 
//                 de podcasts soigneusement sélectionnés.
//               </p>
//               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
//                 <HoverLink
//                   to="/programs"
//                   baseStyle={{
//                     display: 'inline-block',
//                     backgroundColor: '#fff',
//                     color: '#000',
//                     border: 'none',
//                     fontWeight: '500',
//                     padding: '14px 36px',
//                     borderRadius: '30px',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     transition: 'all 0.3s ease',
//                     textDecoration: 'none'
//                   }}
//                   hoverStyle={{
//                     backgroundColor: '#f0f0f0',
//                     transform: 'translateY(-2px)'
//                   }}
//                 >
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Voir la programmation
//                 </HoverLink>
//                 <HoverLink
//                   to="/about"
//                   baseStyle={{
//                     display: 'inline-block',
//                     backgroundColor: 'transparent',
//                     border: '1.5px solid rgba(255,255,255,0.3)',
//                     color: '#fff',
//                     padding: '14px 36px',
//                     fontWeight: '500',
//                     borderRadius: '30px',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     transition: 'all 0.3s ease',
//                     textDecoration: 'none'
//                   }}
//                   hoverStyle={{
//                     backgroundColor: 'rgba(255,255,255,0.1)',
//                     borderColor: 'rgba(255,255,255,0.5)'
//                   }}
//                 >
//                   <i className="bi bi-info-circle me-2"></i>
//                   À propos
//                 </HoverLink>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Stats Section - Design Épuré */}
//       <section style={{ padding: '80px 0', background: '#fff' }}>
//         <Container>
//           <Row className="g-5">
//             <Col md={3} className="text-center">
//               <div>
//                 <h3 
//                   className="mb-2" 
//                   style={{ 
//                     fontSize: '3rem',
//                     fontWeight: '300',
//                     color: '#000',
//                     fontFamily: 'Cormorant Garamond, serif'
//                   }}
//                 >
//                   24/7
//                 </h3>
//                 <p 
//                   style={{ 
//                     color: '#666',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     fontWeight: '500'
//                   }}
//                 >
//                   Diffusion continue
//                 </p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div>
//                 <h3 
//                   className="mb-2" 
//                   style={{ 
//                     fontSize: '3rem',
//                     fontWeight: '300',
//                     color: '#000',
//                     fontFamily: 'Cormorant Garamond, serif'
//                   }}
//                 >
//                   50k+
//                 </h3>
//                 <p 
//                   style={{ 
//                     color: '#666',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     fontWeight: '500'
//                   }}
//                 >
//                   Auditeurs actifs
//                 </p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div>
//                 <h3 
//                   className="mb-2" 
//                   style={{ 
//                     fontSize: '3rem',
//                     fontWeight: '300',
//                     color: '#000',
//                     fontFamily: 'Cormorant Garamond, serif'
//                   }}
//                 >
//                   1000+
//                 </h3>
//                 <p 
//                   style={{ 
//                     color: '#666',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     fontWeight: '500'
//                   }}
//                 >
//                   Épisodes
//                 </p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div>
//                 <h3 
//                   className="mb-2" 
//                   style={{ 
//                     fontSize: '3rem',
//                     fontWeight: '300',
//                     color: '#000',
//                     fontFamily: 'Cormorant Garamond, serif'
//                   }}
//                 >
//                   500+
//                 </h3>
//                 <p 
//                   style={{ 
//                     color: '#666',
//                     fontSize: '13px',
//                     letterSpacing: '0.5px',
//                     textTransform: 'uppercase',
//                     fontWeight: '500'
//                   }}
//                 >
//                   Podcasts
//                 </p>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../contexts/RadioContext';
import AudioPlayer from '../components/AudioPlayer';
import ArtistsCarousel from '../components/Artistscarousel';

const Home = () => {
  const { t } = useTranslation();
  const { 
    currentProgram, 
    nextProgram, 
    getActivePrograms, 
    getEpisodes, 
    getPodcasts,
    playHistory, // ✅ Historique depuis le contexte
    nowPlaying
  } = useRadio();
  
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le carrousel de DJ
  const [currentDJIndex, setCurrentDJIndex] = useState(0);
  const heroImages = [
    '/images/programs/GOOD_MORNING-AFFICHE.jpg',
    '/images/programs/HIT_30_AFFICHE.jpg',
    '/images/programs/LES_ROIS_DE_L_AFROBEAT.jpg',
    '/images/programs/MIX_PARTY_BY_ERIC_5_ETOILES.png',
    '/images/programs/PLAYLIST-NON_STOP_AFFICHE.jpg',
    '/images/programs/PLAYLIST_WEEKEND_AFFICHE.jpg',
    '/images/programs/ROOTS_CLASSICS.jpg',
    '/images/programs/ROOTS_LATINO.jpg',
    '/images/programs/roots_radio_dedicace_AFFICHE.jpg',
    '/images/programs/SUMMER_MIX_BY_DJ_MATHIAS.jpg',
    '/images/programs/TOP_20_AFRICA_AFFICHE.jpg',
    // '/images/programs/LA_RETRO_AFFICHE.jpg',
    // '/images/programs/Selflist-By-Dashor.jpg',
  ];

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setLoading(true);
      try {
        const programs = await getActivePrograms();
        const featured = programs.filter(p => p.featured).slice(0, 3);
        setFeaturedPrograms(featured);

        const episodesData = await getEpisodes({ featured: true, limit: 3 });
        setFeaturedEpisodes(episodesData.episodes || []);

        const podcastsData = await getPodcasts({ featured: true, limit: 3 });
        setFeaturedPodcasts(podcastsData.podcasts || []);
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, [getActivePrograms, getEpisodes, getPodcasts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDJIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const HoverCard = ({ children, className = '', style = {} }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Card 
        className={className}
        style={{
          ...style,
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered 
            ? '0 20px 60px rgba(0,0,0,0.12)' 
            : '0 2px 12px rgba(0,0,0,0.06)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Card>
    );
  };

  const HoverLink = ({ children, baseStyle, hoverStyle, ...props }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link
        {...props}
        style={isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>
    );
  };

  // ✅ Composant pour afficher un élément de l'historique
  const HistoryItem = ({ track, index, isNowPlaying }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Formater l'heure de diffusion
    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / 60000);

      if (diffMinutes < 1) return 'À l\'instant';
      if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    return (
      
      <div 
        className="d-flex align-items-center p-3 mb-2"
        style={{
          background: isNowPlaying
            ? 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)' 
            : isHovered 
            ? 'rgba(0,0,0,0.02)' 
            : 'transparent',
          borderRadius: '12px',
          cursor: 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderLeft: isNowPlaying ? '3px solid #000' : '3px solid transparent',
          position: 'relative'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge "En cours" */}
        {isNowPlaying && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#000',
              color: '#fff',
              fontSize: '9px',
              padding: '3px 8px',
              borderRadius: '10px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            ● EN COURS
          </div>
        )}

        {/* Pochette */}
        <img
          src={track.cover || '/images/default-cover.png'}
          alt={track.title}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '10px',
            objectFit: 'cover',
            marginRight: '12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)'
          }}
          onError={(e) => {
            e.target.src = '/images/default-cover.png';
          }}
        />
        
        {/* Infos */}
        <div className="flex-grow-1 min-width-0">
          <div 
            className="fw-medium text-truncate" 
            style={{ 
              fontSize: '14px',
              color: isNowPlaying ? '#000' : '#1a1a1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              letterSpacing: '-0.01em',
              fontWeight: isNowPlaying ? '600' : '500'
            }}
          >
            {track.title}
          </div>
          <div 
            className="text-truncate" 
            style={{ 
              fontSize: '12px',
              color: '#666',
              marginTop: '2px'
            }}
          >
            {track.artist}
          </div>
          {track.album && (
            <div 
              className="text-truncate" 
              style={{ 
                fontSize: '11px',
                color: '#999',
                marginTop: '2px'
              }}
            >
              {track.album}
            </div>
          )}
        </div>
        
        {/* Heure */}
        <div 
          style={{ 
            fontSize: '11px',
            color: '#999',
            fontFamily: 'Georgia, serif',
            minWidth: '70px',
            textAlign: 'right'
          }}
        >
          {formatTime(track.playedAt)}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      background: '#fafafa',
      minHeight: '100vh',
      paddingBottom: '100px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
          
          .history-container::-webkit-scrollbar {
            width: 6px;
          }
          .history-container::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.03);
            border-radius: 10px;
          }
          .history-container::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.15);
            border-radius: 10px;
          }
          .history-container::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.25);
          }
        `}
      </style>

      {/* Fixed Audio Player Bar */}
      <div 
        className="fixed-bottom" 
        style={{ 
          borderTop: '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          height: '80px',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.04)'
        }}
      >
        <Container fluid className="h-100">
          <div className="d-flex align-items-center justify-content-between h-100 px-4">
            <div className="d-flex align-items-center">
              <div 
                className="px-3 py-1 me-4"
                style={{ 
                  backgroundColor: '#000',
                  color: '#fff',
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  borderRadius: '20px',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                ● EN DIRECT
              </div>
              
              {currentProgram && (
                <div className="d-flex align-items-center">
                  <img
                    src={currentProgram.image || '/uploads/placeholder-program.jpg'}
                    alt={currentProgram.title}
                    className="me-3"
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  />
                  <div>
                    <h6 
                      className="mb-0" 
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#000',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {currentProgram.title}
                    </h6>
                    <small style={{ color: '#666', fontSize: '12px' }}>
                      {currentProgram.host}
                    </small>
                  </div>
                </div>
              )}
            </div>
            
            <div className="d-flex align-items-center justify-content-center flex-grow-1 mx-5">
              <AudioPlayer />
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-link p-2"
                style={{ color: '#000', fontSize: '18px' }}
              >
                <i className="bi bi-volume-up"></i>
              </button>
              <button 
                className="btn btn-link p-2"
                style={{ color: '#000', fontSize: '16px' }}
              >
                <i className="bi bi-three-dots"></i>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <section style={{ 
        padding: '80px 0 60px',
        background: '#fff'
      }}>
        <div>
            <video
        style={{
        marginTop:'-10%',
        width:'100%',
        height:'360',
        objectFit:'cover'
        }}
       
        
        autoPlay
        muted
        loop
        >
            <source src="/logo.mp4" type="video/mp4" />
        </video>
          {/* <div className="text-center mb-5" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <h1 
              style={{
                fontSize: '9.5rem',
                fontWeight: '600',
                color: '#000',
                fontFamily: 'Cormorant Garamond, serif',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                lineHeight: '1.1'
              }}
            >
              Roots Radio <br /> 
              
              <p 
              style={{
                fontSize: '2.5rem',
                fontWeight: '200',
                color: '#000',
                fontFamily: 'Cormorant Garamond, serif',
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                lineHeight: '1.1'
              }}
            >
               Where Everything starts
            </p>
             
            </h1>
            <br />
            <p 
              style={{
                fontSize: '15px',
                color: '#666',
                fontWeight: '400',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              Émissions · Podcasts · Musique
            </p>
          </div> */}
          <ArtistsCarousel />

          <Row className="g-4">
            {/* Section Carrousel DJ */}
            <Col lg={7}>
              <div 
                className="position-relative overflow-hidden" 
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  minHeight: '600px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                }}
              >
                {/* Carrousel Background */}
                <div className="position-absolute w-100 h-100">
                  {heroImages.map((photo, index) => (
                    <div
                      key={index}
                      className="position-absolute w-100 h-100"
                      style={{
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        backgroundImage: `url(${photo}) `,
                        backgroundSize: '95% auto',
                        backgroundPosition: 'center',
                        opacity: index === currentDJIndex ? 1 : 0,
                        transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: 'grayscale(20%) brightness(0.85)'
                      }}
                    />
                  ))}
                  <div 
                    className="position-absolute w-100 h-100"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
                    }}
                  />
                </div>

                {/* Contenu overlay */}
                {/* <div className="position-absolute w-100 h-100 p-4 d-flex flex-column justify-content-end">
                  <div 
                    className="p-4" 
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h5 
                          className="mb-1" 
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#000',
                            letterSpacing: '-0.01em'
                          }}
                        >
                          {nowPlaying.title || 'En cours de diffusion'}
                        </h5>
                        <small style={{ color: '#666', fontSize: '13px' }}>
                          {nowPlaying.artist || 'Session DJ Live'}
                        </small>
                      </div>
                      <div 
                        className="d-flex align-items-center gap-2"
                        style={{
                          fontSize: '12px',
                          color: '#999'
                        }}
                      >
                        <i className="bi bi-people-fill"></i>
                        {nowPlaying.listeners || 0} auditeurs
                      </div>
                    </div>
                    
                    <div className="mb-2" style={{ 
                      height: '2px', 
                      background: 'rgba(0,0,0,0.08)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{ 
                          width: '45%',
                          height: '100%',
                          background: '#000',
                          transition: 'width 0.3s ease'
                        }}
                      ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between" style={{ 
                      fontSize: '11px',
                      color: '#999',
                      fontFamily: 'Georgia, serif'
                    }}>
                      <span>Live</span>
                      <span>Streaming</span>
                    </div>
                  </div>
                </div> */}

                {/* Indicateurs */}
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  <div className="d-flex gap-2">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        className="btn p-0"
                        style={{
                          width: index === currentDJIndex ? '24px' : '6px',
                          height: '6px',
                          borderRadius: '3px',
                          background: index === currentDJIndex 
                            ? 'rgba(255,255,255,0.9)' 
                            : 'rgba(255,255,255,0.4)',
                          border: 'none',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onClick={() => setCurrentDJIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            
            {/* ✅ Section Historique (remplace la playlist statique) */}
            <Col lg={5}>
              <div 
                className="p-4 h-100" 
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  minHeight: '480px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 
                    className="mb-0" 
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Historique
                  </h4>
                  <Badge 
                    style={{
                      background: 'rgba(0,0,0,0.05)',
                      color: '#000',
                      fontWeight: '500',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {playHistory.length} TITRES
                  </Badge>
                </div>
                
                <div className="history-container" style={{ 
                  maxHeight: '340px', 
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}>
                  {playHistory.length === 0 ? (
                    <div 
                      className="text-center py-5"
                      style={{
                        color: '#999',
                        fontSize: '14px'
                      }}
                    >
                      <i className="bi bi-music-note-beamed d-block mb-2" style={{ fontSize: '32px' }}></i>
                      Aucun historique disponible
                    </div>
                  ) : (
                    playHistory.slice(0, 20).map((track, index) => (
                      <HistoryItem
                        key={track._id || index}
                        track={track}
                        index={index}
                        isNowPlaying={index === 0}
                      />
                    ))
                  )}
                </div>
                
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="d-flex justify-content-center">
                    <button 
                      className="btn btn-sm" 
                      style={{
                        background: 'transparent',
                        border: '1.5px solid rgba(0,0,0,0.12)',
                        color: '#000',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => window.open('/history', '_blank')}
                    >
                      <i className="bi bi-clock-history me-2"></i>
                      Voir tout l'historique
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section style={{ padding: '60px 0', background: '#fafafa' }}>
          <Container>
            <div className="text-center mb-5">
              <h2 
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '300',
                  color: '#000',
                  fontFamily: 'Cormorant Garamond, serif',
                  letterSpacing: '-0.02em',
                  marginBottom: '12px'
                }}
              >
                Programmes à la une
              </h2>
              <div 
                style={{
                  width: '60px',
                  height: '2px',
                  background: '#000',
                  margin: '0 auto'
                }}
              />
            </div>
            
            <Row className="g-4">
              {featuredPrograms.map((program) => (
                <Col md={4} key={program._id}>
                  <HoverCard
                    className="h-100 border-0"
                    style={{
                      background: '#fff',
                      borderRadius: '20px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src={program.image || '/uploads/placeholder-program.jpg'}
                        alt={program.title}
                        style={{
                          height: '280px',
                          objectFit: 'cover',
                          filter: 'grayscale(10%)'
                        }}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(10px)',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: '#000'
                        }}
                      >
                        À LA UNE
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <Card.Title 
                        style={{
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#000',
                          marginBottom: '12px',
                          letterSpacing: '-0.01em',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        {program.title}
                      </Card.Title>
                      <Card.Text>
                        <div 
                          style={{
                            fontSize: '13px',
                            color: '#666',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <i className="bi bi-person me-2"></i>
                          {program.host}
                        </div>
                        <p 
                          style={{
                            fontSize: '14px',
                            color: '#888',
                            lineHeight: '1.6',
                            marginBottom: '20px'
                          }}
                        >
                          {program.description}
                        </p>
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge 
                          style={{
                            background: 'rgba(0,0,0,0.05)',
                            color: '#000',
                            fontWeight: '500',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '11px'
                          }}
                        >
                          {program.category}
                        </Badge>
                        <HoverLink
                          to={`/programs/${program.slug}`}
                          className="btn btn-sm"
                          baseStyle={{
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '500',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none'
                          }}
                          hoverStyle={{
                            background: '#333',
                            transform: 'translateY(-2px)'
                          }}
                        >
                          Découvrir
                        </HoverLink>
                      </div>
                    </Card.Body>
                  </HoverCard>
                </Col>
              ))}
            </Row>
            
            <Row className="mt-5">
              <Col className="text-center">
                <HoverLink
                  to="/programs"
                  baseStyle={{
                    display: 'inline-block',
                    background: 'transparent',
                    border: '1.5px solid #000',
                    color: '#000',
                    padding: '12px 32px',
                    fontWeight: '500',
                    borderRadius: '30px',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none'
                  }}
                  hoverStyle={{
                    background: '#000',
                    color: '#fff'
                  }}
                >
                  Tous les programmes
                </HoverLink>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Featured Episodes - Contenu existant... */}
      {/* Featured Podcasts - Contenu existant... */}
      {/* Call to Action - Contenu existant... */}
      {/* Stats Section - Contenu existant... */}

      {/* Call to Action - Section Minimaliste */}
      <section style={{ padding: '100px 0', background: '#000', color: '#fff' }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 
                className="mb-4" 
                style={{
                  fontSize: '3.5rem',
                  fontWeight: '300',
                  fontFamily: 'Cormorant Garamond, serif',
                  lineHeight: '1.2',
                  letterSpacing: '-0.03em'
                }}
              >
                Rejoignez notre univers sonore
              </h2>
              <p 
                className="mb-5" 
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  maxWidth: '600px',
                  margin: '0 auto 48px',
                  fontWeight: '400'
                }}
              >
                Découvrez nos programmes live, nos épisodes exclusifs et notre collection 
                de podcasts soigneusement sélectionnés.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <HoverLink
                  to="/programs"
                  baseStyle={{
                    display: 'inline-block',
                    backgroundColor: '#fff',
                    color: '#000',
                    border: 'none',
                    fontWeight: '500',
                    padding: '14px 36px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  hoverStyle={{
                    backgroundColor: '#f0f0f0',
                    transform: 'translateY(-2px)'
                  }}
                >
                  <i className="bi bi-calendar3 me-2"></i>
                  Voir la programmation
                </HoverLink>
                <HoverLink
                  to="/about"
                  baseStyle={{
                    display: 'inline-block',
                    backgroundColor: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    color: '#fff',
                    padding: '14px 36px',
                    fontWeight: '500',
                    borderRadius: '30px',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  hoverStyle={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  À propos
                </HoverLink>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section - Design Épuré */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <Container>
          <Row className="g-5">
            <Col md={3} className="text-center">
              <div>
                <h3 
                  className="mb-2" 
                  style={{ 
                    fontSize: '3rem',
                    fontWeight: '300',
                    color: '#000',
                    fontFamily: 'Cormorant Garamond, serif'
                  }}
                >
                  24/7
                </h3>
                <p 
                  style={{ 
                    color: '#666',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                  }}
                >
                  Diffusion continue
                </p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div>
                <h3 
                  className="mb-2" 
                  style={{ 
                    fontSize: '3rem',
                    fontWeight: '300',
                    color: '#000',
                    fontFamily: 'Cormorant Garamond, serif'
                  }}
                >
                  50k+
                </h3>
                <p 
                  style={{ 
                    color: '#666',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                  }}
                >
                  Auditeurs actifs
                </p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div>
                <h3 
                  className="mb-2" 
                  style={{ 
                    fontSize: '3rem',
                    fontWeight: '300',
                    color: '#000',
                    fontFamily: 'Cormorant Garamond, serif'
                  }}
                >
                  1000+
                </h3>
                <p 
                  style={{ 
                    color: '#666',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                  }}
                >
                  Épisodes
                </p>
              </div>
            </Col>
            <Col md={3} className="text-center">
              <div>
                <h3 
                  className="mb-2" 
                  style={{ 
                    fontSize: '3rem',
                    fontWeight: '300',
                    color: '#000',
                    fontFamily: 'Cormorant Garamond, serif'
                  }}
                >
                  {playHistory.length}+
                </h3>
                <p 
                  style={{ 
                    color: '#666',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                  }}
                >
                  Titres joués
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;


// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';
// import AudioPlayer from '../components/AudioPlayer';

// // ========================================
// // COMPOSANTS RÉUTILISABLES
// // ========================================

// const HoverCard = ({ children, className = '', style = {} }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Card 
//       className={className}
//       style={{
//         ...style,
//         transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
//         boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.5)' : 'none',
//         transition: 'all 0.3s ease'
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {children}
//     </Card>
//   );
// };

// const HoverButton = ({ children, baseStyle, hoverStyle, ...props }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Button
//       {...props}
//       style={isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {children}
//     </Button>
//   );
// };

// const HoverLink = ({ children, baseStyle, hoverStyle, ...props }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <Link
//       {...props}
//       style={isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {children}
//     </Link>
//   );
// };

// const PlaylistItem = ({ track, index, currentTrack, isPlaying, onPlay }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const isCurrentTrack = currentTrack?.id === track.id;

//   return (
//     <div 
//       className="d-flex align-items-center p-2 mb-2 rounded"
//       style={{
//         background: isCurrentTrack ? 'rgba(0,255,136,0.2)' : 
//                    isHovered ? 'rgba(255,255,255,0.1)' : 
//                    'rgba(255,255,255,0.05)',
//         border: isCurrentTrack ? '1px solid rgba(0,255,136,0.5)' : '1px solid transparent',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease'
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="me-2 text-white fw-bold" style={{ minWidth: '25px', fontSize: '12px' }}>
//         {String(index + 1).padStart(2, '0')}
//       </div>
      
//       <button
//         className="btn btn-sm me-3"
//         style={{
//           background: isCurrentTrack && isPlaying ? '#ff4444' : '#00ff88',
//           border: 'none',
//           color: isCurrentTrack && isPlaying ? 'white' : 'black',
//           borderRadius: '50%',
//           width: '30px',
//           height: '30px',
//           minWidth: '30px'
//         }}
//         onClick={() => onPlay(track)}
//       >
//         <i className={`bi ${isCurrentTrack && isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`} 
//            style={{ fontSize: '12px' }}></i>
//       </button>
      
//       <div className="flex-grow-1 min-width-0">
//         <div className="text-white fw-bold text-truncate" style={{ fontSize: '14px' }}>
//           {track.title}
//         </div>
//         <div className="text-light opacity-75 text-truncate" style={{ fontSize: '12px' }}>
//           {track.artist}
//         </div>
//       </div>
      
//       <div className="text-light opacity-75" style={{ fontSize: '12px' }}>
//         {track.duration}
//       </div>
//     </div>
//   );
// };

// // ========================================
// // COMPOSANT PRINCIPAL
// // ========================================

// const Home = () => {
//   const { t } = useTranslation();
//   const { 
//     currentProgram, 
//     nextProgram, 
//     getActivePrograms, 
//     getEpisodes, 
//     getPodcasts 
//   } = useRadio();
  
//   // États pour le contenu featured
//   const [featuredPrograms, setFeaturedPrograms] = useState([]);
//   const [featuredEpisodes, setFeaturedEpisodes] = useState([]);
//   const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // État pour le carrousel de DJ
//   const [currentDJIndex, setCurrentDJIndex] = useState(0);
//   const heroImages = [
//     '/images/programs/ROOTS-RADIO-DEDICACE.PNG',
//     '/images/programs/top-20-africa.jpg',
//     '/images/programs/Selflist-By-Roman-Peter.PNG',
//     '/images/programs/Selflist-By-Martins.PNG',
//     '/images/programs/SUMMER-MIX-DJ-MATHIAS.PNG',
//     '/images/programs/Selflist-By-DJ-ZOUMANTO.PNG',
//     '/images/programs/Selflist-By-Eno-on-the-trck.PNG',
//     '/images/programs/Selflist-By-KIng-Arthur.PNG',
//     '/images/programs/Selflist-By-Le-Joker.PNG',
//     '/images/programs/selflist.PNG',
//     '/images/programs/Selflist-By DJ-BDK.PNG',
//     '/images/programs/SELF-LIST-BY.PNG',
//     '/images/programs/Selflist-By-Dashor.PNG',
//   ];

//   // État pour la playlist
//   const [playlist] = useState([
//     { id: 1, title: 'SABRINA_MARTIN', artist: 'Sabrina', src: '/music/sabrina/SAINTTROPEZ.mp3', duration:'3:45' },
//     { id: 2, title: 'A MINUTE', artist: 'Sabrina', src: '/music/sabrina/A_MINUTE.mp3', duration: '4:12' },
//     { id: 3, title: 'AGILITY', artist: 'Sabrina', src: '/music/sabrina/AGILITY.mp3', duration: '3:28' },
//     { id: 4, title: 'ALONE', artist: 'Sabrina', src: '/music/sabrina/ALONE.mp3', duration: '4:05' },
//     { id: 5, title: 'DONT CALL ME', artist: 'Sabrina', src: '/music/sabrina/DONT_CALL_ME.mp3', duration: '3:52' },
//     { id: 6, title: 'FARAWAY', artist: 'Sabrina', src: '/music/sabrina/FARAWAY.mp3', duration: '4:05' },
//     { id: 7, title: 'JEJELY', artist: 'Sabrina', src: '/music/sabrina/JEJELY.mp3', duration: '4:05' },
//     { id: 8, title: 'LOSE', artist: 'Sabrina', src: '/music/sabrina/LOSE.mp3', duration: '4:05' },
//     { id: 9, title: 'MY AFRICA', artist: 'Sabrina', src: '/music/sabrina/MY_AFRICA.mp3', duration: '4:05' },
//     { id: 10, title: 'ONLY ONE', artist: 'Sabrina', src: '/music/sabrina/ONLY_ONE.mp3', duration: '4:05' },
//     { id: 11, title: 'PAPARAZZI', artist: 'Sabrina', src: '/music/sabrina/PAPARAZZI.mp3', duration: '4:05' },
//     { id: 12, title: 'PEACE OF MIND', artist: 'Sabrina', src: '/music/sabrina/PEACE_OF_MIND.mp3', duration: '4:05' },
//     { id: 13, title: 'RIDE OR DIE', artist: 'Sabrina', src: '/music/sabrina/RIDE_OR_DIE.mp3', duration: '4:05' },
//   ]);
  
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);

//   // ========================================
//   // EFFETS (useEffect)
//   // ========================================

//   // Initialisation de l'audio
//   useEffect(() => {
//     audioRef.current = new Audio();
    
//     const handleTrackEnd = () => {
//       setIsPlaying(false);
//       setCurrentTrack(null);
//     };

//     audioRef.current.addEventListener('ended', handleTrackEnd);
    
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.removeEventListener('ended', handleTrackEnd);
//         audioRef.current.pause();
//         audioRef.current.src = '';
//         audioRef.current = null;
//       }
//     };
//   }, []);

//   // Chargement du contenu featured
//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       setLoading(true);
//       try {
//         const programs = await getActivePrograms();
//         const featured = programs.filter(p => p.featured).slice(0, 3);
//         setFeaturedPrograms(featured);

//         const episodesData = await getEpisodes({ featured: true, limit: 3 });
//         setFeaturedEpisodes(episodesData.episodes || []);

//         const podcastsData = await getPodcasts({ featured: true, limit: 3 });
//         setFeaturedPodcasts(podcastsData.podcasts || []);
//       } catch (error) {
//         console.error('Failed to fetch featured content:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedContent();
//   }, [getActivePrograms, getEpisodes, getPodcasts]);

//   // Carrousel automatique pour les photos de DJ
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDJIndex((prevIndex) => 
//         prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [heroImages.length]);

//   // ========================================
//   // FONCTIONS HANDLERS
//   // ========================================

//   const playTrack = (track) => {
//     if (!audioRef.current) return;

//     if (currentTrack && currentTrack.id === track.id && isPlaying) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       if (currentTrack && currentTrack.id !== track.id) {
//         audioRef.current.pause();
//       }
//       audioRef.current.src = track.src;
//       audioRef.current.play().catch(console.error);
//       setCurrentTrack(track);
//       setIsPlaying(true);
//     }
//   };

//   // ========================================
//   // RENDER
//   // ========================================

//   return (
//     <div className="home-page" style={{ 
//       backgroundColor: 'white',
//       //  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
//       minHeight: '100vh',
//       color: 'black',
//       paddingBottom: '10px'
//     }}>
//       {/* Fixed Audio Player Bar */}
//       <div 
//         className="fixed-bottom" 
//         style={{ 
          
//           // background: 'linear-gradient(to right, rgba(139, 69, 19, 0.95), rgba(160, 82, 45, 0.95))',
//           borderTop: '1px solid rgba(255,255,255,0.2)',
//           backdropFilter: 'blur(10px)',
//           zIndex: 1000,
//           height: '80px'
//         }}
//       >
//         <Container fluid className="h-100">
//           <div className="d-flex align-items-center justify-content-between h-100 px-3">
//             <div className="d-flex align-items-center">
//               <div 
//                 className="px-3 py-1 rounded-pill me-3 text-white fw-bold"
//                 style={{ 
//                   background: '#ff4444',
//                   fontSize: '12px'
//                 }}
//               >
//                 ON AIR
//               </div>
              
//               {currentProgram && (
//                 <div className="d-flex align-items-center">
//                   <img
//                     src={currentProgram.image || '/uploads/placeholder-program.jpg'}
//                     alt={currentProgram.title}
//                     className="rounded me-3"
//                     style={{ 
//                       width: '50px', 
//                       height: '50px', 
//                       objectFit: 'cover'
//                     }}
//                   />
//                   <div>
//                     <h6 className="mb-0 text-white fw-bold" style={{fontSize: '14px'}}>
//                       {currentProgram.title}
//                     </h6>
//                     <small className="text-light opacity-75">
//                       {currentProgram.host}
//                     </small>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="d-flex align-items-center justify-content-center flex-grow-1 mx-4">
//               <AudioPlayer />
//             </div>
            
//             <div className="d-flex align-items-center">
//               <button 
//                 className="btn btn-link text-white p-2"
//                 style={{ fontSize: '20px' }}
//               >
//                 <i className="bi bi-volume-up"></i>
//               </button>
//               <button 
//                 className="btn btn-link text-white p-2"
//                 style={{ fontSize: '18px' }}
//               >
//                 <i className="bi bi-three-dots"></i>
//               </button>
//             </div>
//           </div>
//         </Container>
//       </div>

//       {/* Hero Section with DJ Carousel and Playlist */}
//       <section className="py-5" style={{ 
//       minWidth: '1100px'
//         // background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//       }}>
//         <Container>
//           <Row 
//           style={{
//               // display: 'grid',
//               // alignItems: 'center',
//               // justifyContent: 'center'
              
//             }}
//           >
//             {/* DJ Carousel Section */}
//             <Col lg={7} className="mb-4 mb-lg-0"
            
//             >
//               <div className="h-100 rounded shadow-lg position-relative overflow-hidden" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)',
//                 minHeight: '700px',
//                 minWidth: '1100px',
//               }}>
//                 {/* Carrousel Background */}
//                 <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
//                   {heroImages.map((photo, index) => (
//                     <div
//                       key={index}
//                       className="position-absolute w-100 h-100"
//                       style={{
//                         backgroundImage: `url(${photo})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                         opacity: index === currentDJIndex ? 1 : 0,
//                         transition: 'opacity 1s ease-in-out',
//                         filter: 'brightness(0.6)'
//                       }}
//                     />
//                   ))}


                  
//                           <div className="p-4 h-100 rounded shadow-lg" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)',
//                 minHeight: '200px',
//                 marginLeft: '400px',
//                 alignContent: 'left',
//                 justifyContent: 'center'
//               }}>
//                 <h4 className="mb-3 text-white">
//                   <i className="bi bi-music-note-list me-2" style={{color: '#00ff88'}}></i>
//                   Playlist du Moment
//                 </h4>
                
//                 <div className="playlist-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
//                   {playlist.map((track, index) => (
//                     <PlaylistItem
//                       key={track.id}
//                       track={track}
//                       index={index}
//                       currentTrack={currentTrack}
//                       isPlaying={isPlaying}
//                       onPlay={playTrack}
//                     />
//                   ))}
//                 </div>
                
//                 <div className="mt-3 pt-3 border-top border-secondary">
//                   <div className="d-flex justify-content-center gap-2">
//                     <button className="btn btn-sm" style={{
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       color: 'white'
//                     }}>
//                       <i className="bi bi-shuffle"></i>
//                     </button>
//                     <button className="btn btn-sm" style={{
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       color: 'white'
//                     }}>
//                       <i className="bi bi-arrow-repeat"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>


//                 </div>

//                 {/* Overlay Content */}
//                 <div className="position-absolute w-100 h-100 p-4 d-flex flex-column justify-content-between" style={{ zIndex: 2 }}>
//                   <div>
//                     <h3 className="mb-3 text-white fw-bold">
//                       <i className="bi bi-broadcast-pin me-2" style={{color: '#ff4444'}}></i>
//                       Programme Actuel - DJ Live
//                     </h3>
//                   </div>

//                   <div className="mt-auto">
//                     <div className="p-3 rounded" style={{
//                       background: 'rgba(0,0,0,0.7)',
//                       backdropFilter: 'blur(10px)'
//                     }}>
//                       <div className="d-flex align-items-center justify-content-between mb-2">
//                         <div className="text-white">
//                           <h6 className="mb-0">En cours de diffusion</h6>
//                           <small className="text-light opacity-75">DJ Mix Live Session</small>
//                         </div>
//                         <div className="d-flex align-items-center gap-2">
//                           <button className="btn btn-sm" style={{
//                             background: '#ff4444',
//                             border: 'none',
//                             color: 'white',
//                             borderRadius: '50%',
//                             width: '40px',
//                             height: '40px'
//                           }}>
//                             <i className="bi bi-pause-fill"></i>
//                           </button>
//                         </div>
//                       </div>
                      
//                       <div className="progress mb-2" style={{ height: '4px' }}>
//                         <div 
//                           className="progress-bar bg-danger" 
//                           style={{ width: '45%' }}
//                         ></div>
//                       </div>
                      
//                       <div className="d-flex justify-content-between small text-light opacity-75">
//                         <span>2:34</span>
//                         <span>5:47</span>
//                       </div>

//                     </div>

//                   </div>
//                 </div>

//                 {/* Indicateurs du carrousel */}
//                 <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2" style={{ zIndex: 3 }}>
//                   <div className="d-flex gap-2">
//                     {heroImages.map((_, index) => (
//                       <button
//                         key={index}
//                         className="btn p-0"
//                         style={{
//                           width: '8px',
//                           height: '8px',
//                           borderRadius: '50%',
//                           background: index === currentDJIndex ? '#ff4444' : 'rgba(255,255,255,0.4)',
//                           border: 'none'
//                         }}
//                         onClick={() => setCurrentDJIndex(index)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//             </Col>
            
//             {/* Playlist Section */}
//             {/* <Col lg={5}>
//               <div className="p-4 h-100 rounded shadow-lg" style={{
//                 background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
//                 border: '1px solid rgba(255,255,255,0.1)',
//                 backdropFilter: 'blur(10px)',
//                 minHeight: '400px'
//               }}>
//                 <h4 className="mb-3 text-white">
//                   <i className="bi bi-music-note-list me-2" style={{color: '#00ff88'}}></i>
//                   Playlist du Moment
//                 </h4>
                
//                 <div className="playlist-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
//                   {playlist.map((track, index) => (
//                     <PlaylistItem
//                       key={track.id}
//                       track={track}
//                       index={index}
//                       currentTrack={currentTrack}
//                       isPlaying={isPlaying}
//                       onPlay={playTrack}
//                     />
//                   ))}
//                 </div>
                
//                 <div className="mt-3 pt-3 border-top border-secondary">
//                   <div className="d-flex justify-content-center gap-2">
//                     <button className="btn btn-sm" style={{
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       color: 'white'
//                     }}>
//                       <i className="bi bi-shuffle"></i>
//                     </button>
//                     <button className="btn btn-sm" style={{
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       color: 'white'
//                     }}>
//                       <i className="bi bi-arrow-repeat"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Col> */}
//           </Row>
//         </Container>
//       </section>

//       {/* Featured Programs */}
//       {featuredPrograms.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-star-fill me-2" style={{color: '#ffcc00'}}></i>
//                   {t('programs')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPrograms.map((program) => (
//                 <Col md={4} key={program._id} className="mb-4">
//                   <HoverCard
//                     className="h-100"
//                     style={{
//                       background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                       border: '1px solid rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(10px)'
//                     }}
//                   >
//                     <Card.Img
//                       variant="top"
//                       src={program.image || '/uploads/placeholder-program.jpg'}
//                       alt={program.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{program.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-person me-1"></i>
//                           {program.host}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{program.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #666, #444)',
//                           color: 'white'
//                         }} className="me-2">
//                           {program.category}
//                         </Badge>
//                         <HoverLink
//                           to={`/programs/${program.slug}`}
//                           className="btn btn-sm"
//                           baseStyle={{
//                             background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                             color: 'black',
//                             border: 'none',
//                             fontWeight: 'bold',
//                             transition: 'all 0.3s ease'
//                           }}
//                           hoverStyle={{
//                             background: 'linear-gradient(45deg, #f0f0f0, #d0d0d0)'
//                           }}
//                         >
//                           Voir plus
//                         </HoverLink>
//                       </div>
//                     </Card.Body>
//                   </HoverCard>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <HoverLink
//                   to="/programs"
//                   className="btn"
//                   baseStyle={{
//                     background: 'transparent',
//                     border: '2px solid white',
//                     color: 'white',
//                     padding: '10px 30px',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                   hoverStyle={{
//                     background: 'white',
//                     color: 'black'
//                   }}
//                 >
//                   Voir tous les programmes
//                 </HoverLink>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Episodes */}
//       {featuredEpisodes.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-collection-play me-2" style={{color: '#4488ff'}}></i>
//                   {t('episodes')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredEpisodes.map((episode) => (
//                 <Col md={4} key={episode._id} className="mb-4">
//                   <HoverCard
//                     className="h-100"
//                     style={{
//                       background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                       border: '1px solid rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(10px)'
//                     }}
//                   >
//                     <Card.Img
//                       variant="top"
//                       src={episode.image || '/uploads/placeholder-episode.jpg'}
//                       alt={episode.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{episode.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-tv me-1"></i>
//                           {episode.programId?.title}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{episode.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto">
//                         <Badge style={{
//                           background: 'linear-gradient(45deg, #44aaff, #3388cc)',
//                           color: 'white'
//                         }} className="me-2">
//                           S{episode.season}E{episode.episodeNumber}
//                         </Badge>
//                         <Button size="sm" style={{
//                           background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                           color: 'black',
//                           border: 'none',
//                           fontWeight: 'bold'
//                         }}>
//                           <i className="bi bi-play-fill me-1"></i>
//                           Écouter
//                         </Button>
//                       </div>
//                     </Card.Body>
//                   </HoverCard>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <HoverLink
//                   to="/episodes"
//                   className="btn"
//                   baseStyle={{
//                     background: 'transparent',
//                     border: '2px solid white',
//                     color: 'white',
//                     padding: '10px 30px',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                   hoverStyle={{
//                     background: 'white',
//                     color: 'black'
//                   }}
//                 >
//                   Voir tous les épisodes
//                 </HoverLink>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Featured Podcasts */}
//       {featuredPodcasts.length > 0 && (
//         <section className="py-5" style={{
//           background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
//         }}>
//           <Container>
//             <Row className="mb-4">
//               <Col>
//                 <h2 className="text-center text-white">
//                   <i className="bi bi-headphones me-2" style={{color: '#00ff88'}}></i>
//                   {t('podcasts')} {t('featured')}
//                 </h2>
//               </Col>
//             </Row>
            
//             <Row>
//               {featuredPodcasts.map((podcast) => (
//                 <Col md={4} key={podcast._id} className="mb-4">
//                   <HoverCard
//                     className="h-100"
//                     style={{
//                       background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
//                       border: '1px solid rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(10px)'
//                     }}
//                   >
//                     <Card.Img
//                       variant="top"
//                       src={podcast.image || '/uploads/placeholder-podcast.jpg'}
//                       alt={podcast.title}
//                       style={{
//                         height: '200px',
//                         objectFit: 'cover',
//                         filter: 'brightness(0.9)'
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
//                       <Card.Title className="text-white">{podcast.title}</Card.Title>
//                       <Card.Text className="flex-grow-1">
//                         <small style={{color: '#ccc'}}>
//                           <i className="bi bi-person me-1"></i>
//                           {podcast.host}
//                         </small>
//                         <br />
//                         <span style={{color: '#bbb'}}>{podcast.description}</span>
//                       </Card.Text>
//                       <div className="mt-auto d-flex justify-content-between align-items-center">
//                         <div>
//                           <Badge style={{
//                             background: 'linear-gradient(45deg, #666, #444)',
//                             color: 'white'
//                           }} className="me-2">
//                             {podcast.category}
//                           </Badge>
//                         </div>
//                         <div>
//                           <small className="me-2" style={{color: '#ccc'}}>
//                             <i className="bi bi-download me-1"></i>
//                             {podcast.downloads || 0}
//                           </small>
//                           <Button size="sm" style={{
//                             background: 'linear-gradient(45deg, #00ff88, #00cc66)',
//                             color: 'black',
//                             border: 'none',
//                             fontWeight: 'bold'
//                           }}>
//                             <i className="bi bi-play-fill me-1"></i>
//                             Écouter
//                           </Button>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </HoverCard>
//                 </Col>
//               ))}
//             </Row>
            
//             <Row className="mt-4">
//               <Col className="text-center">
//                 <HoverLink
//                   to="/podcasts"
//                   className="btn"
//                   baseStyle={{
//                     background: 'transparent',
//                     border: '2px solid white',
//                     color: 'white',
//                     padding: '10px 30px',
//                     fontWeight: 'bold',
//                     transition: 'all 0.3s ease'
//                   }}
//                   hoverStyle={{
//                     background: 'white',
//                     color: 'black'
//                   }}
//                 >
//                   Voir tous les podcasts
//                 </HoverLink>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       )}

//       {/* Call to Action */}
//       <section className="py-5" style={{
//         background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.8))',
//         borderTop: '1px solid #333'
//       }}>
//         <Container>
//           <Row>
//             <Col lg={8} className="mx-auto text-center">
//               <h2 className="mb-3 text-white">
//                 Découvrez notre univers radiophonique
//               </h2>
//               <p className="lead mb-4" style={{color: '#ccc'}}>
//                 Plongez dans un monde de contenus audio exceptionnels avec nos programmes live, 
//                 épisodes exclusifs et podcasts à la demande. Une expérience d'écoute unique vous attend.
//               </p>
//               <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
//                 <HoverLink
//                   to="/programs"
//                   className="btn btn-lg"
//                   baseStyle={{
//                     background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
//                     color: 'black',
//                     border: 'none',
//                     fontWeight: 'bold',
//                     padding: '12px 30px'
//                   }}
//                   hoverStyle={{
//                     background: 'linear-gradient(45deg, #f0f0f0, #d0d0d0)'
//                   }}
//                 >
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Voir la grille
//                 </HoverLink>
//                 <HoverLink
//                   to="/about"
//                   className="btn btn-lg"
//                   baseStyle={{
//                     background: 'transparent',
//                     border: '2px solid white',
//                     color: 'white',
//                     padding: '12px 30px',
//                     fontWeight: 'bold'
//                   }}
//                   hoverStyle={{
//                     background: 'white',
//                     color: 'black'
//                   }}
//                 >
//                   <i className="bi bi-info-circle me-2"></i>
//                   En savoir plus
//                 </HoverLink>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Stats Section */}
//       <section className="py-5" style={{
//         background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
//       }}>
//         <Container>
//           <Row>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-broadcast fs-1 mb-2" style={{color: '#ff4444'}}></i>
//                 <h4 className="mb-1 text-white">24/7</h4>
//                 <p style={{color: '#ccc'}}>Diffusion continue</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-people fs-1 mb-2" style={{color: '#4488ff'}}></i>
//                 <h4 className="mb-1 text-white">50k+</h4>
//                 <p style={{color: '#ccc'}}>Auditeurs actifs</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center mb-4 mb-md-0">
//               <div className="p-3">
//                 <i className="bi bi-collection-play fs-1 mb-2" style={{color: '#00ff88'}}></i>
//                 <h4 className="mb-1 text-white">1000+</h4>
//                 <p style={{color: '#ccc'}}>Épisodes disponibles</p>
//               </div>
//             </Col>
//             <Col md={3} className="text-center">
//               <div className="p-3">
//                 <i className="bi bi-headphones fs-1 mb-2" style={{color: '#ffcc00'}}></i>
//                 <h4 className="mb-1 text-white">500+</h4>
//                 <p style={{color: '#ccc'}}>Podcasts exclusifs</p>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;