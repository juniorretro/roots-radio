import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  A, AppleLayout, AppleCard, CardHeader,
  AppleBtn, AppleTable, AppleTr, AppleTd, AppleThumb,
  AppleBadge, AppleEmpty, AppleSpinner,
} from './AppleAdmin.shared';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const resolveImg = (url) => (!url || url.startsWith('http')) ? url : `${API_URL}${url}`;

const EMPTY_FORM = { type: 'artist', name: '', subtitle: '', image: '', order: 0, isActive: true };

const AdminCarousels = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState('artist');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/carousel/all');
      setItems(res.data.items || []);
    } catch { toast.error('Erreur de chargement'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter(i => i.type === tab);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, type: tab });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ type: item.type, name: item.name || '', subtitle: item.subtitle || '', image: item.image, order: item.order || 0, isActive: item.isActive });
    setShowForm(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res.data.url || res.data.path || res.data.file?.url;
      if (url) setForm(f => ({ ...f, image: url }));
      else toast.error("URL d'image non reçue");
    } catch { toast.error("Erreur lors de l'upload"); }
    setUploading(false);
  };

  const save = async () => {
    if (!form.image) return toast.error("L'image est requise");
    try {
      if (editing) {
        const res = await api.put(`/api/carousel/${editing}`, form);
        setItems(prev => prev.map(i => i._id === editing ? res.data.item : i));
        toast.success('Modifié');
      } else {
        const res = await api.post('/api/carousel', form);
        setItems(prev => [...prev, res.data.item]);
        toast.success('Ajouté');
      }
      setShowForm(false);
    } catch { toast.error('Erreur'); }
  };

  const toggle = async (item) => {
    try {
      const res = await api.put(`/api/carousel/${item._id}`, { isActive: !item.isActive });
      setItems(prev => prev.map(i => i._id === item._id ? res.data.item : i));
    } catch { toast.error('Erreur'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    try {
      await api.delete(`/api/carousel/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Supprimé');
    } catch { toast.error('Erreur'); }
  };

  const tabBar = (
    <div style={{ display: 'flex', gap: 4 }}>
      {[
        { key: 'artist', label: `Artistes (${items.filter(i => i.type === 'artist').length})` },
        { key: 'hero',   label: `Animateurs/Émissions (${items.filter(i => i.type === 'hero').length})` },
      ].map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${tab === t.key ? A.blue : A.border}`, background: tab === t.key ? A.blue : 'transparent', color: tab === t.key ? '#fff' : A.text2, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <AppleLayout
      title="Carrousels"
      subtitle="Gérez les images des artistes et des animateurs/émissions"
      actions={<AppleBtn onClick={openAdd}><i className="bi bi-plus-lg" /> Ajouter</AppleBtn>}
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Artistes actifs',            val: items.filter(i => i.type === 'artist' && i.isActive).length,   color: A.blue   },
          { label: 'Animateurs/Émissions actifs', val: items.filter(i => i.type === 'hero'   && i.isActive).length,   color: A.green  },
        ].map((s, i) => (
          <div key={i} style={{ background: A.surface, borderRadius: A.r16, border: `1px solid ${A.border}`, padding: '20px 16px', textAlign: 'center', boxShadow: A.shadow }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: A.text2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <AppleCard>
        <CardHeader title={tab === 'artist' ? 'Artistes en rotation' : 'Animateurs / Émissions'} right={tabBar} />
        {loading ? <AppleSpinner /> : filtered.length === 0 ? (
          <AppleEmpty icon="images" title="Aucun élément" description="Ajoutez des images pour ce carrousel" />
        ) : (
          <AppleTable cols={[{ label: 'Image' }, { label: tab === 'artist' ? 'Nom / Genre' : 'Titre' }, { label: 'Ordre' }, { label: 'Statut' }, { label: 'Actions', w: 140 }]}>
            {filtered.sort((a, b) => a.order - b.order).map(item => (
              <AppleTr key={item._id}>
                <AppleTd><AppleThumb src={resolveImg(item.image)} alt={item.name || 'image'} /></AppleTd>
                <AppleTd>
                  <strong style={{ fontSize: 14 }}>{item.name || '—'}</strong>
                  {item.subtitle && <div style={{ fontSize: 12, color: A.text2 }}>{item.subtitle}</div>}
                </AppleTd>
                <AppleTd style={{ color: A.text2 }}>{item.order}</AppleTd>
                <AppleTd>
                  <AppleBadge variant={item.isActive ? 'green' : 'red'}>{item.isActive ? 'Actif' : 'Inactif'}</AppleBadge>
                </AppleTd>
                <AppleTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(item)} style={{ background: 'rgba(0,122,255,0.08)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: A.blue, fontSize: 13 }}>
                      <i className="bi bi-pencil" />
                    </button>
                    <button onClick={() => toggle(item)} style={{ background: item.isActive ? 'rgba(255,59,48,0.08)' : 'rgba(52,199,89,0.1)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: item.isActive ? A.red : A.green, fontSize: 13 }}>
                      <i className={`bi bi-${item.isActive ? 'eye-slash' : 'eye'}`} />
                    </button>
                    <button onClick={() => remove(item._id)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: A.text2, fontSize: 13 }}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        )}
      </AppleCard>

      {/* Modal formulaire */}
      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1001, width: '90%', maxWidth: 500, background: A.surface, borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${A.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: A.text }}>{editing ? 'Modifier' : 'Ajouter'} — {form.type === 'artist' ? 'Artiste' : 'Animateur/Émission'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, color: A.text2 }}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Type */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: A.text2, marginBottom: 6, textTransform: 'uppercase' }}>Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${A.border}`, fontSize: 14, background: A.surface, color: A.text }}>
                  <option value="artist">Artiste (carrousel du haut)</option>
                  <option value="hero">Animateur / Émission (fond derrière historique)</option>
                </select>
              </div>

              {/* Image upload */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: A.text2, marginBottom: 6, textTransform: 'uppercase' }}>Image *</label>
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} id="carousel-upload" />
                <label htmlFor="carousel-upload" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 10, border: `1px dashed ${A.border}`, cursor: 'pointer', fontSize: 13, color: A.blue, marginBottom: 8 }}>
                  {uploading ? 'Upload en cours…' : 'Choisir une image'}
                </label>
                {form.image && (
                  <div style={{ marginTop: 6 }}>
                    <img src={resolveImg(form.image)} alt="preview" style={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 8, border: `1px solid ${A.border}` }} />
                  </div>
                )}
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Ou coller une URL d'image" style={{ display: 'block', width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${A.border}`, fontSize: 13, marginTop: 6, boxSizing: 'border-box', background: A.surface, color: A.text }} />
              </div>

              {/* Nom */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: A.text2, marginBottom: 6, textTransform: 'uppercase' }}>{form.type === 'artist' ? 'Nom de l\'artiste' : 'Titre (optionnel)'}</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={form.type === 'artist' ? 'Ex: Burna Boy' : 'Ex: Morning Show'} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${A.border}`, fontSize: 14, boxSizing: 'border-box', background: A.surface, color: A.text }} />
              </div>

              {/* Sous-titre */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: A.text2, marginBottom: 6, textTransform: 'uppercase' }}>{form.type === 'artist' ? 'Genre musical' : 'Sous-titre (optionnel)'}</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder={form.type === 'artist' ? 'Ex: Afrobeat' : 'Ex: Chaque matin à 7h'} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${A.border}`, fontSize: 14, boxSizing: 'border-box', background: A.surface, color: A.text }} />
              </div>

              {/* Ordre + Actif */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: A.text2, marginBottom: 6, textTransform: 'uppercase' }}>Ordre</label>
                  <input type="number" min="0" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${A.border}`, fontSize: 14, boxSizing: 'border-box', background: A.surface, color: A.text }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    <span style={{ color: A.text }}>Actif</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${A.border}`, background: 'transparent', color: A.text2, fontSize: 14, cursor: 'pointer' }}>Annuler</button>
                <button onClick={save} disabled={uploading} style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: A.blue, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {editing ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AppleLayout>
  );
};

export default AdminCarousels;
