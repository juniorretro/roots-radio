import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Artistscarousel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const resolveImg = (url) => (!url || url.startsWith('http')) ? url : `${API_URL}${url}`;

const FALLBACK_ARTISTS = [
  { _id: '1', name: 'Sabrina',     image: '/images/artists/sabrina.jpg',   subtitle: 'Afrobeat'  },
  { _id: '2', name: 'Burna Boy',   image: '/images/artists/burna-boy.jpg', subtitle: 'Afrofusion' },
  { _id: '3', name: 'Wizkid',      image: '/images/artists/wizkid.jpg',    subtitle: 'Afrobeat'  },
  { _id: '4', name: 'Davido',      image: '/images/artists/davido.jpg',    subtitle: 'Afropop'   },
  { _id: '5', name: 'Tems',        image: '/images/artists/tems.jpg',      subtitle: 'R&B/Soul'  },
  { _id: '6', name: 'Fireboy DML', image: '/images/artists/fireboy.jpg',   subtitle: 'Afropop'   },
  { _id: '7', name: 'Asake',       image: '/images/artists/asake.jpg',     subtitle: 'Afrobeat'  },
  { _id: '8', name: 'Rema',        image: '/images/artists/rema.jpg',      subtitle: 'Afrorave'  },
];

const ArtistsCarousel = () => {
  const [artists, setArtists]       = useState(FALLBACK_ARTISTS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get('/api/carousel?type=artist')
      .then(r => { if (r.data.items?.length) setArtists(r.data.items); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % artists.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [artists.length]);

  const getVisibleArtists = () => {
    const prev = (currentIndex - 1 + artists.length) % artists.length;
    const next = (currentIndex + 1) % artists.length;
    return [artists[prev], artists[currentIndex], artists[next]];
  };

  const visibleArtists = getVisibleArtists();

  return (
    <div className="artists-carousel-container">
      <div className="artists-carousel">
        <div className="carousel-track">
          {visibleArtists.map((artist, index) => (
            <div
              key={`${artist._id}-${index}`}
              className={`artist-card ${index === 1 ? 'active' : ''} ${index === 0 ? 'prev' : ''} ${index === 2 ? 'next' : ''}`}
            >
              <div className="artist-image-wrapper">
                <img
                  src={resolveImg(artist.image)}
                  alt={artist.name || ''}
                  className="artist-image"
                  onError={e => { e.target.src = '/images/artists/placeholder.jpg'; }}
                />
                <div className="artist-overlay" />
              </div>
              <div className="artist-info">
                <h3 className="artist-name">{artist.name || ''}</h3>
                <p className="artist-genre">{artist.subtitle || artist.genre || ''}</p>
              </div>
              {index === 1 && (
                <div className="on-air-badge">
                  <span className="pulse-dot" />
                  En rotation
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="carousel-indicators">
          {artists.map((_, index) => (
            <button key={index} className={`indicator ${index === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(index)} aria-label={`Artiste ${index + 1}`} />
          ))}
        </div>

        <button className="carousel-nav prev-btn" onClick={() => setCurrentIndex(p => (p - 1 + artists.length) % artists.length)} aria-label="Précédent">
          <i className="bi bi-chevron-left" />
        </button>
        <button className="carousel-nav next-btn" onClick={() => setCurrentIndex(p => (p + 1) % artists.length)} aria-label="Suivant">
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="carousel-footer">
        <p className="carousel-tagline">Émissions · Podcasts · Musique</p>
      </div>
    </div>
  );
};

export default ArtistsCarousel;
