import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRadio } from '../contexts/RadioContext';

const SearchModal = ({ open, onClose }) => {
  const { searchPrograms, searchEpisodes } = useRadio();
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState({ programs: [], episodes: [] });
  const [loading, setLoading]   = useState(false);
  const inputRef                = useRef(null);
  const debounceRef             = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults({ programs: [], episodes: [] });
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults({ programs: [], episodes: [] }); return; }
    setLoading(true);
    try {
      const [progs, eps] = await Promise.all([
        searchPrograms(q).catch(() => []),
        searchEpisodes(q).catch(() => ({ episodes: [] })),
      ]);
      setResults({
        programs: (Array.isArray(progs) ? progs : progs?.programs || []).slice(0, 5),
        episodes: (eps?.episodes || eps || []).slice(0, 5),
      });
    } catch { setResults({ programs: [], episodes: [] }); }
    setLoading(false);
  }, [searchPrograms, searchEpisodes]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 320);
  };

  const total = results.programs.length + results.episodes.length;
  const hasQuery = query.trim().length > 0;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', zIndex: 2000 }}
      />

      {/* Modal */}
      <div style={{ position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)', zIndex: 2001, width: '90%', maxWidth: 580 }}>
        {/* Search input */}
        <div style={{ background: 'var(--rr-surface, #fff)', borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: hasQuery ? '1px solid rgba(0,0,0,0.06)' : 'none', gap: 12 }}>
            <i className="bi bi-search" style={{ fontSize: 18, color: '#aaa', flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              placeholder="Rechercher programmes, épisodes…"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: 'var(--rr-text, #000)', fontFamily: 'inherit' }}
            />
            {loading && <div className="spinner-border spinner-border-sm" style={{ color: '#aaa', flexShrink: 0 }} />}
            {!loading && query && (
              <button onClick={() => { setQuery(''); setResults({ programs: [], episodes: [] }); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 20, padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
            )}
          </div>

          {/* Results */}
          {hasQuery && (
            <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '8px 0' }}>
              {total === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#aaa', fontSize: 14 }}>
                  <i className="bi bi-search d-block mb-2" style={{ fontSize: 28 }} />
                  Aucun résultat pour « {query} »
                </div>
              )}

              {results.programs.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#aaa', padding: '8px 18px 4px', margin: 0 }}>Programmes</p>
                  {results.programs.map(p => (
                    <Link key={p._id} to={`/programs/${p.slug}`} onClick={onClose}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <img src={p.image || '/uploads/placeholder-program.jpg'} alt=""
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                        onError={e => { e.target.src = '/images/default-cover.png'; }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--rr-text, #000)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{p.host} {p.category && `· ${p.category}`}</div>
                      </div>
                      <i className="bi bi-arrow-right" style={{ marginLeft: 'auto', color: '#ccc', flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              )}

              {results.episodes.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#aaa', padding: '8px 18px 4px', margin: 0 }}>Épisodes</p>
                  {results.episodes.map(ep => (
                    <Link key={ep._id} to={`/programs/${ep.programSlug || ep.program?.slug || '#'}`} onClick={onClose}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <img src={ep.image || ep.cover || '/images/default-cover.png'} alt=""
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                        onError={e => { e.target.src = '/images/default-cover.png'; }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--rr-text, #000)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ep.title}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {ep.program?.title || ep.programTitle || 'Épisode'}
                          {ep.duration && ` · ${Math.floor(ep.duration / 60)} min`}
                        </div>
                      </div>
                      <i className="bi bi-collection-play" style={{ marginLeft: 'auto', color: '#ccc', flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hint when empty */}
          {!hasQuery && (
            <div style={{ padding: '20px 18px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[{ icon: 'bi-broadcast', label: 'Programmes', to: '/programs' }, { icon: 'bi-broadcast-pin', label: 'Émissions', to: '/emissions' }, { icon: 'bi-info-circle', label: 'À propos', to: '/about' }].map(s => (
                <Link key={s.to} to={s.to} onClick={onClose}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(0,0,0,0.04)', borderRadius: 20, fontSize: 13, fontWeight: 500, color: 'var(--rr-text, #000)', textDecoration: 'none' }}>
                  <i className={s.icon} /> {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          Appuyez sur <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>Esc</kbd> pour fermer
        </p>
      </div>
    </>
  );
};

export default SearchModal;
