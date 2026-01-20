import React from 'react';
import { Col, Button } from 'react-bootstrap';

const Playlist = ({ playlist, currentTrack, isPlaying, playTrack }) => {
  return (
    <Col lg={5}>
      <div className="p-4 h-100 rounded shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(60,60,60,0.4), rgba(30,30,30,0.6))',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        minHeight: '400px'
      }}>
        <h4 className="mb-3 text-white">
          <i className="bi bi-music-note-list me-2" style={{color: '#00ff88'}}></i>
          Playlist du Moment
        </h4>
        
        <div className="playlist-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          {playlist.map((track, index) => (
            <div 
              key={`track-${track.id}-${index}`}
              className="d-flex align-items-center p-2 mb-2 rounded hover-item"
              style={{
                background: currentTrack?.id === track.id ? 
                  'rgba(0,255,136,0.2)' : 
                  'rgba(255,255,255,0.05)',
                border: currentTrack?.id === track.id ? 
                  '1px solid rgba(0,255,136,0.5)' : 
                  '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (currentTrack?.id !== track.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentTrack?.id !== track.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
            >
              <div className="me-2 text-white fw-bold" style={{ minWidth: '25px', fontSize: '12px' }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <button
                className="btn btn-sm me-3"
                style={{
                  background: currentTrack?.id === track.id && isPlaying ? 
                    '#ff4444' : '#00ff88',
                  border: 'none',
                  color: currentTrack?.id === track.id && isPlaying ? 
                    'white' : 'black',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  minWidth: '30px'
                }}
                onClick={() => playTrack(track)}
              >
                <i className={`bi ${currentTrack?.id === track.id && isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`} style={{ fontSize: '12px' }}></i>
              </button>
              
              <div className="flex-grow-1 min-width-0">
                <div className="text-white fw-bold text-truncate" style={{ fontSize: '14px' }}>
                  {track.title}
                </div>
                <div className="text-light opacity-75 text-truncate" style={{ fontSize: '12px' }}>
                  {track.artist}
                </div>
              </div>
              
              <div className="text-light opacity-75" style={{ fontSize: '12px' }}>
                {track.duration}
              </div>
            </div>
          ))}
        </div>
        
        {/* Contrôles playlist */}
        <div className="mt-3 pt-3 border-top border-secondary">
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-sm" style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white'
            }}>
              <i className="bi bi-shuffle"></i>
            </button>
            <button className="btn btn-sm" style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white'
            }}>
              <i className="bi bi-arrow-repeat"></i>
            </button>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default Playlist;