import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../contexts/RadioContext';
import ArtistsCarousel from '../components/Artistscarousel';
import FavoriteBtn from '../components/FavoriteBtn';
import api from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const resolveImg = (url) => (!url || url.startsWith('http')) ? url : `${API_URL}${url}`;

const NON_MUSIC_PATTERN = /jingle|jingles|intro\b|pub\b|publicité|promo|spot\b|annonce|commercial|top horaire|non stop|indicatif|générique/i;
const isNonMusic = (title = '', artist = '') =>
  NON_MUSIC_PATTERN.test(title) || NON_MUSIC_PATTERN.test(artist);

const Home = () => {
  const { t } = useTranslation();
  const { currentProgram, getActivePrograms, playHistory, nowPlaying, socket } = useRadio();

  const [featuredPrograms, setFeaturedPrograms]       = useState([]);
  const [combinedHistory, setCombinedHistory]         = useState([]);
  const [affiches, setAffiches]                       = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [currentDJIndex, setCurrentDJIndex]           = useState(0);
  const [currentAfficheIndex, setCurrentAfficheIndex] = useState(0);
  const prevNowPlayingRef = useRef(null);

  const FALLBACK_HERO = [
    '/images/programs/GOOD_MORNING-AFFICHE.jpg',
    '/images/programs/HIT_30_AFFICHE.jpg',
    '/images/programs/LES_ROIS_DE_L_AFROBEAT.jpg',
    '/images/programs/MIX_PARTY_BY_ERIC_5_ETOILES.png',
    '/images/programs/PLAYLIST-NON_STOP_AFFICHE.jpg',
    '/images/programs/PLAYLIST_WEEKEND_AFFICHE.jpg',
    '/images/programs/ROOTS_CLASSICS.jpg',
    '/images/programs/ROOTS_LATINO.jpg',
    '/images/programs/roots_radio_dedicace_AFFICHE.jpg',
    '/images/programs/SUMMER_MIX_BY_DJ_MATHIAS.jpg',
    '/images/programs/TOP_20_AFRICA_AFFICHE.jpg',
  ];
  const [heroImages, setHeroImages] = useState(FALLBACK_HERO);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const [programs, afficheRes, heroRes] = await Promise.all([
          getActivePrograms(),
          api.get('/api/affiches').catch(() => ({ data: { affiches: [] } })),
          api.get('/api/carousel?type=hero').catch(() => ({ data: { items: [] } })),
        ]);
        setFeaturedPrograms(programs.filter(p => p.featured).slice(0, 3));
        setAffiches(afficheRes.data?.affiches || []);
        if (heroRes.data?.items?.length) {
          setHeroImages(heroRes.data.items.map(i => resolveImg(i.image)));
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [getActivePrograms]);

  // Reset de l'historique à minuit chaque jour
  useEffect(() => {
    const msUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight - now;
    };
    let timer;
    const scheduleReset = () => {
      timer = setTimeout(() => {
        setCombinedHistory([]);
        scheduleReset();
      }, msUntilMidnight());
    };
    scheduleReset();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!nowPlaying?.title) return;
    if (isNonMusic(nowPlaying.title, nowPlaying.artist)) return;
    const prev = prevNowPlayingRef.current;
    if (prev && prev.title === nowPlaying.title && prev.artist === nowPlaying.artist) return;
    prevNowPlayingRef.current = nowPlaying;
    const newEntry = { _id: `live-${Date.now()}`, title: nowPlaying.title, artist: nowPlaying.artist || '', cover: nowPlaying.cover || '/images/default-cover.png', playedAt: new Date().toISOString(), _isCurrentlyPlaying: true };
    setCombinedHistory(prev => {
      const clean = prev.map(i => ({ ...i, _isCurrentlyPlaying: false }));
      const dup = clean[0]?.title === newEntry.title && clean[0]?.artist === newEntry.artist;
      return dup ? [{ ...clean[0], _isCurrentlyPlaying: true }, ...clean.slice(1)] : [newEntry, ...clean].slice(0, 50);
    });
  }, [nowPlaying]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      if (!data?.title) return;
      if (data.isFiltered || isNonMusic(data.title, data.artist)) return;
      const e = { _id: `socket-${Date.now()}`, title: data.title, artist: data.artist || '', cover: data.cover || '/images/default-cover.png', playedAt: new Date().toISOString(), _isCurrentlyPlaying: true };
      setCombinedHistory(prev => {
        const clean = prev.map(i => ({ ...i, _isCurrentlyPlaying: false }));
        if (clean[0]?.title === e.title && clean[0]?.artist === e.artist) return prev;
        return [e, ...clean].slice(0, 50);
      });
    };
    socket.on('nowPlaying', handler);
    return () => socket.off('nowPlaying', handler);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const onCreated = (a) => { if (a.isActive) setAffiches(p => [...p, a].sort((x, y) => x.order - y.order)); };
    const onUpdated = (a) => setAffiches(p => p.map(x => x._id === a._id ? a : x).filter(x => x.isActive));
    const onDeleted = (id) => setAffiches(p => p.filter(a => a._id !== id));
    socket.on('afficheCreated', onCreated);
    socket.on('afficheUpdated', onUpdated);
    socket.on('afficheDeleted', onDeleted);
    return () => { socket.off('afficheCreated', onCreated); socket.off('afficheUpdated', onUpdated); socket.off('afficheDeleted', onDeleted); };
  }, [socket]);

  useEffect(() => {
    const id = setInterval(() => setCurrentDJIndex(p => p === heroImages.length - 1 ? 0 : p + 1), 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  useEffect(() => {
    if (affiches.length <= 1) return;
    const id = setInterval(() => setCurrentAfficheIndex(p => p === affiches.length - 1 ? 0 : p + 1), 6000);
    return () => clearInterval(id);
  }, [affiches.length]);

  const formatTime = (d) => {
    const date = new Date(d), diff = Math.floor((new Date() - date) / 60000);
    if (diff < 1) return 'À l\'instant';
    if (diff < 60) return `Il y a ${diff} min`;
    return `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
  };

  const HistoryItem = ({ item }) => (
    <div className="d-flex align-items-center p-2 p-md-3 mb-2" style={{ background: item._isCurrentlyPlaying ? 'rgba(0,0,0,0.06)' : 'transparent', borderRadius: 12, borderLeft: item._isCurrentlyPlaying ? '3px solid #000' : '3px solid transparent', position: 'relative', transition: 'all 0.3s' }}>
      {item._isCurrentlyPlaying && <span style={{ position: 'absolute', top: 8, right: 8, background: '#000', color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', animation: 'blink 1.5s infinite' }}>● EN COURS</span>}
      <img src={item.cover || '/images/default-cover.png'} alt={item.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', marginRight: 12, flexShrink: 0 }} onError={e => { e.target.src = '/images/default-cover.png'; }} />
      <div className="flex-grow-1 overflow-hidden">
        <div style={{ fontSize: 13, fontWeight: item._isCurrentlyPlaying ? 600 : 500, color: '#1a1a1a' }} className="text-truncate">{item.title}</div>
        <div style={{ fontSize: 12, color: '#666' }} className="text-truncate">{item.artist}</div>
      </div>
      <div style={{ fontSize: 11, color: '#999', minWidth: 55, textAlign: 'right', flexShrink: 0 }}>{formatTime(item.playedAt)}</div>
    </div>
  );

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
        .history-container::-webkit-scrollbar{width:4px}
        .history-container::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:10px}
        .hover-card{transition:all 0.4s cubic-bezier(0.4,0,0.2,1)}
        .hover-card:hover{transform:translateY(-8px);box-shadow:0 20px 60px rgba(0,0,0,0.12)!important}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .affiche-thumb{transition:all 0.3s ease;cursor:pointer}
      `}</style>

      {/* ─── SECTION AFFICHES / ÉVÉNEMENTS ─── */}
      {affiches.length > 0 && (
        <section style={{ padding: '40px 0 0', background: '#fff' }}>
          <Container className="px-3 px-md-4">
            <div className="mb-4">
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 300, color: '#000', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-0.02em', marginBottom: 6 }}>Actualités & Événements</h2>
              <div style={{ width: 40, height: 2, background: '#000' }} />
            </div>

            {/* Bannière principale */}
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: affiches.length > 1 ? 16 : 40 }}>
              <div style={{ position: 'relative', minHeight: 'clamp(220px, 40vw, 420px)', background: '#111' }}>
                {affiches.map((affiche, idx) => (
                  <div key={affiche._id} style={{ position: idx === 0 ? 'relative' : 'absolute', inset: 0, opacity: idx === currentAfficheIndex ? 1 : 0, transition: 'opacity 1s ease', zIndex: idx === currentAfficheIndex ? 1 : 0 }}>
                    <img src={resolveImg(affiche.image)} alt={affiche.title} style={{ width: '100%', minHeight: 'clamp(220px, 40vw, 420px)', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 'clamp(20px, 4vw, 52px)', zIndex: 2, maxWidth: '60%' }}>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8, fontWeight: 500 }}>Actualité</p>
                      <h3 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.3rem, 3.5vw, 2.8rem)', fontWeight: 600, marginBottom: 10, lineHeight: 1.2 }}>{affiche.title}</h3>
                      {affiche.subtitle && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(12px, 1.4vw, 15px)', marginBottom: 24, lineHeight: 1.7 }}>{affiche.subtitle}</p>}
                      {affiche.link && (
                        <a href={affiche.link} target={affiche.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#000', padding: '10px 22px', borderRadius: 30, fontWeight: 600, fontSize: 12, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {affiche.linkText || 'En savoir plus'} <i className="bi bi-arrow-right" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {affiches.length > 1 && (
                <div style={{ position: 'absolute', bottom: 20, right: 24, display: 'flex', gap: 8, zIndex: 10 }}>
                  {affiches.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentAfficheIndex(idx)} style={{ width: idx === currentAfficheIndex ? 22 : 8, height: 8, borderRadius: 4, border: 'none', background: idx === currentAfficheIndex ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.3s ease', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Miniatures */}
            {affiches.length > 1 && (
              <Row className="g-2 g-md-3 mb-5">
                {affiches.map((affiche, idx) => (
                  <Col xs={6} sm={4} md={3} key={affiche._id}>
                    <div className="affiche-thumb" onClick={() => setCurrentAfficheIndex(idx)} style={{ borderRadius: 14, overflow: 'hidden', border: `2px solid ${idx === currentAfficheIndex ? '#000' : 'transparent'}`, opacity: idx === currentAfficheIndex ? 1 : 0.6, transform: idx === currentAfficheIndex ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.3s ease' }}>
                      <img src={resolveImg(affiche.image)} alt={affiche.title} style={{ width: '100%', height: 70, objectFit: 'cover', display: 'block' }} onError={e => { e.target.src = '/images/default-cover.png'; }} />
                      <div style={{ padding: '6px 10px', background: '#f5f5f5', fontSize: 11, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{affiche.title}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>
      )}

      {/* ─── HERO VIDEO ─── */}
      <section style={{ background: '#fff' }}>
        <video style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 360 }} autoPlay muted loop playsInline
          onError={e => { e.currentTarget.style.display = 'none'; }}>
          <source src="/logo.mp4" type="video/mp4" />
        </video>

        <ArtistsCarousel />

        <Container className="px-3 px-md-4">
          <Row className="g-4">
            <Col lg={7}>
              <div className="position-relative overflow-hidden" style={{ background: '#fff', borderRadius: 24, minHeight: 450, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                {heroImages.map((photo, index) => (
                  <div key={index} className="position-absolute w-100 h-100" style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: index === currentDJIndex ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)', filter: 'brightness(0.85)' }} />
                ))}
                <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  <div className="d-flex gap-2">
                    {heroImages.map((_, index) => (
                      <button key={index} onClick={() => setCurrentDJIndex(index)} style={{ width: index === currentDJIndex ? 20 : 6, height: 6, borderRadius: 3, border: 'none', background: index === currentDJIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', transition: 'all 0.4s ease', padding: 0, cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div style={{ background: '#fff', borderRadius: 24, minHeight: 400, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '20px 16px' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: '#000', margin: 0 }}>Historique</h4>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
                    <span style={{ background: 'rgba(0,0,0,0.05)', color: '#000', fontWeight: 500, padding: '4px 10px', borderRadius: 20, fontSize: 11 }}>{combinedHistory.length} TITRES</span>
                  </div>
                </div>
                <div className="history-container" style={{ maxHeight: 340, overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center py-4"><div className="spinner-border spinner-border-sm" role="status" /></div>
                  ) : combinedHistory.length === 0 ? (
                    <div className="text-center py-4" style={{ color: '#999', fontSize: 14 }}>
                      <i className="bi bi-music-note-beamed d-block mb-2" style={{ fontSize: 28 }} />Aucun historique
                    </div>
                  ) : combinedHistory.slice(0, 20).map((item, index) => <HistoryItem key={item._id || index} item={item} />)}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ─── PROGRAMMES EN VEDETTE ─── */}
      {featuredPrograms.length > 0 && (
        <section style={{ padding: '60px 0', background: '#fafafa' }}>
          <Container>
            <div className="text-center mb-4 mb-md-5">
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 300, color: '#000', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-0.02em', marginBottom: 12 }}>Programmes à la une</h2>
              <div style={{ width: 50, height: 2, background: '#000', margin: '0 auto' }} />
            </div>
            <Row className="g-3 g-md-4">
              {featuredPrograms.map(program => (
                <Col md={6} lg={4} key={program._id}>
                  <Card className="h-100 border-0 hover-card" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <Card.Img variant="top" src={program.image || '/uploads/placeholder-program.jpg'} alt={program.title} style={{ height: 240, objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>À LA UNE</div>
                    </div>
                    <Card.Body className="p-3 p-md-4 d-flex flex-column">
                      <h5 style={{ fontWeight: 600, color: '#000', marginBottom: 8, fontSize: 18 }}>{program.title}</h5>
                      <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}><i className="bi bi-person me-1" />{program.host}</p>
                      <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, flexGrow: 1 }}>{program.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Badge style={{ background: 'rgba(0,0,0,0.06)', color: '#000', padding: '6px 12px', borderRadius: 20 }}>{program.category}</Badge>
                        <div className="d-flex align-items-center gap-2">
                          <FavoriteBtn item={{ id: program._id, type: 'program', title: program.title, subtitle: program.host, image: program.image, slug: program.slug }} size="sm" />
                          <Link to={`/programs/${program.slug}`} className="btn btn-sm" style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 18px', fontSize: 12, fontWeight: 500 }}>Découvrir</Link>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Link to="/programs" style={{ display: 'inline-block', border: '1.5px solid #000', color: '#000', padding: '10px 28px', borderRadius: 30, fontSize: 13, fontWeight: 500, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.5px' }}>Tous les programmes</Link>
            </div>
          </Container>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section style={{ padding: 'clamp(50px, 8vw, 100px) 0', background: '#000', color: '#fff' }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 300, fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-0.03em', marginBottom: 20 }}>Rejoignez notre univers sonore</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.8, maxWidth: 580, margin: '0 auto 40px' }}>Découvrez nos programmes live, nos épisodes exclusifs et notre collection de podcasts.</p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/programs" style={{ display: 'inline-block', background: '#fff', color: '#000', padding: '13px 32px', borderRadius: 30, fontWeight: 500, fontSize: 13, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.5px' }}><i className="bi bi-calendar3 me-2" />Voir la programmation</Link>
                <Link to="/about" style={{ display: 'inline-block', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', padding: '13px 32px', borderRadius: 30, fontWeight: 500, fontSize: 13, textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.5px' }}><i className="bi bi-info-circle me-2" />À propos</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) 0', background: '#fff' }}>
        <Container>
          <Row className="g-4 text-center">
            {[{ value: '24/7', label: 'Diffusion continue' }, { value: nowPlaying?.listeners > 0 ? nowPlaying.listeners.toLocaleString() : '—', label: 'Auditeurs en direct' }, { value: '1000+', label: 'Épisodes' }, { value: `${playHistory.length}+`, label: 'Titres joués' }].map((stat, i) => (
              <Col xs={6} md={3} key={i}>
                <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#000', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>{stat.value}</h3>
                <p style={{ color: '#666', fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;