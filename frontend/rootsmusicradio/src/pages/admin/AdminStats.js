import React, { useState, useEffect, useCallback } from 'react';
import { useRadio } from '../../contexts/RadioContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  A, AppleLayout, AppleCard, CardHeader, CardBody,
  AppleBtn, AppleTable, AppleTr, AppleTd, AppleBadge
} from './AppleAdmin.shared';

const PIE_COLORS = ['#0071e3','#34c759','#ff9500','#ff3b30','#af52de'];
const PERIODS = [
  { key: 'week',    label: 'Semaine'   },
  { key: 'month',   label: 'Mois'      },
  { key: 'quarter', label: 'Trimestre' },
  { key: 'year',    label: 'Année'     },
];

const EXAMPLE_MONTHLY = [
  { month: 'Jan', episodes: 45, auditeurs: 1200 },
  { month: 'Fév', episodes: 52, auditeurs: 1400 },
  { month: 'Mar', episodes: 48, auditeurs: 1350 },
  { month: 'Avr', episodes: 60, auditeurs: 1600 },
  { month: 'Mai', episodes: 55, auditeurs: 1550 },
  { month: 'Juin', episodes: 58, auditeurs: 1700 },
];

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

const AdminStats = () => {
  const { getProgramsStats, getEpisodesStats } = useRadio();

  const [stats, setStats] = useState({
    programs: { total: 0, active: 0, featured: 0, byCategory: [] },
    episodes: { total: 0, totalDuration: 0 },
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end:   new Date().toISOString().split('T')[0],
  });

  const fetchStats = useCallback(async () => {
    try {
      const [ps, es] = await Promise.all([getProgramsStats(dateRange), getEpisodesStats(dateRange)]);
      setStats({ programs: ps, episodes: es });
    } catch { /* fallback values are already in state */ }
  }, [getProgramsStats, getEpisodesStats, dateRange]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const now = new Date();
    const offsets = { week: () => new Date(new Date().setDate(now.getDate() - 7)), month: () => new Date(new Date().setMonth(now.getMonth() - 1)), quarter: () => new Date(new Date().setMonth(now.getMonth() - 3)), year: () => new Date(new Date().setFullYear(now.getFullYear() - 1)) };
    setDateRange({ start: (offsets[period] || offsets.month)().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
  };

  const STAT_CARDS = [
    { icon: 'bi-broadcast',       color: A.blue,   val: stats.programs.total,       lbl: 'Programmes',      sub: `${stats.programs.active || 0} actifs` },
    { icon: 'bi-collection-play', color: A.green,  val: stats.episodes.total,       lbl: 'Épisodes',        sub: formatDuration(stats.episodes.totalDuration || 0) },
    { icon: 'bi-star-fill',       color: A.orange, val: stats.programs.featured||0, lbl: 'En vedette',      sub: 'Programmes mis en avant' },
    { icon: 'bi-check-circle',    color: A.purple, val: stats.programs.active||0,   lbl: 'Actifs',          sub: 'Diffusion en cours' },
  ];

  return (
    <AppleLayout title="Statistiques" subtitle="Analysez les performances de votre station"
      actions={<AppleBtn onClick={fetchStats}><i className="bi bi-arrow-clockwise" /> Actualiser</AppleBtn>}
    >
      {/* Period filter */}
      <AppleCard style={{ marginBottom: 24 }}>
        <CardHeader title="Période d'analyse" />
        <CardBody style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => handlePeriodChange(p.key)} style={{
              padding: '7px 16px', borderRadius: 8, border: `1px solid ${selectedPeriod === p.key ? A.blue : A.border}`,
              background: selectedPeriod === p.key ? A.blue : 'transparent',
              color: selectedPeriod === p.key ? '#fff' : A.text,
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>{p.label}</button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: 13, color: A.text2 }}>Du</label>
            <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${A.border}`, fontSize: 13 }} />
            <label style={{ fontSize: 13, color: A.text2 }}>Au</label>
            <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${A.border}`, fontSize: 13 }} />
          </div>
        </CardBody>
      </AppleCard>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{ background: A.surface, borderRadius: A.r16, border: `1px solid ${A.border}`, padding: '20px 16px', textAlign: 'center', boxShadow: A.shadow }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <i className={s.icon} style={{ fontSize: 22, color: s.color }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: A.text }}>{s.val}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: A.text, marginTop: 4 }}>{s.lbl}</div>
            <div style={{ fontSize: 12, color: A.text2, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <AppleCard>
          <CardHeader title="Évolution mensuelle" />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={EXAMPLE_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke={A.border} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="episodes"  fill={A.blue}  name="Épisodes"  radius={[4,4,0,0]} />
                <Bar dataKey="auditeurs" fill={A.green} name="Auditeurs" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </AppleCard>
        <AppleCard>
          <CardHeader title="Catégories" />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.programs.byCategory?.length ? stats.programs.byCategory : [{ category: 'Autres', count: 1 }]}
                  cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="category"
                  label={({ category, count }) => `${category}: ${count}`}
                >
                  {(stats.programs.byCategory?.length ? stats.programs.byCategory : [{ category: 'Autres', count: 1 }]).map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </AppleCard>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <AppleCard>
          <CardHeader title="Top Programmes" />
          <AppleTable cols={[{label:'Programme'},{label:'Épisodes'},{label:'Statut'}]}>
            {[
              { name: 'Morning Show', episodes: 25, active: true  },
              { name: 'Jazz Lounge',  episodes: 18, active: true  },
              { name: 'News Update',  episodes: 42, active: true  },
              { name: 'Rock Classics',episodes: 12, active: false },
            ].map((p, i) => (
              <AppleTr key={i}>
                <AppleTd>{p.name}</AppleTd>
                <AppleTd>{p.episodes}</AppleTd>
                <AppleTd><AppleBadge variant={p.active ? 'green' : 'orange'}>{p.active ? 'Actif' : 'Pause'}</AppleBadge></AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        </AppleCard>
        <AppleCard>
          <CardHeader title="Top Épisodes" />
          <AppleTable cols={[{label:'Épisode'},{label:'Durée'},{label:''}]}>
            {[
              { name: 'Morning Show S01E01', duration: '45m', featured: true  },
              { name: 'Jazz Lounge EP05',    duration: '60m', featured: true  },
              { name: 'Tech Talk EP12',      duration: '30m', featured: false },
              { name: 'Culture Mix EP03',    duration: '55m', featured: false },
            ].map((e, i) => (
              <AppleTr key={i}>
                <AppleTd>{e.name}</AppleTd>
                <AppleTd>{e.duration}</AppleTd>
                <AppleTd>{e.featured && <AppleBadge variant="blue">Vedette</AppleBadge>}</AppleTd>
              </AppleTr>
            ))}
          </AppleTable>
        </AppleCard>
      </div>

      {/* Export */}
      <AppleCard>
        <CardHeader title="Exporter les données" />
        <CardBody style={{ display: 'flex', gap: 12 }}>
          <AppleBtn variant="success"><i className="bi bi-file-excel" /> Excel</AppleBtn>
          <AppleBtn variant="danger"><i className="bi bi-file-pdf" /> PDF</AppleBtn>
          <AppleBtn variant="outline"><i className="bi bi-filetype-csv" /> CSV</AppleBtn>
        </CardBody>
      </AppleCard>
    </AppleLayout>
  );
};

export default AdminStats;
