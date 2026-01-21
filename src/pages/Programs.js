// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Form, Badge, Nav, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';

// const Programs = () => {
//   const { t } = useTranslation();
//   const { getProgramsByDay, getActivePrograms, searchPrograms } = useRadio();
  
//   const [programs, setPrograms] = useState([]);
//   const [filteredPrograms, setFilteredPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDay, setSelectedDay] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [categories, setCategories] = useState([]);

//   const days = [
//     { key: 'all', label: t('all') },
//     { key: 'monday', label: t('monday') },
//     { key: 'tuesday', label: t('tuesday') },
//     { key: 'wednesday', label: t('wednesday') },
//     { key: 'thursday', label: t('thursday') },
//     { key: 'friday', label: t('friday') },
//     { key: 'saturday', label: t('saturday') },
//     { key: 'sunday', label: t('sunday') }
//   ];

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   const fetchPrograms = async () => {
//     setLoading(true);
//     try {
//       const data = await getActivePrograms();
//       setPrograms(data);
//       setFilteredPrograms(data);
      
//       // Extract unique categories
//       const uniqueCategories = [...new Set(data.map(p => p.category))];
//       setCategories(uniqueCategories);
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDayFilter = async (day) => {
//     setSelectedDay(day);
//     setLoading(true);
    
//     try {
//       let data;
//       if (day === 'all') {
//         data = await getActivePrograms();
//       } else {
//         data = await getProgramsByDay(day);
//       }
//       setPrograms(data);
//       applyFilters(data, searchQuery, selectedCategory);
//     } catch (error) {
//       console.error('Failed to filter by day:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (query) => {
//     setSearchQuery(query);
    
//     if (query.trim() === '') {
//       setFilteredPrograms(programs);
//       return;
//     }

//     try {
//       const data = await searchPrograms(query);
//       applyFilters(data, query, selectedCategory);
//     } catch (error) {
//       console.error('Failed to search programs:', error);
//     }
//   };

//   const handleCategoryFilter = (category) => {
//     setSelectedCategory(category);
//     applyFilters(programs, searchQuery, category);
//   };

//   const applyFilters = (programsList, query, category) => {
//     let filtered = programsList;

//     if (category !== 'all') {
//       filtered = filtered.filter(program => program.category === category);
//     }

//     setFilteredPrograms(filtered);
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // HH:MM format
//   };

//   const getScheduleForDay = (program, day) => {
//     if (day === 'all') {
//       return program.schedule?.[0]; // Return first schedule
//     }
//     return program.schedule?.find(s => s.day === day);
//   };

//   const renderProgramCard = (program) => {
//     const schedule = getScheduleForDay(program, selectedDay);
    
//     return (
//       <Col lg={4} md={6} key={program._id} className="mb-4">
//         <Card className="card-custom h-100">
//           <Card.Img
//             variant="top"
//             src={program.image || '/uploads/placeholder-program.jpg'}
//             alt={program.title}
//           />
//           <Card.Body className="d-flex flex-column">
//             <div className="mb-2">
//               <Badge bg="secondary" className="me-2">
//                 {program.category}
//               </Badge>
//               {program.featured && (
//                 <Badge bg="warning">
//                   <i className="bi bi-star-fill me-1"></i>
//                   {t('featured')}
//                 </Badge>
//               )}
//             </div>
            
//             <Card.Title className="mb-2">{program.title}</Card.Title>
            
//             <Card.Text className="text-muted mb-2">
//               <i className="bi bi-person me-1"></i>
//               {program.host}
//             </Card.Text>
            
//             <Card.Text className="flex-grow-1 mb-3">
//               {program.description}
//             </Card.Text>
            
//             {schedule && (
//               <div className="mb-3">
//                 <Badge bg="success">
//                   <i className="bi bi-clock me-1"></i>
//                   {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
//                 </Badge>
//                 {schedule.duration && (
//                   <Badge bg="info" className="ms-2">
//                     {schedule.duration} min
//                   </Badge>
//                 )}
//               </div>
//             )}
            
//             <div className="mt-auto">
//               <Link 
//                 to={`/programs/${program.slug}`}
//                 className="btn btn-dark-custom w-100"
//               >
//                 <i className="bi bi-eye me-1"></i>
//                 Voir le programme
//               </Link>
//             </div>
//           </Card.Body>
//         </Card>
//       </Col>
//     );
//   };

//   if (loading && programs.length === 0) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" variant="dark" />
//           <p className="mt-3">{t('loading')}</p>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <div className="programs-page py-5">
//       <Container>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <h1 className="text-center mb-4">
//               <i className="bi bi-calendar3 me-2"></i>
//               {t('programs')}
//             </h1>
//             <p className="text-center text-muted lead">
//               Découvrez notre grille de programmes complète avec tous vos contenus préférés
//             </p>
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
//                       placeholder={`${t('search')} ${t('programs').toLowerCase()}...`}
//                       value={searchQuery}
//                       onChange={(e) => handleSearch(e.target.value)}
//                       className="form-control-custom"
//                     />
//                   </Col>
//                 </Row>

//                 {/* Day Filter */}
//                 <Row className="mb-3">
//                   <Col>
//                     <h6 className="mb-2">Filtrer par jour :</h6>
//                     <Nav variant="pills" className="flex-wrap">
//                       {days.map((day) => (
//                         <Nav.Item key={day.key}>
//                           <Nav.Link
//                             active={selectedDay === day.key}
//                             onClick={() => handleDayFilter(day.key)}
//                             className="me-2 mb-2"
//                           >
//                             {day.label}
//                           </Nav.Link>
//                         </Nav.Item>
//                       ))}
//                     </Nav>
//                   </Col>
//                 </Row>

//                 {/* Category Filter */}
//                 {categories.length > 0 && (
//                   <Row>
//                     <Col>
//                       <h6 className="mb-2">Filtrer par catégorie :</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         <Button
//                           variant={selectedCategory === 'all' ? 'dark' : 'outline-dark'}
//                           size="sm"
//                           onClick={() => handleCategoryFilter('all')}
//                         >
//                           {t('all')}
//                         </Button>
//                         {categories.map((category) => (
//                           <Button
//                             key={category}
//                             variant={selectedCategory === category ? 'dark' : 'outline-dark'}
//                             size="sm"
//                             onClick={() => handleCategoryFilter(category)}
//                           >
//                             {category}
//                           </Button>
//                         ))}
//                       </div>
//                     </Col>
//                   </Row>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Programs Grid */}
//         {loading ? (
//           <div className="text-center py-5">
//             <Spinner animation="border" variant="dark" />
//             <p className="mt-3">{t('loading')}</p>
//           </div>
//         ) : (
//           <>
//             <Row className="mb-3">
//               <Col>
//                 <h5>
//                   {filteredPrograms.length} programme{filteredPrograms.length > 1 ? 's' : ''} 
//                   {selectedDay !== 'all' && ` pour ${days.find(d => d.key === selectedDay)?.label}`}
//                   {searchQuery && ` correspondant à "${searchQuery}"`}
//                 </h5>
//               </Col>
//             </Row>

//             {filteredPrograms.length > 0 ? (
//               <Row>
//                 {filteredPrograms.map(renderProgramCard)}
//               </Row>
//             ) : (
//               <Row>
//                 <Col>
//                   <div className="text-center py-5">
//                     <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
//                     <h4 className="text-muted">{t('noResults')}</h4>
//                     <p className="text-muted">
//                       Aucun programme ne correspond à vos critères de recherche.
//                     </p>
//                     <Button 
//                       variant="outline-dark"
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSelectedDay('all');
//                         setSelectedCategory('all');
//                         fetchPrograms();
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

//         {/* Weekly Schedule Section */}
//         {selectedDay === 'all' && !searchQuery && (
//           <Row className="mt-5">
//             <Col>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <h4 className="mb-3">
//                     <i className="bi bi-calendar-week me-2"></i>
//                     Grille hebdomadaire
//                   </h4>
//                   <p className="text-muted mb-3">
//                     Consultez rapidement les horaires de diffusion pour chaque jour de la semaine.
//                   </p>
//                   <div className="d-flex flex-wrap gap-2">
//                     {days.slice(1).map((day) => (
//                       <Button
//                         key={day.key}
//                         variant="outline-primary"
//                         size="sm"
//                         onClick={() => handleDayFilter(day.key)}
//                       >
//                         <i className="bi bi-calendar-day me-1"></i>
//                         {day.label}
//                       </Button>
//                     ))}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default Programs;
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Form, Badge, Nav, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRadio } from '../contexts/RadioContext';

// const Programs = () => {
//   const { t } = useTranslation();
//   const { getProgramsByDay, getActivePrograms, searchPrograms } = useRadio();
  
//   const [programs, setPrograms] = useState([]);
//   const [filteredPrograms, setFilteredPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDay, setSelectedDay] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [categories, setCategories] = useState([]);

//   const days = [
//     { key: 'all', label: t('all') },
//     { key: 'monday', label: t('monday') },
//     { key: 'tuesday', label: t('tuesday') },
//     { key: 'wednesday', label: t('wednesday') },
//     { key: 'thursday', label: t('thursday') },
//     { key: 'friday', label: t('friday') },
//     { key: 'saturday', label: t('saturday') },
//     { key: 'sunday', label: t('sunday') }
//   ];

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   const fetchPrograms = async () => {
//     setLoading(true);
//     try {
//       const data = await getActivePrograms();
      
//       // FIX: Vérification robuste du type de données
//       let programsData = [];
//       if (Array.isArray(data)) {
//         programsData = data;
//       } else if (data && Array.isArray(data.programs)) {
//         programsData = data.programs;
//       } else if (data && Array.isArray(data.data)) {
//         programsData = data.data;
//       } else {
//         console.warn('getActivePrograms() n\'a pas retourné un tableau valide:', data);
//         programsData = [];
//       }

//       setPrograms(programsData);
//       setFilteredPrograms(programsData);
      
//       // Extract unique categories - avec protection
//       const uniqueCategories = [...new Set(
//         programsData
//           .filter(p => p && p.category) // Filtrer les programmes avec catégorie
//           .map(p => p.category)
//       )];
//       setCategories(uniqueCategories);
      
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//       setPrograms([]);
//       setFilteredPrograms([]);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDayFilter = async (day) => {
//     setSelectedDay(day);
//     setLoading(true);
    
//     try {
//       let data;
//       if (day === 'all') {
//         data = await getActivePrograms();
//       } else {
//         data = await getProgramsByDay(day);
//       }
      
//       // FIX: Même vérification de données
//       let programsData = [];
//       if (Array.isArray(data)) {
//         programsData = data;
//       } else if (data && Array.isArray(data.programs)) {
//         programsData = data.programs;
//       } else if (data && Array.isArray(data.data)) {
//         programsData = data.data;
//       } else {
//         console.warn('getProgramsByDay() n\'a pas retourné un tableau valide:', data);
//         programsData = [];
//       }
      
//       setPrograms(programsData);
//       applyFilters(programsData, searchQuery, selectedCategory);
//     } catch (error) {
//       console.error('Failed to filter by day:', error);
//       setPrograms([]);
//       setFilteredPrograms([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (query) => {
//     setSearchQuery(query);
    
//     if (query.trim() === '') {
//       setFilteredPrograms(programs);
//       return;
//     }

//     try {
//       const data = await searchPrograms(query);
      
//       // FIX: Même vérification de données
//       let programsData = [];
//       if (Array.isArray(data)) {
//         programsData = data;
//       } else if (data && Array.isArray(data.programs)) {
//         programsData = data.programs;
//       } else if (data && Array.isArray(data.data)) {
//         programsData = data.data;
//       } else {
//         console.warn('searchPrograms() n\'a pas retourné un tableau valide:', data);
//         programsData = [];
//       }
      
//       applyFilters(programsData, query, selectedCategory);
//     } catch (error) {
//       console.error('Failed to search programs:', error);
//       setFilteredPrograms([]);
//     }
//   };

//   const handleCategoryFilter = (category) => {
//     setSelectedCategory(category);
//     applyFilters(programs, searchQuery, category);
//   };

//   const applyFilters = (programsList, query, category) => {
//     // FIX: Vérification que programsList est bien un tableau
//     if (!Array.isArray(programsList)) {
//       console.warn('applyFilters: programsList is not an array:', programsList);
//       setFilteredPrograms([]);
//       return;
//     }

//     let filtered = programsList;

//     if (category !== 'all') {
//       filtered = filtered.filter(program => program && program.category === category);
//     }

//     setFilteredPrograms(filtered);
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5); // HH:MM format
//   };

//   const getScheduleForDay = (program, day) => {
//     if (!program || !Array.isArray(program.schedule)) return null;
    
//     if (day === 'all') {
//       return program.schedule[0]; // Return first schedule
//     }
//     return program.schedule.find(s => s && s.day === day);
//   };

//   const renderProgramCard = (program) => {
//     // FIX: Vérification de l'existence du programme
//     if (!program) {
//       console.warn('Tentative de rendu d\'un programme null/undefined');
//       return null;
//     }

//     const schedule = getScheduleForDay(program, selectedDay);
    
//     return (
//       <Col lg={4} md={6} key={program._id || program.id} className="mb-4">
//         <Card className="card-custom h-100">
//           <Card.Img
//             variant="top"
//             src={program.image || '/uploads/placeholder-program.jpg'}
//             alt={program.title || 'Programme'}
//           />
//           <Card.Body className="d-flex flex-column">
//             <div className="mb-2">
//               {program.category && (
//                 <Badge bg="secondary" className="me-2">
//                   {program.category}
//                 </Badge>
//               )}
//               {program.featured && (
//                 <Badge bg="warning">
//                   <i className="bi bi-star-fill me-1"></i>
//                   {t('featured')}
//                 </Badge>
//               )}
//             </div>
            
//             <Card.Title className="mb-2">{program.title || 'Titre non défini'}</Card.Title>
            
//             {program.host && (
//               <Card.Text className="text-muted mb-2">
//                 <i className="bi bi-person me-1"></i>
//                 {program.host}
//               </Card.Text>
//             )}
            
//             <Card.Text className="flex-grow-1 mb-3">
//               {program.description || 'Description non disponible'}
//             </Card.Text>
            
//             {schedule && (
//               <div className="mb-3">
//                 <Badge bg="success">
//                   <i className="bi bi-clock me-1"></i>
//                   {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
//                 </Badge>
//                 {schedule.duration && (
//                   <Badge bg="info" className="ms-2">
//                     {schedule.duration} min
//                   </Badge>
//                 )}
//               </div>
//             )}
            
//             <div className="mt-auto">
//               <Link 
//                 to={`/programs/${program.slug || program._id || program.id}`}
//                 className="btn btn-dark-custom w-100"
//               >
//                 <i className="bi bi-eye me-1"></i>
//                 Voir le programme
//               </Link>
//             </div>
//           </Card.Body>
//         </Card>
//       </Col>
//     );
//   };

//   // FIX: Vérification de sécurité avant le rendu
//   if (!Array.isArray(programs)) {
//     console.error('Programs is not an array:', programs);
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <div className="alert alert-danger">
//             Erreur: Les données des programmes ne sont pas dans le bon format. 
//             Veuillez vérifier votre contexte RadioContext.
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   if (!Array.isArray(filteredPrograms)) {
//     console.error('FilteredPrograms is not an array:', filteredPrograms);
//     setFilteredPrograms([]);
//   }

//   if (loading && programs.length === 0) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" variant="dark" />
//           <p className="mt-3">{t('loading')}</p>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <div className="programs-page py-5">
//       <Container>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <h1 className="text-center mb-4">
//               <i className="bi bi-calendar3 me-2"></i>
//               {t('programs')}
//             </h1>
//             <p className="text-center text-muted lead">
//               Découvrez notre grille de programmes complète avec tous vos contenus préférés
//             </p>
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
//                       placeholder={`${t('search')} ${t('programs').toLowerCase()}...`}
//                       value={searchQuery}
//                       onChange={(e) => handleSearch(e.target.value)}
//                       className="form-control-custom"
//                     />
//                   </Col>
//                 </Row>

//                 {/* Day Filter */}
//                 <Row className="mb-3">
//                   <Col>
//                     <h6 className="mb-2">Filtrer par jour :</h6>
//                     <Nav variant="pills" className="flex-wrap">
//                       {days.map((day) => (
//                         <Nav.Item key={day.key}>
//                           <Nav.Link
//                             active={selectedDay === day.key}
//                             onClick={() => handleDayFilter(day.key)}
//                             className="me-2 mb-2"
//                           >
//                             {day.label}
//                           </Nav.Link>
//                         </Nav.Item>
//                       ))}
//                     </Nav>
//                   </Col>
//                 </Row>

//                 {/* Category Filter */}
//                 {Array.isArray(categories) && categories.length > 0 && (
//                   <Row>
//                     <Col>
//                       <h6 className="mb-2">Filtrer par catégorie :</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         <Button
//                           variant={selectedCategory === 'all' ? 'dark' : 'outline-dark'}
//                           size="sm"
//                           onClick={() => handleCategoryFilter('all')}
//                         >
//                           {t('all')}
//                         </Button>
//                         {categories.map((category) => (
//                           <Button
//                             key={category}
//                             variant={selectedCategory === category ? 'dark' : 'outline-dark'}
//                             size="sm"
//                             onClick={() => handleCategoryFilter(category)}
//                           >
//                             {category}
//                           </Button>
//                         ))}
//                       </div>
//                     </Col>
//                   </Row>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Programs Grid */}
//         {loading ? (
//           <div className="text-center py-5">
//             <Spinner animation="border" variant="dark" />
//             <p className="mt-3">{t('loading')}</p>
//           </div>
//         ) : (
//           <>
//             <Row className="mb-3">
//               <Col>
//                 <h5>
//                   {Array.isArray(filteredPrograms) ? filteredPrograms.length : 0} programme{(Array.isArray(filteredPrograms) && filteredPrograms.length > 1) ? 's' : ''} 
//                   {selectedDay !== 'all' && ` pour ${days.find(d => d.key === selectedDay)?.label}`}
//                   {searchQuery && ` correspondant à "${searchQuery}"`}
//                 </h5>
//               </Col>
//             </Row>

//             {Array.isArray(filteredPrograms) && filteredPrograms.length > 0 ? (
//               <Row>
//                 {filteredPrograms.filter(program => program != null).map(renderProgramCard)}
//               </Row>
//             ) : (
//               <Row>
//                 <Col>
//                   <div className="text-center py-5">
//                     <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
//                     <h4 className="text-muted">{t('noResults') || 'Aucun résultat'}</h4>
//                     <p className="text-muted">
//                       {programs.length === 0 
//                         ? 'Aucun programme n\'est disponible pour le moment.' 
//                         : 'Aucun programme ne correspond à vos critères de recherche.'}
//                     </p>
//                     <Button 
//                       variant="outline-dark"
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSelectedDay('all');
//                         setSelectedCategory('all');
//                         fetchPrograms();
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

//         {/* Weekly Schedule Section */}
//         {selectedDay === 'all' && !searchQuery && (
//           <Row className="mt-5">
//             <Col>
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <h4 className="mb-3">
//                     <i className="bi bi-calendar-week me-2"></i>
//                     Grille hebdomadaire
//                   </h4>
//                   <p className="text-muted mb-3">
//                     Consultez rapidement les horaires de diffusion pour chaque jour de la semaine.
//                   </p>
//                   <div className="d-flex flex-wrap gap-2">
//                     {days.slice(1).map((day) => (
//                       <Button
//                         key={day.key}
//                         variant="outline-primary"
//                         size="sm"
//                         onClick={() => handleDayFilter(day.key)}
//                       >
//                         <i className="bi bi-calendar-day me-1"></i>
//                         {day.label}
//                       </Button>
//                     ))}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default Programs;

import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Programs = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 🎵 Base de données complète des programmes Roots Radio
  const allPrograms = [
    {
      id: 1,
      title: 'Good Morning Vibes',
      slug: 'good-morning-vibes',
      host: 'L\'équipe Roots Radio',
      description: 'Commencez votre journée en musique ! Le meilleur des hits pour vous réveiller en douceur et démarrer du bon pied.',
      image: '/images/programs/GOOD_MORNING-AFFICHE.jpg',
      category: 'Matinale',
      featured: true,
      schedule: [
        { day: 'monday', startTime: '06:00', endTime: '10:00', duration: 240 },
        { day: 'tuesday', startTime: '06:00', endTime: '10:00', duration: 240 },
        { day: 'wednesday', startTime: '06:00', endTime: '10:00', duration: 240 },
        { day: 'thursday', startTime: '06:00', endTime: '10:00', duration: 240 },
        { day: 'friday', startTime: '06:00', endTime: '10:00', duration: 240 },
        { day: 'saturday', startTime: '06:00', endTime: '10:00', duration: 240 },
        { day: 'sunday', startTime: '06:00', endTime: '10:00', duration: 240 }
      ]
    },
    {
      id: 2,
      title: 'Roots Radio Dédicace',
      slug: 'roots-radio-dedicace',
      host: 'L\'équipe Roots Radio',
      description: 'Dédiez vos morceaux préférés à vos proches ! Un moment d\'échange et de partage musical en direct.',
      image: '/images/programs/roots_radio_dedicace_AFFICHE.jpg',
      category: 'Dédicaces',
      featured: true,
      schedule: [
        { day: 'monday', startTime: '12:00', endTime: '14:00', duration: 120 },
        { day: 'tuesday', startTime: '12:00', endTime: '14:00', duration: 120 },
        { day: 'wednesday', startTime: '12:00', endTime: '14:00', duration: 120 },
        { day: 'thursday', startTime: '12:00', endTime: '14:00', duration: 120 },
        { day: 'friday', startTime: '12:00', endTime: '14:00', duration: 120 }
      ]
    },
    {
      id: 3,
      title: 'Hit 10',
      slug: 'hit-10',
      host: 'L\'équipe Roots Radio',
      description: 'Le top 10 des morceaux les plus diffusés de la semaine ! Ne ratez pas le classement des hits du moment.',
      image: '/images/programs/PLAYLIST-NON_STOP_AFFICHE.jpg',
      category: 'Hit Parade',
      featured: true,
      schedule: [
        { day: 'monday', startTime: '18:00', endTime: '19:00', duration: 60 },
        { day: 'tuesday', startTime: '18:00', endTime: '19:00', duration: 60 },
        { day: 'wednesday', startTime: '18:00', endTime: '19:00', duration: 60 },
        { day: 'thursday', startTime: '18:00', endTime: '19:00', duration: 60 },
        { day: 'friday', startTime: '18:00', endTime: '19:00', duration: 60 }
      ]
    },
    {
      id: 4,
      title: 'Les Rois de l\'Afrobeat',
      slug: 'les-rois-de-lafrobeat',
      host: 'L\'équipe Roots Radio',
      description: 'Plongez dans l\'univers de l\'Afrobeat ! Les plus grands artistes du continent africain réunis dans une émission explosive.',
      image: '/images/programs/LES_ROIS_DE_L_AFROBEAT.jpg',
      category: 'Afrobeat',
      featured: true,
      schedule: [
        { day: 'monday', startTime: '19:00', endTime: '20:00', duration: 60 },
        { day: 'tuesday', startTime: '19:00', endTime: '20:00', duration: 60 },
        { day: 'wednesday', startTime: '19:00', endTime: '20:00', duration: 60 },
        { day: 'thursday', startTime: '19:00', endTime: '20:00', duration: 60 },
        { day: 'friday', startTime: '19:00', endTime: '20:00', duration: 60 }
      ]
    },
    {
      id: 5,
      title: 'La Rétro avec Denis',
      slug: 'la-retro-avec-denis',
      host: 'Denis',
      description: 'Denis te plonge dans l\'univers de la musiques urbaine internationales. Fun ,dedicaces , fou rire et bonne humeur sont au rendez-vous chaque soir dans La Rétro.',
      program: 'La Rétro avec Denis.',
      image: '/images/hosts/denis.jpg',
      category: 'Rétro',
      featured: false,
      schedule: [
        { day: 'monday', startTime: '20:00', endTime: '21:00', duration: 60 },
        { day: 'tuesday', startTime: '20:00', endTime: '21:00', duration: 60 },
        { day: 'wednesday', startTime: '20:00', endTime: '21:00', duration: 60 },
        { day: 'thursday', startTime: '20:00', endTime: '21:00', duration: 60 },
        { day: 'friday', startTime: '20:00', endTime: '21:00', duration: 60 }
      ]
    },
    {
      id: 6,
      title: 'Roots Latino',
      slug: 'roots-latino',
      host: 'L\'équipe Roots Radio',
      description: 'Ambiance latine garantie ! Salsa, Bachata, Reggaeton... Le meilleur de la musique latino-américaine.',
      image: '/images/programs/ROOTS_LATINO.jpg',
      category: 'Latino',
      featured: true,
      schedule: [
        { day: 'saturday', startTime: '10:00', endTime: '12:00', duration: 120 }
      ]
    },
    {
      id: 7,
      title: 'Roots Classics',
      slug: 'roots-classics',
      host: 'L\'équipe Roots Radio',
      description: 'Les classiques intemporels de la musique ! Jazz, Soul, Funk, et bien plus encore pour les amateurs de légendes.',
      image: '/images/programs/ROOTS_CLASSICS.jpg',
      category: 'Classics',
      featured: true,
      schedule: [
        { day: 'sunday', startTime: '10:00', endTime: '12:00', duration: 120 }
      ]
    },
    {
      id: 8,
      title: 'Top 20 Africa',
      slug: 'top-20-africa',
      host: 'L\'équipe Roots Radio',
      description: 'Le classement officiel des 20 meilleurs morceaux africains du moment ! Découvrez les tubes qui font danser le continent.',
      image: '/images/programs/TOP_20_AFRICA_AFFICHE.jpg',
      category: 'Hit Parade',
      featured: true,
      schedule: [
        { day: 'saturday', startTime: '12:00', endTime: '13:00', duration: 60 },
        { day: 'sunday', startTime: '12:00', endTime: '13:00', duration: 60 }
      ]
    },
    {
      id: 9,
      title: 'Self-List',
      slug: 'self-list',
      host: 'DJ et artistes invités',
      description: 'Decouvrez les playlistes de vos artistes preferés.',
      image: '/images/hosts/SELF-LIST_AFFICHE.jpg',
      category: 'DJ Set',
      featured: false,
      schedule: [
        { day: 'saturday', startTime: '17:00', endTime: '18:00', duration: 60 },
        { day: 'sunday', startTime: '17:00', endTime: '18:00', duration: 60 }
      ]
    },
    {
      id: 10,
      title: 'Hit 30',
      slug: 'hit-30',
      host: 'L\'équipe Roots Radio',
      description: 'Le top 30 des morceaux les plus populaires ! 2 heures non-stop des plus grands hits du moment.',
      image: '/images/programs/HIT_30_AFFICHE.jpg',
      category: 'Hit Parade',
      featured: true,
      schedule: [
        { day: 'saturday', startTime: '18:00', endTime: '20:00', duration: 120 },
        { day: 'sunday', startTime: '18:00', endTime: '20:00', duration: 120 }
      ]
    },
    {
      id: 11,
      title: 'Mix Party',
      slug: 'mix-party',
      host: 'Eric 5 Étoiles',
      description: 'La soirée commence ici ! Eric 5 Étoiles vous fait vibrer avec les meilleurs mix pour enflammer votre samedi soir.',
      image: '/images/programs/MIX_PARTY_BY_ERIC_5_ETOILES.png',
      category: 'Mix',
      featured: true,
      schedule: [
        { day: 'saturday', startTime: '20:00', endTime: '22:00', duration: 120 }
      ]
    },
    {
      id: 12,
      title: 'Rap Nation',
      slug: 'rap-nation',
      host: 'L\'équipe Roots Radio',
      description: 'Le meilleur du rap francophone et international ! Des classiques aux nouveautés, vivez la culture hip-hop à 100%.',
      image: '/images/programs/PLAYLIST_WEEKEND_AFFICHE.jpg',
      category: 'Hip-Hop',
      featured: false,
      schedule: [
        { day: 'sunday', startTime: '20:00', endTime: '22:00', duration: 120 }
      ]
    }
  ];

  const days = [
    { key: 'all', label: 'Tous les jours' },
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  const categories = ['all', ...new Set(allPrograms.map(p => p.category))];

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM format
  };

  const getDaysForProgram = (program) => {
    if (!program.schedule || program.schedule.length === 0) return [];
    return program.schedule.map(s => {
      const day = days.find(d => d.key === s.day);
      return day ? day.label : s.day;
    });
  };

  const getScheduleForDay = (program, day) => {
    if (day === 'all') {
      return program.schedule[0]; // Return first schedule
    }
    return program.schedule.find(s => s.day === day);
  };

  // Filtrer les programmes
  const filteredPrograms = allPrograms.filter(program => {
    // Filtre par jour
    if (selectedDay !== 'all') {
      const hasScheduleForDay = program.schedule.some(s => s.day === selectedDay);
      if (!hasScheduleForDay) return false;
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      if (program.category !== selectedCategory) return false;
    }

    return true;
  });

  const renderProgramCard = (program) => {
    const schedule = getScheduleForDay(program, selectedDay);
    const programDays = getDaysForProgram(program);
    
    return (
      <Col lg={4} md={6} key={program.id} className="mb-4">
        <Card 
          className="h-100 shadow-sm"
          style={{
            border: 'none',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
          }}
        >
          {/* Image avec overlay */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <Card.Img
              variant="top"
              src={program.image}
              alt={program.title}
              style={{
                height: '280px',
                objectFit: 'cover',
                filter: 'brightness(0.95)'
              }}
              onError={(e) => {
                e.target.src = '/images/programs/PLAYLIST-NON_STOP_AFFICHE.jpg';
              }}
            />
            
            {/* Badges en overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}
            >
              {program.featured && (
                <Badge 
                  bg="warning" 
                  text="dark"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <i className="bi bi-star-fill me-1"></i>
                  À LA UNE
                </Badge>
              )}
              <Badge 
                bg="dark"
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {program.category}
              </Badge>
            </div>
          </div>

          <Card.Body 
            className="d-flex flex-column"
            style={{ padding: '24px' }}
          >
            {/* Titre */}
            <Card.Title 
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {program.title}
            </Card.Title>
            
            {/* Animateur */}
            {program.host && (
              <Card.Text 
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <i className="bi bi-person me-2" style={{ fontSize: '16px' }}></i>
                {program.host}
              </Card.Text>
            )}
            
            {/* Description */}
            <Card.Text 
              className="flex-grow-1"
              style={{
                fontSize: '14px',
                color: '#555',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}
            >
              {program.description}
            </Card.Text>
            
            {/* Horaires */}
            <div 
              style={{
                background: 'rgba(0,0,0,0.03)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '16px'
              }}
            >
              {schedule ? (
                <div className="d-flex align-items-center justify-content-between">
                  <Badge 
                    bg="success"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bi bi-clock me-1"></i>
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </Badge>
                  <Badge 
                    bg="info"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {schedule.duration} min
                  </Badge>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#666' }}>
                  <i className="bi bi-calendar3 me-2"></i>
                  {programDays.join(', ')}
                </div>
              )}
            </div>

            {/* Jours de diffusion (si vue "Tous les jours") */}
            {selectedDay === 'all' && programDays.length > 0 && (
              <div 
                style={{
                  fontSize: '11px',
                  color: '#999',
                  marginBottom: '16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}
              >
                <i className="bi bi-calendar-week me-1"></i>
                {programDays.join(' • ')}
              </div>
            )}
            
            {/* Bouton */}
            <Link 
              to={`/programs/${program.slug}`}
              className="btn w-100"
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="bi bi-eye me-2"></i>
              Voir les détails
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        `}
      </style>

      <Container style={{ paddingTop: '60px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 
            style={{
              fontSize: '4rem',
              fontWeight: '600',
              color: '#000',
              fontFamily: 'Cormorant Garamond, serif',
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}
          >
            Nos Programmes
          </h1>
          <p 
            style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Découvrez notre grille complète de programmes. 
            Du lundi au dimanche, profitez de contenus variés pour tous les goûts.
          </p>
          <div 
            style={{
              width: '60px',
              height: '3px',
              background: '#000',
              margin: '24px auto 0'
            }}
          />
        </div>

        {/* Filtres */}
        <Card 
          className="shadow-sm mb-5"
          style={{
            border: 'none',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          {/* Filtre par jour */}
          <div className="mb-4">
            <h6 
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Filtrer par jour
            </h6>
            <Nav variant="pills" className="flex-wrap">
              {days.map((day) => (
                <Nav.Item key={day.key}>
                  <Nav.Link
                    active={selectedDay === day.key}
                    onClick={() => setSelectedDay(day.key)}
                    style={{
                      marginRight: '8px',
                      marginBottom: '8px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      padding: '8px 20px',
                      background: selectedDay === day.key ? '#000' : 'transparent',
                      color: selectedDay === day.key ? '#fff' : '#666',
                      border: selectedDay === day.key ? 'none' : '1.5px solid rgba(0,0,0,0.12)',
                      fontWeight: '500'
                    }}
                  >
                    {day.label}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          {/* Filtre par catégorie */}
          <div>
            <h6 
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Filtrer par catégorie
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'dark' : 'outline-dark'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    borderRadius: '20px',
                    fontSize: '13px',
                    padding: '8px 20px',
                    fontWeight: '500',
                    border: selectedCategory === category ? 'none' : '1.5px solid rgba(0,0,0,0.12)'
                  }}
                >
                  {category === 'all' ? 'Toutes les catégories' : category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Compteur de résultats */}
        <Row className="mb-4">
          <Col>
            <h5 
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}
            >
              {filteredPrograms.length} programme{filteredPrograms.length > 1 ? 's' : ''} 
              {selectedDay !== 'all' && ` pour ${days.find(d => d.key === selectedDay)?.label}`}
            </h5>
          </Col>
        </Row>

        {/* Grille de programmes */}
        {filteredPrograms.length > 0 ? (
          <Row>
            {filteredPrograms.map(renderProgramCard)}
          </Row>
        ) : (
          <Row>
            <Col>
              <div 
                className="text-center py-5"
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '60px 20px'
                }}
              >
                <i 
                  className="bi bi-calendar-x mb-3"
                  style={{
                    fontSize: '48px',
                    color: '#ccc'
                  }}
                ></i>
                <h4 style={{ color: '#999', marginBottom: '16px' }}>
                  Aucun programme trouvé
                </h4>
                <p style={{ color: '#999', marginBottom: '24px' }}>
                  Aucun programme ne correspond à vos critères de recherche.
                </p>
                <Button 
                  variant="dark"
                  onClick={() => {
                    setSelectedDay('all');
                    setSelectedCategory('all');
                  }}
                  style={{
                    borderRadius: '20px',
                    padding: '10px 24px'
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </Col>
          </Row>
        )}

        {/* Section Info */}
        {selectedDay === 'all' && selectedCategory === 'all' && (
          <Row className="mt-5">
            <Col>
              <Card 
                style={{
                  background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '40px',
                  color: '#fff'
                }}
              >
                <Row className="align-items-center">
                  <Col md={8}>
                    <h4 
                      style={{
                        fontSize: '28px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        fontFamily: 'Cormorant Garamond, serif'
                      }}
                    >
                      Une question sur nos programmes ?
                    </h4>
                    <p style={{ marginBottom: 0, opacity: 0.9 }}>
                      Contactez-nous pour toute information complémentaire sur notre grille 
                      de programmes ou pour proposer de nouvelles émissions.
                    </p>
                  </Col>
                  <Col md={4} className="text-md-end mt-3 mt-md-0">
                    <Link 
                      to="/contact"
                      className="btn btn-light"
                      style={{
                        borderRadius: '20px',
                        padding: '12px 32px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Nous contacter
                    </Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Programs;