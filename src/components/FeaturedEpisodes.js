import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeaturedEpisodes = ({ featuredEpisodes }) => {
  if (!featuredEpisodes || featuredEpisodes.length === 0) return null;

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
    }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center text-white">
              <i className="bi bi-collection-play me-2" style={{color: '#4488ff'}}></i>
              Épisodes en Vedette
            </h2>
          </Col>
        </Row>
        
        <Row>
          {featuredEpisodes.map((episode) => (
            <Col md={4} key={`episode-${episode._id}`} className="mb-4">
              <Card className="h-100" style={{
                background: 'linear-gradient(135deg, rgba(50,50,50,0.6), rgba(20,20,20,0.8))',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <Card.Img
                  variant="top"
                  src={episode.image || '/uploads/placeholder-episode.jpg'}
                  alt={episode.title}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    filter: 'brightness(0.9)'
                  }}
                />
                <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
                  <Card.Title className="text-white">{episode.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <small style={{color: '#ccc'}}>
                      <i className="bi bi-tv me-1"></i>
                      {episode.programId?.title}
                    </small>
                    <br />
                    <span style={{color: '#bbb'}}>{episode.description}</span>
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge style={{
                      background: 'linear-gradient(45deg, #44aaff, #3388cc)',
                      color: 'white'
                    }} className="me-2">
                      S{episode.season}E{episode.episodeNumber}
                    </Badge>
                    <Button size="sm" style={{
                      background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
                      color: 'black',
                      border: 'none',
                      fontWeight: 'bold'
                    }}>
                      <i className="bi bi-play-fill me-1"></i>
                      Écouter
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/episodes" className="btn" style={{
              background: 'transparent',
              border: '2px solid white',
              color: 'white',
              padding: '10px 30px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}>
              Voir tous les épisodes
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedEpisodes;