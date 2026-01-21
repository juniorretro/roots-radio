import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeaturedPodcasts = ({ featuredPodcasts }) => {
  if (!featuredPodcasts || featuredPodcasts.length === 0) return null;

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
    }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center text-white">
              <i className="bi bi-headphones me-2" style={{color: '#00ff88'}}></i>
              Podcasts en Vedette
            </h2>
          </Col>
        </Row>
        
        <Row>
          {featuredPodcasts.map((podcast) => (
            <Col md={4} key={`podcast-${podcast._id}`} className="mb-4">
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
                  src={podcast.image || '/uploads/placeholder-podcast.jpg'}
                  alt={podcast.title}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    filter: 'brightness(0.9)'
                  }}
                />
                <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
                  <Card.Title className="text-white">{podcast.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <small style={{color: '#ccc'}}>
                      <i className="bi bi-person me-1"></i>
                      {podcast.host}
                    </small>
                    <br />
                    <span style={{color: '#bbb'}}>{podcast.description}</span>
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div>
                      <Badge style={{
                        background: 'linear-gradient(45deg, #666, #444)',
                        color: 'white'
                      }} className="me-2">
                        {podcast.category}
                      </Badge>
                    </div>
                    <div>
                      <small className="me-2" style={{color: '#ccc'}}>
                        <i className="bi bi-download me-1"></i>
                        {podcast.downloads || 0}
                      </small>
                      <Button size="sm" style={{
                        background: 'linear-gradient(45deg, #00ff88, #00cc66)',
                        color: 'black',
                        border: 'none',
                        fontWeight: 'bold'
                      }}>
                        <i className="bi bi-play-fill me-1"></i>
                        Écouter
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/podcasts" className="btn" style={{
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
              Voir tous les podcasts
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedPodcasts;