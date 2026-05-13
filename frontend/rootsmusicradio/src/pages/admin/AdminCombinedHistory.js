import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCombinedHistory = () => {
  const [combinedHistory, setCombinedHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Form data pour ajouter une émission
  const [emissionForm, setEmissionForm] = useState({
    title: '',
    host: '',
    programId: '',
    cover: '',
    duration: '',
    description: '',
    category: 'Émission'
  });
  
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    loadHistory();
    loadStats();
    loadPrograms();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/combined-history?limit=100');
      setCombinedHistory(response.data.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Erreur de chargement');
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/combined-history/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await axios.get('/api/programs');
      setPrograms(response.data.programs || response.data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.title}" de l'historique ?`)) {
      return;
    }

    try {
      if (item.type === 'track') {
        await axios.delete(`/api/combined-history/track/${item._id}`);
      } else if (item.type === 'emission') {
        await axios.delete(`/api/combined-history/emission/${item._id}`);
      }
      
      toast.success('Élément supprimé');
      loadHistory();
      loadStats();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddEmission = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/combined-history/emission', emissionForm);
      toast.success('Émission ajoutée à l\'historique');
      setShowModal(false);
      setEmissionForm({
        title: '',
        host: '',
        programId: '',
        cover: '',
        duration: '',
        description: '',
        category: 'Émission'
      });
      loadHistory();
      loadStats();
    } catch (error) {
      console.error('Error adding emission:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const filteredHistory = combinedHistory.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'tracks') return item.type === 'track';
    if (activeTab === 'emissions') return item.type === 'emission';
    return true;
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadge = (type) => {
    if (type === 'track') {
      return <Badge bg="success">Musique</Badge>;
    }
    if (type === 'emission') {
      return <Badge bg="info">Émission</Badge>;
    }
    return <Badge bg="secondary">Inconnu</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <i className="bi bi-clock-history me-2"></i>
                Gestion de l'historique
              </h2>
              <p className="text-muted">Gérez l'historique des diffusions (musique + émissions)</p>
            </div>
            <div>
              <Link to="/admin" className="btn btn-outline-secondary me-2">
                <i className="bi bi-arrow-left me-1"></i>
                Retour
              </Link>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-1"></i>
                Ajouter une émission
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistiques */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h3>{stats.total}</h3>
                <p className="text-muted mb-0">Total éléments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h3>{stats.totalTracks}</h3>
                <p className="text-muted mb-0">Morceaux</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h3>{stats.totalEmissions}</h3>
                <p className="text-muted mb-0">Émissions</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <h3>{stats.today}</h3>
                <p className="text-muted mb-0">Aujourd'hui</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Historique */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Tab eventKey="all" title={`Tout (${combinedHistory.length})`} />
                <Tab eventKey="tracks" title={`Musique (${combinedHistory.filter(i => i.type === 'track').length})`} />
                <Tab eventKey="emissions" title={`Émissions (${combinedHistory.filter(i => i.type === 'emission').length})`} />
              </Tabs>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                  <p className="text-muted mt-2">Aucun élément</p>
                </div>
              ) : (
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Pochette</th>
                      <th>Titre</th>
                      <th>Artiste/Animateur</th>
                      <th>Détails</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item._id}>
                        <td>{getTypeBadge(item.type)}</td>
                        <td>
                          <img
                            src={item.cover || '/images/default-cover.png'}
                            alt={item.title}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              e.target.src = '/images/default-cover.png';
                            }}
                          />
                        </td>
                        <td>
                          <strong>{item.title}</strong>
                        </td>
                        <td>
                          {item.type === 'track' && (
                            <>
                              <i className="bi bi-music-note me-1"></i>
                              {item.artist}
                            </>
                          )}
                          {item.type === 'emission' && (
                            <>
                              <i className="bi bi-mic me-1"></i>
                              {item.host}
                            </>
                          )}
                        </td>
                        <td>
                          {item.type === 'track' && item.album && (
                            <small className="text-muted">{item.album}</small>
                          )}
                          {item.type === 'emission' && item.programId && (
                            <Badge bg="secondary">{item.programId.title || 'Programme'}</Badge>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">{formatTime(item.playedAt)}</small>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
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

      {/* Modal Ajouter Émission */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une émission à l'historique</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddEmission}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre *</Form.Label>
                  <Form.Control
                    type="text"
                    value={emissionForm.title}
                    onChange={(e) => setEmissionForm({ ...emissionForm, title: e.target.value })}
                    required
                    placeholder="Titre de l'émission"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Animateur *</Form.Label>
                  <Form.Control
                    type="text"
                    value={emissionForm.host}
                    onChange={(e) => setEmissionForm({ ...emissionForm, host: e.target.value })}
                    required
                    placeholder="Nom de l'animateur"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Programme (optionnel)</Form.Label>
              <Form.Select
                value={emissionForm.programId}
                onChange={(e) => setEmissionForm({ ...emissionForm, programId: e.target.value })}
              >
                <option value="">Aucun programme</option>
                {programs.map(program => (
                  <option key={program._id} value={program._id}>
                    {program.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={emissionForm.description}
                onChange={(e) => setEmissionForm({ ...emissionForm, description: e.target.value })}
                placeholder="Description de l'émission"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Pochette</Form.Label>
                  <Form.Control
                    type="url"
                    value={emissionForm.cover}
                    onChange={(e) => setEmissionForm({ ...emissionForm, cover: e.target.value })}
                    placeholder="http://example.com/cover.jpg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Durée (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={emissionForm.duration}
                    onChange={(e) => setEmissionForm({ ...emissionForm, duration: e.target.value })}
                    placeholder="60"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                type="text"
                value={emissionForm.category}
                onChange={(e) => setEmissionForm({ ...emissionForm, category: e.target.value })}
                placeholder="Émission"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              <i className="bi bi-plus-circle me-1"></i>
              Ajouter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminCombinedHistory;