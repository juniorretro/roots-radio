import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const StatsSection = () => {
  return (
    <section className="py-5" style={{
      background: 'linear-gradient(to bottom, rgba(40,40,40,0.3), rgba(20,20,20,0.5))'
    }}>
      <Container>
        <Row>
          <Col md={3} className="text-center mb-4 mb-md-0">
            <div className="p-3">
              <i className="bi bi-broadcast fs-1 mb-2" style={{color: '#ff4444'}}></i>
              <h4 className="mb-1 text-white">24/7</h4>
              <p style={{color: '#ccc'}}>Diffusion continue</p>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4 mb-md-0">
            <div className="p-3">
              <i className="bi bi-people fs-1 mb-2" style={{color: '#4488ff'}}></i>
              <h4 className="mb-1 text-white">50k+</h4>
              <p style={{color: '#ccc'}}>Auditeurs actifs</p>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4 mb-md-0">
            <div className="p-3">
              <i className="bi bi-collection-play fs-1 mb-2" style={{color: '#00ff88'}}></i>
              <h4 className="mb-1 text-white">1000+</h4>
              <p style={{color: '#ccc'}}>Épisodes disponibles</p>
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="p-3">
              <i className="bi bi-headphones fs-1 mb-2" style={{color: '#ffcc00'}}></i>
              <h4 className="mb-1 text-white">500+</h4>
              <p style={{color: '#ccc'}}>Podcasts exclusifs</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StatsSection;