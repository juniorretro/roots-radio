import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';

const FavoriteBtn = ({ item, size = 'md', style = {} }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item?.id);

  const sizes = {
    sm: { btn: { width: 28, height: 28, fontSize: 13 } },
    md: { btn: { width: 36, height: 36, fontSize: 16 } },
    lg: { btn: { width: 44, height: 44, fontSize: 20 } },
  };
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(item); }}
      title={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      style={{
        ...s.btn,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: active ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.06)',
        color: active ? '#ef4444' : '#888',
        transition: 'all 0.2s',
        flexShrink: 0,
        ...style,
      }}
    >
      <i className={`bi bi-heart${active ? '-fill' : ''}`} style={{ fontSize: s.btn.fontSize }} />
    </button>
  );
};

export default FavoriteBtn;
