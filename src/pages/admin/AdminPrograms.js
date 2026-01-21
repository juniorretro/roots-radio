// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useRadio } from '../../contexts/RadioContext';

// const AdminPrograms = () => {
//   const { getPrograms, createProgram, updateProgram, deleteProgram } = useRadio();
  
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingProgram, setEditingProgram] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     slug: '',
//     description: '',
//     host: '',
//     category: '',
//     image: '',
//     active: true,
//     featured: false,
//     schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
//   });
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });

//   const categories = ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation'];
//   const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//   const dayLabels = {
//     monday: 'Lundi',
//     tuesday: 'Mardi', 
//     wednesday: 'Mercredi',
//     thursday: 'Jeudi',
//     friday: 'Vendredi',
//     saturday: 'Samedi',
//     sunday: 'Dimanche'
//   };

//   const fetchPrograms = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await getPrograms();
//       setPrograms(data || []);
//     } catch (error) {
//       console.error('Failed to fetch programs:', error);
//       showAlert('danger', 'Erreur lors du chargement des programmes');
//     } finally {
//       setLoading(false);
//     }
//   }, [getPrograms]);

//   useEffect(() => {
//     fetchPrograms();
//   }, [fetchPrograms]);

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const handleOpenModal = (program = null) => {
//     if (program) {
//       setEditingProgram(program);
//       setFormData({
//         title: program.title,
//         slug: program.slug,
//         description: program.description,
//         host: program.host,
//         category: program.category,
//         image: program.image || '',
//         active: program.active,
//         featured: program.featured,
//         schedule: program.schedule || [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
//       });
//     } else {
//       setEditingProgram(null);
//       setFormData({
//         title: '',
//         slug: '',
//         description: '',
//         host: '',
//         category: '',
//         image: '',
//         active: true,
//         featured: false,
//         schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
//       });
//     }
//     setErrors({});
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingProgram(null);
//     setFormData({
//       title: '',
//       slug: '',
//       description: '',
//       host: '',
//       category: '',
//       image: '',
//       active: true,
//       featured: false,
//       schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
//     });
//     setErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     // Auto-generate slug from title
//     if (name === 'title') {
//       const slug = value.toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/(^-|-$)/g, '');
//       setFormData(prev => ({ ...prev, slug }));
//     }
//   };

//   const handleScheduleChange = (index, field, value) => {
//     const newSchedule = [...formData.schedule];
//     newSchedule[index] = { ...newSchedule[index], [field]: value };
    
//     // Calculate duration if start or end time changes
//     if (field === 'startTime' || field === 'endTime') {
//       const start = field === 'startTime' ? value : newSchedule[index].startTime;
//       const end = field === 'endTime' ? value : newSchedule[index].endTime;
      
//       if (start && end) {
//         const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
//         const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
//         newSchedule[index].duration = endMinutes - startMinutes;
//       }
//     }
    
//     setFormData(prev => ({ ...prev, schedule: newSchedule }));
//   };

//   const addScheduleSlot = () => {
//     setFormData(prev => ({
//       ...prev,
//       schedule: [...prev.schedule, { day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
//     }));
//   };

//   const removeScheduleSlot = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       schedule: prev.schedule.filter((_, i) => i !== index)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
//     if (!formData.slug.trim()) newErrors.slug = 'Le slug est requis';
//     if (!formData.description.trim()) newErrors.description = 'La description est requise';
//     if (!formData.host.trim()) newErrors.host = 'L\'animateur est requis';
//     if (!formData.category) newErrors.category = 'La catégorie est requise';

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
//       if (editingProgram) {
//         await updateProgram(editingProgram._id, formData);
//         showAlert('success', 'Programme mis à jour avec succès');
//       } else {
//         await createProgram(formData);
//         showAlert('success', 'Programme créé avec succès');
//       }
      
//       handleCloseModal();
//       fetchPrograms();
//     } catch (error) {
//       console.error('Failed to save program:', error);
//       showAlert('danger', 'Erreur lors de la sauvegarde du programme');
//     }
//   };

//   const handleDelete = async (programId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
//       try {
//         await deleteProgram(programId);
//         showAlert('success', 'Programme supprimé avec succès');
//         fetchPrograms();
//       } catch (error) {
//         console.error('Failed to delete program:', error);
//         showAlert('danger', 'Erreur lors de la suppression du programme');
//       }
//     }
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     return timeString.slice(0, 5);
//   };

//   return (
//     <div className="admin-programs py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2>
//                   <i className="bi bi-calendar3 me-2"></i>
//                   Gestion des Programmes
//                 </h2>
//                 <p className="text-muted mb-0">Gérez vos programmes radio</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1"></i>
//                   Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Nouveau Programme
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

//         {/* Programs Table */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">Liste des programmes ({programs.length})</h5>
//                   <Button variant="outline-primary" size="sm" onClick={fetchPrograms}>
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
//                 ) : programs.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-calendar-x fs-1 text-muted"></i>
//                     <p className="text-muted mt-2">Aucun programme trouvé</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>
//                       Créer le premier programme
//                     </Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th>Programme</th>
//                         <th>Animateur</th>
//                         <th>Catégorie</th>
//                         <th>Horaires</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {programs.map((program) => (
//                         <tr key={program._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {program.image && (
//                                 <img
//                                   src={program.image}
//                                   alt={program.title}
//                                   className="rounded me-2"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               )}
//                               <div>
//                                 <h6 className="mb-0">{program.title}</h6>
//                                 <small className="text-muted">{program.slug}</small>
//                               </div>
//                             </div>
//                           </td>
//                           <td>{program.host}</td>
//                           <td>
//                             <Badge bg="secondary">{program.category}</Badge>
//                           </td>
//                           <td>
//                             {program.schedule && program.schedule.length > 0 ? (
//                               <div>
//                                 {program.schedule.map((sched, index) => (
//                                   <small key={index} className="d-block">
//                                     {dayLabels[sched.day]}: {formatTime(sched.startTime)} - {formatTime(sched.endTime)}
//                                   </small>
//                                 ))}
//                               </div>
//                             ) : (
//                               <small className="text-muted">Aucun horaire</small>
//                             )}
//                           </td>
//                           <td>
//                             <div>
//                               <Badge bg={program.active ? 'success' : 'danger'} className="me-1">
//                                 {program.active ? 'Actif' : 'Inactif'}
//                               </Badge>
//                               {program.featured && (
//                                 <Badge bg="warning">
//                                   <i className="bi bi-star-fill me-1"></i>
//                                   Vedette
//                                 </Badge>
//                               )}
//                             </div>
//                           </td>
//                           <td>
//                             <div className="btn-group" role="group">
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleDelete(program._id)}
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
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       {/* Program Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-calendar3 me-2"></i>
//             {editingProgram ? 'Modifier le programme' : 'Nouveau programme'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     isInvalid={!!errors.title}
//                     placeholder="Nom du programme"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.title}
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Slug *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="slug"
//                     value={formData.slug}
//                     onChange={handleChange}
//                     isInvalid={!!errors.slug}
//                     placeholder="url-du-programme"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.slug}
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
//                 placeholder="Description du programme"
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
//               <Col md={6}>
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
//               <Form.Label>Image (URL)</Form.Label>
//               <Form.Control
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//               />
//             </Form.Group>

//             <Row className="mb-3">
//               <Col>
//                 <Form.Check
//                   type="checkbox"
//                   name="active"
//                   checked={formData.active}
//                   onChange={handleChange}
//                   label="Programme actif"
//                 />
//               </Col>
//               <Col>
//                 <Form.Check
//                   type="checkbox"
//                   name="featured"
//                   checked={formData.featured}
//                   onChange={handleChange}
//                   label="Programme en vedette"
//                 />
//               </Col>
//             </Row>

//             {/* Schedule Section */}
//             <div className="mb-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <Form.Label className="mb-0">Horaires</Form.Label>
//                 <Button variant="outline-primary" size="sm" onClick={addScheduleSlot}>
//                   <i className="bi bi-plus-circle me-1"></i>
//                   Ajouter un créneau
//                 </Button>
//               </div>
              
//               {formData.schedule.map((schedule, index) => (
//                 <Card key={index} className="mb-2">
//                   <Card.Body className="py-2">
//                     <Row className="align-items-center">
//                       <Col md={3}>
//                         <Form.Select
//                           value={schedule.day}
//                           onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
//                           size="sm"
//                         >
//                           {days.map(day => (
//                             <option key={day} value={day}>{dayLabels[day]}</option>
//                           ))}
//                         </Form.Select>
//                       </Col>
//                       <Col md={3}>
//                         <Form.Control
//                           type="time"
//                           value={schedule.startTime}
//                           onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
//                           size="sm"
//                         />
//                       </Col>
//                       <Col md={3}>
//                         <Form.Control
//                           type="time"
//                           value={schedule.endTime}
//                           onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
//                           size="sm"
//                         />
//                       </Col>
//                       <Col md={2}>
//                         <Form.Control
//                           type="number"
//                           value={schedule.duration || 60}
//                           onChange={(e) => handleScheduleChange(index, 'duration', parseInt(e.target.value))}
//                           size="sm"
//                           placeholder="min"
//                         />
//                       </Col>
//                       <Col md={1}>
//                         {formData.schedule.length > 1 && (
//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             onClick={() => removeScheduleSlot(index)}
//                           >
//                             <i className="bi bi-trash"></i>
//                           </Button>
//                         )}
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               ))}
//             </div>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary">
//               <i className="bi bi-save me-1"></i>
//               {editingProgram ? 'Mettre à jour' : 'Créer'}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminPrograms;
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRadio } from '../../contexts/RadioContext';

const AdminPrograms = () => {
  const { getPrograms, createProgram, updateProgram, deleteProgram } = useRadio();
  
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    host: '',
    category: '',
    image: '',
    active: true,
    featured: false,
    schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // États pour l'upload de fichiers
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = ['Actualité', 'Musique', 'Sport', 'Culture', 'Technologie', 'Divertissement', 'Éducation'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi', 
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPrograms();
      // FIX: Vérification robuste du type de données
      if (Array.isArray(data)) {
        setPrograms(data);
      } else if (data && Array.isArray(data.programs)) {
        // Au cas où les données sont dans un objet { programs: [...] }
        setPrograms(data.programs);
      } else if (data && Array.isArray(data.data)) {
        // Au cas où les données sont dans un objet { data: [...] }
        setPrograms(data.data);
      } else {
        // Si aucune donnée valide, initialiser avec un tableau vide
        console.warn('getPrograms() n\'a pas retourné un tableau valide:', data);
        setPrograms([]);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      // FIX: En cas d'erreur, s'assurer que programs reste un tableau
      setPrograms([]);
      showAlert('danger', 'Erreur lors du chargement des programmes');
    } finally {
      setLoading(false);
    }
  }, [getPrograms]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleOpenModal = (program = null) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title || '',
        slug: program.slug || '',
        description: program.description || '',
        host: program.host || '',
        category: program.category || '',
        image: program.image || '',
        active: program.active !== undefined ? program.active : true,
        featured: program.featured !== undefined ? program.featured : false,
        schedule: Array.isArray(program.schedule) && program.schedule.length > 0 
          ? program.schedule 
          : [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
      });
    } else {
      setEditingProgram(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        host: '',
        category: '',
        image: '',
        active: true,
        featured: false,
        schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
      });
    }
    setErrors({});
    setSelectedImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      host: '',
      category: '',
      image: '',
      active: true,
      featured: false,
      schedule: [{ day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
    });
    setErrors({});
    setSelectedImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Gestionnaire pour la sélection de fichiers
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSizeMB = 10;
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      showAlert('danger', `Image trop volumineuse (max ${maxSizeMB}MB)`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      showAlert('danger', 'Sélectionnez une image valide');
      return;
    }
    
    setSelectedImageFile(file);
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
      showAlert('danger', "Erreur lors de l'upload de l'image");
      return null;
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    
    // Calculate duration if start or end time changes
    if (field === 'startTime' || field === 'endTime') {
      const start = field === 'startTime' ? value : newSchedule[index].startTime;
      const end = field === 'endTime' ? value : newSchedule[index].endTime;
      
      if (start && end) {
        const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
        const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
        newSchedule[index].duration = endMinutes - startMinutes;
      }
    }
    
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: 'monday', startTime: '09:00', endTime: '10:00', duration: 60 }]
    }));
  };

  const removeScheduleSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.slug.trim()) newErrors.slug = 'Le slug est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.host.trim()) newErrors.host = 'L\'animateur est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';

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

      if (editingProgram) {
        await updateProgram(editingProgram._id, updatedFormData);
        showAlert('success', 'Programme mis à jour avec succès');
      } else {
        await createProgram(updatedFormData);
        showAlert('success', 'Programme créé avec succès');
      }
      
      handleCloseModal();
      fetchPrograms();
    } catch (error) {
      console.error('Failed to save program:', error);
      showAlert('danger', 'Erreur lors de la sauvegarde du programme');
    }
  };

  const handleDelete = async (programId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      try {
        await deleteProgram(programId);
        showAlert('success', 'Programme supprimé avec succès');
        fetchPrograms();
      } catch (error) {
        console.error('Failed to delete program:', error);
        showAlert('danger', 'Erreur lors de la suppression du programme');
      }
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  // FIX: Vérification de sécurité avant le rendu
  if (!Array.isArray(programs)) {
    console.error('Programs is not an array:', programs);
    return (
      <div className="admin-programs py-4">
        <Container fluid>
          <Row>
            <Col>
              <Alert variant="danger">
                Erreur: Les données des programmes ne sont pas dans le bon format. 
                Veuillez vérifier votre contexte RadioContext.
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-programs py-4">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>
                  <i className="bi bi-calendar3 me-2"></i>
                  Gestion des Programmes
                </h2>
                <p className="text-muted mb-0">Gérez vos programmes radio</p>
              </div>
              <div>
                <Link to="/admin" className="btn btn-outline-secondary me-2">
                  <i className="bi bi-arrow-left me-1"></i>
                  Retour
                </Link>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Nouveau Programme
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

        {/* Programs Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Liste des programmes ({programs.length})</h5>
                  <Button variant="outline-primary" size="sm" onClick={fetchPrograms}>
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
                ) : programs.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x fs-1 text-muted"></i>
                    <p className="text-muted mt-2">Aucun programme trouvé</p>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                      Créer le premier programme
                    </Button>
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Programme</th>
                        <th>Animateur</th>
                        <th>Catégorie</th>
                        <th>Horaires</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program._id || program.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {program.image && (
                                <img
                                  src={program.image}
                                  alt={program.title}
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <h6 className="mb-0">{program.title}</h6>
                                <small className="text-muted">{program.slug}</small>
                              </div>
                            </div>
                          </td>
                          <td>{program.host}</td>
                          <td>
                            <Badge bg="secondary">{program.category}</Badge>
                          </td>
                          <td>
                            {Array.isArray(program.schedule) && program.schedule.length > 0 ? (
                              <div>
                                {program.schedule.map((sched, index) => (
                                  <small key={index} className="d-block">
                                    {dayLabels[sched.day]}: {formatTime(sched.startTime)} - {formatTime(sched.endTime)}
                                  </small>
                                ))}
                              </div>
                            ) : (
                              <small className="text-muted">Aucun horaire</small>
                            )}
                          </td>
                          <td>
                            <div>
                              <Badge bg={program.active ? 'success' : 'danger'} className="me-1">
                                {program.active ? 'Actif' : 'Inactif'}
                              </Badge>
                              {program.featured && (
                                <Badge bg="warning">
                                  <i className="bi bi-star-fill me-1"></i>
                                  Vedette
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenModal(program)}
                                title="Modifier"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(program._id || program.id)}
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
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Program Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar3 me-2"></i>
            {editingProgram ? 'Modifier le programme' : 'Nouveau programme'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    placeholder="Nom du programme"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug *</Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    isInvalid={!!errors.slug}
                    placeholder="url-du-programme"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.slug}
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
                placeholder="Description du programme"
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
              <Col md={6}>
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

            <Row className="mb-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  label="Programme actif"
                />
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  label="Programme en vedette"
                />
              </Col>
            </Row>

            {/* Schedule Section */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Horaires</Form.Label>
                <Button variant="outline-primary" size="sm" onClick={addScheduleSlot}>
                  <i className="bi bi-plus-circle me-1"></i>
                  Ajouter un créneau
                </Button>
              </div>
              
              {Array.isArray(formData.schedule) && formData.schedule.map((schedule, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="py-2">
                    <Row className="align-items-center">
                      <Col md={3}>
                        <Form.Select
                          value={schedule.day}
                          onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                          size="sm"
                        >
                          {days.map(day => (
                            <option key={day} value={day}>{dayLabels[day]}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                          size="sm"
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                          size="sm"
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="number"
                          value={schedule.duration || 60}
                          onChange={(e) => handleScheduleChange(index, 'duration', parseInt(e.target.value))}
                          size="sm"
                          placeholder="min"
                        />
                      </Col>
                      <Col md={1}>
                        {formData.schedule.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeScheduleSlot(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
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
                  {editingProgram ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPrograms;