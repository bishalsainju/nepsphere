// Nepsphere video scenes — uses Stage, Sprite, useSprite from animations.jsx
// 60s walkthrough, screen-recording feel, captions, Devanagari open/close.

const { useMemo: vmemo } = React;

// ── Tap dot ────────────────────────────────────────────────────────────────
function TapDot({ x, y, at, size = 56 }) {
  const { time } = useTimeline();
  const local = time - at;
  if (local < -0.05 || local > 0.7) return null;
  const t = Math.max(0, Math.min(1, (local + 0.05) / 0.55));
  const scale = 0.6 + t * 1.2;
  const opacity = local < 0 ? 0 : 1 - t;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%,-50%) scale(${scale})`,
      width: size, height: size, borderRadius: '50%',
      border: '4px solid #EA580C', opacity, pointerEvents: 'none',
      boxShadow: '0 0 0 2px rgba(234,88,12,0.15)',
    }}/>
  );
}

// ── Caption strip (always-on at bottom of stage) ───────────────────────────
function Caption({ text, start, end, vertical = false }) {
  const { time } = useTimeline();
  const inAt = 0.25, outAt = 0.25;
  if (time < start - 0.1 || time > end + 0.1) return null;
  const local = time - start;
  const dur = end - start;
  let opacity = 1;
  if (local < inAt) opacity = local / inAt;
  else if (local > dur - outAt) opacity = (dur - local) / outAt;
  opacity = Math.max(0, Math.min(1, opacity));

  const w = vertical ? 980 : 1600;
  const stageW = vertical ? 1080 : 1920;
  const stageH = vertical ? 1920 : 1080;

  return (
    <div style={{
      position: 'absolute',
      left: '50%', bottom: vertical ? 140 : 80,
      transform: 'translateX(-50%)',
      width: w, maxWidth: '90%',
      textAlign: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
      fontSize: vertical ? 52 : 56,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      color: '#FAFAF7',
      opacity,
      textShadow: '0 4px 24px rgba(0,0,0,0.5)',
    }}>{text}</div>
  );
}

// ── Browser / phone frame ──────────────────────────────────────────────────
function Frame({ vertical, children, scaleAt = 0, kenBurns = true }) {
  const { time } = useTimeline();
  const t = Math.max(0, time - scaleAt);
  const scale = kenBurns ? 1 + t * 0.008 : 1;
  const w = vertical ? 900 : 1500;
  const h = vertical ? 1480 : 900;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: vertical ? 240 : 90,
      transform: `translateX(-50%) scale(${scale})`,
      transformOrigin: 'center top',
      width: w, height: h,
      background: '#FFF', borderRadius: 24,
      border: '1px solid #E7DFD3',
      boxShadow: '0 60px 120px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)',
      overflow: 'hidden',
    }}>{children}</div>
  );
}

function MockChrome({ url }) {
  return (
    <div style={{
      height: 44, background: '#F2EBDD', borderBottom: '1px solid #E7DFD3',
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
    }}>
      <div style={{width:14,height:14,borderRadius:'50%',background:'#FF5F57'}}/>
      <div style={{width:14,height:14,borderRadius:'50%',background:'#FEBC2E'}}/>
      <div style={{width:14,height:14,borderRadius:'50%',background:'#28C840'}}/>
      <div style={{
        marginLeft:18, flex:1, height:26, background:'#FFF', borderRadius:8,
        display:'flex', alignItems:'center', padding:'0 14px',
        fontSize: 14, color:'#A39B8E', fontFamily:'ui-monospace, monospace',
      }}>{url}</div>
    </div>
  );
}

function NavBar({ active }) {
  const tab = (k, label) => (
    <span style={{
      fontSize: 18, padding: '8px 16px', borderRadius: 10,
      background: active === k ? '#FFF7ED' : 'transparent',
      color: active === k ? '#EA580C' : '#7B7468',
      fontWeight: active === k ? 700 : 500,
    }}>{label}</span>
  );
  return (
    <div style={{
      padding: '14px 28px', borderBottom: '1px solid #EFE9DC',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <svg width="36" height="36" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#1E3A8A"/><circle cx="32" cy="32" r="26" fill="#FAFAF7"/><path d="M10 44 L22 24 L29 34 L38 18 L54 44 Z" fill="#1E3A8A"/><circle cx="42" cy="22" r="5" fill="#DC2626"/></svg>
        <span style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:22}}>Nepsphere</span>
      </div>
      <div style={{display:'flex', gap:4, marginLeft:12}}>
        {tab('community','Community')}{tab('rooms','Rooms')}{tab('connect','Connect')}{tab('jobs','Jobs')}
      </div>
      <div style={{marginLeft:'auto', width:40, height:40, borderRadius:'50%',
        background:'linear-gradient(135deg,#FED7AA,#EA580C)'}}/>
    </div>
  );
}

function GeoBar({ active }) {
  const chip = (k, label) => (
    <span style={{
      padding:'8px 14px', borderRadius:10,
      background: active === k ? '#EA580C' : '#F2EBDD',
      color: active === k ? '#FFF' : '#3A3530',
      fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{label}</span>
  );
  return (
    <div style={{padding:'12px 28px', display:'flex', gap:8, alignItems:'center', borderBottom:'1px solid #EFE9DC'}}>
      {chip('dallas','📍 Dallas')}<span style={{color:'#A39B8E'}}>›</span>
      {chip('usa','🇺🇸 USA')}<span style={{color:'#A39B8E'}}>›</span>
      {chip('global','🌐 Global')}
      <span style={{marginLeft:'auto', fontSize:15, color:'#A39B8E'}}>2,847 members</span>
    </div>
  );
}

Object.assign(window, { TapDot, Caption, Frame, MockChrome, NavBar, GeoBar });
