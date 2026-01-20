import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FeaturedPrograms = ({ featuredPrograms }) => {
  if (!featuredPrograms || featuredPrograms.length === 0) return null;

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(to bottom, rgba(20,20,20,0.5), rgba(40,40,40,0.3))'
    }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center text-white">
              <i className="bi bi-star-fill me-2" style={{color: '#ffcc00'}}></i>
              Programmes en Vedette
            </h2>
          </Col>
        </Row>
        
        <Row>
          {featuredPrograms.map((program) => (
            <Col md={4} key={`program-${program._id}`} className="mb-4">
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
                  src={program.image || '/uploads/placeholder-program.jpg'}
                  alt={program.title}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    filter: 'brightness(0.9)'
                  }}
                />
                <Card.Body className="d-flex flex-column" style={{color: 'white'}}>
                  <Card.Title className="text-white">{program.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <small style={{color: '#ccc'}}>
                      <i className="bi bi-person me-1"></i>
                      {program.host}
                    </small>
                    <br />
                    <span style={{color: '#bbb'}}>{program.description}</span>
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge style={{
                      background: 'linear-gradient(45deg, #666, #444)',
                      color: 'white'
                    }} className="me-2">
                      {program.category}
                    </Badge>
                    <Link 
                      to={`/programs/${program.slug}`}
                      className="btn btn-sm"
                      style={{
                        background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
                        color: 'black',
                        border: 'none',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(45deg, #f0f0f0, #d0d0d0)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(45deg, #ffffff, #e0e0e0)';
                      }}
                    >
                      Voir plus
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/programs" className="btn" style={{
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
              Voir tous les programmes
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedPrograms;