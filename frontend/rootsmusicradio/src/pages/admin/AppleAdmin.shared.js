// ─── AppleAdmin.shared.jsx ────────────────────────────────────────────────────
// Design tokens & components Apple-style shared by all admin pages
// Usage: import { A, AppleLayout, AppleCard, AppleBtn, AppleTable, AppleModal, AppleInput, AppleBadge, AppleEmpty } from './AppleAdmin.shared';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

// ── Tokens ────────────────────────────────────────────────────────────────────
export const A = {
  bg:          '#f5f5f7',
  surface:     '#ffffff',
  surface2:    '#f5f5f7',
  surface3:    '#e8e8ed',
  border:      'rgba(0,0,0,0.08)',
  borderStrong:'rgba(0,0,0,0.15)',
  text:        '#1d1d1f',
  text2:       '#6e6e73',
  text3:       '#aeaeb2',
  blue:        '#0071e3',
  green:       '#34c759',
  red:         '#ff3b30',
  orange:      '#ff9500',
  yellow:      '#ffcc00',
  purple:      '#af52de',
  r8:  8,  r10: 10, r12: 12, r16: 16, r20: 20,
  shadow:  '0 1px 3px rgba(0,0,0,0.06)',
  shadowMd:'0 4px 16px rgba(0,0,0,0.08)',
  ease:    'cubic-bezier(0.4,0,0.2,1)',
  font:    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
};

// ── Nav config ────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { to:'/admin',              icon:'speedometer2',    label:'Tableau de bord' },
  { to:'/admin/programs',     icon:'calendar3',       label:'Programmes'      },
  { to:'/admin/episodes',     icon:'collection-play', label:'Épisodes'        },
  { to:'/admin/emissions',    icon:'broadcast',       label:'Émissions'       },
  { to:'/admin/affiches',      icon:'images',           label:'Affiches'         },
  { to:'/admin/song-requests', icon:'music-note-beamed',label:'Demandes'        },
  { to:'/admin/history',       icon:'clock-history',   label:'Historique'       },
  { to:'/admin/stats',         icon:'bar-chart',       label:'Statistiques'     },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
export const AppleSidebar = () => {
  const location = useLocation();
  const active = p => location.pathname === p;
  return (
    <aside style={{ width:220, background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)', borderRight:`1px solid ${A.border}`, minHeight:'100vh', position:'sticky', top:0, display:'flex', flexDirection:'column', flexShrink:0 }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:`1px solid ${A.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:A.blue, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className="bi bi-radio" style={{ color:'#fff', fontSize:16 }} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:A.text }}>Roots Radio</div>
            <div style={{ fontSize:11, color:A.text2 }}>Administration</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:A.text3, padding:'8px 10px 4px' }}>Menu</div>
        {NAV_ITEMS.map(n => (
          <Link key={n.to} to={n.to} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', marginBottom:2, borderRadius:10, fontSize:14, fontWeight:500, textDecoration:'none', background:active(n.to)?A.blue:'transparent', color:active(n.to)?'#fff':A.text, transition:'all 0.15s' }}>
            <i className={`bi bi-${n.icon}`} style={{ fontSize:15, width:18, textAlign:'center' }} />
            {n.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding:'12px 8px', borderTop:`1px solid ${A.border}` }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:10, fontSize:14, fontWeight:500, textDecoration:'none', color:A.text2 }}>
          <i className="bi bi-house" style={{ fontSize:15 }} />Retour au site
        </Link>
      </div>
    </aside>
  );
};

// ── Layout wrapper ────────────────────────────────────────────────────────────
export const AppleLayout = ({ title, subtitle, actions, children }) => (
  <div style={{ fontFamily:A.font, background:A.bg, minHeight:'100vh', display:'flex', color:A.text }}>
    <AppleSidebar />
    <main style={{ flex:1, overflow:'auto' }}>
      <div style={{ padding:'24px 32px 20px', background:'rgba(255,255,255,0.8)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${A.border}`, position:'sticky', top:0, zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', margin:'0 0 2px', color:A.text }}>{title}</h1>
          <p style={{ fontSize:13, color:A.text2, margin:0 }}>{subtitle}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>{actions}</div>
      </div>
      <div style={{ padding:'28px 32px' }}>{children}</div>
    </main>
  </div>
);

// ── Card ──────────────────────────────────────────────────────────────────────
export const AppleCard = ({ children, style={}, p }) => (
  <div style={{ background:'#fff', border:`1px solid ${A.border}`, borderRadius:16, boxShadow:A.shadow, overflow:'hidden', ...(p?{padding:p}:{}), ...style }}>
    {children}
  </div>
);

export const CardHeader = ({ title, right }) => (
  <div style={{ padding:'18px 20px 14px', borderBottom:`1px solid ${A.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
    <span style={{ fontSize:15, fontWeight:600, color:A.text }}>{title}</span>
    <div>{right}</div>
  </div>
);

export const CardBody = ({ children, style={} }) => (
  <div style={{ padding:20, ...style }}>{children}</div>
);

// ── Button ────────────────────────────────────────────────────────────────────
export const AppleBtn = ({ onClick, variant='primary', children, disabled, type='button', style={}, as }) => {
  const base = { display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, fontSize:14, fontWeight:500, border:'none', cursor:'pointer', transition:'all 0.15s', textDecoration:'none', whiteSpace:'nowrap', ...style };
  const v = {
    primary: { background:A.blue, color:'#fff' },
    ghost:   { background:'rgba(0,0,0,0.06)', color:A.text },
    danger:  { background:'rgba(255,59,48,0.1)', color:A.red },
    success: { background:'rgba(52,199,89,0.1)', color:'#1a7a2e' },
    outline: { background:'transparent', color:A.text, border:`1px solid ${A.borderStrong}` },
  };
  if (as === 'link') return null; // handled separately
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...v[variant]||v.primary, opacity:disabled?0.45:1 }}>
      {children}
    </button>
  );
};

export const AppleLinkBtn = ({ to, children, variant='ghost', style={} }) => {
  const v = {
    primary: { background:A.blue, color:'#fff' },
    ghost:   { background:'rgba(0,0,0,0.06)', color:A.text },
  };
  return (
    <Link to={to} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, fontSize:14, fontWeight:500, textDecoration:'none', transition:'all 0.15s', ...v[variant], ...style }}>
      {children}
    </Link>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
export const AppleBadge = ({ variant='gray', children }) => {
  const v = {
    green:  { bg:'rgba(52,199,89,0.12)',  color:'#1d8833' },
    red:    { bg:'rgba(255,59,48,0.1)',   color:'#cc2200' },
    blue:   { bg:'rgba(0,113,227,0.1)',   color:'#0055b3' },
    orange: { bg:'rgba(255,149,0,0.12)', color:'#c07000' },
    gray:   { bg:A.surface3,             color:A.text2    },
    purple: { bg:'rgba(175,82,222,0.1)', color:'#7b3db5' },
  };
  const s = v[variant]||v.gray;
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:100, fontSize:12, fontWeight:500, background:s.bg, color:s.color }}>{children}</span>;
};

// ── Table ─────────────────────────────────────────────────────────────────────
export const AppleTable = ({ cols, children }) => (
  <div style={{ overflowX:'auto' }}>
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr>
          {cols.map((c,i) => (
            <th key={i} style={{ background:A.bg, padding:'10px 16px', fontSize:11, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:A.text2, borderBottom:`1px solid ${A.border}`, textAlign:'left', whiteSpace:'nowrap', width:c.w||undefined }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const AppleTr = ({ children, onClick }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <tr style={{ borderBottom:`1px solid ${A.border}`, background:hov?A.bg:'transparent', transition:'background 0.12s', cursor:onClick?'pointer':'default' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}>
      {children}
    </tr>
  );
};

export const AppleTd = ({ children, style={} }) => (
  <td style={{ padding:'12px 16px', fontSize:14, color:A.text, verticalAlign:'middle', ...style }}>{children}</td>
);

// ── Thumb ─────────────────────────────────────────────────────────────────────
export const AppleThumb = ({ src, alt, size=52, radius=8 }) => (
  <img src={src||'/images/default-cover.png'} alt={alt} onError={e => { e.target.src='/images/default-cover.png'; }}
    style={{ width:size, height:size, objectFit:'cover', borderRadius:radius, display:'block', background:A.surface3 }} />
);

// ── Input ─────────────────────────────────────────────────────────────────────
export const AppleInput = ({ value, onChange, name, placeholder, type='text', required, min, max, rows, ...rest }) => {
  const s = { width:'100%', padding:'9px 13px', background:A.bg, border:`1px solid ${A.borderStrong}`, borderRadius:10, fontSize:14, color:A.text, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' };
  const [foc, setFoc] = React.useState(false);
  const focStyle = foc ? { borderColor:A.blue, boxShadow:`0 0 0 3px rgba(0,113,227,0.15)`, background:'#fff' } : {};
  if (rows) return <textarea value={value} onChange={onChange} name={name} placeholder={placeholder} required={required} rows={rows} {...rest} style={{ ...s, ...focStyle, resize:'vertical' }} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} />;
  return <input type={type} value={value} onChange={onChange} name={name} placeholder={placeholder} required={required} min={min} max={max} {...rest} style={{ ...s, ...focStyle }} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} />;
};

export const AppleSelect = ({ value, onChange, name, children, required }) => {
  const [foc, setFoc] = React.useState(false);
  return (
    <select value={value} onChange={onChange} name={name} required={required}
      style={{ width:'100%', padding:'9px 13px', background:foc?'#fff':A.bg, border:`1px solid ${foc?A.blue:A.borderStrong}`, borderRadius:10, fontSize:14, color:A.text, outline:'none', fontFamily:'inherit', boxSizing:'border-box', cursor:'pointer', boxShadow:foc?`0 0 0 3px rgba(0,113,227,0.15)`:'none' }}
      onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}>
      {children}
    </select>
  );
};

export const AppleLabel = ({ children, required }) => (
  <label style={{ display:'block', fontSize:13, fontWeight:500, color:A.text2, marginBottom:6 }}>
    {children}{required && <span style={{ color:A.red, marginLeft:2 }}>*</span>}
  </label>
);

export const AppleFormGroup = ({ label, required, hint, children, style={} }) => (
  <div style={{ marginBottom:16, ...style }}>
    {label && <AppleLabel required={required}>{label}</AppleLabel>}
    {children}
    {hint && <p style={{ fontSize:12, color:A.text3, marginTop:5, marginBottom:0 }}>{hint}</p>}
  </div>
);

// ── Toggle ────────────────────────────────────────────────────────────────────
export const AppleToggle = ({ checked, onChange, label }) => (
  <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
    <div style={{ position:'relative', width:44, height:26, flexShrink:0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity:0, width:0, height:0, position:'absolute' }} />
      <div style={{ position:'absolute', inset:0, background:checked?A.green:A.surface3, borderRadius:26, transition:`0.2s`, cursor:'pointer' }} onClick={onChange}>
        <div style={{ position:'absolute', width:20, height:20, borderRadius:'50%', background:'#fff', top:3, left:checked?21:3, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
    {label && <span style={{ fontSize:14, color:A.text }}>{label}</span>}
  </label>
);

// ── Alert ─────────────────────────────────────────────────────────────────────
export const AppleAlert = ({ type='info', children, onClose }) => {
  const v = {
    info:    { bg:'rgba(0,113,227,0.08)',  color:'#0055b3', icon:'info-circle-fill'  },
    danger:  { bg:'rgba(255,59,48,0.08)',  color:'#cc2200', icon:'exclamation-circle-fill' },
    success: { bg:'rgba(52,199,89,0.1)',   color:'#1d7a32', icon:'check-circle-fill' },
    warning: { bg:'rgba(255,149,0,0.1)',   color:'#c07000', icon:'exclamation-triangle-fill' },
  };
  const s = v[type]||v.info;
  return (
    <div style={{ padding:'12px 16px', borderRadius:10, background:s.bg, color:s.color, fontSize:14, display:'flex', alignItems:'flex-start', gap:10, marginBottom:16 }}>
      <i className={`bi bi-${s.icon}`} style={{ flexShrink:0, marginTop:1 }} />
      <div style={{ flex:1 }}>{children}</div>
      {onClose && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:s.color, fontSize:16, lineHeight:1, padding:0 }}>×</button>}
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
export const AppleEmpty = ({ icon, title, description, action }) => (
  <div style={{ textAlign:'center', padding:'64px 32px' }}>
    <div style={{ width:64, height:64, borderRadius:16, background:A.surface3, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:28, color:A.text3, marginBottom:16 }}>
      <i className={`bi bi-${icon}`} />
    </div>
    <h5 style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>{title}</h5>
    {description && <p style={{ fontSize:13, color:A.text2, marginBottom:20 }}>{description}</p>}
    {action}
  </div>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
export const AppleSpinner = ({ label='Chargement...' }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 32px', gap:12 }}>
    <Spinner animation="border" style={{ color:A.blue, width:28, height:28 }} />
    <p style={{ fontSize:13, color:A.text2, margin:0 }}>{label}</p>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export const AppleModal = ({ show, onHide, title, size, footer, children }) => {
  if (!show) return null;
  const widths = { sm:400, md:560, lg:720, xl:900 };
  const w = widths[size]||widths.md;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, backdropFilter:'blur(4px)', padding:16 }} onClick={onHide}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:w, boxShadow:'0 24px 64px rgba(0,0,0,0.2)', overflow:'hidden', maxHeight:'90vh', display:'flex', flexDirection:'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${A.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontSize:17, fontWeight:600, color:A.text }}>{title}</span>
          <button onClick={onHide} style={{ background:'rgba(0,0,0,0.06)', border:'none', width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:17, color:A.text2, lineHeight:1 }}>×</button>
        </div>
        <div style={{ overflowY:'auto', flex:1, padding:24, background:A.bg }}>{children}</div>
        {footer && (
          <div style={{ padding:'16px 24px', background:'#fff', borderTop:`1px solid ${A.border}`, display:'flex', justifyContent:'flex-end', gap:10, flexShrink:0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ── File Upload Field ─────────────────────────────────────────────────────────
export const AppleFileInput = ({ label, accept, onChange, preview, previewSrc, hint, type='image' }) => (
  <AppleFormGroup label={label} hint={hint}>
    <input type="file" accept={accept} onChange={onChange}
      style={{ width:'100%', padding:'9px 13px', background:A.bg, border:`1px solid ${A.borderStrong}`, borderRadius:10, fontSize:14, color:A.text, outline:'none', boxSizing:'border-box' }}
    />
    {preview && (
      <div style={{ marginTop:10 }}>
        {type==='image' ? (
          <img src={preview} alt="preview" style={{ maxWidth:'100%', maxHeight:180, borderRadius:10, objectFit:'cover', border:`1px solid ${A.border}` }} />
        ) : (
          <audio controls src={preview} style={{ width:'100%', marginTop:4 }} />
        )}
      </div>
    )}
    {!preview && previewSrc && (
      <div style={{ marginTop:10 }}>
        <p style={{ fontSize:12, color:A.text3, margin:'0 0 6px' }}>Actuel :</p>
        {type==='image'
          ? <img src={previewSrc} alt="current" style={{ width:100, height:100, objectFit:'cover', borderRadius:8, border:`1px solid ${A.border}` }} />
          : <audio controls src={previewSrc} style={{ width:'100%' }} />
        }
      </div>
    )}
  </AppleFormGroup>
);

// ── Image + URL combo ─────────────────────────────────────────────────────────
export const AppleImageUpload = ({ label='Image', onFileChange, preview, previewSrc, urlValue, onUrlChange, urlName, hint }) => (
  <div style={{ marginBottom:20 }}>
    <AppleLabel>{label}</AppleLabel>
    <input type="file" accept="image/*" onChange={onFileChange}
      style={{ width:'100%', padding:'9px 13px', background:A.bg, border:`1px solid ${A.borderStrong}`, borderRadius:10, fontSize:14, color:A.text, outline:'none', boxSizing:'border-box', marginBottom:8 }}
    />
    {(preview || previewSrc) && (
      <img src={preview||previewSrc} alt="preview" onError={e => { e.target.src='/images/default-cover.png'; }}
        style={{ width:'100%', maxHeight:180, borderRadius:10, objectFit:'cover', marginBottom:8, border:`1px solid ${A.border}` }} />
    )}
    <AppleInput value={urlValue} onChange={onUrlChange} name={urlName} placeholder="Ou entrez une URL directement" />
    {hint && <p style={{ fontSize:12, color:A.text3, marginTop:5, marginBottom:0 }}>{hint}</p>}
  </div>
);

// ── Search bar ────────────────────────────────────────────────────────────────
export const AppleSearch = ({ value, onChange, placeholder='Rechercher…', onClear }) => {
  const [foc, setFoc] = React.useState(false);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, background:foc?'#fff':A.bg, border:`1px solid ${foc?A.blue:A.borderStrong}`, borderRadius:10, padding:'7px 12px', transition:'all 0.15s', boxShadow:foc?`0 0 0 3px rgba(0,113,227,0.15)`:'none', minWidth:200 }}>
      <i className="bi bi-search" style={{ color:A.text3, fontSize:13, flexShrink:0 }} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ border:'none', background:'transparent', outline:'none', fontSize:14, color:A.text, width:'100%', fontFamily:'inherit' }}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
      />
      {value && onClear && (
        <button onClick={onClear} style={{ background:'none', border:'none', cursor:'pointer', color:A.text3, fontSize:16, lineHeight:1, padding:0, flexShrink:0 }}>×</button>
      )}
    </div>
  );
};

export default { A, NAV_ITEMS, AppleSidebar, AppleLayout, AppleCard, CardHeader, CardBody, AppleBtn, AppleLinkBtn, AppleBadge, AppleTable, AppleTr, AppleTd, AppleThumb, AppleInput, AppleSelect, AppleLabel, AppleFormGroup, AppleToggle, AppleAlert, AppleEmpty, AppleSpinner, AppleModal, AppleFileInput, AppleImageUpload, AppleSearch };