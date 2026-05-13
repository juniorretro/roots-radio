import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DJCarousel = ({ heroImages, currentDJIndex, setCurrentDJIndex }) => {
  return (
    <Col lg={7} className="mb-4 mb-lg-0">
      <div className="h-100 rounded shadow-lg position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        minHeight: '400px'
      }}>
        {/* Carrousel Background */}
        <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
          {heroImages.map((photo, index) => (
            <div
              key={`hero-${index}`}
              className="position-absolute w-100 h-100 transition-opacity"
              style={{
                backgroundImage: `url(${photo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentDJIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                filter: 'brightness(0.6)'
              }}
            />
          ))}
        </div>

        {/* Overlay Content */}
        <div className="position-absolute w-100 h-100 p-4 d-flex flex-column justify-content-between" style={{ zIndex: 2 }}>
          <div>
            <h3 className="mb-3 text-white fw-bold">
              <i className="bi bi-broadcast-pin me-2" style={{color: '#ff4444'}}></i>
              Programme Actuel - DJ Live
            </h3>
          </div>

          {/* Mini Audio Player dans le carrousel */}
          <div className="mt-auto">
            <div className="p-3 rounded" style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-white">
                  <h6 className="mb-0">En cours de diffusion</h6>
                  <small className="text-light opacity-75">DJ Mix Live Session</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm" style={{
                    background: '#ff4444',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px'
                  }}>
                    <i className="bi bi-pause-fill"></i>
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="progress mb-2" style={{ height: '4px' }}>
                <div 
                  className="progress-bar bg-danger" 
                  style={{ width: '45%' }}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between small text-light opacity-75">
                <span>2:34</span>
                <span>5:47</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateurs du carrousel */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2" style={{ zIndex: 3 }}>
          <div className="d-flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className="btn p-0"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentDJIndex ? '#ff4444' : 'rgba(255,255,255,0.4)',
                  border: 'none'
                }}
                onClick={() => setCurrentDJIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </Col>
  );
};

export default DJCarousel;