import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tab, Nav, ListGroup, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../contexts/RadioContext';
import AudioPlayer from '../components/AudioPlayer';

const ProgramDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProgramBySlug, getEpisodesByProgram } = useRadio();
  
  const [program, setProgram] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError('');
      
      try {
        const programData = await getProgramBySlug(slug);
        if (!programData) {
          setError('Programme non trouvé');
          return;
        }
        
        setProgram(programData);
        
        // Fetch episodes for this program
        const episodesData = await getEpisodesByProgram(programData._id);
        setEpisodes(episodesData.episodes || []);
      } catch (error) {
        console.error('Failed to fetch program details:', error);
        setError('Erreur lors du chargement du programme');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [slug, getProgramBySlug, getEpisodesByProgram]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  const getDayName = (day) => {
    const days = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };
    return days[day] || day;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !program) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error || 'Programme non trouvé'}</p>
          <Button variant="outline-danger" onClick={() => navigate('/programs')}>
            Retour aux programmes
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="program-detail-page">
      {/* Hero Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={4} className="mb-4 mb-lg-0">
              <img
                src={program.image || '/uploads/placeholder-program.jpg'}
                alt={program.title}
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col lg={8}>
              <div className="mb-3">
                <Badge bg="secondary" className="me-2 fs-6">
                  {program.category}
                </Badge>
                {program.featured && (
                  <Badge bg="warning" className="fs-6">
                    <i className="bi bi-star-fill me-1"></i>
                    Programme vedette
                  </Badge>
                )}
              </div>
              
              <h1 className="mb-3">{program.title}</h1>
              
              <p className="lead mb-3">
                <i className="bi bi-person-fill me-2"></i>
                Animé par {program.host}
              </p>
              
              <p className="mb-4">{program.description}</p>
              
              <div className="d-flex flex-wrap gap-2 mb-3">
                {program.tags && program.tags.map((tag, index) => (
                  <Badge key={index} bg="outline-light" className="border">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="d-flex gap-3">
                <Button variant="light" size="lg">
                  <i className="bi bi-play-fill me-2"></i>
                  Écouter en direct
                </Button>
                <Button variant="outline-light" size="lg">
                  <i className="bi bi-heart me-2"></i>
                  Suivre
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content Tabs */}
      <section className="py-5">
        <Container>
          <Tab.Container defaultActiveKey="schedule">
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="schedule">
                  <i className="bi bi-calendar3 me-2"></i>
                  Horaires
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="episodes">
                  <i className="bi bi-collection-play me-2"></i>
                  Épisodes ({episodes.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="about">
                  <i className="bi bi-info-circle me-2"></i>
                  À propos
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Schedule Tab */}
              <Tab.Pane eventKey="schedule">
                <Row>
                  <Col lg={8}>
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">
                          <i className="bi bi-clock me-2"></i>
                          Grille horaire
                        </h4>
                      </Card.Header>
                      <Card.Body>
                        {program.schedule && program.schedule.length > 0 ? (
                          <ListGroup variant="flush">
                            {program.schedule.map((schedule, index) => (
                              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">{getDayName(schedule.day)}</h6>
                                  <small className="text-muted">
                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                  </small>
                                </div>
                                <Badge bg="primary">
                                  {schedule.duration} min
                                </Badge>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <p className="text-muted">Aucun horaire défini pour ce programme.</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">Informations</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <strong>Animateur :</strong>
                          <br />
                          {program.host}
                        </div>
                        <div className="mb-3">
                          <strong>Catégorie :</strong>
                          <br />
                          <Badge bg="secondary">{program.category}</Badge>
                        </div>
                        <div className="mb-3">
                          <strong>Statut :</strong>
                          <br />
                          <Badge bg={program.active ? 'success' : 'danger'}>
                            {program.active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        {program.social && (
                          <div>
                            <strong>Réseaux sociaux :</strong>
                            <div className="mt-2">
                              {program.social.twitter && (
                                <a href={program.social.twitter} className="btn btn-sm btn-outline-primary me-2">
                                  <i className="bi bi-twitter"></i>
                                </a>
                              )}
                              {program.social.facebook && (
                                <a href={program.social.facebook} className="btn btn-sm btn-outline-primary me-2">
                                  <i className="bi bi-facebook"></i>
                                </a>
                              )}
                              {program.social.instagram && (
                                <a href={program.social.instagram} className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-instagram"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Episodes Tab */}
              <Tab.Pane eventKey="episodes">
                {episodes.length > 0 ? (
                  <Row>
                    {episodes.map((episode) => (
                      <Col lg={6} key={episode._id} className="mb-4">
                        <Card className="h-100">
                          <Row className="g-0">
                            <Col md={4}>
                              <Card.Img
                                src={episode.image || '/uploads/placeholder-episode.jpg'}
                                alt={episode.title}
                                className="h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            </Col>
                            <Col md={8}>
                              <Card.Body className="d-flex flex-column">
                                <Card.Title className="h6">{episode.title}</Card.Title>
                                <Card.Text className="flex-grow-1 small">
                                  {episode.description}
                                </Card.Text>
                                <div className="mt-auto">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                      S{episode.season}E{episode.episodeNumber}
                                    </small>
                                    <Button variant="sm" size="sm">
                                      <i className="bi bi-play-fill me-1"></i>
                                      Écouter
                                    </Button>
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-collection-play fs-1 text-muted mb-3"></i>
                    <h4 className="text-muted">Aucun épisode disponible</h4>
                    <p className="text-muted">
                      Les épisodes de ce programme seront disponibles prochainement.
                    </p>
                  </div>
                )}
              </Tab.Pane>

              {/* About Tab */}
              <Tab.Pane eventKey="about">
                <Row>
                  <Col lg={8}>
                    <Card>
                      <Card.Header>
                        <h4 className="mb-0">À propos du programme</h4>
                      </Card.Header>
                      <Card.Body>
                        <p>{program.longDescription || program.description}</p>
                        
                        {program.history && (
                          <div className="mb-4">
                            <h5>Histoire</h5>
                            <p>{program.history}</p>
                          </div>
                        )}
                        
                        {program.objectives && (
                          <div className="mb-4">
                            <h5>Objectifs</h5>
                            <ul>
                              {program.objectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {program.targetAudience && (
                          <div>
                            <h5>Public cible</h5>
                            <p>{program.targetAudience}</p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">Équipe</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <strong>Animateur principal :</strong>
                          <br />
                          {program.host}
                        </div>
                        
                        {program.coHosts && program.coHosts.length > 0 && (
                          <div className="mb-3">
                            <strong>Co-animateurs :</strong>
                            <ul className="list-unstyled mt-1">
                              {program.coHosts.map((coHost, index) => (
                                <li key={index}>{coHost}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {program.producer && (
                          <div className="mb-3">
                            <strong>Producteur :</strong>
                            <br />
                            {program.producer}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </section>

      {/* Audio Player */}
      <section className="py-3 bg-light">
        <Container>
          <AudioPlayer />
        </Container>
      </section>
    </div>
  );
};

export default ProgramDetail;