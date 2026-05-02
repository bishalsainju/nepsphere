// Nepsphere video scenes — composed inside the main HTML's <Stage>.
// Total duration: 60s. Scene breakdown:
//   0-5    Open: Devanagari namaste + logo
//   5-13   Community feed
//   13-21  Rooms
//   21-31  Connect (3 intents)
//   31-39  Jobs
//   39-46  Verified (orange check)
//   46-52  Built with you / Free
//   52-60  Close: dhanyabad + URL

// ── Scene 1: Open ─────────────────────────────────────────────────────────
function SceneOpen({ vertical }) {
  const stageW = vertical ? 1080 : 1920;
  const stageH = vertical ? 1920 : 1080;
  return (
    <Sprite start={0} end={5}>
      {({ progress, localTime }) => {
        const fadeIn = Math.min(1, localTime / 0.6);
        const fadeOut = localTime > 4.2 ? Math.max(0, 1 - (localTime - 4.2) / 0.8) : 1;
        const opacity = fadeIn * fadeOut;
        const scale = 1 + progress * 0.04;
        return (
          <div style={{
            position:'absolute', inset:0,
            background:'#0F0F0E',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            opacity,
          }}>
            <div style={{
              position:'absolute', inset:0,
              backgroundImage:'url(../assets/topo-pattern.svg)', backgroundSize:'600px',
              opacity: 0.07,
            }}/>
            <div style={{
              fontFamily:"'Noto Sans Devanagari', sans-serif",
              fontSize: vertical ? 200 : 240, color:'#FBBF24', fontWeight:700,
              transform:`scale(${scale})`, lineHeight: 1,
            }}>नमस्ते</div>
            <div style={{
              marginTop: 40, fontFamily:"'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: vertical ? 64 : 80, color:'#FAFAF7',
              letterSpacing:'-0.03em',
            }}>Nepsphere</div>
            <div style={{
              marginTop: 16, fontSize: vertical ? 30 : 36, color:'rgba(250,246,239,0.6)',
              fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight: 500,
            }}>A home for our community online.</div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Scene 2: Community ────────────────────────────────────────────────────
function SceneCommunity({ vertical }) {
  return (
    <Sprite start={5} end={13}>
      {({ localTime }) => (
        <>
          <div style={{position:'absolute', inset:0, background:'#FAF6EE'}}/>
          <Frame vertical={vertical} scaleAt={5} kenBurns={true}>
            <MockChrome url="nepsphere.com/community"/>
            <NavBar active="community"/>
            <GeoBar active="dallas"/>
            <div style={{padding: 22, display:'flex', flexDirection:'column', gap:14}}>
              <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize: 30}}>Community · Dallas</div>
              {/* Post 1 — slide in */}
              {[
                { t:0,    name:'Priya Shrestha', cat:'🏠 Housing', title:'Roommate wanted — Plano, walks to DART',
                  body:'2BR/2BA · $850 · vegetarian-friendly · grad student preferred', av:'linear-gradient(135deg,#FED7AA,#EA580C)', verified:true },
                { t:1.5,  name:'Ramesh Bhattarai', cat:'🎉 Events', title:'Dashain dinner — Saturday at Klyde Warren',
                  body:'Bringing momos and sel roti. Anyone want to join? 6pm.', av:'linear-gradient(135deg,#FBBF24,#B45309)', verified:true },
                { t:3,    name:'Sneha Adhikari',   cat:'🚗 Rideshare', title:'Driving DFW → Houston this Friday',
                  body:'Two seats open. Splitting gas. Leaving 8am.', av:'linear-gradient(135deg,#BBF7D0,#0E9F6E)', verified:true },
              ].map((p, i) => {
                const enter = Math.max(0, Math.min(1, (localTime - p.t) / 0.45));
                return (
                  <div key={i} style={{
                    background:'#FFF', border:'1px solid #E7DFD3', borderRadius:14, padding:18,
                    display:'flex', flexDirection:'column', gap:10,
                    opacity: enter, transform: `translateY(${(1-enter)*20}px)`,
                  }}>
                    <div style={{display:'flex', gap:12, alignItems:'center'}}>
                      <div style={{width:42, height:42, borderRadius:'50%', background:p.av}}/>
                      <div>
                        <div style={{fontWeight:600, fontSize:17, display:'flex', gap:6, alignItems:'center'}}>{p.name}
                          {p.verified && <span style={{color:'#DC2626', fontSize:14}}>✓</span>}
                        </div>
                        <div style={{fontSize:13, color:'#A39B8E'}}>{p.cat} · just now</div>
                      </div>
                    </div>
                    <div style={{fontWeight:700, fontSize:18}}>{p.title}</div>
                    <div style={{fontSize:15, color:'#564F46', lineHeight:1.5}}>{p.body}</div>
                  </div>
                );
              })}
            </div>
          </Frame>
          <TapDot at={6.5} x={vertical?540:850} y={vertical?900:560}/>
          <Caption text="A feed organized by category" start={5.4} end={9} vertical={vertical}/>
          <Caption text="Verified community members get a check" start={9.2} end={13} vertical={vertical}/>
        </>
      )}
    </Sprite>
  );
}

// ── Scene 3: Rooms ────────────────────────────────────────────────────────
function SceneRooms({ vertical }) {
  const rooms = [
    { name:'Dallas-Fort Worth', tag:'Cities', count:'847', tagColor:'#EA580C' },
    { name:'F1 students',       tag:'Life stage', count:'312', tagColor:'#DC2626' },
    { name:'Aamaa group',       tag:'Life stage', count:'156', tagColor:'#0E9F6E' },
    { name:'Foodies',           tag:'Interest',   count:'203', tagColor:'#B45309' },
  ];
  return (
    <Sprite start={13} end={21}>
      {({ localTime }) => (
        <>
          <div style={{position:'absolute', inset:0, background:'#FAF6EE'}}/>
          <Frame vertical={vertical} scaleAt={13} kenBurns={true}>
            <MockChrome url="nepsphere.com/rooms"/>
            <NavBar active="rooms"/>
            <GeoBar active="dallas"/>
            <div style={{padding: 28}}>
              <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:30, marginBottom:20}}>Rooms · Dallas</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
                {rooms.map((r, i) => {
                  const enter = Math.max(0, Math.min(1, (localTime - 0.4 - i*0.35) / 0.45));
                  return (
                    <div key={i} style={{
                      background:'#FFF', border:'1px solid #E7DFD3', borderRadius:18, padding:24,
                      display:'flex', flexDirection:'column', gap:10,
                      opacity: enter, transform:`translateY(${(1-enter)*24}px)`,
                    }}>
                      <div style={{fontSize:13, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:r.tagColor}}>{r.tag}</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:24}}>{r.name}</div>
                      <div style={{display:'flex', gap:6, alignItems:'center'}}>
                        <div style={{width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#FED7AA,#EA580C)', border:'2px solid #FFF'}}/>
                        <div style={{width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#FBBF24,#B45309)', border:'2px solid #FFF', marginLeft:-8}}/>
                        <div style={{width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#FECACA,#DC2626)', border:'2px solid #FFF', marginLeft:-8}}/>
                        <span style={{marginLeft:6, fontSize:14, color:'#A39B8E'}}>{r.count} members</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Frame>
          <TapDot at={15} x={vertical?540:740} y={vertical?1080:640}/>
          <Caption text="Rooms — find the people most like you" start={13.4} end={17} vertical={vertical}/>
          <Caption text="By city, life stage, or interest" start={17.2} end={21} vertical={vertical}/>
        </>
      )}
    </Sprite>
  );
}

// ── Scene 4: Connect (3 intents) ──────────────────────────────────────────
function SceneConnect({ vertical }) {
  const intents = [
    { name:'Friendship', color:'#3B82F6', bg:'#DBEAFE', tag:'Friendship', desc:'Make a chai friend.' },
    { name:'Dating',     color:'#E31C5F', bg:'#FECACA', tag:'Dating',     desc:'Meet someone real.' },
    { name:'Marriage',   color:'#0E9F6E', bg:'#BBF7D0', tag:'Marriage',   desc:'For something serious.' },
  ];
  return (
    <Sprite start={21} end={31}>
      {({ localTime }) => (
        <>
          <div style={{position:'absolute', inset:0, background:'#FAF6EE'}}/>
          <Frame vertical={vertical} scaleAt={21} kenBurns={false}>
            <MockChrome url="nepsphere.com/connect"/>
            <NavBar active="connect"/>
            <div style={{padding: 32}}>
              <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:30, marginBottom:8}}>Connect</div>
              <div style={{fontSize:16, color:'#A39B8E', marginBottom:24}}>What are you looking for?</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18}}>
                {intents.map((it, i) => {
                  const enter = Math.max(0, Math.min(1, (localTime - 0.3 - i*0.35) / 0.5));
                  const highlight = localTime > 3.2 + i*0.6 && localTime < 3.8 + i*0.6;
                  const lift = highlight ? -8 : 0;
                  return (
                    <div key={i} style={{
                      borderRadius: 18, overflow:'hidden',
                      border: `3px solid ${it.color}`,
                      opacity: enter,
                      transform: `translateY(${(1-enter)*24 + lift}px)`,
                      transition: 'transform 0.3s',
                      boxShadow: highlight ? `0 20px 40px ${it.color}40` : '0 4px 16px rgba(0,0,0,0.06)',
                    }}>
                      <div style={{height:140, background:`linear-gradient(135deg,${it.bg},${it.color})`, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <div style={{background:it.color, color:'#FFF', padding:'8px 18px', borderRadius:9999, fontWeight:700, fontSize:18}}>{it.tag}</div>
                      </div>
                      <div style={{padding:24, background:'#FFF'}}>
                        <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:22}}>{it.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Frame>
          <Caption text="Three intents. Never confused." start={21.4} end={25.5} vertical={vertical}/>
          <Caption text="Friendship · Dating · Marriage — clearly separated" start={25.7} end={31} vertical={vertical}/>
        </>
      )}
    </Sprite>
  );
}

// ── Scene 5: Jobs ─────────────────────────────────────────────────────────
function SceneJobs({ vertical }) {
  const jobs = [
    { title:'Backend engineer', co:'Coalbase · Dallas', salary:'$140k–180k', sponsor:true,  initials:'CB', color:'#EA580C', poster:'Bibek K.' },
    { title:'Part-time delivery (weekends)', co:'Local restaurant · Irving', salary:'$22/hr + tips', sponsor:false, initials:'LR', color:'#0E9F6E', poster:'Anita S.' },
    { title:'Senior data analyst', co:'Toyota Connected · Plano', salary:'$110k–135k', sponsor:true, initials:'TC', color:'#1E3A8A', poster:null },
  ];
  return (
    <Sprite start={31} end={39}>
      {({ localTime }) => (
        <>
          <div style={{position:'absolute', inset:0, background:'#0F0F0E'}}/>
          <Frame vertical={vertical} scaleAt={31} kenBurns={true}>
            <MockChrome url="nepsphere.com/jobs"/>
            <NavBar active="jobs"/>
            <GeoBar active="dallas"/>
            <div style={{padding: 22, display:'flex', flexDirection:'column', gap:14}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:28}}>Jobs · Dallas</div>
                <span style={{padding:'6px 14px', background:'#FEE2E2', color:'#991B1B', borderRadius:9999, fontSize:14, fontWeight:600}}>Sponsorship ✓</span>
              </div>
              {jobs.map((j, i) => {
                const enter = Math.max(0, Math.min(1, (localTime - 0.4 - i*0.45) / 0.5));
                return (
                  <div key={i} style={{
                    background:'#FFF', border:'1px solid #E7DFD3', borderRadius:14, padding:18,
                    display:'flex', flexDirection:'column', gap:10,
                    opacity: enter, transform:`translateY(${(1-enter)*22}px)`,
                  }}>
                    <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
                      <div style={{width:48, height:48, borderRadius:12, background:j.color, color:'#FFF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16}}>{j.initials}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700, fontSize:18}}>{j.title}</div>
                        <div style={{fontSize:14, color:'#A39B8E'}}>{j.co}</div>
                      </div>
                      {j.sponsor && <span style={{background:'#FEE2E2', color:'#991B1B', padding:'4px 10px', borderRadius:9999, fontSize:12, fontWeight:700}}>Sponsorship</span>}
                    </div>
                    <div style={{display:'flex', gap:12, fontSize:13, color:'#A39B8E', alignItems:'center'}}>
                      <span style={{fontWeight:700, color:'#1A1714'}}>{j.salary}</span>
                      {j.poster && <><span>·</span><span>posted by {j.poster}</span></>}
                      <span style={{marginLeft:'auto', background:'#EA580C', color:'#FFF', padding:'6px 14px', borderRadius:8, fontSize:13, fontWeight:600}}>Apply →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Frame>
          <Caption text="Jobs — including visa-sponsored roles" start={31.4} end={35} vertical={vertical}/>
          <Caption text="Posted by people in your community" start={35.2} end={39} vertical={vertical}/>
        </>
      )}
    </Sprite>
  );
}

// ── Scene 6: Verified ─────────────────────────────────────────────────────
function SceneVerified({ vertical }) {
  return (
    <Sprite start={39} end={46}>
      {({ localTime }) => {
        const checkScale = localTime > 1.2 ? 1 : Math.max(0, (localTime - 0.5) / 0.7);
        const checkBounce = checkScale * (1 + Math.sin(checkScale * Math.PI) * 0.4);
        return (
          <>
            <div style={{position:'absolute', inset:0, background:'#FAF6EE'}}/>
            <div style={{
              position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-58%)',
              background:'#FFF', borderRadius: 28, padding: vertical ? 56 : 64,
              boxShadow: '0 30px 80px rgba(0,0,0,0.12)',
              display:'flex', flexDirection:'column', alignItems:'center', gap: 20,
              width: vertical ? 720 : 560,
            }}>
              <div style={{position:'relative', width:160, height:160}}>
                <div style={{width:160, height:160, borderRadius:'50%', background:'linear-gradient(135deg,#FED7AA,#EA580C)'}}/>
                <div style={{
                  position:'absolute', bottom:-6, right:-6,
                  width:64, height:64, borderRadius:'50%',
                  background:'#EA580C', border:'8px solid #FFF',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#FFF', fontSize:30, fontWeight:900,
                  transform: `scale(${checkBounce})`,
                }}>✓</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:36}}>Priya Shrestha</div>
                <div style={{fontSize:18, color:'#A39B8E', marginTop:4}}>Plano · MS in CS, UTD</div>
              </div>
              <div style={{
                background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:12,
                padding:'14px 24px', display:'flex', gap:10, alignItems:'center',
              }}>
                <span style={{color:'#EA580C', fontWeight:800, fontSize:18}}>✓</span>
                <span style={{fontSize:18, fontWeight:600, color:'#9A3412'}}>Verified · 12 Apr 2026</span>
              </div>
            </div>
            <Caption text="Every member is verified" start={39.4} end={42.5} vertical={vertical}/>
            <Caption text="Government ID + selfie. The orange check means a real person." start={42.7} end={46} vertical={vertical}/>
          </>
        );
      }}
    </Sprite>
  );
}

// ── Scene 7: Free + Built with you ────────────────────────────────────────
function SceneValues({ vertical }) {
  return (
    <Sprite start={46} end={52}>
      {({ localTime }) => {
        const items = [
          { label: 'Posting · joining rooms · messaging' },
          { label: 'Verification' },
          { label: 'Posting jobs and events' },
        ];
        return (
          <>
            <div style={{position:'absolute', inset:0, background:'#EA580C'}}/>
            <div style={{
              position:'absolute', inset: 0,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap: 28, padding: vertical ? '0 80px' : '0 200px',
            }}>
              <div style={{
                fontFamily:"'Plus Jakarta Sans'", fontWeight:800,
                fontSize: vertical ? 96 : 128, color:'#FFF',
                letterSpacing:'-0.03em', lineHeight: 0.95, textAlign:'center',
              }}>Free, forever.<br/>For the basics.</div>
              <div style={{display:'flex', flexDirection:'column', gap:14, marginTop: 24, width:'100%', maxWidth: 700}}>
                {items.map((it, i) => {
                  const enter = Math.max(0, Math.min(1, (localTime - 0.6 - i*0.4) / 0.5));
                  return (
                    <div key={i} style={{
                      background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
                      borderRadius: 14, padding: '18px 24px',
                      display:'flex', alignItems:'center', gap: 16,
                      opacity: enter, transform:`translateX(${(1-enter)*-30}px)`,
                    }}>
                      <span style={{
                        width:36, height:36, borderRadius:'50%', background:'#FFF',
                        color:'#EA580C', display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight:900, fontSize:18, flexShrink:0,
                      }}>✓</span>
                      <span style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:600, fontSize: vertical?22:24, color:'#FFF'}}>{it.label}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:16, fontSize: vertical?22:24, color:'rgba(255,255,255,0.85)', fontWeight:500}}>No ads. No selling your data.</div>
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ── Scene 8: Close ────────────────────────────────────────────────────────
function SceneClose({ vertical }) {
  return (
    <Sprite start={52} end={60}>
      {({ localTime }) => {
        const fadeIn = Math.min(1, localTime / 0.7);
        return (
          <>
            <div style={{position:'absolute', inset:0, background:'#0F0F0E'}}/>
            <div style={{position:'absolute', inset:0, backgroundImage:'url(../assets/topo-pattern.svg)', backgroundSize:'600px', opacity:0.07}}/>
            <div style={{position:'absolute', left:0, right:0, top:0, height: 10,
              background:'linear-gradient(to right, #1E3A8A 0 20%, #FAFAF7 20% 40%, #DC2626 40% 60%, #0E9F6E 60% 80%, #F59E0B 80% 100%)'}}/>
            <div style={{position:'absolute', left:0, right:0, bottom:0, height: 10,
              background:'linear-gradient(to right, #1E3A8A 0 20%, #FAFAF7 20% 40%, #DC2626 40% 60%, #0E9F6E 60% 80%, #F59E0B 80% 100%)'}}/>
            <div style={{
              position:'absolute', inset:0,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap: 36, opacity: fadeIn,
            }}>
              <div style={{fontFamily:"'Noto Sans Devanagari', sans-serif", fontSize: vertical ? 140 : 180, color:'#FBBF24', fontWeight:700, lineHeight:1}}>धन्यवाद</div>
              <div style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize: vertical ? 110 : 160, color:'#FAFAF7', letterSpacing:'-0.03em', lineHeight: 1}}>Dhanyabad.</div>
              <div style={{fontSize: vertical ? 30 : 36, color:'rgba(250,246,239,0.78)', textAlign:'center', maxWidth: 1100, fontFamily:"'Plus Jakarta Sans'"}}>
                Built with love by Nepalis, for Nepalis.
              </div>
              <div style={{display:'flex', gap:18, marginTop: 24, flexWrap:'wrap', justifyContent:'center'}}>
                <span style={{background:'#EA580C', color:'#FFF', padding:'18px 32px', borderRadius:12, fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize: vertical?24:26}}>nepsphere.com/dallas</span>
                <span style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.2)', color:'#FAFAF7', padding:'18px 32px', borderRadius:12, fontFamily:"'Plus Jakarta Sans'", fontWeight:600, fontSize: vertical?24:26}}>@nepsphere</span>
              </div>
              <div style={{marginTop: 28, display:'flex', alignItems:'center', gap:14}}>
                <svg width="48" height="48" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#1E3A8A"/><circle cx="32" cy="32" r="26" fill="#FAFAF7"/><path d="M10 44 L22 24 L29 34 L38 18 L54 44 Z" fill="#1E3A8A"/><circle cx="42" cy="22" r="5" fill="#DC2626"/></svg>
                <span style={{fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize: 32, color:'#FAFAF7'}}>Nepsphere</span>
              </div>
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, { SceneOpen, SceneCommunity, SceneRooms, SceneConnect, SceneJobs, SceneVerified, SceneValues, SceneClose });
