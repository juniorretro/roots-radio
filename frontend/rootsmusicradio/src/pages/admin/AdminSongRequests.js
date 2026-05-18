import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  A, AppleLayout, AppleCard, CardHeader,
  AppleBtn, AppleTable, AppleTr, AppleTd,
  AppleBadge, AppleEmpty, AppleSpinner,
} from './AppleAdmin.shared';

const STATUS_VARIANTS = { pending: 'orange', played: 'green', declined: 'red' };
const STATUS_LABELS   = { pending: 'En attente', played: 'Diffusée', declined: 'Refusée' };

const AdminSongRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/song-requests');
      setRequests(res.data.requests || []);
    } catch { toast.error('Erreur de chargement'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/song-requests/${id}`, { status });
      setRequests(r => r.map(x => x._id === id ? { ...x, status } : x));
      toast.success('Statut mis à jour');
    } catch { toast.error('Erreur'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return;
    try {
      await axios.delete(`/api/song-requests/${id}`);
      setRequests(r => r.filter(x => x._id !== id));
      toast.success('Supprimée');
    } catch { toast.error('Erreur'); }
  };

  const formatDate = (d) => new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  const FILTERS = [
    { key: 'all',      label: `Toutes (${requests.length})`                                       },
    { key: 'pending',  label: `En attente (${requests.filter(r => r.status === 'pending').length})`  },
    { key: 'played',   label: `Diffusées (${requests.filter(r => r.status === 'played').length})`    },
    { key: 'declined', label: `Refusées (${requests.filter(r => r.status === 'declined').length})`   },
  ];

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const tabBar = (
    <div style={{ display: 'flex', gap: 4 }}>
      {FILTERS.map(f => (
        <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${filter === f.key ? A.blue : A.border}`, background: filter === f.key ? A.blue : 'transparent', color: filter === f.key ? '#fff' : A.text2, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {f.label}
        </button>
      ))}
    </div>
  );

  const pending = requests.filter(r => r.status === 'pending').length;

  return (
    <AppleLayout
      title="Demandes de chansons"
      subtitle={`${pending} demande${pending !== 1 ? 's' : ''} en attente`}
      actions={<AppleBtn onClick={load}><i className="bi bi-arrow-clockwise" /> Actualiser</AppleBtn>}
    >
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: 'bi-hourglass-split', color: A.orange, val: requests.filter(r => r.status === 'pending').length,  lbl: 'En attente' },
          { icon: 'bi-check-circle',    color: A.green,  val: requests.filter(r => r.status === 'played').length,   lbl: 'Diffusées' },
          { icon: 'bi-x-circle',        color: A.red,    val: requests.filter(r => r.status === 'declined').length, lbl: 'Refusées' },
        ].map((s, i) => (
          <div key={i} style={{ background: A.surface, borderRadius: A.r16, border: `1px solid ${A.border}`, padding: '20px 16px', textAlign: 'center', boxShadow: A.shadow }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <i className={s.icon} style={{ fontSize: 20, color: s.color }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: A.text }}>{s.val}</div>
            <div style={{ fontSize: 13, color: A.text2, marginTop: 4 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <AppleCard>
        <CardHeader title="Liste des demandes" right={tabBar} />
        {loading ? (
          <AppleSpinner />
        ) : filtered.length === 0 ? (
          <AppleEmpty icon="music-note-beamed" title="Aucune demande" description="Les demandes des auditeurs apparaîtront ici" />
        ) : (
          <AppleTable cols={[{label:'Titre'},{label:'Artiste'},{label:'Auditeur'},{label:'Message'},{label:'Date'},{label:'Statut'},{label:'Actions',w:160}]}>
            {filtered.map(r => (
              <AppleTr key={r._id}>
                <AppleTd><strong style={{ fontSize: 14 }}>{r.title}</strong></AppleTd>
                <AppleTd style={{ color: A.text2 }}>{r.artist || '—'}</AppleTd>
                <AppleTd style={{ color: A.text2 }}>{r.listener || '—'}</AppleTd>
                <AppleTd style={{ maxWidth: 200 }}>
                  {r.message ? <span style={{ fontSize: 13, color: A.text2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.message}</span> : '—'}
                </AppleTd>
                <AppleTd style={{ fontSize: 12, color: A.text2 }}>{formatDate(r.createdAt)}</AppleTd>
                <AppleTd><AppleBadge variant={STATUS_VARIANTS[r.status]}>{STATUS_LABELS[r.status]}</AppleBadge></AppleTd>
                <AppleTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {r.status !== 'played' && (
                      <button onClick={() => updateStatus(r._id, 'played')} title="Marquer diffusée" style={{ background: 'rgba(52,199,89,0.1)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#1d8833', fontSize: 13 }}>
                        <i className="bi bi-check2" />
                      </button>
                    )}
                    {r.status !== 'declined' && (
                      <button onClick={() => updateStatus(r._id, 'declined')} title="Refuser" style={{ background: 'rgba(255,59,48,0.08)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: A.red, fontSize: 13 }}>
                        <i className="bi bi-x" />
                      </button>
                    )}
                    <button onClick={() => remove(r._id)} title="Supprimer" style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: A.text2, fontSize: 13 }}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        )}
      </AppleCard>
    </AppleLayout>
  );
};

export default AdminSongRequests;
