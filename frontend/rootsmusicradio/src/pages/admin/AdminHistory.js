// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Table, Badge, Form, Alert } from 'react-bootstrap';
// import { useRadio } from '../../contexts/RadioContext';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const AdminHistory = () => {
//   const [history, setHistory] = useState([]);
//   const [suspiciousTracks, setSuspiciousTracks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState(null);
//   const [selectedTrack, setSelectedTrack] = useState(null);
//   const [newKeyword, setNewKeyword] = useState('');
//   const [keywordType, setKeywordType] = useState('keyword');

//   useEffect(() => {
//     loadHistory();
//     loadSuspiciousTracks();
//     loadStats();
//   }, []);

//   const loadHistory = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('/api/history?limit=100');
//       setHistory(response.data.history || []);
//     } catch (error) {
//       console.error('Error loading history:', error);
//       toast.error('Erreur de chargement');
//     }
//     setLoading(false);
//   };

//   const loadSuspiciousTracks = async () => {
//     try {
//       const response = await axios.get('/api/admin/history/suspicious?limit=50');
//       setSuspiciousTracks(response.data.tracks || []);
//     } catch (error) {
//       console.error('Error loading suspicious tracks:', error);
//     }
//   };

//   const loadStats = async () => {
//     try {
//       const response = await axios.get('/api/history/stats');
//       setStats(response.data.stats);
//     } catch (error) {
//       console.error('Error loading stats:', error);
//     }
//   };

//   const cleanAds = async () => {
//     if (!window.confirm('Voulez-vous vraiment nettoyer toutes les publicités de l\'historique ?')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post('/api/admin/history/clean-ads');
//       toast.success(`✅ ${response.data.deleted} publicités supprimées`);
//       loadHistory();
//       loadSuspiciousTracks();
//     } catch (error) {
//       console.error('Error cleaning ads:', error);
//       toast.error('Erreur lors du nettoyage');
//     }
//     setLoading(false);
//   };

//   const deleteTrack = async (id) => {
//     if (!window.confirm('Supprimer ce track de l\'historique ?')) {
//       return;
//     }

//     try {
//       await axios.delete(`/api/admin/history/${id}`);
//       toast.success('Track supprimé');
//       loadHistory();
//       loadSuspiciousTracks();
//     } catch (error) {
//       console.error('Error deleting track:', error);
//       toast.error('Erreur lors de la suppression');
//     }
//   };

//   const analyzeTrack = async (track) => {
//     try {
//       const response = await axios.post('/api/admin/history/analyze-track', track);
//       setSelectedTrack({
//         ...track,
//         analysis: response.data
//       });
//     } catch (error) {
//       console.error('Error analyzing track:', error);
//       toast.error('Erreur d\'analyse');
//     }
//   };

//   const addToBlacklist = async () => {
//     if (!newKeyword.trim()) {
//       toast.error('Veuillez entrer un mot-clé');
//       return;
//     }

//     try {
//       await axios.post('/api/admin/history/add-blacklist', {
//         keyword: newKeyword,
//         type: keywordType
//       });
//       toast.success(`"${newKeyword}" ajouté à la liste noire`);
//       setNewKeyword('');
//     } catch (error) {
//       console.error('Error adding to blacklist:', error);
//       toast.error('Erreur lors de l\'ajout');
//     }
//   };

//   const getScoreBadge = (score) => {
//     if (score >= 70) return <Badge bg="success">{score}%</Badge>;
//     if (score >= 50) return <Badge bg="warning">{score}%</Badge>;
//     return <Badge bg="danger">{score}%</Badge>;
//   };

//   return (
//     <Container fluid className="py-4">
//       <Row className="mb-4">
//         <Col>
//           <h2>Gestion de l'historique</h2>
//         </Col>
//       </Row>

//       {/* Statistiques */}
//       {stats && (
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card>
//               <Card.Body>
//                 <h6 className="text-muted">Total Tracks</h6>
//                 <h3>{stats.totalTracks}</h3>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card>
//               <Card.Body>
//                 <h6 className="text-muted">Aujourd'hui</h6>
//                 <h3>{history.filter(t => {
//                   const today = new Date().toDateString();
//                   return new Date(t.playedAt).toDateString() === today;
//                 }).length}</h3>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card>
//               <Card.Body>
//                 <h6 className="text-muted">Suspects</h6>
//                 <h3>{suspiciousTracks.length}</h3>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card>
//               <Card.Body className="d-flex align-items-center justify-content-between">
//                 <div>
//                   <h6 className="text-muted mb-0">Actions</h6>
//                 </div>
//                 <Button 
//                   variant="danger" 
//                   size="sm"
//                   onClick={cleanAds}
//                   disabled={loading}
//                 >
//                   <i className="bi bi-trash me-2"></i>
//                   Nettoyer pubs
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Ajouter à la liste noire */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Ajouter à la liste noire</h5>
//             </Card.Header>
//             <Card.Body>
//               <Row>
//                 <Col md={5}>
//                   <Form.Control
//                     type="text"
//                     placeholder="Mot-clé ou nom d'artiste"
//                     value={newKeyword}
//                     onChange={(e) => setNewKeyword(e.target.value)}
//                   />
//                 </Col>
//                 <Col md={3}>
//                   <Form.Select
//                     value={keywordType}
//                     onChange={(e) => setKeywordType(e.target.value)}
//                   >
//                     <option value="keyword">Mot-clé</option>
//                     <option value="artist">Artiste</option>
//                   </Form.Select>
//                 </Col>
//                 <Col md={2}>
//                   <Button 
//                     variant="primary" 
//                     onClick={addToBlacklist}
//                     className="w-100"
//                   >
//                     Ajouter
//                   </Button>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Tracks suspects */}
//       {suspiciousTracks.length > 0 && (
//         <Row className="mb-4">
//           <Col md={12}>
//             <Card>
//               <Card.Header className="d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">Tracks suspects (score &lt; 50%)</h5>
//                 <Badge bg="warning">{suspiciousTracks.length} tracks</Badge>
//               </Card.Header>
//               <Card.Body>
//                 <Table striped hover responsive>
//                   <thead>
//                     <tr>
//                       <th>Score</th>
//                       <th>Titre</th>
//                       <th>Artiste</th>
//                       <th>Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {suspiciousTracks.slice(0, 20).map((track) => (
//                       <tr key={track._id}>
//                         <td>{getScoreBadge(track.score)}</td>
//                         <td>{track.title}</td>
//                         <td>{track.artist}</td>
//                         <td>{new Date(track.playedAt).toLocaleString()}</td>
//                         <td>
//                           <Button
//                             variant="outline-primary"
//                             size="sm"
//                             className="me-2"
//                             onClick={() => analyzeTrack(track)}
//                           >
//                             Analyser
//                           </Button>
//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             onClick={() => deleteTrack(track._id)}
//                           >
//                             Supprimer
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Historique complet */}
//       <Row>
//         <Col md={12}>
//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Historique récent</h5>
//             </Card.Header>
//             <Card.Body>
//               <Table striped hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Pochette</th>
//                     <th>Titre</th>
//                     <th>Artiste</th>
//                     <th>Album</th>
//                     <th>Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.slice(0, 50).map((track) => (
//                     <tr key={track._id}>
//                       <td>
//                         <img
//                           src={track.cover || '/images/default-cover.png'}
//                           alt={track.title}
//                           style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
//                           onError={(e) => {
//                             e.target.src = '/images/default-cover.png';
//                           }}
//                         />
//                       </td>
//                       <td>{track.title}</td>
//                       <td>{track.artist}</td>
//                       <td>{track.album || '-'}</td>
//                       <td>{new Date(track.playedAt).toLocaleString()}</td>
//                       <td>
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           className="me-2"
//                           onClick={() => analyzeTrack(track)}
//                         >
//                           Analyser
//                         </Button>
//                         <Button
//                           variant="outline-danger"
//                           size="sm"
//                           onClick={() => deleteTrack(track._id)}
//                         >
//                           Supprimer
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Modal d'analyse */}
//       {selectedTrack && (
//         <div 
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 9999
//           }}
//           onClick={() => setSelectedTrack(null)}
//         >
//           <Card 
//             style={{ 
//               maxWidth: '600px', 
//               width: '90%' 
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Card.Header>
//               <h5>Analyse du track</h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="mb-3">
//                 <strong>Titre:</strong> {selectedTrack.title}
//               </div>
//               <div className="mb-3">
//                 <strong>Artiste:</strong> {selectedTrack.artist}
//               </div>
//               {selectedTrack.analysis && (
//                 <>
//                   <div className="mb-3">
//                     <strong>Score de confiance:</strong> {getScoreBadge(selectedTrack.analysis.score)}
//                   </div>
//                   <div className="mb-3">
//                     <strong>Verdict:</strong>{' '}
//                     {selectedTrack.analysis.isMusic ? (
//                       <Badge bg="success">Musique valide</Badge>
//                     ) : (
//                       <Badge bg="danger">Publicité / Suspect</Badge>
//                     )}
//                   </div>
//                 </>
//               )}
//             </Card.Body>
//             <Card.Footer>
//               <Button variant="secondary" onClick={() => setSelectedTrack(null)}>
//                 Fermer
//               </Button>
//             </Card.Footer>
//           </Card>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default AdminHistory;

// ════════════════════════════════════════════════════════════════════════
// AdminHistory.jsx — Apple Design System
// ════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { A, AppleLayout, AppleCard, CardHeader, AppleBtn, AppleLinkBtn, AppleBadge, AppleTable, AppleTr, AppleTd, AppleThumb, AppleInput, AppleSelect, AppleFormGroup, AppleAlert, AppleEmpty, AppleSpinner } from './AppleAdmin.shared';

export const AdminHistory = () => {
  const [history, setHistory]           = useState([]);
  const [suspicious, setSuspicious]     = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(false);
  const [tab, setTab]                   = useState('all');
  const [keyword, setKeyword]           = useState('');
  const [kwType, setKwType]             = useState('keyword');
  const [selected, setSelected]         = useState(null);
  const [alert, setAlert]               = useState(null);

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const load = async () => {
    setLoading(true);
    try {
      const [h, s, st] = await Promise.all([
        axios.get('/api/history?limit=100'),
        axios.get('/api/admin/history/suspicious?limit=50').catch(() => ({ data:{ tracks:[] } })),
        axios.get('/api/history/stats').catch(() => ({ data:{ stats:null } })),
      ]);
      setHistory(h.data.history||[]);
      setSuspicious(s.data.tracks||[]);
      setStats(st.data.stats);
    } catch { showAlert('danger','Erreur chargement'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cleanAds = async () => {
    if (!window.confirm('Nettoyer toutes les publicités de l\'historique ?')) return;
    try { const r = await axios.post('/api/admin/history/clean-ads'); toast.success(`${r.data.deleted} publicités supprimées`); load(); }
    catch { toast.error('Erreur nettoyage'); }
  };

  const deleteTrack = async (id, type='track') => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    try {
      await axios.delete(`/api/admin/history/${id}`);
      toast.success('Supprimé'); load();
    } catch { toast.error('Erreur suppression'); }
  };

  const addBlacklist = async () => {
    if (!keyword.trim()) { showAlert('danger','Mot-clé requis'); return; }
    try { await axios.post('/api/admin/history/add-blacklist', { keyword:keyword.trim(), type:kwType }); toast.success(`"${keyword}" ajouté`); setKeyword(''); }
    catch { toast.error('Erreur'); }
  };

  const scored = s => s>=70?{ variant:'green' }:s>=50?{ variant:'orange' }:{ variant:'red' };

  const filtered = history.filter(item =>
    tab==='all' || (tab==='tracks'&&item.type==='track') || (tab==='emissions'&&item.type==='emission')
  );

  const TABS = [
    { key:'all',       label:`Tout (${history.length})` },
    { key:'tracks',    label:`Musique (${history.filter(i=>i.type==='track').length})` },
    { key:'emissions', label:`Émissions (${history.filter(i=>i.type==='emission').length})` },
  ];

  const COLS = [{ label:'Type',w:90 },{ label:'Cover',w:60 },{ label:'Titre' },{ label:'Artiste / Animateur' },{ label:'Détails' },{ label:'Date' },{ label:'',w:60 }];

  return (
    <AppleLayout
      title="Historique"
      subtitle="Gérez l'historique des diffusions"
      actions={<>
        <AppleLinkBtn to="/admin" variant="ghost"><i className="bi bi-arrow-left" />Retour</AppleLinkBtn>
        <AppleBtn variant="danger" onClick={cleanAds}><i className="bi bi-trash" />Nettoyer pubs</AppleBtn>
      </>}
    >
      {alert && <AppleAlert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</AppleAlert>}

      {/* Stats */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Total éléments', value:stats.total||history.length, icon:'collection', color:'#0071e3', bg:'rgba(0,113,227,0.1)' },
            { label:'Morceaux', value:stats.totalTracks||history.filter(i=>i.type==='track').length, icon:'music-note', color:'#34c759', bg:'rgba(52,199,89,0.1)' },
            { label:'Émissions', value:stats.totalEmissions||history.filter(i=>i.type==='emission').length, icon:'broadcast', color:'#ff9500', bg:'rgba(255,149,0,0.1)' },
            { label:'Suspects', value:suspicious.length, icon:'exclamation-triangle', color:'#ff3b30', bg:'rgba(255,59,48,0.1)' },
          ].map((s,i) => (
            <AppleCard key={i} p={16}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className={`bi bi-${s.icon}`} style={{ fontSize:17, color:s.color }} />
                </div>
                <div>
                  <div style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:A.text2, marginTop:2 }}>{s.label}</div>
                </div>
              </div>
            </AppleCard>
          ))}
        </div>
      )}

      {/* Blacklist */}
      <AppleCard style={{ marginBottom:20 }}>
        <div style={{ padding:'18px 20px 14px', borderBottom:`1px solid ${A.border}`, fontSize:15, fontWeight:600 }}>Ajouter à la liste noire</div>
        <div style={{ padding:'16px 20px', display:'flex', gap:10, alignItems:'flex-end' }}>
          <AppleFormGroup label="Mot-clé ou artiste" style={{ flex:1, marginBottom:0 }}>
            <AppleInput value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Publicité, Promo…" onKeyDown={e=>e.key==='Enter'&&addBlacklist()} />
          </AppleFormGroup>
          <AppleFormGroup label="Type" style={{ width:140, marginBottom:0 }}>
            <AppleSelect value={kwType} onChange={e=>setKwType(e.target.value)}>
              <option value="keyword">Mot-clé</option>
              <option value="artist">Artiste</option>
            </AppleSelect>
          </AppleFormGroup>
          <AppleBtn onClick={addBlacklist}><i className="bi bi-plus" />Ajouter</AppleBtn>
        </div>
      </AppleCard>

      {/* Suspicious */}
      {suspicious.length > 0 && (
        <AppleCard style={{ marginBottom:20 }}>
          <CardHeader title={`Tracks suspects — score < 50%`} right={<AppleBadge variant="orange">{suspicious.length}</AppleBadge>} />
          <AppleTable cols={[{ label:'Score',w:80 },{ label:'Titre' },{ label:'Artiste' },{ label:'Date' },{ label:'',w:80 }]}>
            {suspicious.slice(0,20).map(t => (
              <AppleTr key={t._id}>
                <AppleTd><AppleBadge variant={scored(t.score).variant}>{t.score}%</AppleBadge></AppleTd>
                <AppleTd><span style={{ fontSize:14 }}>{t.title}</span></AppleTd>
                <AppleTd><span style={{ fontSize:14, color:A.text2 }}>{t.artist}</span></AppleTd>
                <AppleTd><span style={{ fontSize:13, color:A.text3 }}>{new Date(t.playedAt).toLocaleString()}</span></AppleTd>
                <AppleTd>
                  <AppleBtn variant="danger" style={{ padding:'6px 10px' }} onClick={() => deleteTrack(t._id)}><i className="bi bi-trash" style={{ fontSize:13 }} /></AppleBtn>
                </AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        </AppleCard>
      )}

      {/* History Table */}
      <AppleCard>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${A.border}`, display:'flex', gap:2 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, background:tab===t.key?A.blue:'transparent', color:tab===t.key?'#fff':A.text2, transition:'all 0.15s' }}>
              {t.label}
            </button>
          ))}
          <div style={{ flex:1 }} />
          <AppleBtn variant="ghost" onClick={load}><i className="bi bi-arrow-clockwise" /></AppleBtn>
        </div>

        {loading ? <AppleSpinner /> : filtered.length===0 ? (
          <AppleEmpty icon="clock-history" title="Aucun élément" />
        ) : (
          <AppleTable cols={COLS}>
            {filtered.slice(0,100).map(item => (
              <AppleTr key={item._id}>
                <AppleTd><AppleBadge variant={item.type==='track'?'green':'blue'}>{item.type==='track'?'Musique':'Émission'}</AppleBadge></AppleTd>
                <AppleTd><AppleThumb src={item.cover} alt={item.title} size={44} /></AppleTd>
                <AppleTd><span style={{ fontWeight:600, fontSize:14 }}>{item.title}</span></AppleTd>
                <AppleTd><span style={{ fontSize:14, color:A.text2 }}>{item.artist||item.host||'—'}</span></AppleTd>
                <AppleTd>{item.album ? <span style={{ fontSize:13, color:A.text3 }}>{item.album}</span> : item.programId ? <AppleBadge variant="gray">{item.programId.title||'Programme'}</AppleBadge> : '—'}</AppleTd>
                <AppleTd><span style={{ fontSize:12, color:A.text3 }}>{new Date(item.playedAt).toLocaleString('fr-FR')}</span></AppleTd>
                <AppleTd>
                  <AppleBtn variant="danger" style={{ padding:'6px 10px' }} onClick={() => deleteTrack(item._id)}><i className="bi bi-trash" style={{ fontSize:13 }} /></AppleBtn>
                </AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        )}
      </AppleCard>
    </AppleLayout>
  );
};

export default AdminHistory;