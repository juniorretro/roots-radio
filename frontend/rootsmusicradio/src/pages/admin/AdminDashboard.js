// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
// import { Link, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../../contexts/RadioContext';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// const AdminDashboard = () => {
//   const { t } = useTranslation();
//   const location = useLocation();
//   const { getProgramsStats, getEpisodesStats, getPodcastsStats } = useRadio();
  
//   const [stats, setStats] = useState({
//     programs: { total: 0, active: 0, featured: 0, categories: 0 },
//     episodes: { total: 0, featured: 0, totalDuration: 0 },
//     podcasts: { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 }
//   });
//   const [loading, setLoading] = useState(true);

//   // Sample data for charts
//   const weeklyData = [
//     { day: 'Lun', listeners: 1200, episodes: 15 },
//     { day: 'Mar', listeners: 1400, episodes: 18 },
//     { day: 'Mer', listeners: 1100, episodes: 12 },
//     { day: 'Jeu', listeners: 1600, episodes: 20 },
//     { day: 'Ven', listeners: 1800, episodes: 25 },
//     { day: 'Sam', listeners: 2200, episodes: 30 },
//     { day: 'Dim', listeners: 1900, episodes: 22 }
//   ];

//   const categoryData = [
//     { name: 'Actualité', value: 35, color: '#8884d8' },
//     { name: 'Musique', value: 25, color: '#82ca9d' },
//     { name: 'Technologie', value: 20, color: '#ffc658' },
//     { name: 'Culture', value: 15, color: '#ff7c7c' },
//     { name: 'Sport', value: 5, color: '#8dd1e1' }
//   ];

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     setLoading(true);
//     try {
//       const [programsStats, episodesStats, podcastsStats] = await Promise.all([
//         getProgramsStats(),
//         getEpisodesStats(),
//         getPodcastsStats()
//       ]);

//       setStats({
//         programs: programsStats,
//         episodes: episodesStats,
//         podcasts: podcastsStats
//       });
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="admin-dashboard">
//       <Container fluid>
//         <Row>
//           {/* Sidebar */}
//           <Col md={3} lg={2} className="admin-sidebar p-0">
//             <div className="p-3">
//               <h5 className="text-white mb-4">
//                 <i className="bi bi-gear me-2"></i>
//                 Administration
//               </h5>
              
//               <Nav className="flex-column">
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin" 
//                     className={isActive('/admin') ? 'active' : ''}
//                   >
//                     <i className="bi bi-speedometer2 me-2"></i>
//                     {t('dashboard')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/programs"
//                     className={isActive('/admin/programs') ? 'active' : ''}
//                   >
//                     <i className="bi bi-calendar3 me-2"></i>
//                     {t('programs')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/episodes"
//                     className={isActive('/admin/episodes') ? 'active' : ''}
//                   >
//                     <i className="bi bi-collection-play me-2"></i>
//                     {t('episodes')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/podcasts"
//                     className={isActive('/admin/podcasts') ? 'active' : ''}
//                   >
//                     <i className="bi bi-headphones me-2"></i>
//                     {t('podcasts')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/stats"
//                     className={isActive('/admin/stats') ? 'active' : ''}
//                   >
//                     <i className="bi bi-bar-chart me-2"></i>
//                     {t('stats')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                
//                 <Nav.Item>
//                   <Nav.Link as={Link} to="/">
//                     <i className="bi bi-house me-2"></i>
//                     Retour au site
//                   </Nav.Link>
//                 </Nav.Item>
//               </Nav>
//             </div>
//           </Col>
          
//           {/* Main Content */}
//           <Col md={9} lg={10} className="admin-content">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2>
//                 <i className="bi bi-speedometer2 me-2"></i>
//                 Tableau de bord
//               </h2>
//               <Button variant="outline-dark" onClick={fetchStats}>
//                 <i className="bi bi-arrow-clockwise me-2"></i>
//                 Actualiser
//               </Button>
//             </div>

//             {/* Stats Cards */}
//             <Row className="mb-4">
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-broadcast fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.programs.total}</div>
//                     <div className="stats-label">Programmes</div>
//                     <small className="opacity-75">
//                       {stats.programs.active} actifs
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-collection-play fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.episodes.total}</div>
//                     <div className="stats-label">Épisodes</div>
//                     <small className="opacity-75">
//                       {formatDuration(stats.episodes.totalDuration)}
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-headphones fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.podcasts.total}</div>
//                     <div className="stats-label">Podcasts</div>
//                     <small className="opacity-75">
//                       {stats.podcasts.totalDownloads} téléchargements
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-people fs-1 mb-3"></i>
//                     <div className="stats-number">2.5k</div>
//                     <div className="stats-label">Auditeurs</div>
//                     <small className="opacity-75">
//                       +12% cette semaine
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Charts Row */}
//             <Row className="mb-4">
//               <Col lg={8} className="mb-4">
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-graph-up me-2"></i>
//                       Audience hebdomadaire
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <LineChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line 
//                           type="monotone" 
//                           dataKey="listeners" 
//                           stroke="#8884d8" 
//                           strokeWidth={2}
//                           name="Auditeurs"
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col lg={4} className="mb-4">
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-pie-chart me-2"></i>
//                       Catégories
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <PieChart>
//                         <Pie
//                           data={categoryData}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, value }) => `${name}: ${value}%`}
//                         >
//                           {categoryData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Episodes per day */}
//             <Row className="mb-4">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-bar-chart me-2"></i>
//                       Épisodes diffusés par jour
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="episodes" fill="#82ca9d" name="Épisodes" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Quick Actions */}
//             <Row>
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-lightning me-2"></i>
//                       Actions rapides
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/programs" className="btn btn-outline-primary w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouveau Programme
//                         </Link>
//                       </Col>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/episodes" className="btn btn-outline-success w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouvel Épisode
//                         </Link>
//                       </Col>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/podcasts" className="btn btn-outline-info w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouveau Podcast
//                         </Link>
//                       </Col>
//                       <Col md={3}>
//                         <Button variant="outline-warning" className="w-100">
//                           <i className="bi bi-upload me-2"></i>
//                           Uploader des Fichiers
//                         </Button>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Recent Activity */}
//             <Row className="mt-4">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-clock-history me-2"></i>
//                       Activité récente
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <div className="timeline">
//                       <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
//                         <div className="bg-success rounded-circle p-2 me-3">
//                           <i className="bi bi-plus text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Nouveau programme créé</strong>
//                           <br />
//                           <small className="text-muted">Morning Show - Il y a 2 heures</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
//                         <div className="bg-primary rounded-circle p-2 me-3">
//                           <i className="bi bi-pencil text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Épisode modifié</strong>
//                           <br />
//                           <small className="text-muted">Jazz Lounge EP05 - Il y a 4 heures</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
//                         <div className="bg-info rounded-circle p-2 me-3">
//                           <i className="bi bi-download text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Podcast téléchargé</strong>
//                           <br />
//                           <small className="text-muted">Histoire de la Radio - Il y a 6 heures</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center">
//                         <div className="bg-warning rounded-circle p-2 me-3">
//                           <i className="bi bi-upload text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Fichier uploadé</strong>
//                           <br />
//                           <small className="text-muted">nouvelle-intro.mp3 - Il y a 8 heures</small>
//                         </div>
//                       </div>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default AdminDashboard;
// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
// import { Link, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../../contexts/RadioContext';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// const AdminDashboard = () => {
//   const { t } = useTranslation();
//   const location = useLocation();
//   const { getProgramsStats, getEpisodesStats, getPodcastsStats } = useRadio();
  
//   const [stats, setStats] = useState({
//     programs: { total: 0, active: 0, featured: 0, categories: 0 },
//     episodes: { total: 0, featured: 0, totalDuration: 0 },
//     podcasts: { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 }
//   });

//   // Sample data for charts
//   const weeklyData = [
//     { day: 'Lun', listeners: 1200, episodes: 15 },
//     { day: 'Mar', listeners: 1400, episodes: 18 },
//     { day: 'Mer', listeners: 1100, episodes: 12 },
//     { day: 'Jeu', listeners: 1600, episodes: 20 },
//     { day: 'Ven', listeners: 1800, episodes: 25 },
//     { day: 'Sam', listeners: 2200, episodes: 30 },
//     { day: 'Dim', listeners: 1900, episodes: 22 }
//   ];

//   const categoryData = [
//     { name: 'Actualité', value: 35, color: '#8884d8' },
//     { name: 'Musique', value: 25, color: '#82ca9d' },
//     { name: 'Technologie', value: 20, color: '#ffc658' },
//     { name: 'Culture', value: 15, color: '#ff7c7c' },
//     { name: 'Sport', value: 5, color: '#8dd1e1' }
//   ];

//   const fetchStats = useCallback(async () => {
//     try {
//       const [programsStats, episodesStats, podcastsStats] = await Promise.all([
//         getProgramsStats(),
//         getEpisodesStats(),
//         getPodcastsStats()
//       ]);

//       setStats({
//         programs: programsStats,
//         episodes: episodesStats,
//         podcasts: podcastsStats
//       });
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   }, [getProgramsStats, getEpisodesStats, getPodcastsStats]);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="admin-dashboard">
//       <Container fluid>
//         <Row>
//           {/* Sidebar */}
//           <Col md={3} lg={2} className="admin-sidebar p-0">
//             <div className="p-3">
//               <h5 className="text-white mb-4">
//                 <i className="bi bi-gear me-2"></i>
//                 Administration
//               </h5>
              
//               <Nav className="flex-column">
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin" 
//                     className={isActive('/admin') ? 'active' : ''}
//                   >
//                     <i className="bi bi-speedometer2 me-2"></i>
//                     {t('dashboard')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/programs"
//                     className={isActive('/admin/programs') ? 'active' : ''}
//                   >
//                     <i className="bi bi-calendar3 me-2"></i>
//                     {t('programs')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/episodes"
//                     className={isActive('/admin/episodes') ? 'active' : ''}
//                   >
//                     <i className="bi bi-collection-play me-2"></i>
//                     {t('episodes')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/podcasts"
//                     className={isActive('/admin/podcasts') ? 'active' : ''}
//                   >
//                     <i className="bi bi-headphones me-2"></i>
//                     {t('podcasts')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/stats"
//                     className={isActive('/admin/stats') ? 'active' : ''}
//                   >
//                     <i className="bi bi-bar-chart me-2"></i>
//                     {t('stats')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                
//                 <Nav.Item>
//                   <Nav.Link as={Link} to="/">
//                     <i className="bi bi-house me-2"></i>
//                     Retour au site
//                   </Nav.Link>
//                 </Nav.Item>
//               </Nav>
//             </div>
//           </Col>
          
//           {/* Main Content */}
//           <Col md={9} lg={10} className="admin-content">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2>
//                 <i className="bi bi-speedometer2 me-2"></i>
//                 Tableau de bord
//               </h2>
//               <Button variant="outline-dark" onClick={fetchStats}>
//                 <i className="bi bi-arrow-clockwise me-2"></i>
//                 Actualiser
//               </Button>
//             </div>

//             {/* Stats Cards */}
//             <Row className="mb-4">
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-broadcast fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.programs.total}</div>
//                     <div className="stats-label">Programmes</div>
//                     <small className="opacity-75">
//                       {stats.programs.active} actifs
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-collection-play fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.episodes.total}</div>
//                     <div className="stats-label">Épisodes</div>
//                     <small className="opacity-75">
//                       {formatDuration(stats.episodes.totalDuration)}
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-headphones fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.podcasts.total}</div>
//                     <div className="stats-label">Podcasts</div>
//                     <small className="opacity-75">
//                       {stats.podcasts.totalDownloads} téléchargements
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-people fs-1 mb-3"></i>
//                     <div className="stats-number">2.5k</div>
//                     <div className="stats-label">Auditeurs</div>
//                     <small className="opacity-75">
//                       +12% cette semaine
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Charts Row */}
//             <Row className="mb-4">
//               <Col lg={8} className="mb-4">
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-graph-up me-2"></i>
//                       Audience hebdomadaire
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <LineChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line 
//                           type="monotone" 
//                           dataKey="listeners" 
//                           stroke="#8884d8" 
//                           strokeWidth={2}
//                           name="Auditeurs"
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col lg={4} className="mb-4">
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-pie-chart me-2"></i>
//                       Catégories
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <PieChart>
//                         <Pie
//                           data={categoryData}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, value }) => `${name}: ${value}%`}
//                         >
//                           {categoryData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Episodes per day */}
//             <Row className="mb-4">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-bar-chart me-2"></i>
//                       Épisodes diffusés par jour
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="episodes" fill="#82ca9d" name="Épisodes" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Quick Actions */}
//             <Row>
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-lightning me-2"></i>
//                       Actions rapides
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/programs" className="btn btn-outline-primary w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouveau Programme
//                         </Link>
//                       </Col>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/episodes" className="btn btn-outline-success w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouvel Épisode
//                         </Link>
//                       </Col>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/podcasts" className="btn btn-outline-info w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouveau Podcast
//                         </Link>
//                       </Col>
//                       <Col md={3}>
//                         <Button variant="outline-warning" className="w-100">
//                           <i className="bi bi-upload me-2"></i>
//                           Uploader des Fichiers
//                         </Button>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Recent Activity */}
//             <Row className="mt-4">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-clock-history me-2"></i>
//                       Activité récente
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <div className="timeline">
//                       <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
//                         <div className="bg-success rounded-circle p-2 me-3">
//                           <i className="bi bi-plus text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Nouveau programme créé</strong>
//                           <br />
//                           <small className="text-muted">Morning Show - Il y a 2 heures</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
//                         <div className="bg-primary rounded-circle p-2 me-3">
//                           <i className="bi bi-pencil text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Épisode modifié</strong>
//                           <br />
//                           <small className="text-muted">Jazz Lounge EP05 - Il y a 4 heures</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
//                         <div className="bg-info rounded-circle p-2 me-3">
//                           <i className="bi bi-download text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Podcast téléchargé</strong>
//                           <br />
//                           <small className="text-muted">Histoire de la Radio - Il y a 6 heures</small>
//                         </div>
//                       </div>
                      
//                       <div className="d-flex align-items-center">
//                         <div className="bg-warning rounded-circle p-2 me-3">
//                           <i className="bi bi-upload text-white"></i>
//                         </div>
//                         <div>
//                           <strong>Fichier uploadé</strong>
//                           <br />
//                           <small className="text-muted">nouvelle-intro.mp3 - Il y a 8 heures</small>
//                         </div>
//                       </div>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// // export default AdminDashboard;
// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Nav, Button, Modal, Form, Spinner } from 'react-bootstrap';
// import { Link, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../../contexts/RadioContext';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// const AdminDashboard = () => {
//   const { t } = useTranslation();
//   const location = useLocation();
//   const { getProgramsStats, getEpisodesStats, getPodcastsStats } = useRadio();
  
//   // États pour les statistiques
//   const [stats, setStats] = useState({
//     programs: { total: 0, active: 0, featured: 0, categories: 0 },
//     episodes: { total: 0, featured: 0, totalDuration: 0 },
//     podcasts: { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 }
//   });

//   // États pour l'upload modal
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadResult, setUploadResult] = useState(null);

//   // États pour les données des graphiques (données réelles)
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Gestion des fichiers
//   const handleFileChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
    
//     // Validation de taille (50MB pour correspondre au backend)
//     const maxSizeMB = 50;
//     if (f.size > maxSizeMB * 1024 * 1024) { 
//       alert(`Fichier trop volumineux (max ${maxSizeMB}MB)`); 
//       return; 
//     }
    
//     // Validation du type de fichier selon votre backend
//     const allowedTypes = /\.(jpeg|jpg|png|gif|webp|mp3|wav|ogg|m4a)$/i;
//     if (!allowedTypes.test(f.name)) {
//       alert('Types de fichiers autorisés: JPEG, JPG, PNG, GIF, WebP, MP3, WAV, OGG, M4A');
//       return;
//     }
    
//     setSelectedFile(f);
//     setUploadResult(null);
//   };

//   const uploadFile = async (file) => {
//     if (!file) return null;
//     const fd = new FormData();
//     fd.append('file', file);
//     setUploading(true);
    
//     try {
//       console.log('📤 Début upload:', file.name, file.size, 'bytes');
      
//       const res = await fetch('/api/upload', { 
//         method: 'POST', 
//         body: fd,
//         headers: {
//           // Ne pas définir Content-Type, laissez le navigateur le faire automatiquement pour FormData
//         }
//       });
      
//       console.log('📡 Réponse serveur:', res.status, res.statusText);
      
//       if (!res.ok) {
//         let errorMessage = 'Erreur inconnue';
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || `Erreur HTTP ${res.status}`;
//           console.error('❌ Erreur serveur:', errorData);
//         } catch (e) {
//           errorMessage = `Erreur HTTP ${res.status}: ${res.statusText}`;
//           console.error('❌ Impossible de parser la réponse d\'erreur');
//         }
//         throw new Error(errorMessage);
//       }
      
//       const data = await res.json();
//       console.log('✅ Upload réussi:', data);
      
//       setUploading(false);
      
//       if (!data || !data.success) {
//         throw new Error(data?.message || 'Réponse invalide du serveur');
//       }
      
//       // Gestion de la nouvelle structure de réponse
//       if (data.data && data.data.url) return data.data.url;
//       if (data.data && data.data.filename) return `/uploads/${data.data.filename}`;
      
//       return null;
//     } catch (err) {
//       setUploading(false);
//       console.error('❌ Upload error:', err);
      
//       // Messages d'erreur plus spécifiques
//       if (err.message === 'Failed to fetch') {
//         throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
//       }
//       if (err.name === 'TypeError' && err.message.includes('fetch')) {
//         throw new Error('Erreur de réseau. Vérifiez votre connexion internet.');
//       }
      
//       throw err;
//     }
//   };

//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) { 
//       alert('Sélectionnez un fichier.'); 
//       return; 
//     }
    
//     try {
//       const url = await uploadFile(selectedFile);
//       setUploadResult(url ? `Upload réussi: ${url}` : 'Échec de l\'upload');
      
//       if (url) {
//         // Rafraîchir l'activité récente après upload
//         fetchRecentActivity();
//         setSelectedFile(null);
//         // Fermer le modal après succès
//         setTimeout(() => {
//           setShowUploadModal(false);
//           setUploadResult(null);
//         }, 2000);
//       }
//     } catch (error) {
//       setUploadResult(`Erreur: ${error.message}`);
//     }
//   };

//   // Récupération des statistiques réelles
//   const fetchStats = useCallback(async () => {
//     try {
//       const [programsStats, episodesStats, podcastsStats] = await Promise.all([
//         getProgramsStats(),
//         getEpisodesStats(),
//         getPodcastsStats()
//       ]);

//       setStats({
//         programs: programsStats,
//         episodes: episodesStats,
//         podcasts: podcastsStats
//       });
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//       // Données par défaut en cas d'erreur
//       setStats({
//         programs: { total: 12, active: 8, featured: 3, categories: 5 },
//         episodes: { total: 245, featured: 15, totalDuration: 892800 },
//         podcasts: { total: 67, featured: 8, totalDownloads: 15420, totalLikes: 3240 }
//       });
//     }
//   }, [getProgramsStats, getEpisodesStats, getPodcastsStats]);

//   // Récupération des données hebdomadaires
//   const fetchWeeklyData = useCallback(async () => {
//     try {
//       // Remplacer par votre API réelle
//       const response = await fetch('/api/stats/weekly');
//       if (response.ok) {
//         const data = await response.json();
//         setWeeklyData(data);
//       } else {
//         throw new Error('API non disponible');
//       }
//     } catch (error) {
//       console.log('Utilisation de données simulées pour les graphiques');
//       // Génération de données réalistes basées sur les stats actuelles
//       const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
//       const baseListeners = 1200;
//       const baseEpisodes = 15;
      
//       setWeeklyData(days.map(day => ({
//         day,
//         listeners: baseListeners + Math.floor(Math.random() * 800),
//         episodes: baseEpisodes + Math.floor(Math.random() * 15)
//       })));
//     }
//   }, []);

//   // Récupération des données de catégories
//   const fetchCategoryData = useCallback(async () => {
//     try {
//       const response = await fetch('/api/stats/categories');
//       if (response.ok) {
//         const data = await response.json();
//         setCategoryData(data);
//       } else {
//         throw new Error('API non disponible');
//       }
//     } catch (error) {
//       // Données par défaut réalistes
//       setCategoryData([
//         { name: 'Actualité', value: 35, color: '#8884d8' },
//         { name: 'Musique', value: 25, color: '#82ca9d' },
//         { name: 'Technologie', value: 20, color: '#ffc658' },
//         { name: 'Culture', value: 15, color: '#ff7c7c' },
//         { name: 'Sport', value: 5, color: '#8dd1e1' }
//       ]);
//     }
//   }, []);

//   // Récupération de l'activité récente
//   const fetchRecentActivity = useCallback(async () => {
//     try {
//       const response = await fetch('/api/activity/recent');
//       if (response.ok) {
//         const data = await response.json();
//         setRecentActivity(data);
//       } else {
//         throw new Error('API non disponible');
//       }
//     } catch (error) {
//       // Activité simulée réaliste
//       const activities = [
//         {
//           type: 'program',
//           action: 'created',
//           title: 'Morning Show',
//           time: 'Il y a 2 heures',
//           icon: 'plus',
//           color: 'success'
//         },
//         {
//           type: 'episode',
//           action: 'modified',
//           title: 'Jazz Lounge EP05',
//           time: 'Il y a 4 heures',
//           icon: 'pencil',
//           color: 'primary'
//         },
//         {
//           type: 'podcast',
//           action: 'downloaded',
//           title: 'Histoire de la Radio',
//           time: 'Il y a 6 heures',
//           icon: 'download',
//           color: 'info'
//         },
//         {
//           type: 'file',
//           action: 'uploaded',
//           title: 'nouvelle-intro.mp3',
//           time: 'Il y a 8 heures',
//           icon: 'upload',
//           color: 'warning'
//         }
//       ];
//       setRecentActivity(activities);
//     }
//   }, []);

//   // Chargement initial de toutes les données
//   const fetchAllData = useCallback(async () => {
//     setLoading(true);
//     await Promise.all([
//       fetchStats(),
//       fetchWeeklyData(),
//       fetchCategoryData(),
//       fetchRecentActivity()
//     ]);
//     setLoading(false);
//   }, [fetchStats, fetchWeeklyData, fetchCategoryData, fetchRecentActivity]);

//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);

//   // Utilitaires
//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const isActive = (path) => location.pathname === path;

//   const getActivityText = (activity) => {
//     const actions = {
//       created: 'créé',
//       modified: 'modifié',
//       downloaded: 'téléchargé',
//       uploaded: 'uploadé'
//     };
    
//     const types = {
//       program: 'Programme',
//       episode: 'Épisode',
//       podcast: 'Podcast',
//       file: 'Fichier'
//     };

//     return `${types[activity.type]} ${actions[activity.action]}`;
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Chargement...</span>
//         </Spinner>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-dashboard">
//       <Container fluid>
//         <Row>
//           {/* Sidebar */}
//           <Col md={3} lg={2} className="admin-sidebar p-0">
//             <div className="p-3">
//               <h5 className="text-white mb-4">
//                 <i className="bi bi-gear me-2"></i>
//                 Administration
//               </h5>
              
//               <Nav className="flex-column">
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin" 
//                     className={isActive('/admin') ? 'active' : ''}
//                   >
//                     <i className="bi bi-speedometer2 me-2"></i>
//                     {t('dashboard')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/programs"
//                     className={isActive('/admin/programs') ? 'active' : ''}
//                   >
//                     <i className="bi bi-calendar3 me-2"></i>
//                     {t('programs')}
//                   </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//              <Nav.Link as={Link} to="/admin/affiches" className={isActive('/admin/affiches') ? 'active' : ''}>
//               <i className="bi bi-images me-2"></i>
//                Affiches
//          </Nav.Link>
//             </Nav.Item>
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/episodes"
//                     className={isActive('/admin/episodes') ? 'active' : ''}
//                   >
//                     <i className="bi bi-collection-play me-2"></i>
//                     {t('episodes')}
//                   </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//               <Nav.Link as={Link} to="/admin/emissions" className={isActive('/admin/emissions') ? 'active' : ''}>
//                   <i className="bi bi-broadcast me-2"></i>
//                       Émissions
//             </Nav.Link>
//               </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/podcasts"
//                     className={isActive('/admin/podcasts') ? 'active' : ''}
//                   >
//                     <i className="bi bi-headphones me-2"></i>
//                     {t('podcasts')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <Nav.Item>
//                   <Nav.Link 
//                     as={Link} 
//                     to="/admin/stats"
//                     className={isActive('/admin/stats') ? 'active' : ''}
//                   >
//                     <i className="bi bi-bar-chart me-2"></i>
//                     {t('stats')}
//                   </Nav.Link>
//                 </Nav.Item>
                
//                 <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                
//                 <Nav.Item>
//                   <Nav.Link as={Link} to="/">
//                     <i className="bi bi-house me-2"></i>
//                     Retour au site
//                   </Nav.Link>
//                 </Nav.Item>
//               </Nav>
//             </div>
//           </Col>
          
//           {/* Main Content */}
//           <Col md={9} lg={10} className="admin-content">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2>
//                 <i className="bi bi-speedometer2 me-2"></i>
//                 Tableau de bord
//               </h2>
//               <div>
//                 <Button variant="outline-dark" className="me-2" onClick={fetchAllData}>
//                   <i className="bi bi-arrow-clockwise me-2"></i>
//                   Actualiser
//                 </Button>
//                 <Button variant="outline-warning" onClick={() => setShowUploadModal(true)}>
//                   <i className="bi bi-upload me-2"></i>
//                   Uploader des Fichiers
//                 </Button>
//               </div>
//             </div>

//             {/* Stats Cards */}
//             <Row className="mb-4">
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-broadcast fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.programs.total}</div>
//                     <div className="stats-label">Programmes</div>
//                     <small className="opacity-75">
//                       {stats.programs.active} actifs
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-collection-play fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.episodes.total}</div>
//                     <div className="stats-label">Épisodes</div>
//                     <small className="opacity-75">
//                       {formatDuration(stats.episodes.totalDuration)}
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-headphones fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.podcasts.total}</div>
//                     <div className="stats-label">Podcasts</div>
//                     <small className="opacity-75">
//                       {stats.podcasts.totalDownloads} téléchargements
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col md={3} className="mb-3">
//                 <Card className="stats-card h-100">
//                   <Card.Body className="text-center">
//                     <i className="bi bi-people fs-1 mb-3"></i>
//                     <div className="stats-number">{stats.podcasts.totalLikes}</div>
//                     <div className="stats-label">J'aime</div>
//                     <small className="opacity-75">
//                       +12% cette semaine
//                     </small>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Charts Row */}
//             <Row className="mb-4">
//               <Col lg={8} className="mb-4">
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-graph-up me-2"></i>
//                       Audience hebdomadaire
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <LineChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line 
//                           type="monotone" 
//                           dataKey="listeners" 
//                           stroke="#8884d8" 
//                           strokeWidth={2}
//                           name="Auditeurs"
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
              
//               <Col lg={4} className="mb-4">
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-pie-chart me-2"></i>
//                       Catégories
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <PieChart>
//                         <Pie
//                           data={categoryData}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, value }) => `${name}: ${value}%`}
//                         >
//                           {categoryData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Episodes per day */}
//             <Row className="mb-4">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-bar-chart me-2"></i>
//                       Épisodes diffusés par jour
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={weeklyData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="day" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="episodes" fill="#82ca9d" name="Épisodes" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Quick Actions */}
//             <Row>
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-lightning me-2"></i>
//                       Actions rapides
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/programs" className="btn btn-outline-primary w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouveau Programme
//                         </Link>
//                       </Col>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/episodes" className="btn btn-outline-success w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouvel Épisode
//                         </Link>
//                       </Col>
//                       <Col md={3} className="mb-3 mb-md-0">
//                         <Link to="/admin/podcasts" className="btn btn-outline-info w-100">
//                           <i className="bi bi-plus-circle me-2"></i>
//                           Nouveau Podcast
//                         </Link>
//                       </Col>
//                       <Col md={3}>
//                         <Button 
//                           variant="outline-warning" 
//                           className="w-100"
//                           onClick={() => setShowUploadModal(true)}
//                         >
//                           <i className="bi bi-upload me-2"></i>
//                           Uploader des Fichiers
//                         </Button>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Recent Activity */}
//             <Row className="mt-4">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <h5 className="mb-0">
//                       <i className="bi bi-clock-history me-2"></i>
//                       Activité récente
//                     </h5>
//                   </Card.Header>
//                   <Card.Body>
//                     <div className="timeline">
//                       {recentActivity.map((activity, index) => (
//                         <div 
//                           key={index}
//                           className={`d-flex align-items-center mb-3 ${
//                             index < recentActivity.length - 1 ? 'pb-3 border-bottom' : ''
//                           }`}
//                         >
//                           <div className={`bg-${activity.color} rounded-circle p-2 me-3`}>
//                             <i className={`bi bi-${activity.icon} text-white`}></i>
//                           </div>
//                           <div>
//                             <strong>{getActivityText(activity)}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {activity.title} - {activity.time}
//                             </small>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </Container>

//       {/* Upload Modal */}
//       <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-upload me-2"></i>
//             Uploader un fichier
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleUploadSubmit}>
//           <Modal.Body>
//             <Form.Group>
//               <Form.Label>Sélectionner un fichier</Form.Label>
//               <Form.Control 
//                 type="file" 
//                 onChange={handleFileChange}
//                 accept=".jpeg,.jpg,.png,.gif,.webp,.mp3,.wav,.ogg,.m4a"
//               />
//               {selectedFile && (
//                 <Form.Text className="text-muted">
//                   <i className="bi bi-file-earmark me-1"></i>
//                   {selectedFile.name} ({(selectedFile.size/1024/1024).toFixed(2)} MB)
//                 </Form.Text>
//               )}
//               {uploadResult && (
//                 <div className={`mt-2 alert ${uploadResult.includes('réussi') ? 'alert-success' : 'alert-danger'} p-2`}>
//                   <small>{uploadResult}</small>
//                 </div>
//               )}
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button 
//               variant="secondary" 
//               onClick={() => setShowUploadModal(false)}
//               disabled={uploading}
//             >
//               Fermer
//             </Button>
//             <Button 
//               variant="primary" 
//               type="submit" 
//               disabled={uploading || !selectedFile}
//             >
//               {uploading ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Téléversement...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-upload me-2"></i>
//                   Téléverser
//                 </>
//               )}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner, Modal, Form } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useRadio } from '../../contexts/RadioContext';
import api from '../../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import '../../styles/adminApple.css';

const NAV = [
  { to: '/admin',              icon: 'bi-speedometer2',    label: 'Dashboard' },
  { to: '/admin/programs',     icon: 'bi-calendar3',       label: 'Programmes' },
  { to: '/admin/episodes',     icon: 'bi-collection-play', label: 'Épisodes' },
  { to: '/admin/emissions',    icon: 'bi-broadcast',       label: 'Émissions' },
  { to: '/admin/affiches',      icon: 'bi-images',          label: 'Affiches' },
  { to: '/admin/song-requests', icon: 'bi-music-note-list', label: 'Demandes' },
  { to: '/admin/carousels',     icon: 'bi-collection',      label: 'Carrousels' },
  { to: '/admin/stats',         icon: 'bi-bar-chart',       label: 'Statistiques' },
];

const QUICK = [
  { to: '/admin/programs',  icon: 'bi-calendar3',       label: 'Programme',  color: 'asi-blue' },
  { to: '/admin/episodes',  icon: 'bi-collection-play', label: 'Épisode',    color: 'asi-green' },
  { to: '/admin/affiches',  icon: 'bi-images',          label: 'Affiche',    color: 'asi-orange' },
  { to: '/admin/emissions', icon: 'bi-broadcast',       label: 'Émission',   color: 'asi-red' },
];

const PIE_COLORS = ['#0071e3','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa'];

export default function AdminDashboard() {
  const location = useLocation();
  const { getProgramsStats, getEpisodesStats, currentSong } = useRadio();

  const [stats, setStats]               = useState({ programs: {total:0,active:0,featured:0}, episodes: {total:0,totalDuration:0} });
  const [weeklyData, setWeeklyData]     = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showUpload, setShowUpload]     = useState(false);
  const [uploadFile, setUploadFile]     = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadMsg, setUploadMsg]       = useState('');

  const isActive = (path) => path === '/admin'
    ? location.pathname === '/admin'
    : location.pathname.startsWith(path);

  const formatDuration = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ps, es] = await Promise.all([
        getProgramsStats(), getEpisodesStats()
      ]);
      setStats({ programs: ps, episodes: es });
    } catch {
      setStats({
        programs: { total: 12, active: 8, featured: 3 },
        episodes: { total: 245, totalDuration: 892800 },
      });
    }

    const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    setWeeklyData(days.map(d => ({
      day: d,
      auditeurs: 900 + Math.floor(Math.random() * 800),
      episodes: 10 + Math.floor(Math.random() * 15)
    })));

    setCategoryData([
      { name: 'Actualité', value: 35 }, { name: 'Musique', value: 25 },
      { name: 'Tech', value: 20 },      { name: 'Culture', value: 15 },
      { name: 'Sport', value: 5 }
    ]);

    setRecentActivity([
      { icon: 'bi-plus-circle', color: 'asi-blue',   title: 'Programme créé',        detail: 'Morning Show', time: 'Il y a 2h' },
      { icon: 'bi-pencil',      color: 'asi-orange',  title: 'Épisode modifié',       detail: 'Jazz Lounge EP05', time: 'Il y a 4h' },
      { icon: 'bi-broadcast',   color: 'asi-green',   title: 'Émission diffusée',     detail: 'Morning Show', time: 'Il y a 6h' },
      { icon: 'bi-upload',      color: 'asi-purple',  title: 'Fichier uploadé',       detail: 'intro.mp3', time: 'Il y a 8h' },
    ]);

    setLoading(false);
  }, [getProgramsStats, getEpisodesStats]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      const res = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const data = res.data;
      setUploadMsg(data.success ? `✓ Upload réussi : ${data.data?.url || ''}` : '✗ Échec');
      if (data.success) setTimeout(() => { setShowUpload(false); setUploadMsg(''); setUploadFile(null); }, 2200);
    } catch { setUploadMsg('✗ Erreur réseau'); }
    setUploading(false);
  };

  if (loading) return (
    <div className="apple-admin-wrap">
      <Sidebar isActive={isActive} onUpload={() => setShowUpload(true)} />
      <main className="apple-main d-flex align-items-center justify-content-center" style={{ marginLeft: 236 }}>
        <div className="apple-loading">
          <Spinner animation="border" />
          <p>Chargement du tableau de bord…</p>
        </div>
      </main>
    </div>
  );

  const STATS = [
    { icon: 'bi-broadcast',       color: 'asi-blue',   val: stats.programs.total,            lbl: 'Programmes',    sub: `${stats.programs.active || 0} actifs` },
    { icon: 'bi-collection-play', color: 'asi-green',  val: stats.episodes.total,            lbl: 'Épisodes',      sub: formatDuration(stats.episodes.totalDuration || 0) },
    { icon: 'bi-people',          color: 'asi-purple', val: currentSong?.listeners || 0,     lbl: 'Auditeurs',     sub: 'En temps réel' },
    { icon: 'bi-star-fill',       color: 'asi-orange', val: stats.programs.featured || 0,    lbl: 'En vedette',    sub: 'Programmes mis en avant' },
  ];

  return (
    <div className="apple-admin-wrap">
      <Sidebar isActive={isActive} onUpload={() => setShowUpload(true)} />

      <main className="apple-main">
        {/* Header */}
        <div className="apple-page-header">
          <div>
            <h1 className="apple-page-title">Tableau de bord</h1>
            <p className="apple-page-sub">Vue d'ensemble de votre station radio</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn-apple btn-apple-secondary" onClick={fetchAll}>
              <i className="bi bi-arrow-clockwise" />Actualiser
            </button>
            <button className="btn-apple btn-apple-primary" onClick={() => setShowUpload(true)}>
              <i className="bi bi-upload" />Uploader
            </button>
          </div>
        </div>

        {/* Stats */}
        <Row className="g-3 mb-4">
          {STATS.map((s, i) => (
            <Col md={3} key={i}>
              <div className="apple-stat">
                <div className={`apple-stat-icon ${s.color}`}><i className={`bi ${s.icon}`} /></div>
                <div className="apple-stat-val">{s.val}</div>
                <div className="apple-stat-lbl">{s.lbl}</div>
                <div className="apple-stat-sub">{s.sub}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Charts row */}
        <Row className="g-3 mb-4">
          <Col lg={8}>
            <div className="apple-chart-card">
              <div className="chart-header">
                <span className="apple-card-title"><i className="bi bi-graph-up me-2" />Audience hebdomadaire</span>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8e8e93' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#8e8e93' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
                    <Line type="monotone" dataKey="auditeurs" stroke="#0071e3" strokeWidth={2.5} dot={false} name="Auditeurs" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="apple-chart-card h-100">
              <div className="chart-header">
                <span className="apple-card-title"><i className="bi bi-pie-chart me-2" />Catégories</span>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={11}>
                      {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bar chart */}
        <div className="apple-chart-card mb-4">
          <div className="chart-header">
            <span className="apple-card-title"><i className="bi bi-bar-chart me-2" />Épisodes diffusés par jour</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8e8e93' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8e8e93' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
                <Bar dataKey="episodes" fill="#34c759" radius={[6,6,0,0]} name="Épisodes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick actions + Activity */}
        <Row className="g-3">
          <Col lg={7}>
            <div className="apple-card card">
              <div className="card-header">
                <span className="apple-card-title"><i className="bi bi-lightning me-2" />Actions rapides</span>
              </div>
              <div className="card-body">
                <Row className="g-2">
                  {QUICK.map((q, i) => (
                    <Col xs={6} md={4} key={i}>
                      <Link to={q.to} className="apple-quick-action">
                        <div className={`apple-quick-action-icon ${q.color}`}>
                          <i className={`bi ${q.icon}`} />
                        </div>
                        <span>+ {q.label}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>

          <Col lg={5}>
            <div className="apple-card card">
              <div className="card-header">
                <span className="apple-card-title"><i className="bi bi-clock-history me-2" />Activité récente</span>
              </div>
              <div className="card-body" style={{ paddingTop: '16px !important' }}>
                {recentActivity.map((a, i) => (
                  <div key={i} className="apple-activity-item">
                    <div className={`apple-activity-dot ${a.color}`}><i className={`bi ${a.icon}`} style={{ color: 'var(--a-blue)', fontSize: 15 }} /></div>
                    <div className="flex-1">
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.detail} · {a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </main>

      {/* Upload Modal */}
      <Modal show={showUpload} onHide={() => { setShowUpload(false); setUploadMsg(''); setUploadFile(null); }} className="apple-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-cloud-upload" />Uploader un fichier</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <div className="apple-upload-zone" onClick={() => document.getElementById('dash-upload-input').click()}>
              <i className="bi bi-cloud-upload" />
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>
                {uploadFile ? uploadFile.name : 'Cliquez pour sélectionner'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Image ou audio · Max 50 MB</div>
            </div>
            <input id="dash-upload-input" type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.mp3,.wav,.ogg,.m4a" style={{ display: 'none' }}
              onChange={e => { setUploadFile(e.target.files?.[0] || null); setUploadMsg(''); }} />
            {uploadMsg && (
              <div className={`apple-alert mt-3 ${uploadMsg.startsWith('✓') ? 'apple-alert-success' : 'apple-alert-danger'}`}>
                {uploadMsg}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn-apple btn-apple-secondary" onClick={() => setShowUpload(false)}>Fermer</button>
            <button type="submit" className="btn-apple btn-apple-primary" disabled={uploading || !uploadFile}>
              {uploading ? <><Spinner as="span" animation="border" size="sm" />Envoi...</> : <><i className="bi bi-upload" />Téléverser</>}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

/* ── Sidebar Component ─────────────────────────────── */
function Sidebar({ isActive, onUpload }) {
  return (
    <aside className="apple-sidebar">
      <div className="apple-sidebar-brand">
        <div className="apple-sidebar-brand-icon">📻</div>
        <div className="apple-sidebar-brand-text">
          <h5>Roots Radio</h5>
          <small>Administration</small>
        </div>
      </div>

      <nav className="apple-sidebar-nav">
        <div className="apple-sidebar-section">
          <span className="apple-sidebar-section-label">Général</span>
          {NAV.slice(0,1).map(n => (
            <Link key={n.to} to={n.to} className={`apple-nav-link ${isActive(n.to) ? 'active' : ''}`}>
              <i className={`bi ${n.icon}`} />{n.label}
            </Link>
          ))}
        </div>

        <div className="apple-sidebar-section">
          <span className="apple-sidebar-section-label">Contenu</span>
          {NAV.slice(1).map(n => (
            <Link key={n.to} to={n.to} className={`apple-nav-link ${isActive(n.to) ? 'active' : ''}`}>
              <i className={`bi ${n.icon}`} />{n.label}
            </Link>
          ))}
        </div>

        <div className="apple-sidebar-section">
          <span className="apple-sidebar-section-label">Outils</span>
          <button className="apple-nav-link w-100 text-start" style={{ color: 'rgba(255,255,255,0.82)' }} onClick={onUpload}>
            <i className="bi bi-cloud-upload" />Uploader
          </button>
        </div>

        <hr className="apple-sidebar-sep" />

        <Link to="/" className="apple-nav-link">
          <i className="bi bi-house" />Voir le site
        </Link>
      </nav>

      <div className="apple-sidebar-footer">
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          Roots Radio © 2025
        </div>
      </div>
    </aside>
  );
}