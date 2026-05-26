import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../contexts/FavoritesContext';
import FavoriteBtn from '../components/FavoriteBtn';

const Favorites = () => {
  const { t, i18n } = useTranslation();
  const { favorites, clearFavorites } = useFavorites();
  const [filter, setFilter] = useState('all');

  const TYPE_LABELS = { program: t('typeProgram'), episode: t('typeEpisode') };
  const filtered = filter === 'all' ? favorites : favorites.filter(f => f.type === filter);

  const formatDate = (d) => new Date(d).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: 'var(--rr-bg, #fafafa)', minHeight: '100vh', paddingTop: 40, paddingBottom: 40 }}>
      <Container>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 300, color: 'var(--rr-text, #000)', margin: 0, letterSpacing: '-0.02em' }}>{t('myFavorites')}</h1>
            <p style={{ color: 'var(--rr-text2, #666)', fontSize: 14, marginTop: 6, marginBottom: 0 }}>{favorites.length} {t('typeProgram').toLowerCase()}{favorites.length !== 1 ? 's' : ''}</p>
          </div>
          {favorites.length > 0 && (
            <button onClick={() => { if (window.confirm(t('confirmClear'))) clearFavorites(); }}
              style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 20, padding: '7px 18px', fontSize: 13, cursor: 'pointer' }}>
              <i className="bi bi-trash me-2" />{t('clearAll')}
            </button>
          )}
        </div>

        {/* Filter tabs */}
        {favorites.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { key: 'all',     label: `${t('all')} (${favorites.length})` },
              { key: 'program', label: `${t('programs')} (${favorites.filter(f => f.type === 'program').length})` },
              { key: 'episode', label: `${t('episodes')} (${favorites.filter(f => f.type === 'episode').length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '7px 16px', borderRadius: 20, border: `1.5px solid ${filter === tab.key ? '#000' : 'rgba(0,0,0,0.12)'}`, background: filter === tab.key ? '#000' : 'transparent', color: filter === tab.key ? '#fff' : 'var(--rr-text, #000)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Empty */}
        {favorites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <i className="bi bi-heart" style={{ fontSize: 52, color: '#ccc', display: 'block', marginBottom: 16 }} />
            <h4 style={{ fontWeight: 400, color: 'var(--rr-text, #000)', marginBottom: 8 }}>{t('noFavoritesYet')}</h4>
            <p style={{ color: 'var(--rr-text2, #666)', marginBottom: 24 }}>{t('noFavoritesDesc')}</p>
            <Link to="/programs" style={{ background: '#000', color: '#fff', padding: '10px 28px', borderRadius: 30, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>{t('allPrograms')}</Link>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <Row className="g-3 g-md-4">
            {filtered.map(item => (
              <Col xs={12} sm={6} lg={4} key={item.id}>
                <div style={{ background: 'var(--rr-surface, #fff)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={item.image || '/images/default-cover.png'} alt={item.title}
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.src = '/images/default-cover.png'; }}
                    />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                      {TYPE_LABELS[item.type] || item.type}
                    </span>
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <FavoriteBtn item={item} size="sm" />
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--rr-text, #000)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h5>
                    {item.subtitle && <p style={{ fontSize: 13, color: 'var(--rr-text2, #666)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#aaa' }}>{t('savedOn')} {formatDate(item.savedAt)}</span>
                      {item.slug && (
                        <Link to={`/programs/${item.slug}`} style={{ fontSize: 12, fontWeight: 600, color: '#000', textDecoration: 'none', background: 'rgba(0,0,0,0.06)', padding: '5px 12px', borderRadius: 20 }}>
                          {t('see')} <i className="bi bi-arrow-right" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {filtered.length === 0 && favorites.length > 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--rr-text2, #666)' }}>
            {filter === 'program' ? t('noFavPrograms') : t('noFavEpisodes')}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Favorites;
