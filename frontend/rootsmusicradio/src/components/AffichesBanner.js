import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AffichesBanner = () => {
  const [affiches, setAffiches] = useState([]);
  const [current, setCurrent]   = useState(0);

  useEffect(() => {
    api.get('/api/affiches')
      .then(r => setAffiches(r.data.affiches || []))
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent(i => (i + 1) % affiches.length), [affiches.length]);

  // Auto-rotate every 6s when multiple affiches
  useEffect(() => {
    if (affiches.length <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [affiches.length, next]);

  if (!affiches.length) return null;

  const a = affiches[current];

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 0 }}>
      {/* Banner principal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxHeight: 280,
          overflow: 'hidden',
          background: '#000',
          cursor: a.link ? 'pointer' : 'default',
        }}
        onClick={() => { if (a.link) window.open(a.link, '_blank', 'noopener,noreferrer'); }}
      >
        <img
          key={a._id}
          src={a.image}
          alt={a.title}
          style={{
            width: '100%',
            maxHeight: 280,
            objectFit: 'cover',
            display: 'block',
            opacity: 0.92,
            transition: 'opacity 0.4s',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Text overlay */}
        {(a.title || a.subtitle) && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            padding: '20px 28px',
            maxWidth: 480,
          }}>
            {a.title && (
              <h3 style={{
                color: '#fff', margin: 0, lineHeight: 1.2,
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 500,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}>{a.title}</h3>
            )}
            {a.subtitle && (
              <p style={{
                color: 'rgba(255,255,255,0.85)', margin: '6px 0 0',
                fontSize: 'clamp(12px, 1.5vw, 14px)',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}>{a.subtitle}</p>
            )}
            {a.link && (
              <span style={{
                display: 'inline-block', marginTop: 12,
                background: '#fff', color: '#000',
                padding: '7px 18px', borderRadius: 20,
                fontSize: 12, fontWeight: 600,
                letterSpacing: '0.3px',
              }}>{a.linkText || 'En savoir plus'}</span>
            )}
          </div>
        )}

        {/* Badge "Publicité" */}
        <span style={{
          position: 'absolute', top: 10, right: 12,
          background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)',
          fontSize: 10, padding: '2px 8px', borderRadius: 10,
          letterSpacing: '0.5px', textTransform: 'uppercase',
        }}>Publicité</span>
      </div>

      {/* Dots navigation (si plusieurs affiches) */}
      {affiches.length > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 6,
          padding: '10px 0', background: 'var(--rr-bg, #fafafa)',
        }}>
          {affiches.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6, borderRadius: 3, border: 'none', padding: 0,
                background: i === current ? '#000' : 'rgba(0,0,0,0.2)',
                cursor: 'pointer', transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AffichesBanner;
