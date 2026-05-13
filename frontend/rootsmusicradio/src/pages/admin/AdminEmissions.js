// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Container, Row, Col, Card, Table, Button, Modal, Form,
//   Badge, Alert, Spinner, InputGroup
// } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import api from '../../services/api';
// import { toast } from 'react-toastify';

// // ─── Formulaire vide ───────────────────────────────────────────────────────────
// const EMPTY_FORM = {
//   title:       '',
//   host:        '',
//   bio:         '',
//   description: '',
//   cover:       '',
//   audioUrl:    '',
//   schedule:    '',
//   category:    'Émission',
//   duration:    '',   // en secondes
//   programId:   '',
// };

// // ─── Composant ─────────────────────────────────────────────────────────────────
// const AdminEmissions = () => {
//   const [emissions, setEmissions]     = useState([]);
//   const [programs, setPrograms]       = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [showModal, setShowModal]     = useState(false);
//   const [editing, setEditing]         = useState(null);
//   const [formData, setFormData]       = useState(EMPTY_FORM);
//   const [coverFile, setCoverFile]     = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [audioFile, setAudioFile]     = useState(null);
//   const [uploading, setUploading]     = useState(false);
//   const [search, setSearch]           = useState('');
//   const [filterHost, setFilterHost]   = useState('');
//   const [alert, setAlert]             = useState({ show: false, type: '', message: '' });

//   const showAlertMsg = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
//   };

//   // ─── Upload helper ────────────────────────────────────────────────────────
//   const uploadFile = async (file) => {
//     if (!file) return null;
//     const fd = new FormData();
//     fd.append('file', file);
//     setUploading(true);
//     try {
//       const res = await api.post('/api/upload', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setUploading(false);
//       const d = res.data;
//       return d?.data?.url || d?.data?.filename && `/uploads/${d.data.filename}`
//           || d?.url        || d?.filename        && `/uploads/${d.filename}`
//           || null;
//     } catch {
//       setUploading(false);
//       showAlertMsg('danger', "Erreur lors de l'upload");
//       return null;
//     }
//   };

//   // ─── Fetch émissions ──────────────────────────────────────────────────────
//   const fetchEmissions = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/api/emissions?limit=100');
//       // Le backend retourne { emissions: [...], hosts: [...] }
//       // On utilise emissions directement pour l'admin
//       setEmissions(res.data.emissions || []);
//     } catch {
//       showAlertMsg('danger', 'Erreur lors du chargement des émissions');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ─── Fetch programmes (pour le select) ───────────────────────────────────
//   const fetchPrograms = useCallback(async () => {
//     try {
//       const res = await api.get('/api/programs');
//       const list = Array.isArray(res.data) ? res.data
//                  : Array.isArray(res.data?.programs) ? res.data.programs
//                  : [];
//       setPrograms(list);
//     } catch { /* silencieux */ }
//   }, []);

//   useEffect(() => {
//     fetchEmissions();
//     fetchPrograms();
//   }, [fetchEmissions, fetchPrograms]);

//   // ─── Modal open/close ─────────────────────────────────────────────────────
//   const openModal = (emission = null) => {
//     if (emission) {
//       setEditing(emission);
//       setFormData({
//         title:       emission.title       || '',
//         host:        emission.host        || '',
//         bio:         emission.bio         || '',
//         description: emission.description || '',
//         cover:       emission.cover       || '',
//         audioUrl:    emission.audioUrl    || '',
//         schedule:    emission.schedule    || '',
//         category:    emission.category    || 'Émission',
//         duration:    emission.duration    ? String(emission.duration) : '',
//         programId:   emission.programId?._id || emission.programId || '',
//       });
//       setCoverPreview(emission.cover || null);
//     } else {
//       setEditing(null);
//       setFormData(EMPTY_FORM);
//       setCoverPreview(null);
//     }
//     setCoverFile(null);
//     setAudioFile(null);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditing(null);
//     setCoverFile(null);
//     setAudioFile(null);
//     setCoverPreview(null);
//     setFormData(EMPTY_FORM);
//   };

//   // ─── Changements de champs ────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(f => ({ ...f, [name]: value }));
//   };

//   const handleCoverChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('image/')) { showAlertMsg('danger', 'Image invalide'); return; }
//     if (file.size > 10 * 1024 * 1024)   { showAlertMsg('danger', 'Image trop lourde (max 10 MB)'); return; }
//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));
//   };

//   const handleAudioChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('audio/')) { showAlertMsg('danger', 'Fichier audio invalide'); return; }
//     if (file.size > 500 * 1024 * 1024)  { showAlertMsg('danger', 'Fichier trop lourd (max 500 MB)'); return; }
//     setAudioFile(file);
//   };

//   // ─── Soumission ───────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title.trim()) { showAlertMsg('danger', 'Le titre est requis'); return; }
//     if (!formData.host.trim())  { showAlertMsg('danger', "Le nom de l'animateur est requis"); return; }

//     let coverUrl = formData.cover;
//     let audioUrl = formData.audioUrl;

//     if (coverFile) { const up = await uploadFile(coverFile); if (up) coverUrl = up; }
//     if (audioFile) { const up = await uploadFile(audioFile); if (up) audioUrl = up; }

//     const payload = {
//       title:       formData.title.trim(),
//       host:        formData.host.trim(),
//       bio:         formData.bio,
//       description: formData.description,
//       cover:       coverUrl,
//       audioUrl:    audioUrl,
//       schedule:    formData.schedule,
//       category:    formData.category || 'Émission',
//       duration:    formData.duration ? parseInt(formData.duration) : undefined,
//       programId:   formData.programId || undefined,
//     };

//     try {
//       if (editing) {
//         await api.put(`/api/emissions/${editing._id}`, payload);
//         toast.success('Émission mise à jour !');
//       } else {
//         await api.post('/api/emissions', payload);
//         toast.success('Émission créée !');
//       }
//       closeModal();
//       fetchEmissions();
//     } catch (err) {
//       showAlertMsg('danger', err.response?.data?.message || 'Erreur lors de la sauvegarde');
//     }
//   };

//   // ─── Supprimer ────────────────────────────────────────────────────────────
//   const handleDelete = async (emission) => {
//     if (!window.confirm(`Supprimer "${emission.title}" ?`)) return;
//     try {
//       await api.delete(`/api/emissions/${emission._id}`);
//       toast.success('Émission supprimée');
//       fetchEmissions();
//     } catch { toast.error('Erreur lors de la suppression'); }
//   };

//   // ─── Filtres ──────────────────────────────────────────────────────────────
//   const uniqueHosts = [...new Set(emissions.map(e => e.host).filter(Boolean))].sort();

//   const filtered = emissions.filter(em => {
//     const matchSearch = !search
//       || em.title?.toLowerCase().includes(search.toLowerCase())
//       || em.host?.toLowerCase().includes(search.toLowerCase());
//     const matchHost = !filterHost || em.host === filterHost;
//     return matchSearch && matchHost;
//   });

//   // ─── Formatage ────────────────────────────────────────────────────────────
//   const formatDuration = (sec) => {
//     if (!sec) return '—';
//     const h = Math.floor(sec / 3600);
//     const m = Math.floor((sec % 3600) / 60);
//     const s = sec % 60;
//     return h > 0
//       ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
//       : `${m}:${String(s).padStart(2,'0')}`;
//   };

//   const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

//   // ─────────────────────────────────────────────────────────────────────────
//   // RENDER
//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="admin-emissions py-4">
//       <Container fluid>

//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2><i className="bi bi-broadcast me-2" />Gestion des Émissions</h2>
//                 <p className="text-muted mb-0">
//                   Créez et gérez les émissions diffusées sur la radio
//                 </p>
//               </div>
//               <div className="d-flex gap-2">
//                 <Link to="/admin" className="btn btn-outline-secondary">
//                   <i className="bi bi-arrow-left me-1" />Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => openModal()}>
//                   <i className="bi bi-plus-circle me-1" />Nouvelle Émission
//                 </Button>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Alert */}
//         {alert.show && (
//           <Row className="mb-3">
//             <Col>
//               <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
//                 {alert.message}
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {/* Info */}
//         <Row className="mb-4">
//           <Col>
//             <Alert variant="info" className="d-flex align-items-start gap-2">
//               <i className="bi bi-info-circle-fill mt-1" />
//               <div>
//                 <strong>Comment ça marche ?</strong> Chaque émission est liée à un animateur (champ <em>Host</em>).
//                 La page publique <em>Nos Émissions</em> regroupe automatiquement toutes les émissions par animateur.
//               </div>
//             </Alert>
//           </Col>
//         </Row>

//         {/* Compteurs */}
//         <Row className="mb-4 g-3">
//           <Col md={3}>
//             <Card className="text-center border-0 shadow-sm">
//               <Card.Body>
//                 <i className="bi bi-collection-play fs-2 text-primary mb-2 d-block" />
//                 <h4 className="mb-0">{emissions.length}</h4>
//                 <small className="text-muted">Total émissions</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center border-0 shadow-sm">
//               <Card.Body>
//                 <i className="bi bi-people fs-2 text-success mb-2 d-block" />
//                 <h4 className="mb-0">{uniqueHosts.length}</h4>
//                 <small className="text-muted">Animateurs uniques</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center border-0 shadow-sm">
//               <Card.Body>
//                 <i className="bi bi-calendar-check fs-2 text-info mb-2 d-block" />
//                 <h4 className="mb-0">
//                   {emissions.filter(e => {
//                     const today = new Date().toDateString();
//                     return e.airedAt && new Date(e.airedAt).toDateString() === today;
//                   }).length}
//                 </h4>
//                 <small className="text-muted">Aujourd'hui</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center border-0 shadow-sm">
//               <Card.Body>
//                 <i className="bi bi-mic fs-2 text-warning mb-2 d-block" />
//                 <h4 className="mb-0">
//                   {emissions.filter(e => e.audioUrl).length}
//                 </h4>
//                 <small className="text-muted">Avec audio</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Card className="shadow-sm border-0">
//           <Card.Header className="bg-white">
//             <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//               <h5 className="mb-0">
//                 Liste des émissions
//                 <Badge bg="secondary" className="ms-2">{filtered.length}</Badge>
//                 {filterHost && <Badge bg="info" className="ms-1">{filterHost}</Badge>}
//               </h5>
//               <div className="d-flex gap-2 flex-wrap">
//                 {/* Filtre par animateur */}
//                 <Form.Select
//                   size="sm"
//                   value={filterHost}
//                   onChange={e => setFilterHost(e.target.value)}
//                   style={{ width: 200 }}
//                 >
//                   <option value="">Tous les animateurs</option>
//                   {uniqueHosts.map(h => (
//                     <option key={h} value={h}>{h}</option>
//                   ))}
//                 </Form.Select>
//                 {/* Recherche */}
//                 <InputGroup size="sm" style={{ width: 220 }}>
//                   <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
//                   <Form.Control
//                     placeholder="Rechercher…"
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                   />
//                   {search && (
//                     <Button variant="outline-secondary" onClick={() => setSearch('')}>
//                       <i className="bi bi-x" />
//                     </Button>
//                   )}
//                 </InputGroup>
//                 <Button variant="outline-primary" size="sm" onClick={fetchEmissions}>
//                   <i className="bi bi-arrow-clockwise me-1" />Actualiser
//                 </Button>
//               </div>
//             </div>
//           </Card.Header>

//           <Card.Body className="p-0">
//             {loading ? (
//               <div className="text-center py-5">
//                 <Spinner animation="border" />
//                 <p className="mt-2">Chargement...</p>
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-5">
//                 <i className="bi bi-broadcast fs-1 text-muted" />
//                 <p className="text-muted mt-2">
//                   {emissions.length === 0 ? 'Aucune émission pour l\'instant' : 'Aucun résultat'}
//                 </p>
//                 {emissions.length === 0 && (
//                   <Button variant="primary" onClick={() => openModal()}>
//                     Créer la première émission
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <Table responsive hover className="mb-0 align-middle">
//                 <thead className="bg-light">
//                   <tr>
//                     <th style={{ width: 70 }}>Cover</th>
//                     <th>Titre</th>
//                     <th>Animateur</th>
//                     <th>Programme</th>
//                     <th>Catégorie</th>
//                     <th>Durée</th>
//                     <th>Audio</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map(em => (
//                     <tr key={em._id}>
//                       <td>
//                         <img
//                           src={em.cover || '/images/default-cover.png'}
//                           alt={em.title}
//                           style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8 }}
//                           onError={e => { e.target.src = '/images/default-cover.png'; }}
//                         />
//                       </td>
//                       <td>
//                         <strong>{em.title}</strong>
//                         {em.description && (
//                           <small className="d-block text-muted" style={{ maxWidth: 260 }}>
//                             {em.description.slice(0, 60)}{em.description.length > 60 ? '…' : ''}
//                           </small>
//                         )}
//                       </td>
//                       <td>
//                         <div className="d-flex align-items-center gap-2">
//                           <i className="bi bi-person-circle text-muted" />
//                           <span style={{ fontSize: 13 }}>{em.host || '—'}</span>
//                         </div>
//                         {em.schedule && (
//                           <small className="text-muted d-block" style={{ fontSize: 11 }}>
//                             <i className="bi bi-clock me-1" />{em.schedule}
//                           </small>
//                         )}
//                       </td>
//                       <td>
//                         {em.programId?.title
//                           ? <Badge bg="secondary" style={{ fontSize: 11 }}>{em.programId.title}</Badge>
//                           : <span className="text-muted" style={{ fontSize: 12 }}>—</span>
//                         }
//                       </td>
//                       <td>
//                         <Badge bg="light" text="dark" style={{ fontSize: 11 }}>
//                           {em.category || 'Émission'}
//                         </Badge>
//                       </td>
//                       <td>
//                         <small className="text-muted">{formatDuration(em.duration)}</small>
//                       </td>
//                       <td>
//                         {em.audioUrl ? (
//                           <a href={em.audioUrl} target="_blank" rel="noopener noreferrer" title="Écouter">
//                             <i className="bi bi-play-circle-fill text-success fs-5" />
//                           </a>
//                         ) : (
//                           <i className="bi bi-x-circle text-muted fs-5" title="Pas d'audio" />
//                         )}
//                       </td>
//                       <td>
//                         <div className="btn-group">
//                           <Button
//                             variant="outline-primary" size="sm"
//                             onClick={() => openModal(em)}
//                             title="Modifier"
//                           >
//                             <i className="bi bi-pencil" />
//                           </Button>
//                           <Button
//                             variant="outline-danger" size="sm"
//                             onClick={() => handleDelete(em)}
//                             title="Supprimer"
//                           >
//                             <i className="bi bi-trash" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             )}
//           </Card.Body>
//         </Card>
//       </Container>

//       {/* ══════════════════════════════════════════════════════════════════════
//           MODAL Créer / Modifier
//       ══════════════════════════════════════════════════════════════════════ */}
//       <Modal show={showModal} onHide={closeModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-broadcast me-2" />
//             {editing ? 'Modifier l\'émission' : 'Nouvelle émission'}
//           </Modal.Title>
//         </Modal.Header>

//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>

//             {/* Cover */}
//             <Form.Group className="mb-4">
//               <Form.Label className="fw-semibold">Image / Cover</Form.Label>
//               <Form.Control type="file" accept="image/*" onChange={handleCoverChange} className="mb-2" />
//               {coverPreview && (
//                 <img
//                   src={coverPreview} alt="preview"
//                   style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, marginTop: 6 }}
//                 />
//               )}
//               <Form.Control
//                 type="text" name="cover" className="mt-2"
//                 placeholder="Ou entrez une URL directement"
//                 value={formData.cover}
//                 onChange={handleChange}
//               />
//               <Form.Text className="text-muted">Format 16:9 recommandé (ex: 1200×675 px)</Form.Text>
//             </Form.Group>

//             <Row>
//               <Col md={8}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text" name="title" required
//                     placeholder="Titre de l'émission"
//                     value={formData.title}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Catégorie</Form.Label>
//                   <Form.Control
//                     type="text" name="category"
//                     placeholder="Émission, Mix, Actu…"
//                     value={formData.category}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Animateur (Host) *</Form.Label>
//                   <Form.Control
//                     type="text" name="host" required
//                     placeholder="Prénom Nom de l'animateur"
//                     value={formData.host}
//                     onChange={handleChange}
//                     list="hosts-datalist"
//                   />
//                   {/* Suggestions depuis les émissions existantes */}
//                   <datalist id="hosts-datalist">
//                     {uniqueHosts.map(h => <option key={h} value={h} />)}
//                   </datalist>
//                   <Form.Text className="text-muted">
//                     Les émissions du même animateur seront regroupées sur le site.
//                   </Form.Text>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Horaire</Form.Label>
//                   <Form.Control
//                     type="text" name="schedule"
//                     placeholder="ex: Samedi 20h-22h"
//                     value={formData.schedule}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Bio de l'animateur</Form.Label>
//               <Form.Control
//                 as="textarea" rows={2} name="bio"
//                 placeholder="Courte biographie affichée sur la page Émissions"
//                 value={formData.bio}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description de l'épisode</Form.Label>
//               <Form.Control
//                 as="textarea" rows={2} name="description"
//                 placeholder="Description de cette émission / cet épisode"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Programme lié (optionnel)</Form.Label>
//                   <Form.Select name="programId" value={formData.programId} onChange={handleChange}>
//                     <option value="">Aucun programme</option>
//                     {programs.map(p => (
//                       <option key={p._id} value={p._id}>{p.title}</option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Durée (en secondes)</Form.Label>
//                   <Form.Control
//                     type="number" name="duration" min="1" max="86400"
//                     placeholder="ex: 3600 pour 1h00"
//                     value={formData.duration}
//                     onChange={handleChange}
//                   />
//                   <Form.Text className="text-muted">
//                     {formData.duration ? `→ ${Math.floor(formData.duration/3600)}h${String(Math.floor((formData.duration%3600)/60)).padStart(2,'0')}` : ''}
//                   </Form.Text>
//                 </Form.Group>
//               </Col>
//             </Row>

//             {/* Audio */}
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold">Fichier audio</Form.Label>
//               <Form.Control
//                 type="file" accept="audio/*"
//                 onChange={handleAudioChange}
//                 className="mb-2"
//               />
//               {audioFile && (
//                 <audio controls src={URL.createObjectURL(audioFile)} style={{ width: '100%', marginTop: 6 }} />
//               )}
//               {!audioFile && formData.audioUrl && (
//                 <div className="mt-2">
//                   <small className="text-muted">Fichier actuel :</small>
//                   <audio controls src={formData.audioUrl} style={{ width: '100%', marginTop: 4 }} />
//                 </div>
//               )}
//               <Form.Control
//                 type="text" name="audioUrl" className="mt-2"
//                 placeholder="Ou entrez une URL audio directement"
//                 value={formData.audioUrl}
//                 onChange={handleChange}
//               />
//               <Form.Text className="text-muted">MP3, WAV, OGG acceptés (max 500 MB)</Form.Text>
//             </Form.Group>

//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={closeModal} disabled={uploading}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary" disabled={uploading}>
//               {uploading
//                 ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Upload...</>
//                 : <><i className="bi bi-save me-1" />{editing ? 'Enregistrer' : 'Créer'}</>
//               }
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminEmissions;
import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { A, AppleLayout, AppleCard, CardHeader, CardBody, AppleBtn, AppleLinkBtn, AppleBadge, AppleTable, AppleTr, AppleTd, AppleThumb, AppleInput, AppleSelect, AppleFormGroup, AppleAlert, AppleEmpty, AppleSpinner, AppleModal, AppleImageUpload, AppleSearch } from './AppleAdmin.shared';

const EMPTY = { title:'', host:'', bio:'', description:'', cover:'', audioUrl:'', schedule:'', category:'Émission', duration:'', programId:'' };

const AdminEmissions = () => {
  const [emissions, setEmissions]   = useState([]);
  const [programs, setPrograms]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [coverFile, setCoverFile]   = useState(null);
  const [coverPrev, setCoverPrev]   = useState(null);
  const [audioFile, setAudioFile]   = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [search, setSearch]         = useState('');
  const [filterHost, setFilterHost] = useState('');
  const [alert, setAlert]           = useState(null);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const uploadFile = async file => {
    if (!file) return null;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await api.post('/api/upload', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      setUploading(false);
      const d = res.data;
      return d?.data?.url||(d?.data?.filename&&`/uploads/${d.data.filename}`)||d?.url||(d?.filename&&`/uploads/${d.filename}`)||null;
    } catch { setUploading(false); showAlert('danger',"Erreur upload"); return null; }
  };

  const fetchEmissions = useCallback(async () => {
    setLoading(true);
    try { const r = await api.get('/api/emissions?limit=100'); setEmissions(r.data.emissions||[]); }
    catch { showAlert('danger','Erreur chargement'); }
    setLoading(false);
  }, []);

  const fetchPrograms = useCallback(async () => {
    try { const r = await api.get('/api/programs'); setPrograms(Array.isArray(r.data)?r.data:r.data?.programs||[]); }
    catch {}
  }, []);

  useEffect(() => { fetchEmissions(); fetchPrograms(); }, [fetchEmissions, fetchPrograms]);

  const openModal = (em = null) => {
    if (em) { setEditing(em); setForm({ title:em.title||'', host:em.host||'', bio:em.bio||'', description:em.description||'', cover:em.cover||'', audioUrl:em.audioUrl||'', schedule:em.schedule||'', category:em.category||'Émission', duration:em.duration?String(em.duration):'', programId:em.programId?._id||em.programId||'' }); setCoverPrev(em.cover||null); }
    else    { setEditing(null); setForm(EMPTY); setCoverPrev(null); }
    setCoverFile(null); setAudioFile(null); setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setCoverFile(null); setAudioFile(null); setCoverPrev(null); setForm(EMPTY); };
  const set = (name, val) => setForm(f => ({ ...f, [name]:val }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { showAlert('danger','Titre requis'); return; }
    if (!form.host.trim())  { showAlert('danger','Animateur requis'); return; }
    let cover = form.cover, audioUrl = form.audioUrl;
    if (coverFile) { const u = await uploadFile(coverFile); if (u) cover = u; }
    if (audioFile) { const u = await uploadFile(audioFile); if (u) audioUrl = u; }
    const payload = { ...form, cover, audioUrl, duration:form.duration?parseInt(form.duration):undefined, programId:form.programId||undefined };
    try {
      if (editing) { await api.put(`/api/emissions/${editing._id}`, payload); toast.success('Émission mise à jour !'); }
      else         { await api.post('/api/emissions', payload);                toast.success('Émission créée !'); }
      closeModal(); fetchEmissions();
    } catch (err) { showAlert('danger', err.response?.data?.message||'Erreur sauvegarde'); }
  };

  const handleDelete = async em => {
    if (!window.confirm(`Supprimer "${em.title}" ?`)) return;
    try { await api.delete(`/api/emissions/${em._id}`); toast.success('Supprimée'); fetchEmissions(); }
    catch { toast.error('Erreur suppression'); }
  };

  const hosts = [...new Set(emissions.map(e => e.host).filter(Boolean))].sort();
  const filtered = emissions.filter(em =>
    (!search || em.title?.toLowerCase().includes(search.toLowerCase()) || em.host?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterHost || em.host === filterHost)
  );

  const fmtDur = s => { if(!s) return '—'; const h=Math.floor(s/3600), m=Math.floor((s%3600)/60); return h>0?`${h}h${String(m).padStart(2,'0')}`:`${m}min`; };

  const COLS = [{ label:'Cover', w:70 },{ label:'Titre' },{ label:'Animateur' },{ label:'Programme' },{ label:'Catégorie' },{ label:'Durée' },{ label:'Audio', w:60 },{ label:'', w:80 }];

  return (
    <AppleLayout
      title="Émissions"
      subtitle="Gérez les émissions de votre radio"
      actions={<>
        <AppleLinkBtn to="/admin" variant="ghost"><i className="bi bi-arrow-left" />Retour</AppleLinkBtn>
        <AppleBtn onClick={() => openModal()}><i className="bi bi-plus" />Nouvelle Émission</AppleBtn>
      </>}
    >
      {alert && <AppleAlert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</AppleAlert>}

      <AppleAlert type="info">
        <strong>Comment ça marche ?</strong> Chaque émission est liée à un animateur. La page <em>Nos Émissions</em> regroupe automatiquement les émissions par animateur.
      </AppleAlert>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total', value:emissions.length, icon:'collection-play', color:'#0071e3', bg:'rgba(0,113,227,0.1)' },
          { label:'Animateurs', value:hosts.length, icon:'people', color:'#34c759', bg:'rgba(52,199,89,0.1)' },
          { label:"Aujourd'hui", value:emissions.filter(e => e.airedAt && new Date(e.airedAt).toDateString()===new Date().toDateString()).length, icon:'calendar-check', color:'#ff9500', bg:'rgba(255,149,0,0.1)' },
          { label:'Avec audio', value:emissions.filter(e=>e.audioUrl).length, icon:'music-note', color:'#af52de', bg:'rgba(175,82,222,0.1)' },
        ].map((s,i) => (
          <AppleCard key={i} p={16}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className={`bi bi-${s.icon}`} style={{ fontSize:17, color:s.color }} />
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:A.text2, marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          </AppleCard>
        ))}
      </div>

      {/* Table */}
      <AppleCard>
        <CardHeader title={`Émissions (${filtered.length})`} right={
          <div style={{ display:'flex', gap:10 }}>
            <select value={filterHost} onChange={e => setFilterHost(e.target.value)} style={{ padding:'7px 28px 7px 12px', borderRadius:10, border:`1px solid ${A.borderStrong}`, background:A.bg, fontSize:13, color:A.text, outline:'none', cursor:'pointer' }}>
              <option value="">Tous les animateurs</option>
              {hosts.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <AppleSearch value={search} onChange={setSearch} onClear={() => setSearch('')} />
            <AppleBtn variant="ghost" onClick={fetchEmissions}><i className="bi bi-arrow-clockwise" /></AppleBtn>
          </div>
        } />

        {loading ? <AppleSpinner /> : filtered.length === 0 ? (
          <AppleEmpty icon="broadcast" title={emissions.length===0?'Aucune émission':'Aucun résultat'}
            action={emissions.length===0&&<AppleBtn onClick={() => openModal()}>Créer une émission</AppleBtn>} />
        ) : (
          <AppleTable cols={COLS}>
            {filtered.map(em => (
              <AppleTr key={em._id}>
                <AppleTd><AppleThumb src={em.cover} alt={em.title} /></AppleTd>
                <AppleTd>
                  <div style={{ fontWeight:600, fontSize:14 }}>{em.title}</div>
                  {em.description && <div style={{ fontSize:12, color:A.text2, maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{em.description}</div>}
                </AppleTd>
                <AppleTd>
                  <div style={{ fontSize:14 }}>{em.host||'—'}</div>
                  {em.schedule && <div style={{ fontSize:11, color:A.text3 }}>{em.schedule}</div>}
                </AppleTd>
                <AppleTd>{em.programId?.title ? <AppleBadge variant="gray">{em.programId.title}</AppleBadge> : <span style={{ color:A.text3, fontSize:12 }}>—</span>}</AppleTd>
                <AppleTd><AppleBadge variant="blue">{em.category||'Émission'}</AppleBadge></AppleTd>
                <AppleTd><span style={{ fontSize:13, color:A.text2 }}>{fmtDur(em.duration)}</span></AppleTd>
                <AppleTd>
                  {em.audioUrl
                    ? <a href={em.audioUrl} target="_blank" rel="noopener noreferrer"><i className="bi bi-play-circle-fill" style={{ fontSize:20, color:A.green }} /></a>
                    : <i className="bi bi-x-circle" style={{ fontSize:20, color:A.text3 }} />
                  }
                </AppleTd>
                <AppleTd>
                  <div style={{ display:'flex', gap:6 }}>
                    <AppleBtn variant="ghost" style={{ padding:'6px 10px' }} onClick={() => openModal(em)}><i className="bi bi-pencil" style={{ fontSize:13 }} /></AppleBtn>
                    <AppleBtn variant="danger" style={{ padding:'6px 10px' }} onClick={() => handleDelete(em)}><i className="bi bi-trash" style={{ fontSize:13 }} /></AppleBtn>
                  </div>
                </AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        )}
      </AppleCard>

      {/* Modal */}
      <AppleModal show={showModal} onHide={closeModal} size="lg" title={editing?'Modifier l\'émission':'Nouvelle émission'}
        footer={<>
          <AppleBtn variant="ghost" onClick={closeModal}>Annuler</AppleBtn>
          <AppleBtn disabled={uploading} onClick={handleSubmit}>
            {uploading?<><Spinner as="span" size="sm" animation="border" className="me-2" />Upload...</>:<><i className="bi bi-save" />{editing?'Enregistrer':'Créer'}</>}
          </AppleBtn>
        </>}
      >
        <form onSubmit={handleSubmit}>
          <AppleImageUpload label="Cover / Image" onFileChange={e => { const f=e.target.files?.[0]; if(f){setCoverFile(f);setCoverPrev(URL.createObjectURL(f));} }} preview={coverPrev} urlValue={form.cover} onUrlChange={e => set('cover',e.target.value)} urlName="cover" hint="Format 16:9 recommandé" />

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
            <AppleFormGroup label="Titre" required><AppleInput value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Titre de l'émission" required /></AppleFormGroup>
            <AppleFormGroup label="Catégorie"><AppleInput value={form.category} onChange={e=>set('category',e.target.value)} placeholder="Émission, Mix…" /></AppleFormGroup>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <AppleFormGroup label="Animateur (Host)" required>
              <AppleInput value={form.host} onChange={e=>set('host',e.target.value)} placeholder="Nom de l'animateur" required list="hosts-list" />
              <datalist id="hosts-list">{hosts.map(h=><option key={h} value={h}/>)}</datalist>
            </AppleFormGroup>
            <AppleFormGroup label="Horaire"><AppleInput value={form.schedule} onChange={e=>set('schedule',e.target.value)} placeholder="ex: Sam 20h–22h" /></AppleFormGroup>
          </div>

          <AppleFormGroup label="Bio de l'animateur"><AppleInput value={form.bio} onChange={e=>set('bio',e.target.value)} rows={2} placeholder="Courte bio affichée sur le site" /></AppleFormGroup>
          <AppleFormGroup label="Description de l'épisode"><AppleInput value={form.description} onChange={e=>set('description',e.target.value)} rows={2} placeholder="Description de l'émission" /></AppleFormGroup>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <AppleFormGroup label="Programme lié">
              <AppleSelect value={form.programId} onChange={e=>set('programId',e.target.value)}>
                <option value="">Aucun</option>
                {programs.map(p=><option key={p._id} value={p._id}>{p.title}</option>)}
              </AppleSelect>
            </AppleFormGroup>
            <AppleFormGroup label="Durée (secondes)" hint={form.duration?`→ ${Math.floor(form.duration/3600)}h${String(Math.floor((form.duration%3600)/60)).padStart(2,'0')}`:'ex: 3600 = 1h00'}>
              <AppleInput type="number" value={form.duration} onChange={e=>set('duration',e.target.value)} placeholder="3600" min="1" max="86400" />
            </AppleFormGroup>
          </div>

          {/* Audio */}
          <AppleFormGroup label="Fichier audio">
            <input type="file" accept="audio/*" onChange={e => { const f=e.target.files?.[0]; if(f) setAudioFile(f); }}
              style={{ width:'100%', padding:'9px 13px', background:A.bg, border:`1px solid ${A.borderStrong}`, borderRadius:10, fontSize:14, color:A.text, outline:'none', boxSizing:'border-box', marginBottom:8 }} />
            {audioFile && <audio controls src={URL.createObjectURL(audioFile)} style={{ width:'100%', marginBottom:8 }} />}
            {!audioFile && form.audioUrl && <audio controls src={form.audioUrl} style={{ width:'100%', marginBottom:8 }} />}
            <AppleInput value={form.audioUrl} onChange={e=>set('audioUrl',e.target.value)} placeholder="Ou entrez une URL audio directement" />
          </AppleFormGroup>
        </form>
      </AppleModal>
    </AppleLayout>
  );
};

export default AdminEmissions;