// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminEpisodes = () => {
//   const { getEpisodes, getPrograms, createEpisode, updateEpisode, deleteEpisode } = useRadio();
  
//   const [episodes, setEpisodes] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingEpisode, setEditingEpisode] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     programId: '',
//     season: 1,
//     episodeNumber: 1,
//     duration: 3600,
//     airDate: '',
//     audioFile: '',
//     image: '',
//     featured: false,
//     status: 'draft'
//   });
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const statusOptions = [
//     { value: 'draft', label: 'Brouillon', color: 'secondary' },
//     { value: 'scheduled', label: 'Programmé', color: 'warning' },
//     { value: 'aired', label: 'Diffusé', color: 'success' },
//     { value: 'archived', label: 'Archivé', color: 'dark' }
//   ];

//   const fetchEpisodes = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const data = await getEpisodes({ page, limit: 10 });
//       setEpisodes(data.episodes || []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error('Failed to fetch episodes:', error);
//       showAlert('danger', 'Erreur lors du chargement des épisodes');
//     } finally {
//       setLoading(false);
//     }
//   }, [getEpisodes]);

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
//     fetchEpisodes();
//   }, [fetchPrograms, fetchEpisodes]);

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const handleOpenModal = (episode = null) => {
//     if (episode) {
//       setEditingEpisode(episode);
//       setFormData({
//         title: episode.title,
//         description: episode.description,
//         programId: episode.programId?._id || episode.programId,
//         season: episode.season,
//         episodeNumber: episode.episodeNumber,
//         duration: episode.duration,
//         airDate: episode.airDate ? episode.airDate.slice(0, 16) : '',
//         audioFile: episode.audioFile || '',
//         image: episode.image || '',
//         featured: episode.featured,
//         status: episode.status
//       });
//     } else {
//       setEditingEpisode(null);
//       setFormData({
//         title: '',
//         description: '',
//         programId: '',
//         season: 1,
//         episodeNumber: 1,
//         duration: 3600,
//         airDate: '',
//         audioFile: '',
//         image: '',
//         featured: false,
//         status: 'draft'
//       });
//     }
//     setErrors({});
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingEpisode(null);
//     setErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
//     if (!formData.description.trim()) newErrors.description = 'La description est requise';
//     if (!formData.programId) newErrors.programId = 'Le programme est requis';
//     if (!formData.season || formData.season < 1) newErrors.season = 'La saison doit être >= 1';
//     if (!formData.episodeNumber || formData.episodeNumber < 1) newErrors.episodeNumber = 'Le numéro d\'épisode doit être >= 1';
//     if (!formData.duration || formData.duration < 60) newErrors.duration = 'La durée doit être >= 60 secondes';

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       if (editingEpisode) {
//         await updateEpisode(editingEpisode._id, formData);
//         showAlert('success', 'Épisode mis à jour avec succès');
//       } else {
//         await createEpisode(formData);
//         showAlert('success', 'Épisode créé avec succès');
//       }
      
//       handleCloseModal();
//       fetchEpisodes(currentPage);
//     } catch (error) {
//       console.error('Failed to save episode:', error);
//       showAlert('danger', 'Erreur lors de la sauvegarde de l\'épisode');
//     }
//   };

//   const handleDelete = async (episodeId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet épisode ?')) {
//       try {
//         await deleteEpisode(episodeId);
//         showAlert('success', 'Épisode supprimé avec succès');
//         fetchEpisodes(currentPage);
//       } catch (error) {
//         console.error('Failed to delete episode:', error);
//         showAlert('danger', 'Erreur lors de la suppression de l\'épisode');
//       }
//     }
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const statusInfo = statusOptions.find(s => s.value === status);
//     return (
//       <Badge bg={statusInfo?.color || 'secondary'}>
//         {statusInfo?.label || status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="admin-episodes py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-collection-play me-2"></i>
//                   Gestion des Épisodes
//                 </h2>
//                 <p className="text-muted mb-0">Gérez vos épisodes de programmes</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Nouvel Épisode
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Alert */}
//         {alert.show && (
//           <Row className="mb-4">
//             <Col>
//               <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
//                 {alert.message}
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {/* Episodes Table */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Liste des épisodes ({episodes.length})</h5>
//                   <Button variant="outline-primary" size="sm" onClick={() => fetchEpisodes(currentPage)}>
//                     <i className="bi bi-arrow-clockwise me-1"></i>
//                     Actualiser
//                   </Button>
//                 </div>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 {loading ? (
//                   <div className="text-center py-5">
//                     <Spinner animation="border" />
//                     <p className="mt-2">Chargement...</p>
//                   </div>
//                 ) : episodes.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-collection-play fs-1 text-muted"></i>
//                     <p className="text-muted mt-2">Aucun épisode trouvé</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>
//                       Créer le premier épisode
//                     </Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th>Épisode</th>
//                         <th>Programme</th>
//                         <th>Saison/Épisode</th>
//                         <th>Durée</th>
//                         <th>Diffusion</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {episodes.map((episode) => (
//                         <tr key={episode._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {episode.image && (
//                                 <img
//                                   src={episode.image}
//                                   alt={episode.title}
//                                   className="rounded me-2"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               )}
//                               <div>
//                                 <h6 className="mb-0">{episode.title}</h6>
//                                 {episode.featured && (
//                                   <Badge bg="warning" size="sm">
//                                     <i className="bi bi-star-fill me-1"></i>
//                                     Vedette
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <Badge bg="secondary">
//                               {episode.programId?.title || 'Programme supprimé'}
//                             </Badge>
//                           </td>
//                           <td>
//                             <span className="fw-bold">S{episode.season}E{episode.episodeNumber}</span>
//                           </td>
//                           <td>{formatDuration(episode.duration)}</td>
//                           <td>
//                             <small>{formatDate(episode.airDate)}</small>
//                           </td>
//                           <td>{getStatusBadge(episode.status)}</td>
//                           <td>
//                             <div className="btn-group" role="group">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleOpenModal(episode)}
//                                 title="Modifier"
//                               >
//                                 <i className="bi bi-pencil"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 title="Écouter"
//                               >
//                                 <i className="bi bi-play-fill"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(episode._id)}
//                                 title="Supprimer"
//                               >
//                                 <i className="bi bi-trash"></i>
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 )}
//               </Card.Body>
              
//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Card.Footer>
//                   <div className="d-flex justify-content-center">
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === 1}
//                       onClick={() => fetchEpisodes(currentPage - 1)}
//                     >
//                       Précédent
//                     </Button>
//                     <span className="mx-3 align-self-center">
//                       Page {currentPage} sur {totalPages}
//                     </span>
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === totalPages}
//                       onClick={() => fetchEpisodes(currentPage + 1)}
//                     >
//                       Suivant
//                     </Button>
//                   </div>
//                 </Card.Footer>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       {/* Episode Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-collection-play me-2"></i>
//             {editingEpisode ? 'Modifier l\'épisode' : 'Nouvel épisode'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={8}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     isInvalid={!!errors.title}
//                     placeholder="Titre de l'épisode"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Programme *</Form.Label>
//                   <Form.Select
//                     name="programId"
//                     value={formData.programId}
//                     onChange={handleChange}
//                     isInvalid={!!errors.programId}
//                   >
//                     <option value="">Choisir un programme</option>
//                     {programs.map(program => (
//                       <option key={program._id} value={program._id}>
//                         {program.title}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.programId}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Description *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 isInvalid={!!errors.description}
//                 placeholder="Description de l'épisode"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.description}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Row>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Saison *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="season"
//                     value={formData.season}
//                     onChange={handleChange}
//                     isInvalid={!!errors.season}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.season}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Numéro *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="episodeNumber"
//                     value={formData.episodeNumber}
//                     onChange={handleChange}
//                     isInvalid={!!errors.episodeNumber}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.episodeNumber}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Durée (sec) *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     isInvalid={!!errors.duration}
//                     min="60"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.duration}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Statut</Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                   >
//                     {statusOptions.map(status => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Date de diffusion</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 name="airDate"
//                 value={formData.airDate}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Fichier audio (URL)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="audioFile"
//                 value={formData.audioFile}
//                 onChange={handleChange}
//                 placeholder="https://example.com/audio.mp3"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Image (URL)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleChange}
//                 label="Épisode en vedette"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary">
//               <i className="bi bi-save me-1"></i>
//               {editingEpisode ? 'Mettre à jour' : 'Créer'}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminEpisodes;

// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminEpisodes = () => {
//   const { getEpisodes, getPrograms, createEpisode, updateEpisode, deleteEpisode } = useRadio();
  
//   const [episodes, setEpisodes] = useState([]);
//   const [programs, setPrograms] = useState([]); // Assure-toi que c'est un array
//   const [loading, setLoading] = useState(true);
//   const [loadingPrograms, setLoadingPrograms] = useState(true); // Loading séparé pour les programmes
//   const [showModal, setShowModal] = useState(false);
//   const [editingEpisode, setEditingEpisode] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     programId: '',
//     season: 1,
//     episodeNumber: 1,
//     duration: 3600,
//     airDate: '',
//     audioFile: '',
//     image: '',
//     featured: false,
//     status: 'draft'
//   });
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const statusOptions = [
//     { value: 'draft', label: 'Brouillon', color: 'secondary' },
//     { value: 'scheduled', label: 'Programmé', color: 'warning' },
//     { value: 'aired', label: 'Diffusé', color: 'success' },
//     { value: 'archived', label: 'Archivé', color: 'dark' }
//   ];

//   const fetchEpisodes = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const data = await getEpisodes({ page, limit: 10 });
//       // Assure-toi que episodes est toujours un array
//       setEpisodes(Array.isArray(data.episodes) ? data.episodes : []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error('Failed to fetch episodes:', error);
//       setEpisodes([]); // Fallback vers un array vide
//       showAlert('danger', 'Erreur lors du chargement des épisodes');
//     } finally {
//       setLoading(false);
//     }
//   }, [getEpisodes]);

//   const fetchPrograms = useCallback(async () => {
//     setLoadingPrograms(true);
//     try {
//       const data = await getPrograms();
//       console.log('Programs data:', data); // Debug
      
//       // Assure-toi que programs est toujours un array
//       if (Array.isArray(data)) {
//         setPrograms(data);
//       } else if (data && Array.isArray(data.programs)) {
//         setPrograms(data.programs);
//       } else {
//         console.warn('Programs data is not an array:', data);
//         setPrograms([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//       setPrograms([]); // Fallback vers un array vide
//       showAlert('warning', 'Erreur lors du chargement des programmes');
//     } finally {
//       setLoadingPrograms(false);
//     }
//   }, [getPrograms]);

//   useEffect(() => {
//     fetchPrograms();
//     fetchEpisodes();
//   }, [fetchPrograms, fetchEpisodes]);

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const handleOpenModal = (episode = null) => {
//     if (episode) {
//       setEditingEpisode(episode);
//       setFormData({
//         title: episode.title || '',
//         description: episode.description || '',
//         programId: episode.programId?._id || episode.programId || '',
//         season: episode.season || 1,
//         episodeNumber: episode.episodeNumber || 1,
//         duration: episode.duration || 3600,
//         airDate: episode.airDate ? episode.airDate.slice(0, 16) : '',
//         audioFile: episode.audioFile || '',
//         image: episode.image || '',
//         featured: episode.featured || false,
//         status: episode.status || 'draft'
//       });
//     } else {
//       setEditingEpisode(null);
//       setFormData({
//         title: '',
//         description: '',
//         programId: '',
//         season: 1,
//         episodeNumber: 1,
//         duration: 3600,
//         airDate: '',
//         audioFile: '',
//         image: '',
//         featured: false,
//         status: 'draft'
//       });
//     }
//     setErrors({});
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingEpisode(null);
//     setErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
//     if (!formData.description.trim()) newErrors.description = 'La description est requise';
//     if (!formData.programId) newErrors.programId = 'Le programme est requis';
//     if (!formData.season || formData.season < 1) newErrors.season = 'La saison doit être >= 1';
//     if (!formData.episodeNumber || formData.episodeNumber < 1) newErrors.episodeNumber = 'Le numéro d\'épisode doit être >= 1';
//     if (!formData.duration || formData.duration < 60) newErrors.duration = 'La durée doit être >= 60 secondes';

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       // Préparer les données pour l'envoi
//       const episodeData = {
//         ...formData,
//         season: Number(formData.season),
//         episodeNumber: Number(formData.episodeNumber),
//         duration: Number(formData.duration),
//         airDate: formData.airDate ? new Date(formData.airDate).toISOString() : null
//       };

//       console.log('Saving episode with data:', episodeData); // Debug

//       if (editingEpisode) {
//         await updateEpisode(editingEpisode._id, episodeData);
//         showAlert('success', 'Épisode mis à jour avec succès');
//       } else {
//         await createEpisode(episodeData);
//         showAlert('success', 'Épisode créé avec succès');
//       }
      
//       handleCloseModal();
//       fetchEpisodes(currentPage);
//     } catch (error) {
//       console.error('Failed to save episode:', error);
//       showAlert('danger', `Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
//     }
//   };

//   const handleDelete = async (episodeId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet épisode ?')) {
//       try {
//         await deleteEpisode(episodeId);
//         showAlert('success', 'Épisode supprimé avec succès');
//         fetchEpisodes(currentPage);
//       } catch (error) {
//         console.error('Failed to delete episode:', error);
//         showAlert('danger', 'Erreur lors de la suppression de l\'épisode');
//       }
//     }
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const statusInfo = statusOptions.find(s => s.value === status);
//     return (
//       <Badge bg={statusInfo?.color || 'secondary'}>
//         {statusInfo?.label || status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="admin-episodes py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-collection-play me-2"></i>
//                   Gestion des Épisodes
//                 </h2>
//                 <p className="text-muted mb-0">Gérez vos épisodes de programmes</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Nouvel Épisode
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Alert */}
//         {alert.show && (
//           <Row className="mb-4">
//             <Col>
//               <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
//                 {alert.message}
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {/* Episodes Table */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Liste des épisodes ({episodes.length})</h5>
//                   <Button variant="outline-primary" size="sm" onClick={() => fetchEpisodes(currentPage)}>
//                     <i className="bi bi-arrow-clockwise me-1"></i>
//                     Actualiser
//                   </Button>
//                 </div>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 {loading ? (
//                   <div className="text-center py-5">
//                     <Spinner animation="border" />
//                     <p className="mt-2">Chargement...</p>
//                   </div>
//                 ) : episodes.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-collection-play fs-1 text-muted"></i>
//                     <p className="text-muted mt-2">Aucun épisode trouvé</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>
//                       Créer le premier épisode
//                     </Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th>Épisode</th>
//                         <th>Programme</th>
//                         <th>Saison/Épisode</th>
//                         <th>Durée</th>
//                         <th>Diffusion</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {episodes.map((episode) => (
//                         <tr key={episode._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {episode.image && (
//                                 <img
//                                   src={episode.image}
//                                   alt={episode.title}
//                                   className="rounded me-2"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               )}
//                               <div>
//                                 <h6 className="mb-0">{episode.title}</h6>
//                                 {episode.featured && (
//                                   <Badge bg="warning" size="sm">
//                                     <i className="bi bi-star-fill me-1"></i>
//                                     Vedette
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <Badge bg="secondary">
//                               {episode.programId?.title || 'Programme supprimé'}
//                             </Badge>
//                           </td>
//                           <td>
//                             <span className="fw-bold">S{episode.season}E{episode.episodeNumber}</span>
//                           </td>
//                           <td>{formatDuration(episode.duration)}</td>
//                           <td>
//                             <small>{formatDate(episode.airDate)}</small>
//                           </td>
//                           <td>{getStatusBadge(episode.status)}</td>
//                           <td>
//                             <div className="btn-group" role="group">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleOpenModal(episode)}
//                                 title="Modifier"
//                               >
//                                 <i className="bi bi-pencil"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 title="Écouter"
//                               >
//                                 <i className="bi bi-play-fill"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(episode._id)}
//                                 title="Supprimer"
//                               >
//                                 <i className="bi bi-trash"></i>
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 )}
//               </Card.Body>
              
//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Card.Footer>
//                   <div className="d-flex justify-content-center">
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === 1}
//                       onClick={() => fetchEpisodes(currentPage - 1)}
//                     >
//                       Précédent
//                     </Button>
//                     <span className="mx-3 align-self-center">
//                       Page {currentPage} sur {totalPages}
//                     </span>
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === totalPages}
//                       onClick={() => fetchEpisodes(currentPage + 1)}
//                     >
//                       Suivant
//                     </Button>
//                   </div>
//                 </Card.Footer>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       {/* Episode Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-collection-play me-2"></i>
//             {editingEpisode ? 'Modifier l\'épisode' : 'Nouvel épisode'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={8}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     isInvalid={!!errors.title}
//                     placeholder="Titre de l'épisode"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Programme *</Form.Label>
//                   {loadingPrograms ? (
//                     <Form.Control disabled value="Chargement des programmes..." />
//                   ) : (
//                     <Form.Select
//                       name="programId"
//                       value={formData.programId}
//                       onChange={handleChange}
//                       isInvalid={!!errors.programId}
//                     >
//                       <option value="">Choisir un programme</option>
//                       {Array.isArray(programs) && programs.map(program => (
//                         <option key={program._id} value={program._id}>
//                           {program.title}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   )}
//                   <Form.Control.Feedback type="invalid">
//                     {errors.programId}
//                   </Form.Control.Feedback>
//                   {!loadingPrograms && (!Array.isArray(programs) || programs.length === 0) && (
//                     <Form.Text className="text-warning">
//                       Aucun programme disponible. Créez d'abord un programme.
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Description *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 isInvalid={!!errors.description}
//                 placeholder="Description de l'épisode"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.description}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Row>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Saison *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="season"
//                     value={formData.season}
//                     onChange={handleChange}
//                     isInvalid={!!errors.season}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.season}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Numéro *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="episodeNumber"
//                     value={formData.episodeNumber}
//                     onChange={handleChange}
//                     isInvalid={!!errors.episodeNumber}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.episodeNumber}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Durée (sec) *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     isInvalid={!!errors.duration}
//                     min="60"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.duration}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Statut</Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                   >
//                     {statusOptions.map(status => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Date de diffusion</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 name="airDate"
//                 value={formData.airDate}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Fichier audio (URL)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="audioFile"
//                 value={formData.audioFile}
//                 onChange={handleChange}
//                 placeholder="https://example.com/audio.mp3"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Image (URL)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleChange}
//                 label="Épisode en vedette"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary">
//               <i className="bi bi-save me-1"></i>
//               {editingEpisode ? 'Mettre à jour' : 'Créer'}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminEpisodes;

// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminEpisodes = () => {
//   const { getEpisodes, getPrograms, createEpisode, updateEpisode, deleteEpisode } = useRadio();
  
//   const [episodes, setEpisodes] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingPrograms, setLoadingPrograms] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingEpisode, setEditingEpisode] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     programId: '',
//     season: 1,
//     episodeNumber: 1,
//     duration: 3600,
//     airDate: '',
//     audioFile: '',
//     image: '',
//     featured: false,
//     status: 'draft'
//   });
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // États pour l'upload de fichiers
//   const [selectedImageFile, setSelectedImageFile] = useState(null);
//   const [selectedAudioFile, setSelectedAudioFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const statusOptions = [
//     { value: 'draft', label: 'Brouillon', color: 'secondary' },
//     { value: 'scheduled', label: 'Programmé', color: 'warning' },
//     { value: 'aired', label: 'Diffusé', color: 'success' },
//     { value: 'archived', label: 'Archivé', color: 'dark' }
//   ];

//   const fetchEpisodes = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const data = await getEpisodes({ page, limit: 10 });
//       setEpisodes(Array.isArray(data.episodes) ? data.episodes : []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error('Failed to fetch episodes:', error);
//       setEpisodes([]);
//       showAlert('danger', 'Erreur lors du chargement des épisodes');
//     } finally {
//       setLoading(false);
//     }
//   }, [getEpisodes]);

//   const fetchPrograms = useCallback(async () => {
//     setLoadingPrograms(true);
//     try {
//       const data = await getPrograms();
//       console.log('Programs data:', data);
      
//       if (Array.isArray(data)) {
//         setPrograms(data);
//       } else if (data && Array.isArray(data.programs)) {
//         setPrograms(data.programs);
//       } else {
//         console.warn('Programs data is not an array:', data);
//         setPrograms([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//       setPrograms([]);
//       showAlert('warning', 'Erreur lors du chargement des programmes');
//     } finally {
//       setLoadingPrograms(false);
//     }
//   }, [getPrograms]);

//   useEffect(() => {
//     fetchPrograms();
//     fetchEpisodes();
//   }, [fetchPrograms, fetchEpisodes]);

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const handleOpenModal = (episode = null) => {
//     if (episode) {
//       setEditingEpisode(episode);
//       setFormData({
//         title: episode.title || '',
//         description: episode.description || '',
//         programId: episode.programId?._id || episode.programId || '',
//         season: episode.season || 1,
//         episodeNumber: episode.episodeNumber || 1,
//         duration: episode.duration || 3600,
//         airDate: episode.airDate ? episode.airDate.slice(0, 16) : '',
//         audioFile: episode.audioFile || '',
//         image: episode.image || '',
//         featured: episode.featured || false,
//         status: episode.status || 'draft'
//       });
//     } else {
//       setEditingEpisode(null);
//       setFormData({
//         title: '',
//         description: '',
//         programId: '',
//         season: 1,
//         episodeNumber: 1,
//         duration: 3600,
//         airDate: '',
//         audioFile: '',
//         image: '',
//         featured: false,
//         status: 'draft'
//       });
//     }
//     setErrors({});
//     setSelectedImageFile(null);
//     setSelectedAudioFile(null);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingEpisode(null);
//     setErrors({});
//     setSelectedImageFile(null);
//     setSelectedAudioFile(null);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
//     }));
//   };

//   // Gestionnaire pour la sélection de fichiers
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (!files || files.length === 0) return;
    
//     const file = files[0];
//     const maxSizeMB = 200;
    
//     if (file.size > maxSizeMB * 1024 * 1024) {
//       showAlert('danger', `Fichier trop volumineux (max ${maxSizeMB}MB)`);
//       return;
//     }

//     if (name === 'imageFile') {
//       if (!file.type.startsWith('image/')) {
//         showAlert('danger', 'Sélectionnez une image valide');
//         return;
//       }
//       setSelectedImageFile(file);
//     } else if (name === 'audioFile') {
//       if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
//         showAlert('danger', 'Sélectionnez un fichier audio/vidéo valide');
//         return;
//       }
//       setSelectedAudioFile(file);
//     }
//   };

//   // Fonction d'upload robuste
//   const uploadFile = async (file) => {
//     if (!file) return null;
    
//     const formData = new FormData();
//     formData.append('file', file);
    
//     setUploading(true);
//     try {
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData
//       });
      
//       const data = await response.json();
//       setUploading(false);
      
//       if (!data) return null;
      
//       // Gestion flexible des différents formats de réponse
//       if (typeof data === 'string') return data;
//       if (data.url) return data.url;
//       if (data.location) return data.location;
//       if (data.path) {
//         let path = data.path;
//         if (!path.startsWith('http') && !path.startsWith('/')) {
//           path = path.startsWith('uploads') ? '/' + path : '/uploads/' + path;
//         }
//         return path;
//       }
//       if (data.filename) return `/uploads/${data.filename}`;
//       if (data.file) {
//         const fileData = data.file;
//         if (fileData.location) return fileData.location;
//         if (fileData.url) return fileData.url;
//         if (fileData.path) {
//           let path = fileData.path;
//           if (!path.startsWith('http') && !path.startsWith('/')) {
//             path = path.startsWith('uploads') ? '/' + path : `/uploads/${fileData.filename || path}`;
//           }
//           return path;
//         }
//         if (fileData.filename) return `/uploads/${fileData.filename}`;
//       }
      
//       return null;
//     } catch (error) {
//       setUploading(false);
//       console.error('Upload error:', error);
//       showAlert('danger', "Erreur lors de l'upload du fichier");
//       return null;
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
//     if (!formData.description.trim()) newErrors.description = 'La description est requise';
//     if (!formData.programId) newErrors.programId = 'Le programme est requis';
//     if (!formData.season || formData.season < 1) newErrors.season = 'La saison doit être >= 1';
//     if (!formData.episodeNumber || formData.episodeNumber < 1) newErrors.episodeNumber = 'Le numéro d\'épisode doit être >= 1';
//     if (!formData.duration || formData.duration < 60) newErrors.duration = 'La durée doit être >= 60 secondes';

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       let updatedFormData = { ...formData };

//       // Upload de l'image si sélectionnée
//       if (selectedImageFile) {
//         const uploadedImageUrl = await uploadFile(selectedImageFile);
//         if (uploadedImageUrl) {
//           updatedFormData.image = uploadedImageUrl;
//         }
//       }

//       // Upload de l'audio/vidéo si sélectionné
//       if (selectedAudioFile) {
//         const uploadedAudioUrl = await uploadFile(selectedAudioFile);
//         if (uploadedAudioUrl) {
//           updatedFormData.audioFile = uploadedAudioUrl;
//         }
//       }

//       // Préparation des données pour l'envoi
//       const episodeData = {
//         ...updatedFormData,
//         season: Number(updatedFormData.season),
//         episodeNumber: Number(updatedFormData.episodeNumber),
//         duration: Number(updatedFormData.duration),
//         airDate: updatedFormData.airDate ? new Date(updatedFormData.airDate).toISOString() : null
//       };

//       console.log('Saving episode with data:', episodeData);

//       if (editingEpisode) {
//         await updateEpisode(editingEpisode._id, episodeData);
//         showAlert('success', 'Épisode mis à jour avec succès');
//       } else {
//         await createEpisode(episodeData);
//         showAlert('success', 'Épisode créé avec succès');
//       }
      
//       handleCloseModal();
//       fetchEpisodes(currentPage);
//     } catch (error) {
//       console.error('Failed to save episode:', error);
//       showAlert('danger', `Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
//     }
//   };

//   const handleDelete = async (episodeId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet épisode ?')) {
//       try {
//         await deleteEpisode(episodeId);
//         showAlert('success', 'Épisode supprimé avec succès');
//         fetchEpisodes(currentPage);
//       } catch (error) {
//         console.error('Failed to delete episode:', error);
//         showAlert('danger', 'Erreur lors de la suppression de l\'épisode');
//       }
//     }
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const statusInfo = statusOptions.find(s => s.value === status);
//     return (
//       <Badge bg={statusInfo?.color || 'secondary'}>
//         {statusInfo?.label || status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="admin-episodes py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-collection-play me-2"></i>
//                   Gestion des Épisodes
//                 </h2>
//                 <p className="text-muted mb-0">Gérez vos épisodes de programmes</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Nouvel Épisode
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Alert */}
//         {alert.show && (
//           <Row className="mb-4">
//             <Col>
//               <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
//                 {alert.message}
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {/* Episodes Table */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Liste des épisodes ({episodes.length})</h5>
//                   <Button variant="outline-primary" size="sm" onClick={() => fetchEpisodes(currentPage)}>
//                     <i className="bi bi-arrow-clockwise me-1"></i>
//                     Actualiser
//                   </Button>
//                 </div>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 {loading ? (
//                   <div className="text-center py-5">
//                     <Spinner animation="border" />
//                     <p className="mt-2">Chargement...</p>
//                   </div>
//                 ) : episodes.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-collection-play fs-1 text-muted"></i>
//                     <p className="text-muted mt-2">Aucun épisode trouvé</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>
//                       Créer le premier épisode
//                     </Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th>Épisode</th>
//                         <th>Programme</th>
//                         <th>Saison/Épisode</th>
//                         <th>Durée</th>
//                         <th>Diffusion</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {episodes.map((episode) => (
//                         <tr key={episode._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {episode.image && (
//                                 <img
//                                   src={episode.image}
//                                   alt={episode.title}
//                                   className="rounded me-2"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               )}
//                               <div>
//                                 <h6 className="mb-0">{episode.title}</h6>
//                                 {episode.featured && (
//                                   <Badge bg="warning" size="sm">
//                                     <i className="bi bi-star-fill me-1"></i>
//                                     Vedette
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <Badge bg="secondary">
//                               {episode.programId?.title || 'Programme supprimé'}
//                             </Badge>
//                           </td>
//                           <td>
//                             <span className="fw-bold">S{episode.season}E{episode.episodeNumber}</span>
//                           </td>
//                           <td>{formatDuration(episode.duration)}</td>
//                           <td>
//                             <small>{formatDate(episode.airDate)}</small>
//                           </td>
//                           <td>{getStatusBadge(episode.status)}</td>
//                           <td>
//                             <div className="btn-group" role="group">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleOpenModal(episode)}
//                                 title="Modifier"
//                               >
//                                 <i className="bi bi-pencil"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 title="Écouter"
//                               >
//                                 <i className="bi bi-play-fill"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(episode._id)}
//                                 title="Supprimer"
//                               >
//                                 <i className="bi bi-trash"></i>
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 )}
//               </Card.Body>
              
//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Card.Footer>
//                   <div className="d-flex justify-content-center">
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === 1}
//                       onClick={() => fetchEpisodes(currentPage - 1)}
//                     >
//                       Précédent
//                     </Button>
//                     <span className="mx-3 align-self-center">
//                       Page {currentPage} sur {totalPages}
//                     </span>
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === totalPages}
//                       onClick={() => fetchEpisodes(currentPage + 1)}
//                     >
//                       Suivant
//                     </Button>
//                   </div>
//                 </Card.Footer>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       {/* Episode Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-collection-play me-2"></i>
//             {editingEpisode ? 'Modifier l\'épisode' : 'Nouvel épisode'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={8}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     isInvalid={!!errors.title}
//                     placeholder="Titre de l'épisode"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Programme *</Form.Label>
//                   {loadingPrograms ? (
//                     <Form.Control disabled value="Chargement des programmes..." />
//                   ) : (
//                     <Form.Select
//                       name="programId"
//                       value={formData.programId}
//                       onChange={handleChange}
//                       isInvalid={!!errors.programId}
//                     >
//                       <option value="">Choisir un programme</option>
//                       {Array.isArray(programs) && programs.map(program => (
//                         <option key={program._id} value={program._id}>
//                           {program.title}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   )}
//                   <Form.Control.Feedback type="invalid">
//                     {errors.programId}
//                   </Form.Control.Feedback>
//                   {!loadingPrograms && (!Array.isArray(programs) || programs.length === 0) && (
//                     <Form.Text className="text-warning">
//                       Aucun programme disponible. Créez d'abord un programme.
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Description *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 isInvalid={!!errors.description}
//                 placeholder="Description de l'épisode"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.description}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Row>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Saison *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="season"
//                     value={formData.season}
//                     onChange={handleChange}
//                     isInvalid={!!errors.season}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.season}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Numéro *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="episodeNumber"
//                     value={formData.episodeNumber}
//                     onChange={handleChange}
//                     isInvalid={!!errors.episodeNumber}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.episodeNumber}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Durée (sec) *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     isInvalid={!!errors.duration}
//                     min="60"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.duration}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Statut</Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                   >
//                     {statusOptions.map(status => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Date de diffusion</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 name="airDate"
//                 value={formData.airDate}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             {/* Section Upload Audio/Vidéo */}
//             <Form.Group className="mb-3">
//               <Form.Label>Fichier audio/vidéo</Form.Label>
//               <Form.Control
//                 type="file"
//                 name="audioFile"
//                 accept="audio/*,video/*"
//                 onChange={handleFileChange}
//               />
//               {selectedAudioFile && selectedAudioFile.type.startsWith('audio/') && (
//                 <div className="mt-2">
//                   <small className="text-muted">Aperçu audio :</small>
//                   <div className="mt-1">
//                     <audio controls src={URL.createObjectURL(selectedAudioFile)} />
//                   </div>
//                 </div>
//               )}
//               {selectedAudioFile && selectedAudioFile.type.startsWith('video/') && (
//                 <div className="mt-2">
//                   <small className="text-muted">Aperçu vidéo :</small>
//                   <div className="mt-1">
//                     <video controls style={{ maxWidth: '100%' }} src={URL.createObjectURL(selectedAudioFile)} />
//                   </div>
//                 </div>
//               )}
//               {!selectedAudioFile && formData.audioFile && (
//                 <div className="mt-2">
//                   <small className="text-muted">Fichier actuel :</small>
//                   <div className="mt-1">
//                     {formData.audioFile.includes('.mp4') || formData.audioFile.includes('video') ? (
//                       <video controls style={{ maxWidth: '100%' }} src={formData.audioFile} />
//                     ) : (
//                       <audio controls src={formData.audioFile} />
//                     )}
//                   </div>
//                 </div>
//               )}
//               <Form.Text className="text-muted">
//                 Téléchargez un fichier audio/vidéo ou saisissez une URL manuellement.
//               </Form.Text>
//             </Form.Group>

//             {/* Champ URL Audio (optionnel) */}
//             <Form.Group className="mb-3">
//               <Form.Label>URL Audio/Vidéo (optionnel)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="audioFile"
//                 value={formData.audioFile}
//                 onChange={handleChange}
//                 placeholder="https://example.com/audio.mp3"
//               />
//             </Form.Group>

//             {/* Section Upload Image */}
//             <Form.Group className="mb-3">
//               <Form.Label>Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 name="imageFile"
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//               {selectedImageFile && (
//                 <div className="mt-2">
//                   <small className="text-muted">Aperçu :</small>
//                   <div className="mt-1">
//                     <img 
//                       alt="preview" 
//                       src={URL.createObjectURL(selectedImageFile)} 
//                       style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} 
//                     />
//                   </div>
//                 </div>
//               )}
//               {!selectedImageFile && formData.image && (
//                 <div className="mt-2">
//                   <small className="text-muted">Image actuelle :</small>
//                   <div className="mt-1">
//                     <img 
//                       alt="current" 
//                       src={formData.image} 
//                       style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} 
//                     />
//                   </div>
//                 </div>
//               )}
//               <Form.Text className="text-muted">
//                 Téléchargez une image ou saisissez une URL manuellement.
//               </Form.Text>
//             </Form.Group>

//             {/* Champ URL Image (optionnel) */}
//             <Form.Group className="mb-3">
//               <Form.Label>URL Image (optionnel)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleChange}
//                 label="Épisode en vedette"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary" disabled={uploading}>
//               {uploading ? (
//                 <>
//                   <Spinner 
//                     as="span" 
//                     animation="border" 
//                     size="sm" 
//                     role="status" 
//                     aria-hidden="true" 
//                     className="me-2" 
//                   />
//                   Téléversement...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-save me-1"></i>
//                   {editingEpisode ? 'Mettre à jour' : 'Créer'}
//                 </>
//               )}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminEpisodes;
// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminEpisodes = () => {
//   const { getEpisodes, getPrograms, createEpisode, updateEpisode, deleteEpisode } = useRadio();
  
//   const [episodes, setEpisodes] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingPrograms, setLoadingPrograms] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingEpisode, setEditingEpisode] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     programId: '',
//     season: 1,
//     episodeNumber: 1,
//     duration: 3600,
//     airDate: '',
//     audioFile: '',
//     image: '',
//     featured: false,
//     status: 'draft'
//   });
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // États pour l'upload de fichiers
//   const [selectedImageFile, setSelectedImageFile] = useState(null);
//   const [selectedAudioFile, setSelectedAudioFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const statusOptions = [
//     { value: 'draft', label: 'Brouillon', color: 'secondary' },
//     { value: 'scheduled', label: 'Programmé', color: 'warning' },
//     { value: 'aired', label: 'Diffusé', color: 'success' },
//     { value: 'archived', label: 'Archivé', color: 'dark' }
//   ];

//   const fetchEpisodes = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const data = await getEpisodes({ page, limit: 10 });
//       setEpisodes(Array.isArray(data.episodes) ? data.episodes : []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error('Failed to fetch episodes:', error);
//       setEpisodes([]);
//       showAlert('danger', 'Erreur lors du chargement des épisodes');
//     } finally {
//       setLoading(false);
//     }
//   }, [getEpisodes]);

//   const fetchPrograms = useCallback(async () => {
//     setLoadingPrograms(true);
//     try {
//       const data = await getPrograms();
//       console.log('Programs data:', data);
      
//       if (Array.isArray(data)) {
//         setPrograms(data);
//       } else if (data && Array.isArray(data.programs)) {
//         setPrograms(data.programs);
//       } else {
//         console.warn('Programs data is not an array:', data);
//         setPrograms([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//       setPrograms([]);
//       showAlert('warning', 'Erreur lors du chargement des programmes');
//     } finally {
//       setLoadingPrograms(false);
//     }
//   }, [getPrograms]);

//   useEffect(() => {
//     fetchPrograms();
//     fetchEpisodes();
//   }, [fetchPrograms, fetchEpisodes]);

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const handleOpenModal = (episode = null) => {
//     if (episode) {
//       setEditingEpisode(episode);
//       setFormData({
//         title: episode.title || '',
//         description: episode.description || '',
//         programId: episode.programId?._id || episode.programId || '',
//         season: episode.season || 1,
//         episodeNumber: episode.episodeNumber || 1,
//         duration: episode.duration || 3600,
//         airDate: episode.airDate ? episode.airDate.slice(0, 16) : '',
//         audioFile: episode.audioFile || '',
//         image: episode.image || '',
//         featured: episode.featured || false,
//         status: episode.status || 'draft'
//       });
//     } else {
//       setEditingEpisode(null);
//       setFormData({
//         title: '',
//         description: '',
//         programId: '',
//         season: 1,
//         episodeNumber: 1,
//         duration: 3600,
//         airDate: '',
//         audioFile: '',
//         image: '',
//         featured: false,
//         status: 'draft'
//       });
//     }
//     setErrors({});
//     setSelectedImageFile(null);
//     setSelectedAudioFile(null);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingEpisode(null);
//     setErrors({});
//     setSelectedImageFile(null);
//     setSelectedAudioFile(null);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
//     }));
//   };

//   // Gestionnaire pour la sélection de fichiers
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (!files || files.length === 0) return;
    
//     const file = files[0];
//     const maxSizeMB = 200;
    
//     if (file.size > maxSizeMB * 1024 * 1024) {
//       showAlert('danger', `Fichier trop volumineux (max ${maxSizeMB}MB)`);
//       return;
//     }

//     if (name === 'imageFile') {
//       if (!file.type.startsWith('image/')) {
//         showAlert('danger', 'Sélectionnez une image valide');
//         return;
//       }
//       setSelectedImageFile(file);
//     } else if (name === 'audioFile') {
//       if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
//         showAlert('danger', 'Sélectionnez un fichier audio/vidéo valide');
//         return;
//       }
//       setSelectedAudioFile(file);
//     }
//   };

//   // Fonction d'upload corrigée
//   const uploadFile = async (file) => {
//     if (!file) return null;
    
//     const formData = new FormData();
//     formData.append('file', file); // Nom correct pour votre backend
    
//     setUploading(true);
//     try {
//       console.log('Upload en cours:', file.name, file.size, 'bytes');
      
//       // Récupérer le token d'authentification si nécessaire
//       const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
//       const headers = {};
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//         headers: headers
//       });
      
//       console.log('Réponse upload:', response.status, response.statusText);
      
//       if (!response.ok) {
//         let errorMessage = 'Erreur inconnue';
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || `Erreur HTTP ${response.status}`;
//           console.error('Erreur serveur upload:', errorData);
//         } catch (e) {
//           errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }
      
//       const data = await response.json();
//       setUploading(false);
      
//       console.log('Données upload reçues:', data);
      
//       if (!data || !data.success) {
//         throw new Error(data?.message || 'Réponse invalide du serveur');
//       }
      
//       // Gestion de la structure de réponse de votre backend
//       if (data.data && data.data.url) return data.data.url;
//       if (data.data && data.data.filename) return `/uploads/${data.data.filename}`;
      
//       return null;
//     } catch (error) {
//       setUploading(false);
//       console.error('Erreur upload:', error);
//       showAlert('danger', `Erreur lors de l'upload: ${error.message}`);
//       return null;
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
//     if (!formData.description.trim()) newErrors.description = 'La description est requise';
//     if (!formData.programId) newErrors.programId = 'Le programme est requis';
//     if (!formData.season || formData.season < 1) newErrors.season = 'La saison doit être >= 1';
//     if (!formData.episodeNumber || formData.episodeNumber < 1) newErrors.episodeNumber = 'Le numéro d\'épisode doit être >= 1';
//     if (!formData.duration || formData.duration < 60) newErrors.duration = 'La durée doit être >= 60 secondes';

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       let updatedFormData = { ...formData };

//       // Upload de l'image si sélectionnée
//       if (selectedImageFile) {
//         console.log('Upload image en cours...');
//         const uploadedImageUrl = await uploadFile(selectedImageFile);
//         if (uploadedImageUrl) {
//           console.log('Image uploadée:', uploadedImageUrl);
//           updatedFormData.image = uploadedImageUrl;
//         }
//       }

//       // Upload de l'audio/vidéo si sélectionné
//       if (selectedAudioFile) {
//         console.log('Upload audio/vidéo en cours...');
//         const uploadedAudioUrl = await uploadFile(selectedAudioFile);
//         if (uploadedAudioUrl) {
//           console.log('Audio/vidéo uploadé:', uploadedAudioUrl);
//           updatedFormData.audioFile = uploadedAudioUrl;
//         }
//       }

//       // Préparation des données pour l'envoi
//       const episodeData = {
//         ...updatedFormData,
//         season: Number(updatedFormData.season),
//         episodeNumber: Number(updatedFormData.episodeNumber),
//         duration: Number(updatedFormData.duration),
//         airDate: updatedFormData.airDate ? new Date(updatedFormData.airDate).toISOString() : null
//       };

//       console.log('Sauvegarde épisode avec données:', episodeData);

//       if (editingEpisode) {
//         console.log('Mise à jour épisode ID:', editingEpisode._id);
//         await updateEpisode(editingEpisode._id, episodeData);
//         showAlert('success', 'Épisode mis à jour avec succès');
//       } else {
//         console.log('Création nouvel épisode');
//         await createEpisode(episodeData);
//         showAlert('success', 'Épisode créé avec succès');
//       }
      
//       handleCloseModal();
//       fetchEpisodes(currentPage);
//     } catch (error) {
//       console.error('Erreur sauvegarde complète:', error);
//       console.error('Détails erreur:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       showAlert('danger', `Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
//     }
//   };

//   const handleDelete = async (episodeId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet épisode ?')) {
//       try {
//         await deleteEpisode(episodeId);
//         showAlert('success', 'Épisode supprimé avec succès');
//         fetchEpisodes(currentPage);
//       } catch (error) {
//         console.error('Failed to delete episode:', error);
//         showAlert('danger', 'Erreur lors de la suppression de l\'épisode');
//       }
//     }
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const statusInfo = statusOptions.find(s => s.value === status);
//     return (
//       <Badge bg={statusInfo?.color || 'secondary'}>
//         {statusInfo?.label || status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="admin-episodes py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-collection-play me-2"></i>
//                   Gestion des Épisodes
//                 </h2>
//                 <p className="text-muted mb-0">Gérez vos épisodes de programmes</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Nouvel Épisode
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Alert */}
//         {alert.show && (
//           <Row className="mb-4">
//             <Col>
//               <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
//                 {alert.message}
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {/* Episodes Table */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Liste des épisodes ({episodes.length})</h5>
//                   <Button variant="outline-primary" size="sm" onClick={() => fetchEpisodes(currentPage)}>
//                     <i className="bi bi-arrow-clockwise me-1"></i>
//                     Actualiser
//                   </Button>
//                 </div>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 {loading ? (
//                   <div className="text-center py-5">
//                     <Spinner animation="border" />
//                     <p className="mt-2">Chargement...</p>
//                   </div>
//                 ) : episodes.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-collection-play fs-1 text-muted"></i>
//                     <p className="text-muted mt-2">Aucun épisode trouvé</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>
//                       Créer le premier épisode
//                     </Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th>Épisode</th>
//                         <th>Programme</th>
//                         <th>Saison/Épisode</th>
//                         <th>Durée</th>
//                         <th>Diffusion</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {episodes.map((episode) => (
//                         <tr key={episode._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {episode.image && (
//                                 <img
//                                   src={episode.image}
//                                   alt={episode.title}
//                                   className="rounded me-2"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               )}
//                               <div>
//                                 <h6 className="mb-0">{episode.title}</h6>
//                                 {episode.featured && (
//                                   <Badge bg="warning" size="sm">
//                                     <i className="bi bi-star-fill me-1"></i>
//                                     Vedette
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <Badge bg="secondary">
//                               {episode.programId?.title || 'Programme supprimé'}
//                             </Badge>
//                           </td>
//                           <td>
//                             <span className="fw-bold">S{episode.season}E{episode.episodeNumber}</span>
//                           </td>
//                           <td>{formatDuration(episode.duration)}</td>
//                           <td>
//                             <small>{formatDate(episode.airDate)}</small>
//                           </td>
//                           <td>{getStatusBadge(episode.status)}</td>
//                           <td>
//                             <div className="btn-group" role="group">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleOpenModal(episode)}
//                                 title="Modifier"
//                               >
//                                 <i className="bi bi-pencil"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 title="Écouter"
//                                 onClick={() => {
//                                   if (episode.audioFile) {
//                                     window.open(episode.audioFile, '_blank');
//                                   } else {
//                                     showAlert('warning', 'Aucun fichier audio disponible');
//                                   }
//                                 }}
//                               >
//                                 <i className="bi bi-play-fill"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(episode._id)}
//                                 title="Supprimer"
//                               >
//                                 <i className="bi bi-trash"></i>
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 )}
//               </Card.Body>
              
//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Card.Footer>
//                   <div className="d-flex justify-content-center">
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === 1}
//                       onClick={() => fetchEpisodes(currentPage - 1)}
//                     >
//                       Précédent
//                     </Button>
//                     <span className="mx-3 align-self-center">
//                       Page {currentPage} sur {totalPages}
//                     </span>
//                     <Button
//                       variant="outline-secondary"
//                       size="sm"
//                       disabled={currentPage === totalPages}
//                       onClick={() => fetchEpisodes(currentPage + 1)}
//                     >
//                       Suivant
//                     </Button>
//                   </div>
//                 </Card.Footer>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       {/* Episode Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-collection-play me-2"></i>
//             {editingEpisode ? 'Modifier l\'épisode' : 'Nouvel épisode'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={8}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     isInvalid={!!errors.title}
//                     placeholder="Titre de l'épisode"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Programme *</Form.Label>
//                   {loadingPrograms ? (
//                     <Form.Control disabled value="Chargement des programmes..." />
//                   ) : (
//                     <Form.Select
//                       name="programId"
//                       value={formData.programId}
//                       onChange={handleChange}
//                       isInvalid={!!errors.programId}
//                     >
//                       <option value="">Choisir un programme</option>
//                       {Array.isArray(programs) && programs.map(program => (
//                         <option key={program._id} value={program._id}>
//                           {program.title}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   )}
//                   <Form.Control.Feedback type="invalid">
//                     {errors.programId}
//                   </Form.Control.Feedback>
//                   {!loadingPrograms && (!Array.isArray(programs) || programs.length === 0) && (
//                     <Form.Text className="text-warning">
//                       Aucun programme disponible. Créez d'abord un programme.
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Description *</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 isInvalid={!!errors.description}
//                 placeholder="Description de l'épisode"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.description}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Row>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Saison *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="season"
//                     value={formData.season}
//                     onChange={handleChange}
//                     isInvalid={!!errors.season}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.season}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Numéro *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="episodeNumber"
//                     value={formData.episodeNumber}
//                     onChange={handleChange}
//                     isInvalid={!!errors.episodeNumber}
//                     min="1"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.episodeNumber}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Durée (sec) *</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     isInvalid={!!errors.duration}
//                     min="60"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.duration}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Statut</Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                   >
//                     {statusOptions.map(status => (
//                       <option key={status.value} value={status.value}>
//                         {status.label}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Date de diffusion</Form.Label>
//               <Form.Control
//                 type="datetime-local"
//                 name="airDate"
//                 value={formData.airDate}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             {/* Section Upload Audio/Vidéo */}
//             <Form.Group className="mb-3">
//               <Form.Label>Fichier audio/vidéo</Form.Label>
//               <Form.Control
//                 type="file"
//                 name="audioFile"
//                 accept="audio/*,video/*"
//                 onChange={handleFileChange}
//               />
//               {selectedAudioFile && selectedAudioFile.type.startsWith('audio/') && (
//                 <div className="mt-2">
//                   <small className="text-muted">Aperçu audio :</small>
//                   <div className="mt-1">
//                     <audio controls src={URL.createObjectURL(selectedAudioFile)} />
//                   </div>
//                 </div>
//               )}
//               {selectedAudioFile && selectedAudioFile.type.startsWith('video/') && (
//                 <div className="mt-2">
//                   <small className="text-muted">Aperçu vidéo :</small>
//                   <div className="mt-1">
//                     <video controls style={{ maxWidth: '100%' }} src={URL.createObjectURL(selectedAudioFile)} />
//                   </div>
//                 </div>
//               )}
//               {!selectedAudioFile && formData.audioFile && (
//                 <div className="mt-2">
//                   <small className="text-muted">Fichier actuel :</small>
//                   <div className="mt-1">
//                     {formData.audioFile.includes('.mp4') || formData.audioFile.includes('video') ? (
//                       <video controls style={{ maxWidth: '100%' }} src={formData.audioFile} />
//                     ) : (
//                       <audio controls src={formData.audioFile} />
//                     )}
//                   </div>
//                 </div>
//               )}
//               <Form.Text className="text-muted">
//                 Téléchargez un fichier audio/vidéo ou saisissez une URL manuellement ci-dessous.
//               </Form.Text>
//             </Form.Group>

//             {/* Champ URL Audio (optionnel) */}
//             <Form.Group className="mb-3">
//               <Form.Label>URL Audio/Vidéo (optionnel)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="audioFile"
//                 value={formData.audioFile}
//                 onChange={handleChange}
//                 placeholder="https://example.com/audio.mp3"
//               />
//               <Form.Text className="text-muted">
//                 Ou saisissez directement l'URL du fichier audio/vidéo
//               </Form.Text>
//             </Form.Group>

//             {/* Section Upload Image */}
//             <Form.Group className="mb-3">
//               <Form.Label>Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 name="imageFile"
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//               {selectedImageFile && (
//                 <div className="mt-2">
//                   <small className="text-muted">Aperçu :</small>
//                   <div className="mt-1">
//                     <img 
//                       alt="preview" 
//                       src={URL.createObjectURL(selectedImageFile)} 
//                       style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} 
//                     />
//                   </div>
//                 </div>
//               )}
//               {!selectedImageFile && formData.image && (
//                 <div className="mt-2">
//                   <small className="text-muted">Image actuelle :</small>
//                   <div className="mt-1">
//                     <img 
//                       alt="current" 
//                       src={formData.image} 
//                       style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} 
//                     />
//                   </div>
//                 </div>
//               )}
//               <Form.Text className="text-muted">
//                 Téléchargez une image ou saisissez une URL manuellement ci-dessous.
//               </Form.Text>
//             </Form.Group>

//             {/* Champ URL Image (optionnel) */}
//             <Form.Group className="mb-3">
//               <Form.Label>URL Image (optionnel)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//               />
//               <Form.Text className="text-muted">
//                 Ou saisissez directement l'URL de l'image
//               </Form.Text>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleChange}
//                 label="Épisode en vedette"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal} disabled={uploading}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary" disabled={uploading}>
//               {uploading ? (
//                 <>
//                   <Spinner 
//                     as="span" 
//                     animation="border" 
//                     size="sm" 
//                     role="status" 
//                     aria-hidden="true" 
//                     className="me-2" 
//                   />
//                   Téléversement...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-save me-1"></i>
//                   {editingEpisode ? 'Mettre à jour' : 'Créer'}
//                 </>
//               )}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminEpisodes; 


import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRadio } from '../../contexts/RadioContext';

const AdminEpisodes = () => {
  const { getEpisodes, getPrograms, createEpisode, updateEpisode, deleteEpisode } = useRadio();
  
  const [episodes, setEpisodes] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    programId: '',
    season: 1,
    episodeNumber: 1,
    duration: 3600,
    airDate: '',
    audioFile: '',
    image: '',
    featured: false,
    status: 'draft'
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // États pour l'upload de fichiers
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const statusOptions = [
    { value: 'draft', label: 'Brouillon', color: 'secondary' },
    { value: 'scheduled', label: 'Programmé', color: 'warning' },
    { value: 'aired', label: 'Diffusé', color: 'success' },
    { value: 'archived', label: 'Archivé', color: 'dark' }
  ];

  const fetchEpisodes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await getEpisodes({ page, limit: 10 });
      setEpisodes(Array.isArray(data.episodes) ? data.episodes : []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
      setEpisodes([]);
      showAlert('danger', 'Erreur lors du chargement des épisodes');
    } finally {
      setLoading(false);
    }
  }, [getEpisodes]);

  const fetchPrograms = useCallback(async () => {
    setLoadingPrograms(true);
    try {
      const data = await getPrograms();
      console.log('Programs data:', data);
      
      if (Array.isArray(data)) {
        setPrograms(data);
      } else if (data && Array.isArray(data.programs)) {
        setPrograms(data.programs);
      } else {
        console.warn('Programs data is not an array:', data);
        setPrograms([]);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      setPrograms([]);
      showAlert('warning', 'Erreur lors du chargement des programmes');
    } finally {
      setLoadingPrograms(false);
    }
  }, [getPrograms]);

  useEffect(() => {
    fetchPrograms();
    fetchEpisodes();
  }, [fetchPrograms, fetchEpisodes]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleOpenModal = (episode = null) => {
    if (episode) {
      setEditingEpisode(episode);
      setFormData({
        title: episode.title || '',
        description: episode.description || '',
        programId: episode.programId?._id || episode.programId || '',
        season: episode.season || 1,
        episodeNumber: episode.episodeNumber || 1,
        duration: episode.duration || 3600,
        airDate: episode.airDate ? episode.airDate.slice(0, 16) : '',
        audioFile: episode.audioFile || '',
        image: episode.image || '',
        featured: episode.featured || false,
        status: episode.status || 'draft'
      });
    } else {
      setEditingEpisode(null);
      setFormData({
        title: '',
        description: '',
        programId: '',
        season: 1,
        episodeNumber: 1,
        duration: 3600,
        airDate: '',
        audioFile: '',
        image: '',
        featured: false,
        status: 'draft'
      });
    }
    setErrors({});
    setSelectedImageFile(null);
    setSelectedAudioFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEpisode(null);
    setErrors({});
    setSelectedImageFile(null);
    setSelectedAudioFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  // Gestionnaire pour la sélection de fichiers
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSizeMB = 200;
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      showAlert('danger', `Fichier trop volumineux (max ${maxSizeMB}MB)`);
      return;
    }

    if (name === 'imageFile') {
      if (!file.type.startsWith('image/')) {
        showAlert('danger', 'Sélectionnez une image valide');
        return;
      }
      setSelectedImageFile(file);
    } else if (name === 'audioFile') {
      if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
        showAlert('danger', 'Sélectionnez un fichier audio/vidéo valide');
        return;
      }
      setSelectedAudioFile(file);
    }
  };

  // Fonction d'upload corrigée et flexible
  const uploadFile = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    // Essayer différents noms de champs selon votre backend
    formData.append('file', file);
    formData.append('media', file);
    formData.append('upload', file);
    
    setUploading(true);
    try {
      console.log('Upload en cours:', file.name, file.size, 'bytes');
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('adminToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('token');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: headers
      });
      
      console.log('Réponse upload:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = 'Erreur inconnue';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `Erreur HTTP ${response.status}`;
          console.error('Erreur serveur upload:', errorData);
        } catch (e) {
          errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setUploading(false);
      
      console.log('Données upload reçues:', data);
      
      // Gestion flexible des différentes structures de réponse
      if (data.success === false) {
        throw new Error(data.message || 'Upload échoué');
      }
      
      // Essayer différentes structures de réponse possibles
      let uploadedUrl = null;
      
      if (data.url) uploadedUrl = data.url;
      else if (data.data && data.data.url) uploadedUrl = data.data.url;
      else if (data.data && data.data.filename) uploadedUrl = `/uploads/${data.data.filename}`;
      else if (data.filename) uploadedUrl = `/uploads/${data.filename}`;
      else if (data.path) uploadedUrl = data.path.startsWith('/') ? data.path : `/${data.path}`;
      else if (data.location) uploadedUrl = data.location;
      else if (typeof data === 'string') uploadedUrl = data;
      
      if (!uploadedUrl) {
        console.warn('Structure de réponse non reconnue:', data);
        throw new Error('URL de fichier non trouvée dans la réponse');
      }
      
      console.log('URL finale:', uploadedUrl);
      return uploadedUrl;
      
    } catch (error) {
      setUploading(false);
      console.error('Erreur upload:', error);
      showAlert('danger', `Erreur lors de l'upload: ${error.message}`);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation stricte pour éviter les erreurs 400
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.programId || formData.programId.trim() === '') {
      newErrors.programId = 'Le programme est requis';
    }
    
    // Vérifier que le programme existe
    if (formData.programId && !programs.find(p => p._id === formData.programId)) {
      newErrors.programId = 'Programme invalide ou inexistant';
    }
    
    if (!formData.season || formData.season < 1 || isNaN(formData.season)) {
      newErrors.season = 'La saison doit être un nombre >= 1';
    }
    
    if (!formData.episodeNumber || formData.episodeNumber < 1 || isNaN(formData.episodeNumber)) {
      newErrors.episodeNumber = 'Le numéro d\'épisode doit être un nombre >= 1';
    }
    
    if (!formData.duration || formData.duration < 60 || isNaN(formData.duration)) {
      newErrors.duration = 'La durée doit être un nombre >= 60 secondes';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      showAlert('danger', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      let updatedFormData = { ...formData };

      // Upload de l'image si sélectionnée
      if (selectedImageFile) {
        console.log('Upload image en cours...');
        const uploadedImageUrl = await uploadFile(selectedImageFile);
        if (uploadedImageUrl) {
          console.log('Image uploadée:', uploadedImageUrl);
          updatedFormData.image = uploadedImageUrl;
        } else {
          showAlert('warning', 'Échec upload image, sauvegarde sans image');
        }
      }

      // Upload de l'audio/vidéo si sélectionné
      if (selectedAudioFile) {
        console.log('Upload audio/vidéo en cours...');
        const uploadedAudioUrl = await uploadFile(selectedAudioFile);
        if (uploadedAudioUrl) {
          console.log('Audio/vidéo uploadé:', uploadedAudioUrl);
          updatedFormData.audioFile = uploadedAudioUrl;
        } else {
          showAlert('warning', 'Échec upload audio, sauvegarde sans fichier audio');
        }
      }

      // Nettoyage et préparation des données pour éviter les erreurs 400
      const episodeData = {
        title: updatedFormData.title.trim(),
        description: updatedFormData.description.trim(),
        programId: updatedFormData.programId,
        season: parseInt(updatedFormData.season, 10),
        episodeNumber: parseInt(updatedFormData.episodeNumber, 10),
        duration: parseInt(updatedFormData.duration, 10),
        status: updatedFormData.status || 'draft',
        featured: Boolean(updatedFormData.featured)
      };

      // Ajouter la date seulement si elle est définie
      if (updatedFormData.airDate) {
        try {
          episodeData.airDate = new Date(updatedFormData.airDate).toISOString();
        } catch (dateError) {
          console.warn('Date invalide, ignorée:', updatedFormData.airDate);
        }
      }

      // Ajouter les URLs seulement si elles sont définies
      if (updatedFormData.audioFile && updatedFormData.audioFile.trim()) {
        episodeData.audioFile = updatedFormData.audioFile.trim();
      }
      
      if (updatedFormData.image && updatedFormData.image.trim()) {
        episodeData.image = updatedFormData.image.trim();
      }

      console.log('Données finales envoyées:', episodeData);

      if (editingEpisode) {
        console.log('Mise à jour épisode ID:', editingEpisode._id);
        await updateEpisode(editingEpisode._id, episodeData);
        showAlert('success', 'Épisode mis à jour avec succès');
      } else {
        console.log('Création nouvel épisode');
        await createEpisode(episodeData);
        showAlert('success', 'Épisode créé avec succès');
      }
      
      handleCloseModal();
      fetchEpisodes(currentPage);
      
    } catch (error) {
      console.error('Erreur sauvegarde complète:', error);
      
      // Gestion détaillée des erreurs pour debugging
      if (error.response) {
        console.error('Réponse serveur:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        
        if (error.response.status === 400) {
          const serverErrors = error.response.data;
          if (serverErrors.errors) {
            // Erreurs de validation Mongoose
            const validationErrors = {};
            Object.keys(serverErrors.errors).forEach(key => {
              validationErrors[key] = serverErrors.errors[key].message;
            });
            setErrors(validationErrors);
            showAlert('danger', 'Erreurs de validation: vérifiez les champs requis');
          } else {
            showAlert('danger', `Erreur 400: ${serverErrors.message || 'Données invalides'}`);
          }
        } else {
          showAlert('danger', `Erreur serveur ${error.response.status}: ${error.response.data.message || 'Erreur inconnue'}`);
        }
      } else {
        showAlert('danger', `Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
      }
    }
  };

  const handleDelete = async (episodeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet épisode ?')) {
      try {
        await deleteEpisode(episodeId);
        showAlert('success', 'Épisode supprimé avec succès');
        fetchEpisodes(currentPage);
      } catch (error) {
        console.error('Failed to delete episode:', error);
        showAlert('danger', 'Erreur lors de la suppression de l\'épisode');
      }
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    return (
      <Badge bg={statusInfo?.color || 'secondary'}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  return (
    <div className="admin-episodes py-4">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  <i className="bi bi-collection-play me-2"></i>
                  Gestion des Épisodes
                </h2>
                <p className="text-muted mb-0">Gérez vos épisodes de programmes</p>
              </div>
              <div>
                <Link to="/admin" className="btn btn-outline-secondary me-2">
                  <i className="bi bi-arrow-left me-1"></i>
                  Retour
                </Link>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Nouvel Épisode
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Alert */}
        {alert.show && (
          <Row className="mb-4">
            <Col>
              <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>
                {alert.message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Episodes Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Liste des épisodes ({episodes.length})</h5>
                  <Button variant="outline-primary" size="sm" onClick={() => fetchEpisodes(currentPage)}>
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualiser
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Chargement...</p>
                  </div>
                ) : episodes.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-collection-play fs-1 text-muted"></i>
                    <p className="text-muted mt-2">Aucun épisode trouvé</p>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                      Créer le premier épisode
                    </Button>
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Épisode</th>
                        <th>Programme</th>
                        <th>Saison/Épisode</th>
                        <th>Durée</th>
                        <th>Diffusion</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {episodes.map((episode) => (
                        <tr key={episode._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {episode.image && (
                                <img
                                  src={episode.image}
                                  alt={episode.title}
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <h6 className="mb-0">{episode.title}</h6>
                                {episode.featured && (
                                  <Badge bg="warning" size="sm">
                                    <i className="bi bi-star-fill me-1"></i>
                                    Vedette
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {episode.programId?.title || 'Programme supprimé'}
                            </Badge>
                          </td>
                          <td>
                            <span className="fw-bold">S{episode.season}E{episode.episodeNumber}</span>
                          </td>
                          <td>{formatDuration(episode.duration)}</td>
                          <td>
                            <small>{formatDate(episode.airDate)}</small>
                          </td>
                          <td>{getStatusBadge(episode.status)}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenModal(episode)}
                                title="Modifier"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                title="Écouter"
                                onClick={() => {
                                  if (episode.audioFile) {
                                    window.open(episode.audioFile, '_blank');
                                  } else {
                                    showAlert('warning', 'Aucun fichier audio disponible');
                                  }
                                }}
                              >
                                <i className="bi bi-play-fill"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(episode._id)}
                                title="Supprimer"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Card.Footer>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => fetchEpisodes(currentPage - 1)}
                    >
                      Précédent
                    </Button>
                    <span className="mx-3 align-self-center">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => fetchEpisodes(currentPage + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Episode Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-collection-play me-2"></i>
            {editingEpisode ? 'Modifier l\'épisode' : 'Nouvel épisode'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    placeholder="Titre de l'épisode"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Programme *</Form.Label>
                  {loadingPrograms ? (
                    <Form.Control disabled value="Chargement des programmes..." />
                  ) : (
                    <Form.Select
                      name="programId"
                      value={formData.programId}
                      onChange={handleChange}
                      isInvalid={!!errors.programId}
                    >
                      <option value="">Choisir un programme</option>
                      {Array.isArray(programs) && programs.map(program => (
                        <option key={program._id} value={program._id}>
                          {program.title}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.programId}
                  </Form.Control.Feedback>
                  {!loadingPrograms && (!Array.isArray(programs) || programs.length === 0) && (
                    <Form.Text className="text-warning">
                      Aucun programme disponible. <Link to="/admin/programs">Créez d'abord un programme</Link>.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                placeholder="Description de l'épisode"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Saison *</Form.Label>
                  <Form.Control
                    type="number"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    isInvalid={!!errors.season}
                    min="1"
                    max="999"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.season}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Numéro *</Form.Label>
                  <Form.Control
                    type="number"
                    name="episodeNumber"
                    value={formData.episodeNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.episodeNumber}
                    min="1"
                    max="999"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.episodeNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Durée (sec) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    isInvalid={!!errors.duration}
                    min="60"
                    max="86400"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Date de diffusion (optionnel)</Form.Label>
              <Form.Control
                type="datetime-local"
                name="airDate"
                value={formData.airDate}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Laissez vide si pas encore programmé
              </Form.Text>
            </Form.Group>

            {/* Section Upload Audio/Vidéo */}
            <Form.Group className="mb-3">
              <Form.Label>Fichier audio/vidéo</Form.Label>
              <Form.Control
                type="file"
                name="audioFile"
                accept="audio/*,video/*"
                onChange={handleFileChange}
              />
              {selectedAudioFile && selectedAudioFile.type.startsWith('audio/') && (
                <div className="mt-2">
                  <small className="text-muted">Aperçu audio :</small>
                  <div className="mt-1">
                    <audio controls src={URL.createObjectURL(selectedAudioFile)} />
                  </div>
                </div>
              )}
              {selectedAudioFile && selectedAudioFile.type.startsWith('video/') && (
                <div className="mt-2">
                  <small className="text-muted">Aperçu vidéo :</small>
                  <div className="mt-1">
                    <video controls style={{ maxWidth: '100%' }} src={URL.createObjectURL(selectedAudioFile)} />
                  </div>
                </div>
              )}
              {!selectedAudioFile && formData.audioFile && (
                <div className="mt-2">
                  <small className="text-muted">Fichier actuel :</small>
                  <div className="mt-1">
                    {formData.audioFile.includes('.mp4') || formData.audioFile.includes('video') ? (
                      <video controls style={{ maxWidth: '100%' }} src={formData.audioFile} />
                    ) : (
                      <audio controls src={formData.audioFile} />
                    )}
                  </div>
                </div>
              )}
              <Form.Text className="text-muted">
                Téléchargez un fichier audio/vidéo ou saisissez une URL manuellement ci-dessous.
              </Form.Text>
            </Form.Group>

            {/* Champ URL Audio (optionnel) */}
            <Form.Group className="mb-3">
              <Form.Label>URL Audio/Vidéo (optionnel)</Form.Label>
              <Form.Control
                type="url"
                name="audioFile"
                value={formData.audioFile}
                onChange={handleChange}
                placeholder="https://example.com/audio.mp3"
              />
              <Form.Text className="text-muted">
                Ou saisissez directement l'URL du fichier audio/vidéo
              </Form.Text>
            </Form.Group>

            {/* Section Upload Image */}
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
              />
              {selectedImageFile && (
                <div className="mt-2">
                  <small className="text-muted">Aperçu :</small>
                  <div className="mt-1">
                    <img 
                      alt="preview" 
                      src={URL.createObjectURL(selectedImageFile)} 
                      style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} 
                    />
                  </div>
                </div>
              )}
              {!selectedImageFile && formData.image && (
                <div className="mt-2">
                  <small className="text-muted">Image actuelle :</small>
                  <div className="mt-1">
                    <img 
                      alt="current" 
                      src={formData.image} 
                      style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} 
                    />
                  </div>
                </div>
              )}
              <Form.Text className="text-muted">
                Téléchargez une image ou saisissez une URL manuellement ci-dessous.
              </Form.Text>
            </Form.Group>

            {/* Champ URL Image (optionnel) */}
            <Form.Group className="mb-3">
              <Form.Label>URL Image (optionnel)</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <Form.Text className="text-muted">
                Ou saisissez directement l'URL de l'image
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                label="Épisode en vedette"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={uploading}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? (
                <>
                  <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                    className="me-2" 
                  />
                  Téléversement...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-1"></i>
                  {editingEpisode ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminEpisodes;