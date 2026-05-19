import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  A, AppleLayout, AppleCard, CardHeader,
  AppleBtn, AppleTable, AppleTr, AppleTd, AppleThumb,
  AppleBadge, AppleEmpty, AppleSpinner, AppleModal,
  AppleInput, AppleSelect, AppleFormGroup,
} from './AppleAdmin.shared';

const AdminCombinedHistory = () => {
  const [combinedHistory, setCombinedHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [programs, setPrograms] = useState([]);
  const [emissionForm, setEmissionForm] = useState({
    title: '', host: '', programId: '', cover: '', duration: '', description: '', category: 'Émission',
  });

  useEffect(() => {
    loadHistory();
    loadStats();
    loadPrograms();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/combined-history?limit=100');
      setCombinedHistory(res.data.history || []);
    } catch {
      toast.error('Erreur de chargement');
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/api/combined-history/stats');
      setStats(res.data.stats);
    } catch { /* stats are optional */ }
  };

  const loadPrograms = async () => {
    try {
      const res = await api.get('/api/programs');
      setPrograms(res.data.programs || res.data || []);
    } catch { /* programs are optional */ }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.title}" de l'historique ?`)) return;
    try {
      if (item.type === 'track') {
        await api.delete(`/api/combined-history/track/${item._id}`);
      } else {
        await api.delete(`/api/combined-history/emission/${item._id}`);
      }
      toast.success('Élément supprimé');
      loadHistory();
      loadStats();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddEmission = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/combined-history/emission', emissionForm);
      toast.success("Émission ajoutée à l'historique");
      setShowModal(false);
      setEmissionForm({ title: '', host: '', programId: '', cover: '', duration: '', description: '', category: 'Émission' });
      loadHistory();
      loadStats();
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const filteredHistory = combinedHistory.filter(item => {
    if (activeTab === 'tracks')    return item.type === 'track';
    if (activeTab === 'emissions') return item.type === 'emission';
    return true;
  });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const trackCount    = combinedHistory.filter(i => i.type === 'track').length;
  const emissionCount = combinedHistory.filter(i => i.type === 'emission').length;

  const TABS = [
    { key: 'all',       label: `Tout (${combinedHistory.length})` },
    { key: 'tracks',    label: `Musique (${trackCount})`           },
    { key: 'emissions', label: `Émissions (${emissionCount})`      },
  ];

  const STAT_CARDS = stats ? [
    { icon: 'bi-collection',  color: A.blue,   val: stats.total,          lbl: 'Total' },
    { icon: 'bi-music-note',  color: A.green,  val: stats.totalTracks,    lbl: 'Morceaux' },
    { icon: 'bi-broadcast',   color: A.orange, val: stats.totalEmissions, lbl: 'Émissions' },
    { icon: 'bi-calendar-day',color: A.purple, val: stats.today,          lbl: "Aujourd'hui" },
  ] : [];

  const tabBar = (
    <div style={{ display: 'flex', gap: 4 }}>
      {TABS.map(t => (
        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
          padding: '5px 12px', borderRadius: 8, border: `1px solid ${activeTab === t.key ? A.blue : A.border}`,
          background: activeTab === t.key ? A.blue : 'transparent',
          color: activeTab === t.key ? '#fff' : A.text2,
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>{t.label}</button>
      ))}
    </div>
  );

  return (
    <AppleLayout
      title="Historique"
      subtitle="Gérez l'historique des diffusions (musique + émissions)"
      actions={
        <AppleBtn onClick={() => setShowModal(true)}>
          <i className="bi bi-plus" /> Ajouter émission
        </AppleBtn>
      }
    >
      {/* Stat cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} style={{ background: A.surface, borderRadius: A.r16, border: `1px solid ${A.border}`, padding: '20px 16px', textAlign: 'center', boxShadow: A.shadow }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <i className={s.icon} style={{ fontSize: 20, color: s.color }} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: A.text }}>{s.val ?? 0}</div>
              <div style={{ fontSize: 13, color: A.text2, marginTop: 4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      )}

      {/* History table */}
      <AppleCard>
        <CardHeader title="Diffusions" right={tabBar} />
        {loading ? (
          <AppleSpinner />
        ) : filteredHistory.length === 0 ? (
          <AppleEmpty icon="clock-history" title="Aucun élément" description="L'historique est vide pour ce filtre" />
        ) : (
          <AppleTable cols={[{label:'',w:60},{label:'Titre'},{label:'Artiste / Animateur'},{label:'Type'},{label:'Date'},{label:'',w:48}]}>
            {filteredHistory.map(item => (
              <AppleTr key={item._id}>
                <AppleTd>
                  <AppleThumb src={item.cover || '/images/default-cover.png'} />
                </AppleTd>
                <AppleTd><strong style={{ fontSize: 14 }}>{item.title}</strong></AppleTd>
                <AppleTd style={{ color: A.text2, fontSize: 13 }}>
                  {item.type === 'track' ? item.artist : item.host}
                </AppleTd>
                <AppleTd>
                  <AppleBadge variant={item.type === 'track' ? 'green' : 'blue'}>
                    {item.type === 'track' ? 'Musique' : 'Émission'}
                  </AppleBadge>
                </AppleTd>
                <AppleTd style={{ fontSize: 12, color: A.text2 }}>{formatTime(item.playedAt)}</AppleTd>
                <AppleTd>
                  <button onClick={() => handleDelete(item)} style={{ background: 'none', border: 'none', color: A.red, cursor: 'pointer', padding: '4px 8px' }}>
                    <i className="bi bi-trash" style={{ fontSize: 14 }} />
                  </button>
                </AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        )}
      </AppleCard>

      {/* Add Emission Modal */}
      <AppleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Ajouter une émission"
        footer={
          <>
            <AppleBtn variant="ghost" onClick={() => setShowModal(false)}>Annuler</AppleBtn>
            <AppleBtn type="submit" onClick={handleAddEmission}><i className="bi bi-plus" /> Ajouter</AppleBtn>
          </>
        }
      >
        <form onSubmit={handleAddEmission}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AppleFormGroup label="Titre" required>
              <AppleInput required value={emissionForm.title} placeholder="Titre de l'émission"
                onChange={e => setEmissionForm(f => ({ ...f, title: e.target.value }))} />
            </AppleFormGroup>
            <AppleFormGroup label="Animateur" required>
              <AppleInput required value={emissionForm.host} placeholder="Nom de l'animateur"
                onChange={e => setEmissionForm(f => ({ ...f, host: e.target.value }))} />
            </AppleFormGroup>
          </div>
          <AppleFormGroup label="Programme (optionnel)">
            <AppleSelect value={emissionForm.programId} onChange={e => setEmissionForm(f => ({ ...f, programId: e.target.value }))}>
              <option value="">Aucun programme</option>
              {programs.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </AppleSelect>
          </AppleFormGroup>
          <AppleFormGroup label="Description">
            <AppleInput rows={3} value={emissionForm.description} placeholder="Description de l'émission"
              onChange={e => setEmissionForm(f => ({ ...f, description: e.target.value }))} />
          </AppleFormGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AppleFormGroup label="URL Pochette">
              <AppleInput type="url" value={emissionForm.cover} placeholder="https://example.com/cover.jpg"
                onChange={e => setEmissionForm(f => ({ ...f, cover: e.target.value }))} />
            </AppleFormGroup>
            <AppleFormGroup label="Durée (minutes)">
              <AppleInput type="number" value={emissionForm.duration} placeholder="60"
                onChange={e => setEmissionForm(f => ({ ...f, duration: e.target.value }))} />
            </AppleFormGroup>
          </div>
          <AppleFormGroup label="Catégorie">
            <AppleInput value={emissionForm.category} placeholder="Émission"
              onChange={e => setEmissionForm(f => ({ ...f, category: e.target.value }))} />
          </AppleFormGroup>
        </form>
      </AppleModal>
    </AppleLayout>
  );
};

export default AdminCombinedHistory;
