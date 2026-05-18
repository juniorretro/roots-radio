import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useRadio } from '../contexts/RadioContext';
import { useFavorites } from '../contexts/FavoritesContext';
import FavoriteBtn from '../components/FavoriteBtn';
import api from '../services/api';
import { toast } from 'react-toastify';

const TABS = [
  { key: 'overview', label: 'Profil', icon: 'bi-person' },
  { key: 'history',  label: 'Historique', icon: 'bi-clock-history' },
  { key: 'favorites', label: 'Favoris', icon: 'bi-heart' },
  { key: 'settings', label: 'Paramètres', icon: 'bi-gear' },
];

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { playHistory } = useRadio();
  const { favorites }   = useFavorites();

  const [tab, setTab]   = useState('overview');

  // ── Profile edit form ──────────────────────────────────
  const [profileForm, setProfileForm]   = useState({
    firstName:  user?.firstName  || '',
    lastName:   user?.lastName   || '',
    phone:      user?.phone      || '',
    newsletter: user?.newsletter || false,
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // ── Password form ──────────────────────────────────────
  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw]    = useState({ current: false, new: false, confirm: false });

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?';

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.put('/api/auth/profile', profileForm);
      toast.success('Profil mis à jour');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setProfileSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setPwSaving(true);
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Mot de passe modifié avec succès');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPwSaving(false);
    }
  };

  // ── Styles ────────────────────────────────────────────
  const card = {
    background: 'var(--rr-surface, #fff)',
    borderRadius: 18,
    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.06)',
    padding: '24px',
    marginBottom: 20,
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid rgba(0,0,0,0.12)', fontSize: 14,
    outline: 'none', background: 'var(--rr-bg, #fafafa)',
    color: 'var(--rr-text, #000)', boxSizing: 'border-box',
  };

  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--rr-text, #000)', marginBottom: 6, display: 'block' };

  const btnPrimary = (loading) => ({
    background: loading ? '#666' : '#000',
    color: '#fff', border: 'none', borderRadius: 12,
    padding: '11px 24px', fontSize: 14, fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
  });

  return (
    <div style={{ background: 'var(--rr-bg, #fafafa)', minHeight: '100vh', paddingTop: 40, paddingBottom: 40 }}>
      <Container>

        {/* ── Hero card ──────────────────────────────────────── */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: '28px 28px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 600, color: 'var(--rr-text, #000)', margin: 0 }}>
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username}
            </h2>
            <p style={{ color: 'var(--rr-text2, #666)', fontSize: 14, margin: '4px 0 0' }}>@{user?.username} · {user?.email}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ background: user?.role === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.06)', color: user?.role === 'admin' ? '#dc2626' : '#555', fontSize: 12, fontWeight: 600, padding: '3px 12px', borderRadius: 20 }}>
                {user?.role === 'admin' ? 'Administrateur' : 'Membre'}
              </span>
              <span style={{ background: 'rgba(0,0,0,0.04)', color: '#777', fontSize: 12, padding: '3px 12px', borderRadius: 20 }}>
                Membre depuis {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {user?.role === 'admin' && (
              <Link to="/admin" style={{ background: '#000', color: '#fff', padding: '9px 18px', borderRadius: 20, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                <i className="bi bi-speedometer2 me-2" />Dashboard
              </Link>
            )}
            <button onClick={logout} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.15)', color: 'var(--rr-text, #000)', padding: '9px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}>
              <i className="bi bi-box-arrow-right me-2" />Déconnexion
            </button>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { icon: 'bi-music-note-list', val: playHistory.length, label: 'Titres écoutés' },
            { icon: 'bi-heart-fill', val: favorites.length, label: 'Favoris' },
            { icon: 'bi-calendar3', val: formatDate(user?.lastLogin), label: 'Dernière connexion', small: true },
          ].map((s, i) => (
            <div key={i} style={{ ...card, padding: '18px 20px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={s.icon} style={{ fontSize: 18, color: '#000' }} />
              </div>
              <div>
                <div style={{ fontSize: s.small ? 13 : 22, fontWeight: 700, color: 'var(--rr-text, #000)', lineHeight: 1.2 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--rr-text2, #888)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--rr-surface, #fff)', borderRadius: 16, padding: '6px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', borderRadius: 12, border: 'none', background: tab === t.key ? '#000' : 'transparent', color: tab === t.key ? '#fff' : 'var(--rr-text2, #777)', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              <i className={t.icon} /> {t.label}
            </button>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────── */}
        {/* TAB: OVERVIEW */}
        {/* ─────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div style={card}>
            <h5 style={{ fontSize: 16, fontWeight: 600, color: 'var(--rr-text, #000)', marginBottom: 20 }}>Informations du compte</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
              {[
                { label: 'Prénom',    val: user?.firstName  || '—' },
                { label: 'Nom',       val: user?.lastName   || '—' },
                { label: 'Email',     val: user?.email      || '—' },
                { label: 'Pseudo',    val: user?.username   || '—' },
                { label: 'Téléphone', val: user?.phone      || '—' },
                { label: 'Rôle',      val: user?.role === 'admin' ? 'Administrateur' : 'Membre' },
                { label: 'Newsletter', val: user?.newsletter ? 'Activée' : 'Désactivée' },
                { label: 'Inscription', val: formatDate(user?.createdAt) },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--rr-text, #000)', fontWeight: 500 }}>{row.val}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setTab('settings')} style={{ marginTop: 24, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--rr-text, #000)' }}>
              <i className="bi bi-pencil me-2" />Modifier le profil
            </button>
          </div>
        )}

        {/* ─────────────────────────────────────────────────── */}
        {/* TAB: HISTORY */}
        {/* ─────────────────────────────────────────────────── */}
        {tab === 'history' && (
          <div style={card}>
            <h5 style={{ fontSize: 16, fontWeight: 600, color: 'var(--rr-text, #000)', marginBottom: 4 }}>Historique d'écoute</h5>
            <p style={{ fontSize: 13, color: 'var(--rr-text2, #888)', marginBottom: 20 }}>Les titres joués depuis votre connexion actuelle</p>

            {playHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <i className="bi bi-music-note" style={{ fontSize: 44, color: '#ccc', display: 'block', marginBottom: 14 }} />
                <p style={{ color: 'var(--rr-text2, #888)', fontSize: 14 }}>Aucune lecture pour cette session. Lancez la radio !</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {playHistory.map((track, i) => (
                  <div key={track._id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: i === 0 ? 'rgba(0,0,0,0.04)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? 'rgba(0,0,0,0.04)' : 'transparent'; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#999', fontSize: 13 }}>
                      {i === 0 ? <i className="bi bi-music-note-beamed" style={{ color: '#22c55e' }} /> : <span style={{ fontSize: 11, fontWeight: 600 }}>{i + 1}</span>}
                    </div>
                    <img src={track.cover || '/images/default-cover.png'} alt="" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.src = '/images/default-cover.png'; }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--rr-text, #000)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--rr-text2, #888)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</div>
                    </div>
                    {track.playedAt && (
                      <span style={{ fontSize: 11, color: '#bbb', flexShrink: 0 }}>{formatTime(track.playedAt)}</span>
                    )}
                    {i === 0 && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>EN COURS</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────── */}
        {/* TAB: FAVORITES */}
        {/* ─────────────────────────────────────────────────── */}
        {tab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '60px 20px' }}>
                <i className="bi bi-heart" style={{ fontSize: 44, color: '#ccc', display: 'block', marginBottom: 14 }} />
                <p style={{ color: 'var(--rr-text2, #888)', marginBottom: 20 }}>Aucun favori enregistré</p>
                <Link to="/programs" style={{ background: '#000', color: '#fff', padding: '10px 24px', borderRadius: 30, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>Voir les programmes</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {favorites.map(item => (
                  <div key={item.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 0, flexWrap: 'wrap' }}>
                    <img src={item.image || '/images/default-cover.png'} alt={item.title} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.src = '/images/default-cover.png'; }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--rr-text, #000)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      {item.subtitle && <div style={{ fontSize: 12, color: 'var(--rr-text2, #888)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</div>}
                      <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>Sauvegardé le {new Date(item.savedAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#888', background: 'rgba(0,0,0,0.05)', padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                      {item.type === 'program' ? 'Programme' : 'Épisode'}
                    </span>
                    {item.slug && (
                      <Link to={`/programs/${item.slug}`} style={{ fontSize: 12, fontWeight: 600, color: '#000', textDecoration: 'none', background: 'rgba(0,0,0,0.06)', padding: '7px 14px', borderRadius: 20, flexShrink: 0 }}>
                        Voir <i className="bi bi-arrow-right" />
                      </Link>
                    )}
                    <FavoriteBtn item={item} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────── */}
        {/* TAB: SETTINGS */}
        {/* ─────────────────────────────────────────────────── */}
        {tab === 'settings' && (
          <div>
            {/* Profile info form */}
            <div style={card}>
              <h5 style={{ fontSize: 16, fontWeight: 600, color: 'var(--rr-text, #000)', marginBottom: 20 }}>Modifier le profil</h5>
              <form onSubmit={saveProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Prénom</label>
                    <input style={inputStyle} value={profileForm.firstName} onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))} placeholder="Votre prénom" />
                  </div>
                  <div>
                    <label style={labelStyle}>Nom</label>
                    <input style={inputStyle} value={profileForm.lastName} onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Votre nom" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Téléphone</label>
                    <input style={inputStyle} value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+33 6 00 00 00 00" />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, cursor: 'pointer' }}>
                  <input type="checkbox" checked={profileForm.newsletter} onChange={e => setProfileForm(p => ({ ...p, newsletter: e.target.checked }))} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 14, color: 'var(--rr-text, #000)' }}>Recevoir la newsletter de Roots Radio FM</span>
                </label>
                <div style={{ marginTop: 20 }}>
                  <button type="submit" disabled={profileSaving} style={btnPrimary(profileSaving)}>
                    {profileSaving ? 'Enregistrement…' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            </div>

            {/* Password form */}
            <div style={card}>
              <h5 style={{ fontSize: 16, fontWeight: 600, color: 'var(--rr-text, #000)', marginBottom: 20 }}>Changer le mot de passe</h5>
              <form onSubmit={changePassword}>
                {[
                  { key: 'currentPassword', label: 'Mot de passe actuel', ph: '••••••••' },
                  { key: 'newPassword',     label: 'Nouveau mot de passe', ph: '••••••••' },
                  { key: 'confirm',         label: 'Confirmer le nouveau mot de passe', ph: '••••••••' },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw[field.key] ? 'text' : 'password'}
                        style={{ ...inputStyle, paddingRight: 44 }}
                        value={pwForm[field.key]}
                        onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.ph}
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [field.key]: !p[field.key] }))}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>
                        <i className={`bi bi-eye${showPw[field.key] ? '-slash' : ''}`} />
                      </button>
                    </div>
                  </div>
                ))}
                {pwForm.newPassword && pwForm.confirm && pwForm.newPassword !== pwForm.confirm && (
                  <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>Les mots de passe ne correspondent pas</p>
                )}
                <button type="submit" disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirm} style={btnPrimary(pwSaving || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirm)}>
                  {pwSaving ? 'Modification…' : 'Modifier le mot de passe'}
                </button>
              </form>
            </div>

            {/* Danger zone */}
            <div style={{ ...card, border: '1.5px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
              <h5 style={{ fontSize: 15, fontWeight: 600, color: '#dc2626', marginBottom: 8 }}>Zone de danger</h5>
              <p style={{ fontSize: 13, color: 'var(--rr-text2, #888)', marginBottom: 16 }}>Ces actions sont irréversibles.</p>
              <button onClick={() => { if (window.confirm('Se déconnecter de tous les appareils ?')) logout(); }}
                style={{ background: 'none', border: '1.5px solid rgba(239,68,68,0.3)', color: '#dc2626', borderRadius: 12, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>
                <i className="bi bi-box-arrow-right me-2" />Se déconnecter
              </button>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default Profile;
