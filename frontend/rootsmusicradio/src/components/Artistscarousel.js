import React, { useState, useEffect } from 'react';
import './Artistscarousel.css';

const ArtistsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🎵 Liste des artistes à afficher
  const artists = [
    {
      id: 1,
      name: 'Sabrina',
      image: '/images/artists/sabrina.jpg',
      genre: 'Afrobeat'
    },
    {
      id: 2,
      name: 'Burna Boy',
      image: '/images/artists/burna-boy.jpg',
      genre: 'Afrofusion'
    },
    {
      id: 3,
      name: 'Wizkid',
      image: '/images/artists/wizkid.jpg',
      genre: 'Afrobeat'
    },
    {
      id: 4,
      name: 'Davido',
      image: '/images/artists/davido.jpg',
      genre: 'Afropop'
    },
    {
      id: 5,
      name: 'Tems',
      image: '/images/artists/tems.jpg',
      genre: 'R&B/Soul'
    },
    {
      id: 6,
      name: 'Fireboy DML',
      image: '/images/artists/fireboy.jpg',
      genre: 'Afropop'
    },
    {
      id: 7,
      name: 'Asake',
      image: '/images/artists/asake.jpg',
      genre: 'Afrobeat'
    },
    {
      id: 8,
      name: 'Rema',
      image: '/images/artists/rema.jpg',
      genre: 'Afrorave'
    }
  ];

  // Défilement automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artists.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [artists.length]);

  // Obtenir 3 artistes à afficher (précédent, courant, suivant)
  const getVisibleArtists = () => {
    const prev = (currentIndex - 1 + artists.length) % artists.length;
    const next = (currentIndex + 1) % artists.length;
    return [artists[prev], artists[currentIndex], artists[next]];
  };

  const visibleArtists = getVisibleArtists();

  return (
    <div className="artists-carousel-container">
      {/* Titre */}
      {/* <div className="carousel-header">
         <h1 className="carousel-main-title">
        
        </h1>
        <p className="carousel-subtitle">
          Where Everything Starts
        </p> 
      

      </div> */}

      {/* Carrousel d'artistes */}
      <div className="artists-carousel">
        <div className="carousel-track">
          {visibleArtists.map((artist, index) => (
            <div
              key={`${artist.id}-${index}`}
              className={`artist-card ${index === 1 ? 'active' : ''} ${index === 0 ? 'prev' : ''} ${index === 2 ? 'next' : ''}`}
            >
              <div className="artist-image-wrapper">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="artist-image"
                  onError={(e) => {
                    // Fallback si image manquante
                    e.target.src = '/images/artists/placeholder.jpg';
                  }}
                />
                <div className="artist-overlay"></div>
              </div>
              
              <div className="artist-info">
                <h3 className="artist-name">{artist.name}</h3>
                <p className="artist-genre">{artist.genre}</p>
              </div>

              {/* Badge "À l'antenne" pour l'artiste actif */}
              {index === 1 && (
                <div className="on-air-badge">
                  <span className="pulse-dot"></span>
                  En rotation
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Indicateurs de navigation */}
        <div className="carousel-indicators">
          {artists.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Aller à l'artiste ${index + 1}`}
            />
          ))}
        </div>

        {/* Boutons de navigation */}
        <button
          className="carousel-nav prev-btn"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + artists.length) % artists.length)}
          aria-label="Artiste précédent"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button
          className="carousel-nav next-btn"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % artists.length)}
          aria-label="Artiste suivant"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* Tagline */}
      <div className="carousel-footer">
        <p className="carousel-tagline">
          Émissions · Podcasts · Musique
        </p>
      </div>
    </div>
  );
};

export default ArtistsCarousel;