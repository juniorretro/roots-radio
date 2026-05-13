import React, { useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { useRadio } from '../contexts/RadioContext';

const STREAM_URL = 'http://ecmanager2.pro-fhi.net:1510/stream';

const AudioPlayer = () => {
  const audioRef = useRef(null);

  const {
    isPlaying,
    togglePlay,
    volume,
    updateVolume,
    nowPlaying
  } = useRadio();

  // 🐛 Debug: Log quand nowPlaying change
  useEffect(() => {
    console.log('📣 AudioPlayer - nowPlaying updated:', nowPlaying);
  }, [nowPlaying]);

  // ▶️ Play / Pause synchronisé avec le contexte

  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.src = STREAM_URL; // ← une seule fois
  }
}, []);
  // ✅ FIX: Force la source du stream à chaque changement de isPlaying
  useEffect(() => {
    if (!audioRef.current) return;

    // ✅ IMPORTANT: Forcer la source pour garantir la connexion au stream

    if (isPlaying) {
      audioRef.current
        .play()
        .catch(err => console.error('❌ Play error:', err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 🔊 Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <Card
      className="shadow-sm border-0"
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '16px'
      }}
    >
      <audio ref={audioRef} src={STREAM_URL} preload="none" />

      <div className="d-flex align-items-center gap-3">

        {/* 🎨 Pochette */}
        <img
          src={nowPlaying.cover || '/images/default-cover.png'}
          alt={nowPlaying.title || 'Album cover'}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '16px',
            objectFit: 'cover',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
          }}
          onError={(e) => {
            // ✅ Fallback si l'image ne charge pas
            e.target.src = '/images/default-cover.png';
          }}
        />

        {/* 🎵 Infos */}
        <div className="flex-grow-1">
          <div
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#000'
            }}
          >
            {nowPlaying.title || 'Live Radio'}
          </div>

          <div
            style={{
              fontSize: '14px',
              color: '#666'
            }}
          >
            {nowPlaying.artist || 'En direct'}
          </div>

          {/* 🐛 Debug: Afficher l'album et le genre si disponibles */}
          {(nowPlaying.album || nowPlaying.genre) && (
            <div
              style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '4px'
              }}
            >
              {nowPlaying.album && `${nowPlaying.album}`}
              {nowPlaying.album && nowPlaying.genre && ' • '}
              {nowPlaying.genre && `${nowPlaying.genre}`}
            </div>
          )}
        </div>

        {/* ▶️ Controls */}
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="dark"
            onClick={togglePlay}
            style={{
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Button>

          {/* 🔊 Volume */}
          <div className="d-flex align-items-center gap-2">
            <FaVolumeUp />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => updateVolume(Number(e.target.value))}
              style={{
                width: '80px'
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;