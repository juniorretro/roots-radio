// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminPodcasts = () => {
//   const { getPodcasts, createPodcast, updatePodcast, deletePodcast } = useRadio();
  
//   const [podcasts, setPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingPodcast, setEditingPodcast] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     host: '',
//     category: '',
//     duration: 1800,
//     publishDate: '',
//     audioFile: '',
//     image: '',
//     featured: false,
//     tags: []
//   });
//   const [tagInput, setTagInput] = useState('');
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const categories = ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation', 'Santé', 'Business'];

//   const fetchPodcasts = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const data = await getPodcasts({ page, limit: 10 });
//       setPodcasts(data.podcasts || []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(page);
//     } catch (error) {
//       console.error('Failed to fetch podcasts:', error);
//       showAlert('danger', 'Erreur lors du chargement des podcasts');
//     } finally {
//       setLoading(false);
//     }
//   }, [getPodcasts]);

//   useEffect(() => {
//     fetchPodcasts();
//   }, [fetchPodcasts]);

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const handleOpenModal = (podcast = null) => {
//     if (podcast) {
//       setEditingPodcast(podcast);
//       setFormData({
//         title: podcast.title,
//         description: podcast.description,
//         host: podcast.host,
//         category: podcast.category,
//         duration: podcast.duration,
//         publishDate: podcast.publishDate ? podcast.publishDate.slice(0, 16) : '',
//         audioFile: podcast.audioFile || '',
//         image: podcast.image || '',
//         featured: podcast.featured,
//         tags: podcast.tags || []
//       });
//     } else {
//       setEditingPodcast(null);
//       setFormData({
//         title: '',
//         description: '',
//         host: '',
//         category: '',
//         duration: 1800,
//         publishDate: '',
//         audioFile: '',
//         image: '',
//         featured: false,
//         tags: []
//       });
//     }
//     setTagInput('');
//     setErrors({});
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingPodcast(null);
//     setTagInput('');
//     setErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleAddTag = () => {
//     if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()]
//       }));
//       setTagInput('');
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
//     if (!formData.description.trim()) newErrors.description = 'La description est requise';
//     if (!formData.host.trim()) newErrors.host = 'L\'animateur est requis';
//     if (!formData.category) newErrors.category = 'La catégorie est requise';
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
//       if (editingPodcast) {
//         await updatePodcast(editingPodcast._id, formData);
//         showAlert('success', 'Podcast mis à jour avec succès');
//       } else {
//         await createPodcast(formData);
//         showAlert('success', 'Podcast créé avec succès');
//       }
      
//       handleCloseModal();
//       fetchPodcasts(currentPage);
//     } catch (error) {
//       console.error('Failed to save podcast:', error);
//       showAlert('danger', 'Erreur lors de la sauvegarde du podcast');
//     }
//   };

//   const handleDelete = async (podcastId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce podcast ?')) {
//       try {
//         await deletePodcast(podcastId);
//         showAlert('success', 'Podcast supprimé avec succès');
//         fetchPodcasts(currentPage);
//       } catch (error) {
//         console.error('Failed to delete podcast:', error);
//         showAlert('danger', 'Erreur lors de la suppression du podcast');
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
//     return new Date(dateString).toLocaleDateString('fr-FR');
//   };

//   return (
//     <div className="admin-podcasts py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-headphones me-2"></i>
//                   Gestion des Podcasts
//                 </h2>
//                 <p className="text-muted mb-0">Gérez votre bibliothèque de podcasts</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Nouveau Podcast
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

//         {/* Podcasts Table */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Liste des podcasts ({podcasts.length})</h5>
//                   <Button variant="outline-primary" size="sm" onClick={() => fetchPodcasts(currentPage)}>
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
//                 ) : podcasts.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-headphones fs-1 text-muted"></i>
//                     <p className="text-muted mt-2">Aucun podcast trouvé</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>
//                       Créer le premier podcast
//                     </Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th>Podcast</th>
//                         <th>Animateur</th>
//                         <th>Catégorie</th>
//                         <th>Durée</th>
//                         <th>Publication</th>
//                         <th>Stats</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {podcasts.map((podcast) => (
//                         <tr key={podcast._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {podcast.image && (
//                                 <img
//                                   src={podcast.image}
//                                   alt={podcast.title}
//                                   className="rounded me-2"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               )}
//                               <div>
//                                 <h6 className="mb-0">{podcast.title}</h6>
//                                 {podcast.featured && (
//                                   <Badge bg="warning" size="sm">
//                                     <i className="bi bi-star-fill me-1"></i>
//                                     Vedette
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>{podcast.host}</td>
//                           <td>
//                             <Badge bg="secondary">{podcast.category}</Badge>
//                           </td>
//                           <td>{formatDuration(podcast.duration)}</td>
//                           <td>
//                             <small>{formatDate(podcast.publishDate)}</small>
//                           </td>
//                           <td>
//                             <div className="small text-muted">
//                               <div>
//                                 <i className="bi bi-download me-1"></i>
//                                 {podcast.downloads || 0}
//                               </div>
//                               <div>
//                                 <i className="bi bi-heart me-1"></i>
//                                 {podcast.likes || 0}
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="btn-group" role="group">
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => handleOpenModal(podcast)}
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
//                                 onClick={() => handleDelete(podcast._id)}
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
//                       onClick={() => fetchPodcasts(currentPage - 1)}
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
//                       onClick={() => fetchPodcasts(currentPage + 1)}
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

//       {/* Podcast Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-headphones me-2"></i>
//             {editingPodcast ? 'Modifier le podcast' : 'Nouveau podcast'}
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
//                     placeholder="Titre du podcast"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Catégorie *</Form.Label>
//                   <Form.Select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     isInvalid={!!errors.category}
//                   >
//                     <option value="">Choisir une catégorie</option>
//                     {categories.map(cat => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                   </Form.Select>
//                   <Form.Control.Feedback type="invalid">
//                     {errors.category}
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
//                 placeholder="Description du podcast"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.description}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Animateur *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="host"
//                     value={formData.host}
//                     onChange={handleChange}
//                     isInvalid={!!errors.host}
//                     placeholder="Nom de l'animateur"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.host}
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
//                   <Form.Label>Publication</Form.Label>
//                   <Form.Control
//                     type="datetime-local"
//                     name="publishDate"
//                     value={formData.publishDate}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Fichier audio (URL)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="audioFile"
//                 value={formData.audioFile}
//                 onChange={handleChange}
//                 placeholder="https://example.com/podcast.mp3"
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

//             {/* Tags */}
//             <Form.Group className="mb-3">
//               <Form.Label>Tags</Form.Label>
//               <div className="d-flex mb-2">
//                 <Form.Control
//                   type="text"
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   placeholder="Ajouter un tag"
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
//                 />
//                 <Button
//                   variant="outline-secondary"
//                   onClick={handleAddTag}
//                   className="ms-2"
//                 >
//                   Ajouter
//                 </Button>
//               </div>
//               <div className="d-flex flex-wrap gap-1">
//                 {formData.tags.map((tag, index) => (
//                   <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
//                     #{tag}
//                     <Button
//                       variant="link"
//                       size="sm"
//                       className="p-0 ms-1 text-danger"
//                       onClick={() => handleRemoveTag(tag)}
//                     >
//                       <i className="bi bi-x"></i>
//                     </Button>
//                   </Badge>
//                 ))}
//               </div>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleChange}
//                 label="Podcast en vedette"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary">
//               <i className="bi bi-save me-1"></i>
//               {editingPodcast ? 'Mettre à jour' : 'Créer'}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminPodcasts;

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRadio } from '../../contexts/RadioContext';

const AdminPodcasts = () => {
  const { getPodcasts, createPodcast, updatePodcast, deletePodcast } = useRadio();
  
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    host: '',
    category: '',
    duration: 1800,
    publishDate: '',
    audioFile: '',
    image: '',
    featured: false,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // États pour l'upload de fichiers
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation', 'Santé', 'Business'];

  const fetchPodcasts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await getPodcasts({ page, limit: 10 });
      setPodcasts(data.podcasts || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
      showAlert('danger', 'Erreur lors du chargement des podcasts');
    } finally {
      setLoading(false);
    }
  }, [getPodcasts]);

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleOpenModal = (podcast = null) => {
    if (podcast) {
      setEditingPodcast(podcast);
      setFormData({
        title: podcast.title,
        description: podcast.description,
        host: podcast.host,
        category: podcast.category,
        duration: podcast.duration,
        publishDate: podcast.publishDate ? podcast.publishDate.slice(0, 16) : '',
        audioFile: podcast.audioFile || '',
        image: podcast.image || '',
        featured: podcast.featured,
        tags: podcast.tags || []
      });
    } else {
      setEditingPodcast(null);
      setFormData({
        title: '',
        description: '',
        host: '',
        category: '',
        duration: 1800,
        publishDate: '',
        audioFile: '',
        image: '',
        featured: false,
        tags: []
      });
    }
    setTagInput('');
    setErrors({});
    setSelectedImageFile(null);
    setSelectedAudioFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPodcast(null);
    setTagInput('');
    setErrors({});
    setSelectedImageFile(null);
    setSelectedAudioFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  // Fonction d'upload robuste
  const uploadFile = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setUploading(false);
      
      if (!data) return null;
      
      // Gestion flexible des différents formats de réponse
      if (typeof data === 'string') return data;
      if (data.url) return data.url;
      if (data.location) return data.location;
      if (data.path) {
        let path = data.path;
        if (!path.startsWith('http') && !path.startsWith('/')) {
          path = path.startsWith('uploads') ? '/' + path : '/uploads/' + path;
        }
        return path;
      }
      if (data.filename) return `/uploads/${data.filename}`;
      if (data.file) {
        const fileData = data.file;
        if (fileData.location) return fileData.location;
        if (fileData.url) return fileData.url;
        if (fileData.path) {
          let path = fileData.path;
          if (!path.startsWith('http') && !path.startsWith('/')) {
            path = path.startsWith('uploads') ? '/' + path : `/uploads/${fileData.filename || path}`;
          }
          return path;
        }
        if (fileData.filename) return `/uploads/${fileData.filename}`;
      }
      
      return null;
    } catch (error) {
      setUploading(false);
      console.error('Upload error:', error);
      showAlert('danger', "Erreur lors de l'upload du fichier");
      return null;
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.host.trim()) newErrors.host = 'L\'animateur est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.duration || formData.duration < 60) newErrors.duration = 'La durée doit être >= 60 secondes';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      let updatedFormData = { ...formData };

      // Upload de l'image si sélectionnée
      if (selectedImageFile) {
        const uploadedImageUrl = await uploadFile(selectedImageFile);
        if (uploadedImageUrl) {
          updatedFormData.image = uploadedImageUrl;
        }
      }

      // Upload de l'audio/vidéo si sélectionné
      if (selectedAudioFile) {
        const uploadedAudioUrl = await uploadFile(selectedAudioFile);
        if (uploadedAudioUrl) {
          updatedFormData.audioFile = uploadedAudioUrl;
        }
      }

      if (editingPodcast) {
        await updatePodcast(editingPodcast._id, updatedFormData);
        showAlert('success', 'Podcast mis à jour avec succès');
      } else {
        await createPodcast(updatedFormData);
        showAlert('success', 'Podcast créé avec succès');
      }
      
      handleCloseModal();
      fetchPodcasts(currentPage);
    } catch (error) {
      console.error('Failed to save podcast:', error);
      showAlert('danger', 'Erreur lors de la sauvegarde du podcast');
    }
  };

  const handleDelete = async (podcastId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce podcast ?')) {
      try {
        await deletePodcast(podcastId);
        showAlert('success', 'Podcast supprimé avec succès');
        fetchPodcasts(currentPage);
      } catch (error) {
        console.error('Failed to delete podcast:', error);
        showAlert('danger', 'Erreur lors de la suppression du podcast');
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
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="admin-podcasts py-4">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  <i className="bi bi-headphones me-2"></i>
                  Gestion des Podcasts
                </h2>
                <p className="text-muted mb-0">Gérez votre bibliothèque de podcasts</p>
              </div>
              <div>
                <Link to="/admin" className="btn btn-outline-secondary me-2">
                  <i className="bi bi-arrow-left me-1"></i>
                  Retour
                </Link>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Nouveau Podcast
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

        {/* Podcasts Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Liste des podcasts ({podcasts.length})</h5>
                  <Button variant="outline-primary" size="sm" onClick={() => fetchPodcasts(currentPage)}>
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
                ) : podcasts.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-headphones fs-1 text-muted"></i>
                    <p className="text-muted mt-2">Aucun podcast trouvé</p>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                      Créer le premier podcast
                    </Button>
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Podcast</th>
                        <th>Animateur</th>
                        <th>Catégorie</th>
                        <th>Durée</th>
                        <th>Publication</th>
                        <th>Stats</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {podcasts.map((podcast) => (
                        <tr key={podcast._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {podcast.image && (
                                <img
                                  src={podcast.image}
                                  alt={podcast.title}
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <h6 className="mb-0">{podcast.title}</h6>
                                {podcast.featured && (
                                  <Badge bg="warning" size="sm">
                                    <i className="bi bi-star-fill me-1"></i>
                                    Vedette
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{podcast.host}</td>
                          <td>
                            <Badge bg="secondary">{podcast.category}</Badge>
                          </td>
                          <td>{formatDuration(podcast.duration)}</td>
                          <td>
                            <small>{formatDate(podcast.publishDate)}</small>
                          </td>
                          <td>
                            <div className="small text-muted">
                              <div>
                                <i className="bi bi-download me-1"></i>
                                {podcast.downloads || 0}
                              </div>
                              <div>
                                <i className="bi bi-heart me-1"></i>
                                {podcast.likes || 0}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenModal(podcast)}
                                title="Modifier"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                title="Écouter"
                              >
                                <i className="bi bi-play-fill"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(podcast._id)}
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
                      onClick={() => fetchPodcasts(currentPage - 1)}
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
                      onClick={() => fetchPodcasts(currentPage + 1)}
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

      {/* Podcast Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-headphones me-2"></i>
            {editingPodcast ? 'Modifier le podcast' : 'Nouveau podcast'}
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
                    placeholder="Titre du podcast"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
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
                placeholder="Description du podcast"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animateur *</Form.Label>
                  <Form.Control
                    type="text"
                    name="host"
                    value={formData.host}
                    onChange={handleChange}
                    isInvalid={!!errors.host}
                    placeholder="Nom de l'animateur"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.host}
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
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Publication</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

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
                Téléchargez un fichier audio/vidéo ou saisissez une URL manuellement.
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
                placeholder="https://example.com/podcast.mp3"
              />
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
                Téléchargez une image ou saisissez une URL manuellement.
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
            </Form.Group>

            {/* Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleAddTag}
                  className="ms-2"
                >
                  Ajouter
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} bg="light" text="dark" className="d-flex align-items-center">
                    #{tag}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 ms-1 text-danger"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                label="Podcast en vedette"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
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
                  {editingPodcast ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPodcasts;