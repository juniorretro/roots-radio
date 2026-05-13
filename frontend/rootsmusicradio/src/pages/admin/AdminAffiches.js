// import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import api from '../../services/api';
// import { toast } from 'react-toastify';

// const AdminAffiches = () => {
//   const [affiches, setAffiches]           = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [showModal, setShowModal]         = useState(false);
//   const [editingAffiche, setEditingAffiche] = useState(null);
//   const [uploading, setUploading]         = useState(false);
//   const [selectedImageFile, setSelectedImageFile] = useState(null);
//   const [imagePreview, setImagePreview]   = useState(null);
//   const [alert, setAlert]                 = useState({ show: false, type: '', message: '' });

//   const emptyForm = {
//     title: '',
//     subtitle: '',
//     image: '',
//     link: '',
//     linkText: 'En savoir plus',
//     order: 0,
//     isActive: true,
//     startDate: '',
//     endDate: ''
//   };
//   const [formData, setFormData] = useState(emptyForm);

//   const showAlertMsg = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
//   };

//   // ─── Chargement ───
//   const fetchAffiches = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/api/affiches/all');
//       setAffiches(res.data.affiches || []);
//     } catch (error) {
//       console.error(error);
//       showAlertMsg('danger', 'Erreur lors du chargement des affiches');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchAffiches(); }, [fetchAffiches]);

//   // ─── Ouvrir modal ───
//   const handleOpenModal = (affiche = null) => {
//     if (affiche) {
//       setEditingAffiche(affiche);
//       setFormData({
//         title: affiche.title || '',
//         subtitle: affiche.subtitle || '',
//         image: affiche.image || '',
//         link: affiche.link || '',
//         linkText: affiche.linkText || 'En savoir plus',
//         order: affiche.order || 0,
//         isActive: affiche.isActive !== undefined ? affiche.isActive : true,
//         startDate: affiche.startDate ? affiche.startDate.slice(0, 10) : '',
//         endDate: affiche.endDate ? affiche.endDate.slice(0, 10) : ''
//       });
//       setImagePreview(affiche.image || null);
//     } else {
//       setEditingAffiche(null);
//       setFormData(emptyForm);
//       setImagePreview(null);
//     }
//     setSelectedImageFile(null);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingAffiche(null);
//     setSelectedImageFile(null);
//     setImagePreview(null);
//     setFormData(emptyForm);
//   };

//   // ─── Changement de champ ───
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   // ─── Sélection fichier ───
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       showAlertMsg('danger', 'Sélectionnez une image valide (JPG, PNG, WebP…)');
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       showAlertMsg('danger', 'Image trop volumineuse (max 10 MB)');
//       return;
//     }

//     setSelectedImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   // ─── Upload image ───
//   const uploadImage = async (file) => {
//     if (!file) return null;
//     const fd = new FormData();
//     fd.append('file', file);
//     setUploading(true);
//     try {
//       const res = await api.post('/api/upload', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setUploading(false);
//       const d = res.data;
//       if (d?.data?.url) return d.data.url;
//       if (d?.data?.filename) return `/uploads/${d.data.filename}`;
//       if (d?.url) return d.url;
//       if (d?.filename) return `/uploads/${d.filename}`;
//       return null;
//     } catch (err) {
//       setUploading(false);
//       console.error('Upload error:', err);
//       showAlertMsg('danger', "Erreur lors de l'upload de l'image");
//       return null;
//     }
//   };

//   // ─── Soumettre ───
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title.trim()) {
//       showAlertMsg('danger', 'Le titre est requis');
//       return;
//     }

//     let imageUrl = formData.image;

//     // Upload si un fichier a été sélectionné
//     if (selectedImageFile) {
//       const uploaded = await uploadImage(selectedImageFile);
//       if (uploaded) {
//         imageUrl = uploaded;
//       } else if (!imageUrl) {
//         showAlertMsg('danger', "Impossible d'uploader l'image");
//         return;
//       }
//     }

//     if (!imageUrl) {
//       showAlertMsg('danger', 'Une image est requise');
//       return;
//     }

//     const payload = {
//       ...formData,
//       image: imageUrl,
//       order: parseInt(formData.order) || 0,
//       startDate: formData.startDate || null,
//       endDate: formData.endDate || null
//     };

//     try {
//       if (editingAffiche) {
//         await api.put(`/api/affiches/${editingAffiche._id}`, payload);
//         toast.success('Affiche mise à jour !');
//       } else {
//         await api.post('/api/affiches', payload);
//         toast.success('Affiche créée !');
//       }
//       handleCloseModal();
//       fetchAffiches();
//     } catch (err) {
//       console.error(err);
//       showAlertMsg('danger', err.response?.data?.message || 'Erreur lors de la sauvegarde');
//     }
//   };

//   // ─── Supprimer ───
//   const handleDelete = async (affiche) => {
//     if (!window.confirm(`Supprimer l'affiche "${affiche.title}" ?`)) return;
//     try {
//       await api.delete(`/api/affiches/${affiche._id}`);
//       toast.success('Affiche supprimée');
//       fetchAffiches();
//     } catch (err) {
//       console.error(err);
//       toast.error('Erreur lors de la suppression');
//     }
//   };

//   // ─── Toggle actif/inactif ───
//   const handleToggleActive = async (affiche) => {
//     try {
//       await api.put(`/api/affiches/${affiche._id}`, { isActive: !affiche.isActive });
//       fetchAffiches();
//     } catch (err) {
//       toast.error('Erreur');
//     }
//   };

//   const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

//   return (
//     <div className="admin-affiches py-4">
//       <Container fluid>
//         {/* Header */}
//         <Row className="mb-4">
//           <Col>
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2><i className="bi bi-images me-2" />Gestion des Affiches</h2>
//                 <p className="text-muted mb-0">Gérez les bannières et publicités affichées sur la page d'accueil</p>
//               </div>
//               <div>
//                 <Link to="/admin" className="btn btn-outline-secondary me-2">
//                   <i className="bi bi-arrow-left me-1" />Retour
//                 </Link>
//                 <Button variant="primary" onClick={() => handleOpenModal()}>
//                   <i className="bi bi-plus-circle me-1" />Nouvelle Affiche
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
//                 <strong>Comment ça marche ?</strong> Les affiches actives apparaissent dans la section <em>Actualités &amp; Événements</em> sur la page d'accueil, sous forme de bannière avec carrousel automatique.
//                 Vous pouvez ajouter un titre, un sous-titre, une image, et un lien cliquable. L'ordre détermine la position dans le carrousel.
//               </div>
//             </Alert>
//           </Col>
//         </Row>

//         {/* Tableau */}
//         <Row>
//           <Col>
//             <Card>
//               <Card.Header>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0">
//                     Liste des affiches ({affiches.length})
//                     <Badge bg="success" className="ms-2">{affiches.filter(a => a.isActive).length} actives</Badge>
//                   </h5>
//                   <Button variant="outline-primary" size="sm" onClick={fetchAffiches}>
//                     <i className="bi bi-arrow-clockwise me-1" />Actualiser
//                   </Button>
//                 </div>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 {loading ? (
//                   <div className="text-center py-5"><Spinner animation="border" /><p className="mt-2">Chargement...</p></div>
//                 ) : affiches.length === 0 ? (
//                   <div className="text-center py-5">
//                     <i className="bi bi-images fs-1 text-muted" />
//                     <p className="text-muted mt-2">Aucune affiche pour l'instant</p>
//                     <Button variant="primary" onClick={() => handleOpenModal()}>Créer la première affiche</Button>
//                   </div>
//                 ) : (
//                   <Table responsive hover className="mb-0">
//                     <thead className="bg-light">
//                       <tr>
//                         <th style={{ width: 80 }}>Aperçu</th>
//                         <th>Titre</th>
//                         <th>Sous-titre</th>
//                         <th>Lien</th>
//                         <th>Ordre</th>
//                         <th>Dates</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {affiches.map(affiche => (
//                         <tr key={affiche._id}>
//                           <td>
//                             <img
//                               src={affiche.image}
//                               alt={affiche.title}
//                               style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 8 }}
//                               onError={e => { e.target.src = '/images/default-cover.png'; }}
//                             />
//                           </td>
//                           <td>
//                             <strong>{affiche.title}</strong>
//                           </td>
//                           <td>
//                             <small className="text-muted">
//                               {affiche.subtitle ? affiche.subtitle.slice(0, 50) + (affiche.subtitle.length > 50 ? '…' : '') : '—'}
//                             </small>
//                           </td>
//                           <td>
//                             {affiche.link ? (
//                               <a href={affiche.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
//                                 <i className="bi bi-link-45deg me-1" />
//                                 {affiche.linkText || 'Lien'}
//                               </a>
//                             ) : (
//                               <span className="text-muted" style={{ fontSize: 12 }}>Aucun lien</span>
//                             )}
//                           </td>
//                           <td>
//                             <Badge bg="secondary">{affiche.order}</Badge>
//                           </td>
//                           <td>
//                             <small className="text-muted d-block">
//                               {affiche.startDate || affiche.endDate
//                                 ? `${formatDate(affiche.startDate)} → ${formatDate(affiche.endDate)}`
//                                 : 'Permanent'}
//                             </small>
//                           </td>
//                           <td>
//                             <Button
//                               variant={affiche.isActive ? 'success' : 'outline-secondary'}
//                               size="sm"
//                               onClick={() => handleToggleActive(affiche)}
//                               style={{ minWidth: 80, fontSize: 11 }}
//                             >
//                               {affiche.isActive ? '● Actif' : '○ Inactif'}
//                             </Button>
//                           </td>
//                           <td>
//                             <div className="btn-group">
//                               <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(affiche)} title="Modifier">
//                                 <i className="bi bi-pencil" />
//                               </Button>
//                               <Button variant="outline-danger" size="sm" onClick={() => handleDelete(affiche)} title="Supprimer">
//                                 <i className="bi bi-trash" />
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

//       {/* ─── Modal Créer / Modifier ─── */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <i className="bi bi-images me-2" />
//             {editingAffiche ? 'Modifier l\'affiche' : 'Nouvelle affiche'}
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             {/* Image */}
//             <Form.Group className="mb-4">
//               <Form.Label className="fw-semibold">Image de la bannière *</Form.Label>
//               <Form.Control
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="mb-2"
//               />
//               {imagePreview && (
//                 <div style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8 }}>
//                   <img
//                     src={imagePreview}
//                     alt="Aperçu"
//                     style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
//                   />
//                 </div>
//               )}
//               <Form.Text className="text-muted">
//                 Recommandé : 1200 × 500 px minimum. Format 16:9 idéal pour les bannières.
//               </Form.Text>
//               <Form.Control
//                 type="text"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 placeholder="Ou entrez une URL directement : /uploads/... ou https://..."
//                 className="mt-2"
//               />
//             </Form.Group>

//             <Row>
//               <Col md={8}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Titre *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     placeholder="Titre de l'affiche"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Ordre d'affichage</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="order"
//                     value={formData.order}
//                     onChange={handleChange}
//                     min="0"
//                     placeholder="0"
//                   />
//                   <Form.Text className="text-muted">0 = affiché en premier</Form.Text>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Sous-titre / Description courte</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 name="subtitle"
//                 value={formData.subtitle}
//                 onChange={handleChange}
//                 placeholder="Description courte affichée sous le titre (optionnel)"
//               />
//             </Form.Group>

//             <Row>
//               <Col md={7}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Lien cliquable</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="link"
//                     value={formData.link}
//                     onChange={handleChange}
//                     placeholder="/programs/mon-programme  ou  https://exemple.com"
//                   />
//                   <Form.Text className="text-muted">
//                     Laissez vide si vous ne voulez pas de bouton. Chemin interne ou URL externe.
//                   </Form.Text>
//                 </Form.Group>
//               </Col>
//               <Col md={5}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Texte du bouton</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="linkText"
//                     value={formData.linkText}
//                     onChange={handleChange}
//                     placeholder="En savoir plus"
//                     maxLength={50}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Date de début (optionnel)</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleChange}
//                   />
//                   <Form.Text className="text-muted">Laissez vide = affiche permanente</Form.Text>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Date de fin (optionnel)</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group>
//               <Form.Check
//                 type="switch"
//                 id="isActive"
//                 name="isActive"
//                 checked={formData.isActive}
//                 onChange={handleChange}
//                 label={
//                   <span>
//                     {formData.isActive
//                       ? <><Badge bg="success" className="me-1">Actif</Badge> Visible sur la page d'accueil</>
//                       : <><Badge bg="secondary" className="me-1">Inactif</Badge> Masquée du site</>
//                     }
//                   </span>
//                 }
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal} disabled={uploading}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="primary" disabled={uploading}>
//               {uploading ? (
//                 <><Spinner as="span" animation="border" size="sm" className="me-2" />Upload en cours...</>
//               ) : (
//                 <><i className="bi bi-save me-1" />{editingAffiche ? 'Enregistrer' : 'Créer l\'affiche'}</>
//               )}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminAffiches;

import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { A, AppleLayout, AppleCard, CardHeader, AppleBtn, AppleLinkBtn, AppleBadge, AppleTable, AppleTr, AppleTd, AppleThumb, AppleInput, AppleFormGroup, AppleToggle, AppleAlert, AppleEmpty, AppleSpinner, AppleModal, AppleImageUpload } from './AppleAdmin.shared';

const EMPTY = { title:'', subtitle:'', image:'', link:'', linkText:'En savoir plus', order:0, isActive:true, startDate:'', endDate:'' };

const AdminAffiches = () => {
  const [affiches, setAffiches]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [imgFile, setImgFile]       = useState(null);
  const [imgPrev, setImgPrev]       = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [alert, setAlert]           = useState(null);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const uploadImage = async file => {
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

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try { const r = await api.get('/api/affiches/all'); setAffiches(r.data.affiches||[]); }
    catch { showAlert('danger','Erreur chargement'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openModal = (a = null) => {
    if (a) { setEditing(a); setForm({ title:a.title||'', subtitle:a.subtitle||'', image:a.image||'', link:a.link||'', linkText:a.linkText||'En savoir plus', order:a.order||0, isActive:a.isActive!==false, startDate:a.startDate?a.startDate.slice(0,10):'', endDate:a.endDate?a.endDate.slice(0,10):'' }); setImgPrev(a.image||null); }
    else    { setEditing(null); setForm(EMPTY); setImgPrev(null); }
    setImgFile(null); setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setImgFile(null); setImgPrev(null); setForm(EMPTY); };
  const set = (name, val) => setForm(f => ({ ...f, [name]:val }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { showAlert('danger','Titre requis'); return; }
    let image = form.image;
    if (imgFile) { const u = await uploadImage(imgFile); if (u) image = u; }
    if (!image) { showAlert('danger','Image requise'); return; }
    const payload = { ...form, image, order:parseInt(form.order)||0, startDate:form.startDate||null, endDate:form.endDate||null };
    try {
      if (editing) { await api.put(`/api/affiches/${editing._id}`, payload); toast.success('Affiche mise à jour !'); }
      else         { await api.post('/api/affiches', payload);                toast.success('Affiche créée !'); }
      closeModal(); fetch_();
    } catch (err) { showAlert('danger', err.response?.data?.message||'Erreur sauvegarde'); }
  };

  const handleDelete = async a => {
    if (!window.confirm(`Supprimer "${a.title}" ?`)) return;
    try { await api.delete(`/api/affiches/${a._id}`); toast.success('Supprimée'); fetch_(); }
    catch { toast.error('Erreur suppression'); }
  };

  const handleToggle = async a => {
    try { await api.put(`/api/affiches/${a._id}`, { isActive:!a.isActive }); fetch_(); }
    catch { toast.error('Erreur'); }
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

  const COLS = [{ label:'Image', w:100 },{ label:'Titre' },{ label:'Sous-titre' },{ label:'Lien' },{ label:'Ordre', w:60 },{ label:'Dates' },{ label:'Statut', w:100 },{ label:'', w:80 }];

  return (
    <AppleLayout
      title="Affiches"
      subtitle="Bannières et publicités de la page d'accueil"
      actions={<>
        <AppleLinkBtn to="/admin" variant="ghost"><i className="bi bi-arrow-left" />Retour</AppleLinkBtn>
        <AppleBtn onClick={() => openModal()}><i className="bi bi-plus" />Nouvelle Affiche</AppleBtn>
      </>}
    >
      {alert && <AppleAlert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</AppleAlert>}

      <AppleAlert type="info">
        <strong>Comment ça marche ?</strong> Les affiches actives apparaissent en carrousel sur la page d'accueil. L'ordre détermine leur position.
      </AppleAlert>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total',   value:affiches.length,                         icon:'images',     color:'#0071e3', bg:'rgba(0,113,227,0.1)' },
          { label:'Actives', value:affiches.filter(a=>a.isActive).length,   icon:'eye',        color:'#34c759', bg:'rgba(52,199,89,0.1)'  },
          { label:'Inactives',value:affiches.filter(a=>!a.isActive).length, icon:'eye-slash',  color:'#6e6e73', bg:A.surface3             },
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
        <CardHeader title={`Affiches (${affiches.length})`} right={
          <AppleBtn variant="ghost" onClick={fetch_}><i className="bi bi-arrow-clockwise" />Actualiser</AppleBtn>
        } />
        {loading ? <AppleSpinner /> : affiches.length === 0 ? (
          <AppleEmpty icon="images" title="Aucune affiche" action={<AppleBtn onClick={() => openModal()}>Créer une affiche</AppleBtn>} />
        ) : (
          <AppleTable cols={COLS}>
            {affiches.map(a => (
              <AppleTr key={a._id}>
                <td style={{ padding:'10px 16px' }}>
                  <img src={a.image} alt={a.title} onError={e => { e.target.src='/images/default-cover.png'; }}
                    style={{ width:80, height:48, objectFit:'cover', borderRadius:8 }} />
                </td>
                <td style={{ padding:'10px 16px', fontWeight:600, fontSize:14 }}>{a.title}</td>
                <td style={{ padding:'10px 16px', fontSize:13, color:A.text2, maxWidth:200 }}>
                  <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.subtitle||'—'}</div>
                </td>
                <td style={{ padding:'10px 16px' }}>
                  {a.link ? <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:A.blue, textDecoration:'none' }}><i className="bi bi-link-45deg" />{a.linkText||'Lien'}</a>
                  : <span style={{ fontSize:13, color:A.text3 }}>Aucun</span>}
                </td>
                <td style={{ padding:'10px 16px' }}><AppleBadge variant="gray">{a.order}</AppleBadge></td>
                <td style={{ padding:'10px 16px', fontSize:12, color:A.text2 }}>
                  {a.startDate||a.endDate ? `${fmtDate(a.startDate)} → ${fmtDate(a.endDate)}` : 'Permanent'}
                </td>
                <td style={{ padding:'10px 16px' }}>
                  <button onClick={() => handleToggle(a)} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:100, fontSize:12, fontWeight:500, border:'none', cursor:'pointer', background:a.isActive?'rgba(52,199,89,0.12)':'rgba(0,0,0,0.06)', color:a.isActive?'#1d8833':A.text2, transition:'all 0.15s' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:a.isActive?A.green:A.text3, display:'inline-block' }} />
                    {a.isActive?'Actif':'Inactif'}
                  </button>
                </td>
                <td style={{ padding:'10px 16px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <AppleBtn variant="ghost" style={{ padding:'6px 10px' }} onClick={() => openModal(a)}><i className="bi bi-pencil" style={{ fontSize:13 }} /></AppleBtn>
                    <AppleBtn variant="danger" style={{ padding:'6px 10px' }} onClick={() => handleDelete(a)}><i className="bi bi-trash" style={{ fontSize:13 }} /></AppleBtn>
                  </div>
                </td>
              </AppleTr>
            ))}
          </AppleTable>
        )}
      </AppleCard>

      {/* Modal */}
      <AppleModal show={showModal} onHide={closeModal} size="lg" title={editing?'Modifier l\'affiche':'Nouvelle affiche'}
        footer={<>
          <AppleBtn variant="ghost" onClick={closeModal}>Annuler</AppleBtn>
          <AppleBtn disabled={uploading} onClick={handleSubmit}>
            {uploading?<><Spinner as="span" size="sm" animation="border" className="me-2" />Upload...</>:<><i className="bi bi-save" />{editing?'Enregistrer':'Créer'}</>}
          </AppleBtn>
        </>}
      >
        <form onSubmit={handleSubmit}>
          <AppleImageUpload label="Image de la bannière *" onFileChange={e => { const f=e.target.files?.[0]; if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f));} }} preview={imgPrev} urlValue={form.image} onUrlChange={e => set('image',e.target.value)} urlName="image" hint="Recommandé: 1200×500px minimum, format 16:9" />

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
            <AppleFormGroup label="Titre" required><AppleInput value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Titre de l'affiche" required /></AppleFormGroup>
            <AppleFormGroup label="Ordre" hint="0 = premier"><AppleInput type="number" value={form.order} onChange={e=>set('order',e.target.value)} min="0" /></AppleFormGroup>
          </div>

          <AppleFormGroup label="Sous-titre / Description">
            <AppleInput value={form.subtitle} onChange={e=>set('subtitle',e.target.value)} rows={2} placeholder="Description courte affichée sous le titre" />
          </AppleFormGroup>

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
            <AppleFormGroup label="Lien cliquable" hint="Laissez vide pour pas de bouton"><AppleInput value={form.link} onChange={e=>set('link',e.target.value)} placeholder="/programs/mon-programme ou https://…" /></AppleFormGroup>
            <AppleFormGroup label="Texte du bouton"><AppleInput value={form.linkText} onChange={e=>set('linkText',e.target.value)} placeholder="En savoir plus" /></AppleFormGroup>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
            <AppleFormGroup label="Date de début" hint="Vide = permanent"><AppleInput type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} /></AppleFormGroup>
            <AppleFormGroup label="Date de fin"><AppleInput type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)} /></AppleFormGroup>
          </div>

          <AppleToggle checked={form.isActive} onChange={e => set('isActive',e.target.checked)} label={form.isActive?'Affiche active — visible sur le site':'Affiche inactive — masquée du site'} />
        </form>
      </AppleModal>
    </AppleLayout>
  );
};

export default AdminAffiches;