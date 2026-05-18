import React, { useState } from 'react';
import api from '../services/api';
import { useRadio } from '../contexts/RadioContext';

const SongRequestModal = ({ open, onClose }) => {
  const { nowPlaying } = useRadio();
  const [form, setForm]     = useState({ title: '', artist: '', listener: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setStatus('loading');
    try {
      await api.post('/api/song-requests', form);
      setStatus('success');
      setTimeout(() => { setStatus('idle'); setForm({ title: '', artist: '', listener: '', message: '' }); onClose(); }, 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // Pre-fill with current song
  const prefill = () => setForm(f => ({ ...f, title: nowPlaying?.title || '', artist: nowPlaying?.artist || '' }));

  if (!open) return null;

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'var(--rr-bg, #fafafa)', color: 'var(--rr-text, #000)', boxSizing: 'border-box' };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', zIndex: 2000 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 2001, width: '90%', maxWidth: 460, background: 'var(--rr-surface, #fff)', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--rr-text, #000)' }}>Demande de chanson</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#888', marginTop: 2 }}>Suggérez un titre à l'animateur</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          {/* Pre-fill hint */}
          {nowPlaying?.title && (
            <button type="button" onClick={prefill} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'rgba(0,0,0,0.04)', border: '1px dashed rgba(0,0,0,0.12)', borderRadius: 12, padding: '10px 14px', cursor: 'pointer', marginBottom: 16, textAlign: 'left' }}>
              <img src={nowPlaying.cover || '/images/default-cover.png'} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} onError={e => { e.target.src = '/images/default-cover.png'; }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--rr-text, #000)' }}>{nowPlaying.title}</div>
                <div style={{ fontSize: 11, color: '#888' }}>Cliquer pour pré-remplir avec le titre en cours</div>
              </div>
            </button>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Titre <span style={{ color: '#f00' }}>*</span></label>
            <input required value={form.title} onChange={set('title')} placeholder="Nom du titre" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Artiste</label>
            <input value={form.artist} onChange={set('artist')} placeholder="Nom de l'artiste" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Votre prénom</label>
            <input value={form.listener} onChange={set('listener')} placeholder="Facultatif" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Message</label>
            <textarea value={form.message} onChange={set('message')} placeholder="Un message pour l'animateur… (facultatif)" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {status === 'success' && (
            <div style={{ background: 'rgba(34,197,94,0.1)', color: '#15803d', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-check-circle-fill" /> Demande envoyée, merci !
            </div>
          )}
          {status === 'error' && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#b91c1c', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-exclamation-circle-fill" /> Erreur, réessayez.
            </div>
          )}

          <button type="submit" disabled={status === 'loading' || status === 'success'} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#000', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: status === 'loading' ? 0.7 : 1 }}>
            {status === 'loading' ? <><div className="spinner-border spinner-border-sm" /> Envoi…</> : <><i className="bi bi-music-note-beamed" /> Envoyer la demande</>}
          </button>
        </form>
      </div>
    </>
  );
};

export default SongRequestModal;
