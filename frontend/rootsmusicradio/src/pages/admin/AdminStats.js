// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminStats = () => {
//   const { getDetailedStats } = useRadio();
  
//   const [stats, setStats] = useState({
//     overview: { totalListeners: 0, totalPrograms: 0, totalEpisodes: 0, totalPodcasts: 0 },
//     listening: [],
//     programs: [],
//     episodes: [],
//     podcasts: [],
//     geographical: [],
//     devices: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState('7d');

//   const timeRangeOptions = [
//     { value: '24h', label: 'Dernières 24h' },
//     { value: '7d', label: '7 derniers jours' },
//     { value: '30d', label: '30 derniers jours' },
//     { value: '90d', label: '3 derniers mois' },
//     { value: '1y', label: 'Dernière année' }
//   ];

//   // Données exemple pour la démonstration
//   const exampleData = {
//     overview: {
//       totalListeners: 52847,
//       totalPrograms: 15,
//       totalEpisodes: 342,
//       totalPodcasts: 87
//     },
//     listening: [
//       { date: '2024-01-01', listeners: 1200, duration: 4800 },
//       { date: '2024-01-02', listeners: 1350, duration: 5200 },
//       { date: '2024-01-03', listeners: 1180, duration: 4600 },
//       { date: '2024-01-04', listeners: 1450, duration: 5800 },
//       { date: '2024-01-05', listeners: 1600, duration: 6400 },
//       { date: '2024-01-06', listeners: 1850, duration: 7200 },
//       { date: '2024-01-07', listeners: 1720, duration: 6800 }
//     ],
//     programs: [
//       { name: 'Morning Show', listeners: 8500, engagement: 85 },
//       { name: 'Jazz Evening', listeners: 6200, engagement: 78 },
//       { name: 'Tech Talk', listeners: 4800, engagement: 82 },
//       { name: 'Music Mix', listeners: 7300, engagement: 80 },
//       { name: 'News Hour', listeners: 5900, engagement: 75 }
//     ],
//     episodes: [
//       { title: 'Interview Exclusive', views: 2500, likes: 340, downloads: 1200 },
//       { title: 'Débat Politique', views: 2100, likes: 280, downloads: 950 },
//       { title: 'Découverte Musicale', views: 1900, likes: 420, downloads: 1100 },
//       { title: 'Tech Review', views: 1600, likes: 220, downloads: 800 }
//     ],
//     podcasts: [
//       { title: 'Histoire du Jazz', downloads: 3200, likes: 450, rating: 4.8 },
//       { title: 'Startup Stories', downloads: 2800, likes: 380, rating: 4.6 },
//       { title: 'Culture Africaine', downloads: 2400, likes: 520, rating: 4.9 },
//       { title: 'Innovation Tech', downloads: 2100, likes: 290, rating: 4.5 }
//     ],
//     geographical: [
//       { country: 'Cameroun', listeners: 25000, percentage: 47 },
//       { country: 'France', listeners: 8500, percentage: 16 },
//       { country: 'Sénégal', listeners: 6200, percentage: 12 },
//       { country: 'Côte d\'Ivoire', listeners: 4800, percentage: 9 },
//       { country: 'Autres', listeners: 8347, percentage: 16 }
//     ],
//     devices: [
//       { device: 'Mobile', count: 28500, color: '#8884d8' },
//       { device: 'Desktop', count: 15200, color: '#82ca9d' },
//       { device: 'Tablette', count: 7800, color: '#ffc658' },
//       { device: 'Smart TV', count: 1347, color: '#ff7c7c' }
//     ]
//   };

//   const fetchStats = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Dans un vrai projet, cette fonction appellerait l'API
//       // const data = await getDetailedStats({ timeRange });
      
//       // Pour la démonstration, on utilise les données d'exemple
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setStats(exampleData);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//       // En cas d'erreur, utiliser les données d'exemple
//       setStats(exampleData);
//     } finally {
//       setLoading(false);
//     }
//   }, [timeRange]);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   const formatNumber = (num) => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
//     return num.toString();
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

//   return (
//     <div className="admin-stats py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-bar-chart me-2"></i>
//                   Statistiques Détaillées
//                 </h2>
//                 <p className="text-muted mb-0">Analyses et métriques de performance</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Form.Select 
//                   value={timeRange} 
//                   onChange={(e) => setTimeRange(e.target.value)}
//                   style={{ width: '200px' }}
//                   className="d-inline-block"
//                 >
//                   {timeRangeOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Overview Cards */}
//         <Row className="mb-4">
//           <Col md={3} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Body className="text-center">
//                 <div className="text-primary mb-2">
//                   <i className="bi bi-people-fill fs-1"></i>
//                 </div>
//                 <h3 className="mb-1">{formatNumber(stats.overview.totalListeners)}</h3>
//                 <p className="text-muted mb-0">Total Auditeurs</p>
//                 <small className="text-success">
//                   <i className="bi bi-arrow-up"></i> +12% vs période précédente
//                 </small>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col md={3} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Body className="text-center">
//                 <div className="text-success mb-2">
//                   <i className="bi bi-broadcast fs-1"></i>
//                 </div>
//                 <h3 className="mb-1">{stats.overview.totalPrograms}</h3>
//                 <p className="text-muted mb-0">Programmes Actifs</p>
//                 <small className="text-primary">
//                   <i className="bi bi-arrow-up"></i> +2 ce mois
//                 </small>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col md={3} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Body className="text-center">
//                 <div className="text-info mb-2">
//                   <i className="bi bi-collection-play fs-1"></i>
//                 </div>
//                 <h3 className="mb-1">{stats.overview.totalEpisodes}</h3>
//                 <p className="text-muted mb-0">Épisodes Diffusés</p>
//                 <small className="text-success">
//                   <i className="bi bi-arrow-up"></i> +15 cette semaine
//                 </small>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col md={3} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Body className="text-center">
//                 <div className="text-warning mb-2">
//                   <i className="bi bi-headphones fs-1"></i>
//                 </div>
//                 <h3 className="mb-1">{stats.overview.totalPodcasts}</h3>
//                 <p className="text-muted mb-0">Podcasts Publiés</p>
//                 <small className="text-success">
//                   <i className="bi bi-arrow-up"></i> +5 ce mois
//                 </small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Listening Trends */}
//         <Row className="mb-4">
//           <Col lg={8}>
//             <Card className="h-100">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-graph-up me-2"></i>
//                   Tendances d'écoute
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={stats.listening}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} />
//                     <YAxis />
//                     <Tooltip 
//                       labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
//                       formatter={(value, name) => [
//                         name === 'listeners' ? value + ' auditeurs' : formatDuration(value),
//                         name === 'listeners' ? 'Auditeurs' : 'Temps d\'écoute'
//                       ]}
//                     />
//                     <Area type="monotone" dataKey="listeners" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col lg={4}>
//             <Card className="h-100">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-pie-chart me-2"></i>
//                   Appareils d'écoute
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={stats.devices}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="count"
//                       label={({ device, count }) => `${device}: ${formatNumber(count)}`}
//                     >
//                       {stats.devices.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => formatNumber(value)} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Programs Performance */}
//         <Row className="mb-4">
//           <Col>
//             <Card>
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-award me-2"></i>
//                   Performance des Programmes
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={stats.programs}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="listeners" fill="#8884d8" name="Auditeurs" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Tables */}
//         <Row className="mb-4">
//           <Col lg={6}>
//             <Card className="h-100">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-trophy me-2"></i>
//                   Top Épisodes
//                 </h5>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 <Table responsive hover className="mb-0">
//                   <thead className="bg-light">
//                     <tr>
//                       <th>Épisode</th>
//                       <th>Vues</th>
//                       <th>Likes</th>
//                       <th>Téléchargements</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stats.episodes.map((episode, index) => (
//                       <tr key={index}>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <span className="badge bg-primary me-2">#{index + 1}</span>
//                             <span className="fw-bold">{episode.title}</span>
//                           </div>
//                         </td>
//                         <td>{formatNumber(episode.views)}</td>
//                         <td>
//                           <span className="text-danger">
//                             <i className="bi bi-heart-fill me-1"></i>
//                             {episode.likes}
//                           </span>
//                         </td>
//                         <td>
//                           <span className="text-success">
//                             <i className="bi bi-download me-1"></i>
//                             {formatNumber(episode.downloads)}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col lg={6}>
//             <Card className="h-100">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-star me-2"></i>
//                   Top Podcasts
//                 </h5>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 <Table responsive hover className="mb-0">
//                   <thead className="bg-light">
//                     <tr>
//                       <th>Podcast</th>
//                       <th>Téléchargements</th>
//                       <th>Note</th>
//                       <th>Likes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stats.podcasts.map((podcast, index) => (
//                       <tr key={index}>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <span className="badge bg-success me-2">#{index + 1}</span>
//                             <span className="fw-bold">{podcast.title}</span>
//                           </div>
//                         </td>
//                         <td>{formatNumber(podcast.downloads)}</td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <span className="text-warning me-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <i 
//                                   key={i} 
//                                   className={`bi bi-star${i < Math.floor(podcast.rating) ? '-fill' : ''}`}
//                                 ></i>
//                               ))}
//                             </span>
//                             <small className="text-muted">{podcast.rating}</small>
//                           </div>
//                         </td>
//                         <td>
//                           <span className="text-danger">
//                             <i className="bi bi-heart-fill me-1"></i>
//                             {podcast.likes}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Geographic Distribution */}
//         <Row className="mb-4">
//           <Col lg={8}>
//             <Card>
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-globe me-2"></i>
//                   Répartition Géographique
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <div className="table-responsive">
//                   <Table hover className="mb-0">
//                     <thead>
//                       <tr>
//                         <th>Pays</th>
//                         <th>Auditeurs</th>
//                         <th>Pourcentage</th>
//                         <th>Progression</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {stats.geographical.map((country, index) => (
//                         <tr key={index}>
//                           <td>
//                             <strong>{country.country}</strong>
//                           </td>
//                           <td>{formatNumber(country.listeners)}</td>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
//                                 <div
//                                   className="progress-bar"
//                                   style={{ width: `${country.percentage}%` }}
//                                 ></div>
//                               </div>
//                               <span className="small">{country.percentage}%</span>
//                             </div>
//                           </td>
//                           <td>
//                             <span className="text-success small">
//                               <i className="bi bi-arrow-up"></i> +{Math.floor(Math.random() * 10) + 1}%
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
          
//           <Col lg={4}>
//             <Card className="h-100">
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-clock me-2"></i>
//                   Heures de pointe
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <div className="mb-3">
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <span>08:00 - 10:00</span>
//                     <strong>Peak</strong>
//                   </div>
//                   <div className="progress mb-2">
//                     <div className="progress-bar bg-success" style={{ width: '95%' }}></div>
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <span>12:00 - 14:00</span>
//                     <strong>High</strong>
//                   </div>
//                   <div className="progress mb-2">
//                     <div className="progress-bar bg-primary" style={{ width: '80%' }}></div>
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <span>18:00 - 20:00</span>
//                     <strong>High</strong>
//                   </div>
//                   <div className="progress mb-2">
//                     <div className="progress-bar bg-info" style={{ width: '85%' }}></div>
//                   </div>
//                 </div>
                
//                 <div className="mb-3">
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <span>22:00 - 00:00</span>
//                     <strong>Medium</strong>
//                   </div>
//                   <div className="progress mb-2">
//                     <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <div className="d-flex justify-content-between align-items-center mb-1">
//                     <span>02:00 - 06:00</span>
//                     <strong>Low</strong>
//                   </div>
//                   <div className="progress">
//                     <div className="progress-bar bg-secondary" style={{ width: '25%' }}></div>
//                   </div>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Export Actions */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <h5 className="mb-0">
//                   <i className="bi bi-download me-2"></i>
//                   Export des Données
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <p className="text-muted mb-3">
//                   Exportez vos données statistiques dans différents formats pour analyse externe.
//                 </p>
//                 <div className="d-flex gap-2 flex-wrap">
//                   <Button variant="outline-primary">
//                     <i className="bi bi-filetype-csv me-1"></i>
//                     Export CSV
//                   </Button>
//                   <Button variant="outline-success">
//                     <i className="bi bi-filetype-xlsx me-1"></i>
//                     Export Excel
//                   </Button>
//                   <Button variant="outline-info">
//                     <i className="bi bi-filetype-pdf me-1"></i>
//                     Export PDF
//                   </Button>
//                   <Button variant="outline-warning">
//                     <i className="bi bi-filetype-json me-1"></i>
//                     Export JSON
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default AdminStats;
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRadio } from '../../contexts/RadioContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminStats = () => {
  const { getProgramsStats, getEpisodesStats, getPodcastsStats } = useRadio();
  
  const [stats, setStats] = useState({
    programs: { total: 0, active: 0, featured: 0, byCategory: [] },
    episodes: { total: 0, featured: 0, totalDuration: 0, byMonth: [] },
    podcasts: { total: 0, featured: 0, totalDownloads: 0, totalLikes: 0 }
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const exampleData = [
    { month: 'Jan', episodes: 45, podcasts: 12, listeners: 1200 },
    { month: 'Fév', episodes: 52, podcasts: 18, listeners: 1400 },
    { month: 'Mar', episodes: 48, podcasts: 15, listeners: 1350 },
    { month: 'Avr', episodes: 60, podcasts: 22, listeners: 1600 },
    { month: 'Mai', episodes: 55, podcasts: 20, listeners: 1550 },
    { month: 'Juin', episodes: 58, podcasts: 25, listeners: 1700 }
  ];

  const fetchDetailedStats = useCallback(async () => {
    try {
      const [programsStats, episodesStats, podcastsStats] = await Promise.all([
        getProgramsStats(dateRange),
        getEpisodesStats(dateRange),
        getPodcastsStats(dateRange)
      ]);

      setStats({
        programs: programsStats,
        episodes: episodesStats,
        podcasts: podcastsStats
      });
    } catch (error) {
      console.error('Failed to fetch detailed stats:', error);
    }
  }, [getProgramsStats, getEpisodesStats, getPodcastsStats, dateRange]);

  useEffect(() => {
    fetchDetailedStats();
  }, [fetchDetailedStats]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="admin-stats py-4">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  <i className="bi bi-bar-chart me-2"></i>
                  Statistiques détaillées
                </h2>
                <p className="text-muted mb-0">Analysez les performances de votre station</p>
              </div>
              <div>
                <Link to="/admin" className="btn btn-outline-secondary me-2">
                  <i className="bi bi-arrow-left me-1"></i>
                  Retour
                </Link>
                <Button variant="primary" onClick={fetchDetailedStats}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Actualiser
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Period Filters */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Filtres de période</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="d-flex gap-2 mb-3">
                      {['week', 'month', 'quarter', 'year'].map((period) => (
                        <Button
                          key={period}
                          variant={selectedPeriod === period ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => handlePeriodChange(period)}
                        >
                          {period === 'week' ? 'Semaine' :
                           period === 'month' ? 'Mois' :
                           period === 'quarter' ? 'Trimestre' : 'Année'}
                        </Button>
                      ))}
                    </div>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>Du</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => handleDateRangeChange('start', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Au</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => handleDateRangeChange('end', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Summary Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-broadcast fs-1 text-primary mb-3"></i>
                <h3>{stats.programs.total}</h3>
                <p className="text-muted">Total Programmes</p>
                <small className="text-success">
                  {stats.programs.active} actifs
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-collection-play fs-1 text-success mb-3"></i>
                <h3>{stats.episodes.total}</h3>
                <p className="text-muted">Total Épisodes</p>
                <small className="text-info">
                  {formatDuration(stats.episodes.totalDuration)}
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-headphones fs-1 text-info mb-3"></i>
                <h3>{stats.podcasts.total}</h3>
                <p className="text-muted">Total Podcasts</p>
                <small className="text-warning">
                  {stats.podcasts.totalDownloads} téléchargements
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-heart fs-1 text-danger mb-3"></i>
                <h3>{stats.podcasts.totalLikes}</h3>
                <p className="text-muted">Total J'aimes</p>
                <small className="text-muted">
                  Sur les podcasts
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-graph-up me-2"></i>
                  Évolution mensuelle
                </h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={exampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="episodes" fill="#8884d8" name="Épisodes" />
                    <Bar dataKey="podcasts" fill="#82ca9d" name="Podcasts" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-pie-chart me-2"></i>
                  Répartition par catégorie
                </h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={stats.programs.byCategory || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                      label={({ category, count }) => `${category}: ${count}`}
                    >
                      {(stats.programs.byCategory || []).map((entry, index) => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Detailed Tables */}
        <Row>
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Top Programmes</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Programme</th>
                      <th>Épisodes</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Morning Show</td>
                      <td>25</td>
                      <td><span className="badge bg-success">Actif</span></td>
                    </tr>
                    <tr>
                      <td>Jazz Lounge</td>
                      <td>18</td>
                      <td><span className="badge bg-success">Actif</span></td>
                    </tr>
                    <tr>
                      <td>News Update</td>
                      <td>42</td>
                      <td><span className="badge bg-success">Actif</span></td>
                    </tr>
                    <tr>
                      <td>Rock Classics</td>
                      <td>12</td>
                      <td><span className="badge bg-warning">Pause</span></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Top Podcasts</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Podcast</th>
                      <th>Téléchargements</th>
                      <th>J'aimes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Histoire de la Radio</td>
                      <td>1,245</td>
                      <td>89</td>
                    </tr>
                    <tr>
                      <td>Tech Talk</td>
                      <td>987</td>
                      <td>67</td>
                    </tr>
                    <tr>
                      <td>Culture Mix</td>
                      <td>756</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>Sports Analysis</td>
                      <td>623</td>
                      <td>34</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Export Options */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-download me-2"></i>
                  Exporter les données
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  Téléchargez les statistiques dans différents formats pour vos rapports.
                </p>
                <div className="d-flex gap-2">
                  <Button variant="outline-success">
                    <i className="bi bi-file-excel me-1"></i>
                    Excel
                  </Button>
                  <Button variant="outline-danger">
                    <i className="bi bi-file-pdf me-1"></i>
                    PDF
                  </Button>
                  <Button variant="outline-primary">
                    <i className="bi bi-filetype-csv me-1"></i>
                    CSV
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminStats;