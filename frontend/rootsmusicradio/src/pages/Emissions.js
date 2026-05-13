
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Emissions = () => {
  const { t } = useTranslation();
  const [selectedHost, setSelectedHost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  
  // ✅ États dynamiques
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Récupération dynamique des émissions depuis l'API
  useEffect(() => {
    const fetchEmissions = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get('/api/emissions');
        setHosts(response.data.hosts || []);
      } catch (error) {
        console.error('Failed to fetch emissions:', error);
        setError('Erreur lors du chargement des émissions');
        
        // ⚠️ FALLBACK : Si l'API échoue, utiliser les données statiques temporairement
        setHosts([
          {
            id: 1,
            photo: '/images/hosts/SELF-LIST_AFFICHE.jpg',
            bio: 'Decouvrez les playlistes de vos artistes preferés.',
            program: 'Mix Party',
            schedule: 'Samedi 20h-22h',
            episodes: [
              {
                id: 'ep1',
                title: 'SELF-LIST #125 - BY-SABRINA',
                date: '2025-01-04',
                duration: '00:15:53',
                audioUrl: '/audio/emissions/SELF-LIST-BY-SABRINA.mp3',
                cover: '/images/hosts/SELF-LIST-BY-SABRINA.jpg',
                description: 'Episode 01.'
              }
            ]
          },
          {
            id: 2,
            photo: '/images/hosts/denis.jpg',
            bio: 'Denis te plonge dans l\'univers de la musiques urbaine internationales.',
            program: 'La Rétro avec Denis',
            episodes: [
              {
                id: 'ep4',
                title: 'La Rétro #89 - Golden 80s',
                date: '2025-01-03',
                duration: '1:00:00',
                audioUrl: '/audio/emissions/retro-89.mp3',
                cover: '/images/hosts/PLAYLIST_WEEKEND_AFFICHE.jpg',
                description: 'Redécouvrez les plus grands tubes des années 80.'
              }
            ]
          },
          {
            id: 3,
            photo: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.png',
            bio: 'DJ vedette de Mix Party, Eric 5 Étoiles enflamme vos samedis soirs.',
            program: 'Mix Party',
            episodes: [
              {
                id: 'ep1',
                title: 'Mix Party #125 - Special Afrobeat',
                date: '2025-01-04',
                duration: '2:00:00',
                audioUrl: '/audio/emissions/mix-party-125.mp3',
                cover: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.jpg',
                description: 'Un mix explosif des meilleurs hits afrobeat.'
              }
            ]
          },
          {
            id: 4,
            photo: '/images/hosts/SUMMER_MIX_BY_DJ_MATHIAS.jpg',
            title: 'Animateurs Good Morning Vibes',
            bio: 'L\'équipe dynamique qui réveille vos matinées.',
            program: 'Good Morning Vibes',
            episodes: [
              {
                id: 'ep7',
                title: 'Good Morning Vibes - Lundi 6 Janvier',
                date: '2025-01-06',
                duration: '4:00:00',
                audioUrl: '/audio/emissions/SELF-LIST-BY-DJ-ZOUMANTO.mp3',
                cover: '/images/hosts/GOOD_MORNING-AFFICHE.jpg',
                description: 'Démarrez la semaine en musique !'
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmissions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleHostClick = (host) => {
    setSelectedHost(host);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  if (currentAudio) {
    currentAudio._cleanup?.();  // ← cleanup des listeners
    currentAudio.pause();
    currentAudio.src = '';
    setCurrentAudio(null);
  }
    setIsPlaying(false);
    setSelectedEpisode(null);
  };

  const handlePlayEpisode = (episode) => {
     if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = ''; // libérer la ressource
  }
  const audio = new Audio(episode.audioUrl);
  
  const onEnded = () => setIsPlaying(false);
  const onError = () => {
    alert('Fichier audio introuvable.');
    setIsPlaying(false);
  };
  
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('error', onError);
  
  // Stocker les références pour cleanup
  audio._cleanup = () => {
    audio.removeEventListener('ended', onEnded);
    audio.removeEventListener('error', onError);
  };
  
  setCurrentAudio(audio);
    setSelectedEpisode(episode);
    setIsPlaying(true);

    audio.play();

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('error', () => {
      alert('Impossible de lire cet épisode. Le fichier audio est introuvable.');
      setIsPlaying(false);
    });
  };



  const handlePauseEpisode = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const handleResumeEpisode = () => {
    if (currentAudio) {
      currentAudio.play();
      setIsPlaying(true);
    }
  };

  // ✅ Affichage du chargement
  if (loading) {
    return (
      <div style={{ 
        background: '#fafafa', 
        minHeight: '100vh', 
        paddingTop: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <Spinner animation="border" variant="dark" />
          <p className="mt-3">Chargement des émissions...</p>
        </div>
      </div>
    );
  }

  // ✅ Affichage des erreurs
  if (error && hosts.length === 0) {
    return (
      <div style={{ 
        background: '#fafafa', 
        minHeight: '100vh', 
        paddingTop: '60px',
        paddingBottom: '80px'
      }}>
        <Container>
          <Alert variant="danger" className="mt-5">
            <Alert.Heading>Erreur</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#fafafa', 
      minHeight: '100vh', 
      paddingTop: '60px',
      paddingBottom: '80px'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
          
          .host-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          
          .host-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
          }
          
          .host-photo {
            transition: transform 0.6s ease;
          }
          
          .host-card:hover .host-photo {
            transform: scale(1.1);
          }
          
          .episode-card {
            transition: all 0.3s ease;
          }
          
          .episode-card:hover {
            background: rgba(0,0,0,0.02);
          }
          
          .play-button {
            transition: all 0.3s ease;
          }
          
          .play-button:hover {
            transform: scale(1.1);
            background: #333 !important;
          }
        `}
      </style>

      <Container>
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
            Nos Émissions
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
            Rencontrez nos animateurs et réécoutez leurs meilleures émissions
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

        {/* ⚠️ Message si données en fallback */}
        {error && hosts.length > 0 && (
          <Alert variant="warning" className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Connexion à la base de données impossible. Affichage des données de démonstration.
          </Alert>
        )}

        {/* Grille des animateurs */}
        {hosts.length > 0 ? (
          <Row className="g-4">
            {hosts.map((host) => (
              <Col lg={4} md={6} key={host.id}>
                <Card 
                  className="host-card border-0 h-100"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: '#fff'
                  }}
                  onClick={() => handleHostClick(host)}
                >
                  {/* Photo de l'animateur */}
                  <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden',
                    height: '350px'
                  }}>
                    <img
                      src={host.photo}
                      alt={host.name || 'Animateur'}
                      className="host-photo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(20%)'
                      }}
                      onError={(e) => {
                        e.target.src = '/images/hosts/placeholder.jpg';
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                        padding: '60px 24px 24px',
                        color: '#fff'
                      }}
                    >
                      <h3 
                        style={{
                          fontSize: '28px',
                          fontWeight: '700',
                          marginBottom: '4px',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        {host.name || host.program}
                      </h3>
                      <p 
                        style={{
                          fontSize: '14px',
                          marginBottom: '12px',
                          opacity: 0.9
                        }}
                      >
                        {host.title || 'Animateur'}
                      </p>
                      {host.schedule && (
                        <Badge 
                          style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '500',
                            border: '1px solid rgba(255,255,255,0.3)'
                          }}
                        >
                          <i className="bi bi-clock me-1"></i>
                          {host.schedule}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Infos */}
                  <Card.Body style={{ padding: '24px' }}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <Badge 
                        style={{
                          background: 'rgba(0,0,0,0.05)',
                          color: '#000',
                          fontWeight: '600',
                          padding: '8px 14px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}
                      >
                        <i className="bi bi-broadcast me-1"></i>
                        {host.program}
                      </Badge>
                      <Badge 
                        bg="dark"
                        style={{
                          padding: '8px 14px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {host.episodes?.length || 0} épisodes
                      </Badge>
                    </div>
                    <p 
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}
                    >
                      {host.bio}
                    </p>
                    <button
                      className="btn w-100"
                      style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#333';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#000';
                      }}
                    >
                      <i className="bi bi-headphones me-2"></i>
                      Écouter les émissions
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-broadcast fs-1 text-muted mb-3"></i>
            <h4 className="text-muted">Aucune émission disponible</h4>
            <p className="text-muted">
              Les émissions seront bientôt disponibles.
            </p>
          </div>
        )}
      </Container>

      {/* Modal des épisodes */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg"
        centered
      >
        <Modal.Header 
          closeButton
          style={{
            border: 'none',
            padding: '24px',
            background: '#fafafa'
          }}
        >
          <Modal.Title 
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '700',
              fontSize: '24px'
            }}
          >
            {selectedHost?.name || selectedHost?.program}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0 24px 24px' }}>
          {selectedHost && (
            <>
              {/* Info de l'animateur */}
              <div 
                className="mb-4 p-3"
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-broadcast me-2" style={{ fontSize: '18px' }}></i>
                  <strong style={{ fontSize: '16px' }}>{selectedHost.program}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {selectedHost.bio}
                </p>
              </div>

              {/* Liste des épisodes */}
              <h5 
                className="mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '600',
                  fontSize: '18px'
                }}
              >
                Émissions disponibles
              </h5>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedHost.episodes && selectedHost.episodes.length > 0 ? (
                  selectedHost.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="episode-card d-flex align-items-center p-3 mb-3"
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        border: selectedEpisode?.id === episode.id 
                          ? '2px solid #000' 
                          : '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      {/* Pochette */}
                      <img
                        src={episode.cover}
                        alt={episode.title}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          marginRight: '16px'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/default-cover.jpg';
                        }}
                      />

                      {/* Infos */}
                      <div className="flex-grow-1">
                        <h6 
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            marginBottom: '4px',
                            color: '#000'
                          }}
                        >
                          {episode.title}
                        </h6>
                        <p 
                          style={{
                            fontSize: '13px',
                            color: '#666',
                            marginBottom: '4px'
                          }}
                        >
                          {episode.description}
                        </p>
                        <div className="d-flex gap-3" style={{ fontSize: '12px', color: '#999' }}>
                          <span>
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(episode.date)}
                          </span>
                          <span>
                            <i className="bi bi-clock me-1"></i>
                            {episode.duration}
                          </span>
                        </div>
                      </div>

                      {/* Bouton Play/Pause */}
                      <button
                        className="play-button btn"
                        style={{
                          background: '#000',
                          color: '#fff',
                          border: 'none',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}
                        onClick={() => {
                          if (selectedEpisode?.id === episode.id && isPlaying) {
                            handlePauseEpisode();
                          } else if (selectedEpisode?.id === episode.id && !isPlaying) {
                            handleResumeEpisode();
                          } else {
                            handlePlayEpisode(episode);
                          }
                        }}
                      >
                        {selectedEpisode?.id === episode.id && isPlaying ? (
                          <i className="bi bi-pause-fill"></i>
                        ) : (
                          <i className="bi bi-play-fill"></i>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-collection-play fs-1 text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun épisode disponible</h5>
                  </div>
                )}
              </div>

              {/* Lecteur en cours */}
              {selectedEpisode && (
                <div 
                  className="mt-4 p-3"
                  style={{
                    background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i 
                      className="bi bi-music-note-beamed me-3" 
                      style={{ fontSize: '24px' }}
                    ></i>
                    <div className="flex-grow-1">
                      <div 
                        style={{
                          fontSize: '13px',
                          opacity: 0.8,
                          marginBottom: '2px'
                        }}
                      >
                        {isPlaying ? 'En cours de lecture' : 'En pause'}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600' }}>
                        {selectedEpisode.title}
                      </div>
                    </div>
                    <Badge 
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px'
                      }}
                    >
                      {isPlaying ? (
                        <>
                          <span className="pulse-dot"></span>
                          EN LECTURE
                        </>
                      ) : (
                        'PAUSE'
                      )}
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Emissions;