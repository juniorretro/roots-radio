import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Emissions = () => {
  const { t } = useTranslation();
  const [selectedHost, setSelectedHost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  // 🎙️ Liste des animateurs avec leurs émissions
  const hosts = [
    {
      id: 1,
    //   name: 'SELF-LIST_AFFICHE',
      photo: '/images/hosts/SELF-LIST_AFFICHE.jpg',
    //   title: 'Animateur Mix Party',
      bio: 'Decouvrez les playlistes de vos artistes preferés.',
      program: 'Mix Party',
      schedule: 'Samedi 20h-22h',
      episodes: [
       
        {
          id: 'ep3',
          title: 'Mix Party #123 - BY-BDK',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/DJ-BDK.mp3',
          cover: '/images/hosts/DJ_BDK.jpg',
          description: 'Episode.'
        },
         {
          id: 'ep4',
          title: 'Mix Party #123 -BY-DASHOR',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF_LIST_BY_DASHOR.mp3',
          cover: '/images/hosts/SELF_LIST_BY_DASHOR.jpg',
          description: 'Episode.'
        },
         {
          id: 'ep5',
          title: 'Mix Party #123 - BY-DJ-PERES',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-DJ-PERES.mp3',
          cover: '/images/hosts/SELF-LIST-BY-DJ-PERES.jpg',
          description: 'Episode.'
        },
         {
          id: 'ep1',
          title: 'SELF-LIST #125 - BY-SABRINA',
          date: '2025-01-04',
          duration: '00:15:53',
          audioUrl: '/audio/emissions/SELF-LIST-BY-SABRINA.mp3',
          cover: '/images/hosts/SELF-LIST-BY-SABRINA.jpg',
          description: 'Episode 01.'
        },
         {
          id: 'ep6',
          title: 'Mix Party #123 - BY-LE-JOKER',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/JOKER.mp3',
          cover: '/images/hosts/SELF-LIST-BY-LE-JOKER.jpg',
          description: 'Episode.'
        }
        ,
         {
          id: 'ep7',
          title: 'Mix Party #123 - BY-DJ-KAMENI',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-DJ-KAMENI.mp3',
          cover: '/images/hosts/SELF-LIST-BY-DJ-KAMENI.jpg',
          description: 'Episode.'
        },
         {
          id: 'ep8',
          title: 'Mix Party #123 - BY-DJ-ZOUMENTO',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-DJ-ZOUMANTO.mp3',
          cover: '/images/hosts/DJ-ZOUMANTO.jpg',
          description: 'Episode.'
        },
         {
          id: 'ep9',
          title: 'Mix Party #123 - BY-ENO',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-ENO-ON-THE-TRACK.mp3',
          cover: '/images/hosts/ENO-ON-THE-TRACK.jpg',
          description: 'Episode.'
        },
         {
          id: 'ep10',
          title: 'Mix Party #123 - BY-KING-ARTHUR',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-KING-ARTHUR.mp3',
          cover: '/images/hosts/SELF-LIST-BY-KING-ARTHUR.jpg',
          description: 'Episode.'
        }
        // ,
        //  {
        //   id: 'ep11',
        //   title: 'Mix Party #123 - BY-DJ-KAMENI',
        //   date: '2024-12-21',
        //   duration: '00:16:05',
        //   audioUrl: '/audio/emissions/SELF-LIST-BY-DJ-KAMENI.mp3',
        //   cover: '/images/hosts/SELF-LIST-BY-DJ-KAMENI.jpg',
        //   description: 'Episode.'
        // }
        ,
         {
          id: 'ep12',
          title: 'Mix Party #123 - BY-ROMEN-PETER',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-ROMAN-PETER.mp3',
          cover: '/images/hosts/SELF-LIST-BY-ROMAN-PETER.jpg',
          description: 'Episode.'
        },
        
        {
          id: 'ep2',
          title: 'Mix Party #124 - By-MARTIN-S',
          date: '2024-12-28',
          duration: '2:00:00',
          audioUrl: '/audio/emissions/SELF-LIST-BY-MARTIN-S.mp3',
          cover: '/images/hosts/SELF-LIST-BY-MARTIN-S.jpg',
          description: 'Episode 01.'
        },
         {
          id: 'ep13',
          title: 'Mix Party #123 - BY-SALATIEL',
          date: '2024-12-21',
          duration: '00:16:05',
          audioUrl: '/audio/emissions/SELF-LIST-BY-SALATIEL.mp3',
          cover: '/images/hosts/SELF-LIST-BY-SALATIEL.jpg',
          description: 'Episode.'
        },
      ]
    },
    {
      id: 2,
    //   name: 'Denis',
      photo: '/images/hosts/denis.jpg',
    //   title: 'Animateur La Rétro',
      bio: 'Denis te plonge dans l\'univers de la musiques urbaine internationales. Fun ,dedicaces , fou rire et bonne humeur sont au rendez-vous chaque soir dans La Rétro.',
      program: 'La Rétro avec Denis',
    //   schedule: 'Lun-Ven 20h-21h',
      episodes: [
        {
          id: 'ep4',
          title: 'La Rétro #89 - Golden 80s',
          date: '2025-01-03',
          duration: '1:00:00',
          audioUrl: '/audio/emissions/retro-89.mp3',
          cover: '/images/hosts/PLAYLIST_WEEKEND_AFFICHE.jpg',
          description: 'Redécouvrez les plus grands tubes des années 80.'
        },
        {
          id: 'ep5',
          title: 'La Rétro #88 - Disco Fever',
          date: '2025-01-02',
          duration: '1:00:00',
          audioUrl: '/audio/emissions/retro-88.mp3',
          cover: '/images/hosts/PLAYLIST_WEEKEND_AFFICHE.jpg',
          description: 'L\'âge d\'or du disco et du funk.'
        },
        {
          id: 'ep6',
          title: 'La Rétro #87 - Soul Classics',
          date: '2024-12-30',
          duration: '1:00:00',
          audioUrl: '/audio/emissions/retro-87.mp3',
          cover: '/images/hosts/PLAYLIST_WEEKEND_AFFICHE.jpg',
          description: 'Les légendes de la soul music.'
        }
      ]
    },
        
{
      id: 3,
    //   name: 'Eric 5 Étoiles',
      photo: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.png',
    //   title: 'Animateur Mix Party',
      bio: 'DJ vedette de Mix Party, Eric 5 Étoiles enflamme vos samedis soirs avec les meilleurs mix.',
    //   program: 'Mix Party',
    //   schedule: 'Samedi 20h-22h',
      episodes: [
        {
          id: 'ep1',
          title: 'Mix Party #125 - Special Afrobeat',
          date: '2025-01-04',
          duration: '2:00:00',
          audioUrl: '/audio/emissions/mix-party-125.mp3',
          cover: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.jpg',
          description: 'Un mix explosif des meilleurs hits afrobeat du moment.'
        },
        {
          id: 'ep2',
          title: 'Mix Party #124 - New Year Special',
          date: '2024-12-28',
          duration: '2:00:00',
          audioUrl: '/audio/emissions/mix-party-124.mp3',
          cover: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.jpg',
          description: 'Célébration du Nouvel An avec les tubes de 2024.'
        },
        {
          id: 'ep3',
          title: 'Mix Party #123 - Goods Vibes',
          date: '2024-12-21',
          duration: '2:00:00',
          audioUrl: '/audio/emissions/mix-party-123.mp3',
          cover: '/images/hosts/MIX_PARTY_BY_ERIC_5_ETOILES.jpg',
          description: 'Ambiance festive pour les fêtes de fin d\'année.'
        }
      ]
    },

    {
      id: 4,
    //   name: 'SUMMER_MIX_BY_DJ_MATHIAS',
      photo: '/images/hosts/SUMMER_MIX_BY_DJ_MATHIAS.jpg',
      title: 'Animateurs Good Morning Vibes',
      bio: 'L\'équipe dynamique qui réveille vos matinées avec énergie et bonne humeur.',
      program: 'Good Morning Vibes',
    //   schedule: 'Tous les jours 6h-10h',
      episodes: [
        {
          id: 'ep7',
          title: 'Good Morning Vibes - Lundi 6 Janvier',
          date: '2025-01-06',
          duration: '4:00:00',
          audioUrl: '/audio/emissions/SELF-LIST-BY-DJ-ZOUMANTO.mp3',
          cover: '/images/hosts/GOOD_MORNING-AFFICHE.jpg',
          description: 'Démarrez la semaine en musique !'
        },
        {
          id: 'ep8',
          title: 'Good Morning Vibes - Vendredi 3 Janvier',
          date: '2025-01-03',
          duration: '4:00:00',
          audioUrl: '/audio/emissions/morning-03-01.mp3',
          cover: '/images/hosts/GOOD_MORNING-AFFICHE.jpg',
          description: 'On termine la semaine en beauté.'
        }
      ]
    },

  ];

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
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
    setSelectedEpisode(null);
  };

  const handlePlayEpisode = (episode) => {
    // Arrêter l'audio précédent si existant
    if (currentAudio) {
      currentAudio.pause();
    }

    // Créer un nouvel élément audio
    const audio = new Audio(episode.audioUrl);
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

  return (
    <div style={{ 
      background: '#fafafa', 
      minHeight: '100vh', 
      paddingTop: '60px',
      paddingBottom: '80px'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
          
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

        {/* Grille des animateurs */}
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
                    alt={host.name}
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
                      {host.name}
                    </h3>
                    <p 
                      style={{
                        fontSize: '14px',
                        marginBottom: '12px',
                        opacity: 0.9
                      }}
                    >
                      {host.title}
                    </p>
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
                      {host.episodes.length} épisodes
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
            {selectedHost?.name}
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
                {selectedHost.episodes.map((episode) => (
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
                ))}
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