import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animation de la barre de progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Vitesse de progression (2% toutes les 50ms = 2.5 secondes)
      });
    }, 50);

    // Démarrer le fade out à 100%
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Appeler onFinish après l'animation de fade out
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3300); // 2.5s (loading) + 0.8s (fade out)

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background animé */}
      <div className="splash-background">
        <div className="splash-circle circle-1"></div>
        <div className="splash-circle circle-2"></div>
        <div className="splash-circle circle-3"></div>
      </div>

      {/* Contenu principal */}
      <div className="splash-content">
        {/* Logo */}
        <div className="splash-logo-container">
          <img 
            src="/images/logo.png" 
            alt="Roots Radio Logo" 
            className="splash-logo"
            onError={(e) => {
              // Fallback si le logo n'existe pas
              e.target.style.display = 'none';
              document.querySelector('.splash-logo-placeholder').style.display = 'flex';
            }}
          />
          {/* Placeholder si pas de logo */}
          <div className="splash-logo-placeholder">
            <div className="splash-logo-text">
              <span className="logo-roots">ROOTS</span>
              <span className="logo-radio">RADIO</span>
            </div>
          </div>
        </div>

        {/* Message Welcome */}
        <div className="splash-welcome">
          <h1 className="splash-title">Welcome</h1>
          <p className="splash-subtitle">Where Everything Starts</p>
        </div>

        {/* Barre de progression */}
        <div className="splash-loader">
          <div className="splash-progress-bar">
            <div 
              className="splash-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="splash-loading-text">
            Chargement... {progress}%
          </p>
        </div>

        {/* Animation des ondes sonores */}
        <div className="splash-sound-waves">
          <div className="sound-wave"></div>
          <div className="sound-wave"></div>
          <div className="sound-wave"></div>
          <div className="sound-wave"></div>
          <div className="sound-wave"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;