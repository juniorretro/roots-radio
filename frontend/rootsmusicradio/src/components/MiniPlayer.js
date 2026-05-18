import React, { useRef, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { useRadio } from '../contexts/RadioContext';
import SongRequestModal from './SongRequestModal';
import NotificationToggle from './NotificationToggle';

const STREAM_URL = 'http://ecmanager2.pro-fhi.net:1510/stream';

const MiniPlayer = () => {
  const audioRef = useRef(null);
  const { isPlaying, togglePlay, volume, updateVolume, nowPlaying, currentProgram } = useRadio();
  const [showShare, setShowShare]       = useState(false);
  const [showRequest, setShowRequest]   = useState(false);
  const [copyDone, setCopyDone]         = useState(false);

  // Init audio source once
  useEffect(() => {
    if (audioRef.current) audioRef.current.src = STREAM_URL;
  }, []);

  // Sync play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── Share helpers ──────────────────────────────────────────────────────────
  const siteUrl   = window.location.origin;
  const shareText = nowPlaying?.title
    ? `🎵 J'écoute "${nowPlaying.title}"${nowPlaying.artist ? ` — ${nowPlaying.artist}` : ''} en direct sur Roots Radio FM`
    : '🎵 En ce moment sur Roots Radio FM — la radio en direct !';

  const handleShare = (platform) => {
    const full = `${shareText}\n${siteUrl}`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(full).then(() => {
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 2200);
      });
    }
    if (platform !== 'copy') setShowShare(false);
  };

  // ── Styles shared ──────────────────────────────────────────────────────────
  const shareBtnStyle = (bg, color) => ({
    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
    padding: '9px 14px', border: 'none', borderRadius: 10,
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    background: bg, color,
  });

  const liveListeners = nowPlaying?.listeners || 0;

  return (
    <>
      {/* Hidden audio element — single source of truth */}
      <audio ref={audioRef} preload="none" />
      <SongRequestModal open={showRequest} onClose={() => setShowRequest(false)} />

      {/* ── Share popup ────────────────────────────────────────────────────── */}
      {showShare && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 1001 }}
            onClick={() => setShowShare(false)}
          />
          <div style={{
            position: 'fixed', bottom: 90, right: 16, zIndex: 1002,
            background: '#fff', borderRadius: 16, padding: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.14)', border: '1px solid rgba(0,0,0,0.07)',
            minWidth: 210,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>Partager</p>
            {nowPlaying?.title && (
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12, lineHeight: 1.4, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 10 }}>
                {nowPlaying.title}{nowPlaying.artist && ` — ${nowPlaying.artist}`}
              </p>
            )}
            <button onClick={() => handleShare('whatsapp')} style={shareBtnStyle('#25D366', '#fff')}>
              <i className="bi bi-whatsapp" style={{ fontSize: 15 }} /> WhatsApp
            </button>
            <button onClick={() => handleShare('twitter')} style={{ ...shareBtnStyle('#000', '#fff'), marginTop: 8 }}>
              <i className="bi bi-twitter-x" style={{ fontSize: 15 }} /> Twitter / X
            </button>
            <button onClick={() => handleShare('copy')} style={{ ...shareBtnStyle(copyDone ? '#22c55e' : '#f5f5f7', copyDone ? '#fff' : '#000'), marginTop: 8 }}>
              <i className={`bi bi-${copyDone ? 'check2' : 'link-45deg'}`} style={{ fontSize: 15 }} />
              {copyDone ? 'Copié !' : 'Copier le lien'}
            </button>
          </div>
        </>
      )}

      {/* ── Player bar ─────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.04)',
      }}>
        <style>{`
          @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
          .mp-vol::-webkit-slider-thumb{width:12px;height:12px;border-radius:50%;background:#000;cursor:pointer;-webkit-appearance:none}
          .mp-vol::-webkit-slider-runnable-track{background:rgba(0,0,0,0.1);border-radius:10px;height:4px}
          .mp-vol{-webkit-appearance:none;background:transparent;outline:none}
        `}</style>

        {/* ── Desktop ── */}
        <div className="d-none d-lg-flex align-items-center justify-content-between px-4" style={{ height: 78 }}>

          {/* Left: LIVE badge + program */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
            <span style={{ background: '#000', color: '#fff', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap', animation: 'blink 2s infinite' }}>● EN DIRECT</span>
            {currentProgram && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={currentProgram.image || '/uploads/placeholder-program.jpg'} alt="" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 8 }} onError={e => { e.target.src = '/images/default-cover.png'; }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#000', lineHeight: 1.2 }}>{currentProgram.title}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{currentProgram.host}</div>
                </div>
              </div>
            )}
          </div>

          {/* Center: track + controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, maxWidth: 520, justifyContent: 'center' }}>
            <img
              src={nowPlaying?.cover || '/images/default-cover.png'}
              alt=""
              style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              onError={e => { e.target.src = '/images/default-cover.png'; }}
            />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nowPlaying?.title || 'Roots Radio FM'}
              </div>
              <div style={{ fontSize: 12, color: '#777' }}>
                {nowPlaying?.artist || 'En direct'}
              </div>
            </div>
            {/* Play/Pause */}
            <button onClick={togglePlay} style={{ width: 44, height: 44, borderRadius: '50%', background: '#000', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} />}
            </button>
            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <FaVolumeUp size={12} style={{ color: '#999' }} />
              <input className="mp-vol" type="range" min="0" max="1" step="0.01" value={volume} onChange={e => updateVolume(Number(e.target.value))} style={{ width: 80, height: 4, cursor: 'pointer' }} />
            </div>
          </div>

          {/* Right: listeners + share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200, justifyContent: 'flex-end' }}>
            {liveListeners > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.04)', padding: '5px 12px', borderRadius: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#444' }}>{liveListeners.toLocaleString()} auditeurs</span>
              </div>
            )}
            <button onClick={() => setShowRequest(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 20, padding: '7px 14px', fontSize: 13, fontWeight: 500, color: '#000', cursor: 'pointer' }}>
              <i className="bi bi-music-note-beamed" /> Demander
            </button>
            <button
              onClick={() => setShowShare(s => !s)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: showShare ? '#000' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 500, color: showShare ? '#fff' : '#000', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <i className="bi bi-share" /> Partager
            </button>
            <NotificationToggle />
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="d-lg-none" style={{ padding: '8px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={nowPlaying?.cover || '/images/default-cover.png'}
              alt=""
              style={{ width: 38, height: 38, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }}
              onError={e => { e.target.src = '/images/default-cover.png'; }}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nowPlaying?.title || 'Roots Radio FM'}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{nowPlaying?.artist || 'En direct'}</div>
            </div>
            {liveListeners > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: '#666', fontWeight: 500 }}>{liveListeners}</span>
              </div>
            )}
            <button onClick={() => setShowShare(s => !s)} style={{ background: showShare ? '#000' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: showShare ? '#fff' : '#000' }}>
              <i className="bi bi-share" style={{ fontSize: 13 }} />
            </button>
            <button onClick={togglePlay} style={{ width: 38, height: 38, borderRadius: '50%', background: '#000', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
            </button>
          </div>
          {/* Mobile volume bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ background: '#000', color: '#fff', fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, padding: '2px 8px', borderRadius: 20, animation: 'blink 2s infinite', flexShrink: 0 }}>● LIVE</span>
            <FaVolumeUp size={11} style={{ color: '#aaa', flexShrink: 0 }} />
            <input className="mp-vol" type="range" min="0" max="1" step="0.01" value={volume} onChange={e => updateVolume(Number(e.target.value))} style={{ flex: 1, height: 4, cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
