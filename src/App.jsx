import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PROXY CONFIG — paste your Vercel deployment URL here after deploying
// e.g. "https://rentalrev-proxy.vercel.app"
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_PROXY = "";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0D0F14; --surface:#141720; --surface2:#1C2030; --border:#252A3A;
    --text:#E8EAF0; --muted:#6B7280; --accent:#4F9EFF; --gold:#F5C842;
    --green:#34D399; --red:#F87171; --purple:#A78BFA;
  }
  body { font-family:'Outfit',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
  .shell { display:flex; min-height:100vh; }
  .sidebar { width:230px; min-width:230px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; padding:24px 0; }
  .logo { padding:0 20px 24px; border-bottom:1px solid var(--border); margin-bottom:16px; }
  .logo-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; }
  .logo-badge { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--accent); margin-top:2px; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:10px 20px; font-size:13px; font-weight:500; color:var(--muted); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all 0.15s; border-left:3px solid transparent; }
  .nav-item:hover { color:var(--text); background:var(--surface2); }
  .nav-item.active { color:var(--accent); border-left-color:var(--accent); background:rgba(79,158,255,0.07); }
  .nav-section { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--muted); padding:16px 20px 6px; }
  .sidebar-footer { margin-top:auto; padding:16px 20px; border-top:1px solid var(--border); }
  .api-status { font-size:11px; color:var(--muted); display:flex; align-items:center; gap:6px; }
  .dot { width:7px; height:7px; border-radius:50%; background:var(--green); box-shadow:0 0 6px var(--green); }
  .dot.red { background:var(--red); box-shadow:0 0 6px var(--red); }
  .dot.yellow { background:var(--gold); box-shadow:0 0 6px var(--gold); }
  .main { flex:1; overflow-y:auto; }
  .topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:16px 32px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
  .page-title { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; }
  .page-sub { font-size:12px; color:var(--muted); margin-top:1px; }
  .content { padding:28px 32px; }

  .connect-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); }
  .connect-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:36px 44px; width:540px; }
  .connect-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:700; margin-bottom:6px; text-align:center; }
  .connect-sub { font-size:13px; color:var(--muted); margin-bottom:24px; line-height:1.6; text-align:center; }
  .connect-input { width:100%; padding:11px 14px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; color:var(--text); font-family:'Outfit',sans-serif; font-size:14px; outline:none; transition:border-color 0.2s; margin-bottom:10px; }
  .connect-input:focus { border-color:var(--accent); }
  .connect-hint { font-size:11px; color:var(--muted); margin-bottom:18px; line-height:1.7; }
  .connect-hint a { color:var(--accent); text-decoration:none; }
  .connect-hint code { background:var(--surface2); padding:1px 5px; border-radius:3px; color:var(--gold); font-size:11px; }

  .setup-box { background:rgba(245,200,66,0.06); border:1px solid rgba(245,200,66,0.25); border-radius:10px; padding:16px 18px; margin-bottom:20px; }
  .setup-title { font-size:13px; font-weight:700; color:var(--gold); margin-bottom:10px; }
  .step { display:flex; gap:10px; align-items:flex-start; margin-bottom:8px; font-size:12px; color:var(--muted); line-height:1.6; }
  .step-num { width:20px; height:20px; min-width:20px; border-radius:50%; background:var(--gold); color:#1A1400; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; margin-top:1px; }
  .step code { background:var(--surface2); padding:1px 5px; border-radius:3px; color:var(--accent); font-size:11px; }

  .btn { padding:10px 20px; border-radius:8px; font-family:'Outfit',sans-serif; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s; }
  .btn-accent { background:var(--accent); color:#0D1B2E; }
  .btn-accent:hover { background:#6AABFF; }
  .btn-accent:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-ghost { background:transparent; border:1px solid var(--border); color:var(--muted); }
  .btn-ghost:hover { border-color:var(--text); color:var(--text); }
  .btn-danger { background:rgba(248,113,113,0.12); border:1px solid var(--red); color:var(--red); }
  .btn-green { background:rgba(52,211,153,0.12); border:1px solid var(--green); color:var(--green); }
  .btn-sm { padding:6px 13px; font-size:12px; }
  .btn-full { width:100%; }

  .stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px 22px; position:relative; overflow:hidden; }
  .stat-glow { position:absolute; top:-20px; right:-20px; width:80px; height:80px; border-radius:50%; opacity:0.12; filter:blur(20px); }
  .stat-label { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
  .stat-value { font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:700; line-height:1; }
  .stat-delta { font-size:12px; margin-top:6px; color:var(--muted); }

  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:20px; }
  .card-head { padding:16px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .card-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; }
  .card-body { padding:22px; }
  .g2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }

  table { width:100%; border-collapse:collapse; }
  th { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); padding:10px 14px; text-align:left; border-bottom:1px solid var(--border); }
  td { padding:12px 14px; font-size:13px; border-bottom:1px solid var(--border); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:var(--surface2); }

  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
  .badge-green { background:rgba(52,211,153,0.15); color:var(--green); }
  .badge-blue  { background:rgba(79,158,255,0.15); color:var(--accent); }
  .badge-gold  { background:rgba(245,200,66,0.15); color:var(--gold); }
  .badge-red   { background:rgba(248,113,113,0.15); color:var(--red); }
  .badge-muted { background:var(--surface2); color:var(--muted); }
  .badge-purple{ background:rgba(167,139,250,0.15); color:var(--purple); }

  .platform { display:inline-flex; align-items:center; gap:5px; font-size:12px; }
  .pdot { width:8px; height:8px; border-radius:50%; }
  .p-airbnb{background:#FF5A5F;} .p-vrbo{background:#1DABD4;} .p-direct{background:var(--green);} .p-booking{background:#3B82F6;}

  .prop-card { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:18px; cursor:pointer; transition:all 0.2s; }
  .prop-card:hover,.prop-card.sel { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
  .prop-name { font-weight:600; font-size:14px; margin-bottom:3px; }
  .prop-meta { font-size:12px; color:var(--muted); }

  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; margin-top:12px; }
  .cal-hdr { font-size:10px; font-weight:700; text-align:center; color:var(--muted); padding:4px 0; }
  .cal-cell { aspect-ratio:1; border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; position:relative; }
  .cal-cell.av { background:var(--surface2); color:var(--muted); }
  .cal-cell.bk { background:rgba(79,158,255,0.2); color:var(--accent); }
  .cal-cell.bl { background:rgba(248,113,113,0.15); color:var(--red); }
  .cal-cell.td { box-shadow:0 0 0 2px var(--gold); }

  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
  .form-group { display:flex; flex-direction:column; gap:5px; }
  .form-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--muted); }
  .form-control { padding:10px 13px; background:var(--surface2); border:1px solid var(--border); border-radius:7px; color:var(--text); font-family:'Outfit',sans-serif; font-size:13px; outline:none; }
  .form-control:focus { border-color:var(--accent); }

  .toggle-wrap { display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--border); }
  .tgl { width:42px; height:23px; border-radius:12px; background:var(--border); border:none; position:relative; cursor:pointer; transition:background 0.2s; flex-shrink:0; }
  .tgl.on { background:var(--accent); }
  .tgl::after { content:''; position:absolute; width:17px; height:17px; border-radius:50%; background:white; top:3px; left:3px; transition:left 0.2s; }
  .tgl.on::after { left:22px; }

  .alert { padding:12px 15px; border-radius:8px; font-size:13px; margin-bottom:14px; display:flex; gap:10px; align-items:flex-start; line-height:1.5; }
  .a-blue   { background:rgba(79,158,255,0.09); border:1px solid rgba(79,158,255,0.25); }
  .a-yellow { background:rgba(245,200,66,0.09); border:1px solid rgba(245,200,66,0.25); }
  .a-green  { background:rgba(52,211,153,0.09); border:1px solid rgba(52,211,153,0.25); }
  .a-red    { background:rgba(248,113,113,0.09); border:1px solid rgba(248,113,113,0.25); }

  .pinput { background:var(--surface2); border:1px solid var(--border); border-radius:6px; padding:8px 11px; color:var(--text); font-family:'Outfit',sans-serif; font-size:13px; outline:none; width:100%; }
  .pinput:focus { border-color:var(--accent); }

  .spinner { display:inline-block; width:15px; height:15px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite; vertical-align:middle; }
  @keyframes spin{to{transform:rotate(360deg)}}
  .sk { background:var(--surface2); border-radius:6px; animation:pulse 1.5s ease-in-out infinite; }
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .empty { text-align:center; padding:40px 20px; color:var(--muted); }
  .empty-icon { font-size:36px; margin-bottom:10px; }
  .empty-title { font-size:15px; font-weight:600; color:var(--text); margin-bottom:5px; }

  .bp-hero { background:linear-gradient(135deg,#1A2E40,#0D1B2E); padding:28px; color:white; text-align:center; }
  .bp-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:700; margin-bottom:4px; }
  .bp-body { padding:24px; background:#FFFDF8; color:#1A1410; }
  .bp-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#888; margin-bottom:5px; }
  .bp-input { width:100%; padding:9px 13px; border:1.5px solid #DDD; border-radius:7px; font-size:13px; margin-bottom:12px; outline:none; }
  .bp-btn { width:100%; padding:13px; background:#1A2E40; color:white; border:none; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; }
  .bp-save { background:#E8F5E9; border-radius:7px; padding:8px 12px; font-size:12px; color:#2E7D32; margin-bottom:12px; font-weight:500; }

  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:var(--bg)} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
`;

const MO_S  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MO_F  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const $     = n => n==null?"—":"$"+Number(n).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0});
const fdate = d => { if(!d) return "—"; const dt=new Date(d); return `${MO_S[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`; };
const nts   = (a,b) => Math.round((new Date(b)-new Date(a))/86400000);
const pcls  = p => ({airbnb:"p-airbnb",vrbo:"p-vrbo",direct:"p-direct",booking:"p-booking"})[p?.toLowerCase()]||"p-direct";
const rbadge= s => ({accepted:"badge-green",pending:"badge-gold",cancelled:"badge-red",inquiry:"badge-blue",declined:"badge-red"})[s]||"badge-muted";

// ─── ConnectScreen ────────────────────────────────────────────────────────────
function ConnectScreen({ onConnect }) {
  const [tok,setTok]=useState(""); const [prx,setPrx]=useState(""); const [loading,setLoading]=useState(false); const [err,setErr]=useState("");

  const go = async () => {
    if (!tok.trim()||!prx.trim()) { setErr("Both fields required."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${prx.trim()}/api/hospitable?path=${encodeURIComponent("/v2/properties?per_page=1")}`,
        { headers:{"X-Hospitable-Token":tok.trim(),"Accept":"application/json"} });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.message||d?.error||`HTTP ${r.status}`);
      onConnect(tok.trim(), prx.trim());
    } catch(e) {
      setErr(e.message.includes("fetch")||e.message.includes("Network")
        ? "Cannot reach proxy. Make sure your Vercel URL is correct and the proxy is deployed."
        : e.message);
    }
    setLoading(false);
  };

  return (
    <div className="connect-wrap">
      <div className="connect-card">
        <div style={{fontSize:44,textAlign:"center",marginBottom:14}}>🏡</div>
        <div className="connect-title">Connect to Hospitable</div>
        <div className="connect-sub">Live data from all your channels. A proxy URL is needed to fix browser CORS — takes ~5 min to set up once.</div>

        <div className="setup-box">
          <div className="setup-title">⚡ One-Time Proxy Setup</div>
          <div className="step"><div className="step-num">1</div><div>Install Vercel CLI: <code>npm i -g vercel</code> (requires Node.js)</div></div>
          <div className="step"><div className="step-num">2</div><div>Unzip the <strong>rentalrev-proxy.zip</strong> file you downloaded, then: <code>cd rentalrev-proxy && vercel deploy</code></div></div>
          <div className="step"><div className="step-num">3</div><div>Copy the <code>.vercel.app</code> URL shown after deploy — paste it below</div></div>
          <div className="step"><div className="step-num">4</div><div>Optionally set <code>HOSPITABLE_API_KEY</code> in Vercel env vars to skip pasting the token every time</div></div>
        </div>

        <div className="form-label" style={{marginBottom:6}}>Vercel Proxy URL</div>
        <input className="connect-input" placeholder="https://rentalrev-proxy.vercel.app" value={prx} onChange={e=>setPrx(e.target.value)} />
        <div className="form-label" style={{marginBottom:6}}>Hospitable Personal Access Token</div>
        <input className="connect-input" type="password" placeholder="Paste your PAT from Hospitable → Settings → API" value={tok} onChange={e=>setTok(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} />
        <div className="connect-hint">
          Generate at <a href="https://app.hospitable.com/settings/api" target="_blank">app.hospitable.com → Settings → API</a>. Enable <strong>Read</strong> + <strong>Write</strong> scopes.
        </div>
        {err&&<div className="alert a-red" style={{marginBottom:14}}><span>⚠️</span><span>{err}</span></div>}
        <button className="btn btn-accent btn-full" onClick={go} disabled={loading||!tok.trim()||!prx.trim()}>
          {loading?<><span className="spinner" style={{marginRight:8}}/>Connecting…</>:"Connect to Hospitable"}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skel() {
  return <div><div className="stat-grid">{[0,1,2,3].map(i=><div key={i} className="stat-card"><div className="sk" style={{height:18,width:70,marginBottom:12}}/><div className="sk" style={{height:36,width:90}}/></div>)}</div><div className="card"><div className="card-body"><div className="sk" style={{height:180,borderRadius:8}}/></div></div></div>;
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewTab({reservations:R,properties:P,loading}) {
  if(loading) return <Skel/>;
  const acc=R.filter(r=>r.status==="accepted");
  const rev=acc.reduce((s,r)=>s+(r.financials?.total_host_payout||0),0);
  const avgN=acc.length?Math.round(acc.reduce((s,r)=>s+nts(r.arrival_date,r.departure_date),0)/acc.length):0;
  const upc=acc.filter(r=>new Date(r.arrival_date)>new Date()).length;
  const pc={}; R.forEach(r=>{pc[r.platform]=(pc[r.platform]||0)+1;});
  return (
    <div>
      <div className="stat-grid">
        {[[$(rev),`${acc.length} confirmed bookings`,"Total Revenue","#4F9EFF"],[P.length,"Connected via Hospitable","Properties","#A78BFA"],[upc,"Future accepted bookings","Upcoming Stays","#F5C842"],[`${avgN}n`,"Avg nights per booking","Avg Stay","#34D399"]].map(([v,d,l,c])=>(
          <div key={l} className="stat-card"><div className="stat-glow" style={{background:c}}/><div className="stat-label">{l}</div><div className="stat-value" style={{color:c}}>{v}</div><div className="stat-delta">{d}</div></div>
        ))}
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-head"><div className="card-title">Recent Reservations</div></div>
          {R.length===0?<div className="empty"><div className="empty-icon">📅</div><div className="empty-title">No reservations found</div></div>:
          <table><thead><tr><th>Guest</th><th>Dates</th><th>Platform</th><th>Status</th></tr></thead>
            <tbody>{R.slice(0,8).map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:500}}>{r.guest?.name||r.guest?.first_name||"Guest"}</td>
                <td style={{color:"var(--muted)",fontSize:12}}>{fdate(r.arrival_date)} → {fdate(r.departure_date)}</td>
                <td><span className="platform"><span className={`pdot ${pcls(r.platform)}`}/>{r.platform||"direct"}</span></td>
                <td><span className={`badge ${rbadge(r.status)}`}>{r.status}</span></td>
              </tr>
            ))}</tbody>
          </table>}
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Booking Sources</div></div>
          <div className="card-body">
            {Object.entries(pc).length===0?<div className="empty" style={{padding:"16px 0"}}><div>No data yet</div></div>:
              Object.entries(pc).map(([pl,ct])=>{
                const pct=Math.round(ct/R.length*100);
                return <div key={pl} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span className="platform"><span className={`pdot ${pcls(pl)}`}/>{pl||"direct"}</span>
                    <span style={{fontSize:12,color:"var(--muted)"}}>{ct} ({pct}%)</span>
                  </div>
                  <div style={{height:5,background:"var(--border)",borderRadius:3}}>
                    <div style={{height:"100%",width:`${pct}%`,borderRadius:3,background:pl==="airbnb"?"#FF5A5F":pl==="vrbo"?"#1DABD4":"var(--green)"}}/>
                  </div>
                </div>;
              })
            }
            <div className="alert a-yellow" style={{marginTop:12}}><span>💡</span><div>Enable the <strong>Direct Booking</strong> tab to capture fee-free bookings and keep 100% of your rate.</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reservations ─────────────────────────────────────────────────────────────
function ReservationsTab({reservations:R,loading}) {
  const [f,setF]=useState("all");
  if(loading) return <Skel/>;
  const fr=f==="all"?R:R.filter(r=>r.status===f);
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {["all","accepted","pending","cancelled"].map(x=>(
          <button key={x} className={`btn btn-sm ${f===x?"btn-accent":"btn-ghost"}`} onClick={()=>setF(x)}>
            {x.charAt(0).toUpperCase()+x.slice(1)} ({x==="all"?R.length:R.filter(r=>r.status===x).length})
          </button>
        ))}
      </div>
      <div className="card">
        {fr.length===0?<div className="empty"><div className="empty-icon">🔍</div><div className="empty-title">No {f} reservations</div></div>:
        <table>
          <thead><tr><th>Guest</th><th>Property</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Platform</th><th>Payout</th><th>Status</th></tr></thead>
          <tbody>{fr.map(r=>(
            <tr key={r.id}>
              <td style={{fontWeight:500}}>{r.guest?.name||r.guest?.first_name||"—"}</td>
              <td style={{color:"var(--muted)",fontSize:12}}>{r.properties?.[0]?.name||r.property?.name||"—"}</td>
              <td style={{fontSize:12}}>{fdate(r.arrival_date)}</td>
              <td style={{fontSize:12}}>{fdate(r.departure_date)}</td>
              <td><span className="badge badge-muted">{nts(r.arrival_date,r.departure_date)}n</span></td>
              <td><span className="platform"><span className={`pdot ${pcls(r.platform)}`}/>{r.platform||"direct"}</span></td>
              <td style={{fontWeight:600,color:"var(--green)"}}>{r.financials?.total_host_payout?$(r.financials.total_host_payout):"—"}</td>
              <td><span className={`badge ${rbadge(r.status)}`}>{r.status}</span></td>
            </tr>
          ))}</tbody>
        </table>}
      </div>
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function CalendarTab({properties:P,apiFetch,loading}) {
  const [sel,setSel]=useState(null);
  const [mo,setMo]=useState(new Date().getMonth());
  const [yr,setYr]=useState(new Date().getFullYear());
  const [cal,setCal]=useState([]);
  const [calL,setCalL]=useState(false);
  const [ep,setEp]=useState({});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  useEffect(()=>{ if(P.length&&!sel) setSel(P[0]); },[P]);
  useEffect(()=>{
    if(!sel) return;
    (async()=>{
      setCalL(true);
      try{
        const s=`${yr}-${String(mo+1).padStart(2,"0")}-01`;
        const e=`${yr}-${String(mo+1).padStart(2,"0")}-${new Date(yr,mo+1,0).getDate()}`;
        const d=await apiFetch(`/v2/properties/${sel.id}/calendar?start_date=${s}&end_date=${e}`);
        setCal(d.data||[]);
      }catch{ setCal([]); }
      setCalL(false);
    })();
  },[sel,mo,yr]);

  const save=async(date)=>{
    if(!ep[date]||!sel) return;
    setSaving(true); setMsg("");
    try{
      await apiFetch(`/v2/properties/${sel.id}/calendar`,{method:"PUT",body:JSON.stringify({dates:[{date,price:parseFloat(ep[date])}]})});
      setMsg("✅ Price updated!");
      setCal(c=>c.map(d=>d.date===date?{...d,price:parseFloat(ep[date])}:d));
      setEp(x=>{const n={...x};delete n[date];return n;});
    }catch(e){setMsg("❌ "+e.message);}
    setSaving(false); setTimeout(()=>setMsg(""),4000);
  };

  const fd=new Date(yr,mo,1).getDay(); const dim=new Date(yr,mo+1,0).getDate();
  const today=new Date(); const cm=Object.fromEntries(cal.map(d=>[d.date,d]));
  if(loading) return <Skel/>;
  return (
    <div>
      {P.length>1&&<div className="g3" style={{marginBottom:18}}>{P.map(p=><div key={p.id} className={`prop-card${sel?.id===p.id?" sel":""}`} onClick={()=>setSel(p)}><div className="prop-name">{p.name}</div><div className="prop-meta">{p.address?.city}, {p.address?.state}</div></div>)}</div>}
      {msg&&<div className={`alert ${msg.startsWith("✅")?"a-green":"a-red"}`} style={{marginBottom:14}}><span>{msg}</span></div>}
      <div className="card">
        <div className="card-head">
          <div className="card-title">{sel?.name||"Calendar"}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);}}>‹</button>
            <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,fontWeight:600,minWidth:128,textAlign:"center"}}>{MO_F[mo]} {yr}</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);}}>›</button>
          </div>
        </div>
        <div className="card-body">
          {calL?<div style={{textAlign:"center",padding:40}}><div className="spinner" style={{width:26,height:26,borderWidth:3}}/></div>:
          <>
            <div style={{display:"flex",gap:14,marginBottom:12}}>
              {[["Available","var(--surface2)","var(--muted)"],["Booked","rgba(79,158,255,0.2)","var(--accent)"],["Blocked","rgba(248,113,113,0.15)","var(--red)"]].map(([l,bg,fg])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--muted)"}}><div style={{width:11,height:11,borderRadius:3,background:bg,border:`1px solid ${fg}`}}/>{l}</div>
              ))}
            </div>
            <div className="cal-grid">
              {DAYS.map(d=><div key={d} className="cal-hdr">{d}</div>)}
              {Array(fd).fill(null).map((_,i)=><div key={`e${i}`}/>)}
              {Array(dim).fill(null).map((_,i)=>{
                const d=i+1; const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                const ent=cm[ds]; const isT=today.getDate()===d&&today.getMonth()===mo&&today.getFullYear()===yr;
                const cls=ent?.status==="booked"?"bk":ent?.status==="blocked"?"bl":"av";
                return <div key={d} className={`cal-cell ${cls}${isT?" td":""}`} title={`${ds}${ent?.price?` · $${ent.price}`:""}${ent?.status?` · ${ent.status}`:""}`}>
                  {d}{ent?.price&&<span style={{position:"absolute",bottom:1,left:0,right:0,textAlign:"center",fontSize:7,color:"var(--gold)",fontWeight:700}}>${ent.price}</span>}
                </div>;
              })}
            </div>
          </>}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Push Price Updates</div><span style={{fontSize:11,color:"var(--muted)"}}>Syncs to Airbnb & VRBO via Hospitable</span></div>
        <div className="card-body">
          <div className="alert a-blue" style={{marginBottom:14}}><span>ℹ️</span><div>Changes write directly to Hospitable and auto-propagate to connected channels.</div></div>
          <div className="g3">
            {Array(6).fill(null).map((_,i)=>{
              const dt=new Date(yr,mo,today.getDate()+i+1); if(dt.getMonth()!==mo) return null;
              const ds=dt.toISOString().split("T")[0]; const ex=cm[ds]?.price;
              return <div key={ds} style={{background:"var(--surface2)",borderRadius:8,padding:12,border:"1px solid var(--border)"}}>
                <div style={{fontSize:11,color:"var(--muted)",marginBottom:6}}>{fdate(ds)}</div>
                <div style={{display:"flex",gap:6}}>
                  <input className="pinput" placeholder={ex?`$${ex}`:"Rate…"} value={ep[ds]||""} onChange={e=>setEp(p=>({...p,[ds]:e.target.value}))} style={{flex:1}}/>
                  <button className="btn btn-green btn-sm" onClick={()=>save(ds)} disabled={!ep[ds]||saving}>Save</button>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Properties ───────────────────────────────────────────────────────────────
function PropertiesTab({properties:P,loading}) {
  if(loading) return <Skel/>;
  if(!P.length) return <div className="empty"><div className="empty-icon">🏡</div><div className="empty-title">No properties found</div></div>;
  return <div className="g2">{P.map(p=>(
    <div key={p.id} className="card">
      <div className="card-head"><div className="card-title">{p.name}</div><span className="badge badge-green">Active</span></div>
      <div className="card-body">
        <table><tbody>
          {[["Location",[p.address?.city,p.address?.state,p.address?.country].filter(Boolean).join(", ")||"—"],["Bedrooms",p.bedrooms??"—"],["Bathrooms",p.bathrooms??"—"],["Max Guests",p.capacity??"—"],["Type",p.property_type||"—"]].map(([l,v])=>(
            <tr key={l}><td style={{color:"var(--muted)",fontSize:11,width:100}}>{l}</td><td style={{fontWeight:500,fontSize:13}}>{v}</td></tr>
          ))}
        </tbody></table>
        <div style={{marginTop:12,display:"flex",gap:6,flexWrap:"wrap"}}>
          {p.airbnb_listing_id&&<span className="badge badge-red">Airbnb</span>}
          {p.vrbo_listing_id&&<span className="badge badge-blue">VRBO</span>}
          <span className="badge badge-muted">ID: {p.id?.slice(0,8)}…</span>
        </div>
      </div>
    </div>
  ))}</div>;
}

// ─── Direct Booking ───────────────────────────────────────────────────────────
function DirectBookingTab({properties:P}) {
  const [s,setS]=useState({propName:P[0]?.name||"My Rental",headline:"Book Direct & Save",subline:"Skip the fees. Same property, better price.",directRate:180,airbnbRate:220,email:"",phone:"",minNights:2,showSavings:true,contactEnabled:true,requirePhone:false});
  const [tab,setTab]=useState("settings");
  const sv=s.airbnbRate-s.directRate; const sp=Math.round(sv/s.airbnbRate*100);
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[["settings","⚙️ Settings"],["preview","👁 Preview"],["embed","</> Embed"]].map(([id,lbl])=>(
          <button key={id} className={`btn btn-sm ${tab===id?"btn-accent":"btn-ghost"}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>
      {tab==="settings"&&<div className="g2">
        <div className="card">
          <div className="card-head"><div className="card-title">Page Content</div></div>
          <div className="card-body">
            {[["propName","Property Name"],["headline","Hero Headline"],["subline","Sub-headline"]].map(([k,l])=>(
              <div key={k} className="form-group" style={{marginBottom:12}}>
                <label className="form-label">{l}</label>
                <input className="form-control" value={s[k]} onChange={e=>setS(x=>({...x,[k]:e.target.value}))}/>
              </div>
            ))}
            <div className="form-row">
              <div className="form-group"><label className="form-label">Direct Rate/Night</label><input className="form-control" type="number" value={s.directRate} onChange={e=>setS(x=>({...x,directRate:+e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Airbnb Rate</label><input className="form-control" type="number" value={s.airbnbRate} onChange={e=>setS(x=>({...x,airbnbRate:+e.target.value}))}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Contact Email</label><input className="form-control" type="email" value={s.email} onChange={e=>setS(x=>({...x,email:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={s.phone} onChange={e=>setS(x=>({...x,phone:e.target.value}))}/></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Features</div></div>
          <div className="card-body">
            {[["showSavings","Show Savings Banner","Show guests how much they save vs Airbnb"],["contactEnabled","Contact/Booking Form","Email form for direct inquiries"],["requirePhone","Require Phone Number","Guest must provide phone to inquire"]].map(f=>(
              <div key={f[0]} className="toggle-wrap">
                <div><div style={{fontSize:13,fontWeight:500}}>{f[1]}</div><div style={{fontSize:12,color:"var(--muted)"}}>{f[2]}</div></div>
                <button className={`tgl${s[f[0]]?" on":""}`} onClick={()=>setS(x=>({...x,[f[0]]:!x[f[0]]}))}/>
              </div>
            ))}
            <div className="alert a-green" style={{marginTop:14}}><span>💰</span><div>Guests save <strong>${sv}/night ({sp}%)</strong> vs Airbnb. You pocket the difference — no host fees.</div></div>
          </div>
        </div>
      </div>}
      {tab==="preview"&&<div style={{maxWidth:460,margin:"0 auto",borderRadius:12,overflow:"hidden",border:"2px solid var(--border)"}}>
        <div className="bp-hero"><div style={{fontSize:12,opacity:0.6,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{s.propName}</div><div className="bp-title">{s.headline}</div><div style={{fontSize:13,opacity:0.7}}>{s.subline}</div></div>
        <div className="bp-body">
          {s.showSavings&&<div className="bp-save">🎉 Save <strong>${sv}/night ({sp}% off)</strong> vs Airbnb!</div>}
          {["Check-in Date","Check-out Date"].map(l=><div key={l}><div className="bp-label">{l}</div><input className="bp-input" type="date"/></div>)}
          <div className="bp-label">Guests</div><select className="bp-input">{[1,2,3,4,5,6].map(n=><option key={n}>{n} guest{n>1?"s":""}</option>)}</select>
          {s.contactEnabled&&<><div className="bp-label">Name</div><input className="bp-input" placeholder="Full name"/><div className="bp-label">Email</div><input className="bp-input" type="email" placeholder="your@email.com"/>{s.requirePhone&&<><div className="bp-label">Phone</div><input className="bp-input" type="tel"/></>}</>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div style={{fontSize:11,color:"#999",textDecoration:"line-through"}}>${s.airbnbRate}/night on Airbnb</div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:700,color:"#1A1410"}}>${s.directRate}<span style={{fontSize:13,fontWeight:400}}>/night</span></div></div>
            <div style={{fontSize:11,color:"#2E7D32",background:"#E8F5E9",padding:"3px 9px",borderRadius:10,fontWeight:600}}>Min {s.minNights} nights</div>
          </div>
          <button className="bp-btn">Request to Book Direct →</button>
          {s.email&&<div style={{textAlign:"center",fontSize:11,color:"#999",marginTop:10}}>Questions? <strong>{s.email}</strong>{s.phone&&` · ${s.phone}`}</div>}
        </div>
      </div>}
      {tab==="embed"&&<div className="card"><div className="card-head"><div className="card-title">Embed on Your Website</div></div>
        <div className="card-body">
          <div className="alert a-blue" style={{marginBottom:14}}><span>ℹ️</span><div>Drop into Squarespace, Wix, Webflow, WordPress, or any custom site. Zero OTA fees.</div></div>
          <div style={{background:"var(--bg)",borderRadius:8,padding:18,fontFamily:"monospace",fontSize:11,color:"#A5F3FC",lineHeight:1.8,overflowX:"auto",marginBottom:14,whiteSpace:"pre-wrap"}}>
{`<!-- Direct Booking: ${s.propName} -->
<style>
.rb{max-width:460px;font-family:sans-serif;border:1px solid #ddd;border-radius:10px;overflow:hidden}
.rb-hero{background:#1A2E40;color:#fff;padding:22px;text-align:center}
.rb-body{padding:22px;background:#fff}
.rb-i{width:100%;padding:9px;border:1px solid #ddd;border-radius:6px;margin-bottom:11px;font-size:13px}
.rb-btn{width:100%;padding:12px;background:#1A2E40;color:#fff;border:none;border-radius:7px;font-size:14px;font-weight:700;cursor:pointer}
.rb-sv{background:#e8f5e9;color:#2e7d32;padding:7px 11px;border-radius:6px;font-size:12px;margin-bottom:11px}
</style>
<div class="rb">
  <div class="rb-hero">
    <h2 style="margin:0 0 3px">${s.headline}</h2>
    <p style="margin:0;opacity:.7;font-size:13px">${s.subline}</p>
  </div>
  <div class="rb-body">
    ${s.showSavings?`<div class="rb-sv">Save $${sv}/night vs Airbnb!</div>`:""}
    <form action="mailto:${s.email||"you@email.com"}" method="post" enctype="text/plain">
      <input class="rb-i" type="date" name="checkin" required/>
      <input class="rb-i" type="date" name="checkout" required/>
      <input class="rb-i" type="text" name="name" placeholder="Your name" required/>
      <input class="rb-i" type="email" name="email" placeholder="Email" required/>
      <button class="rb-btn" type="submit">Book Direct @ $${s.directRate}/night →</button>
    </form>
  </div>
</div>`}
          </div>
          <button className="btn btn-accent" onClick={()=>{ try{navigator.clipboard.writeText("<!-- See dashboard for full embed code -->");}catch{} }}>Copy Embed Code</button>
        </div>
      </div>}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token,setToken]=useState(""); const [proxyUrl,setProxyUrl]=useState(DEFAULT_PROXY);
  const [tab,setTab]=useState("overview");
  const [props,setProps]=useState([]); const [res,setRes]=useState([]);
  const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [lastSync,setLastSync]=useState(null);

  const apiFetch=useCallback((path,opts={})=>{
    const url=proxyUrl?`${proxyUrl}/api/hospitable?path=${encodeURIComponent(path)}`:`https://public.api.hospitable.com${path}`;
    return fetch(url,{...opts,headers:{"Accept":"application/json","Content-Type":"application/json","X-Hospitable-Token":token,"Authorization":`Bearer ${token}`,...(opts.headers||{})}})
      .then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d?.message||d?.error||`HTTP ${r.status}`);return d;});
  },[token,proxyUrl]);

  const load=useCallback(async()=>{
    setLoading(true);setError("");
    try{
      const[pr,rr]=await Promise.all([apiFetch("/v2/properties?per_page=50"),apiFetch("/v2/reservations?per_page=100&include=guest,financials,properties")]);
      setProps(pr.data||[]);setRes(rr.data||[]);setLastSync(new Date());
    }catch(e){setError(e.message);}
    setLoading(false);
  },[apiFetch]);

  const onConnect=(tok,prx)=>{setToken(tok);setProxyUrl(prx);};
  useEffect(()=>{if(token&&proxyUrl)load();},[token,proxyUrl]);

  if(!token) return <><style>{S}</style><ConnectScreen onConnect={onConnect}/></>;

  const NAV=[{id:"overview",icon:"📊",label:"Overview"},{id:"reservations",icon:"📋",label:"Reservations"},{id:"calendar",icon:"📅",label:"Calendar & Pricing"},{id:"properties",icon:"🏡",label:"Properties"},{id:"direct",icon:"🔗",label:"Direct Booking"}];
  const TITLES={overview:["Overview","Live data from Hospitable"],reservations:["Reservations","All bookings across channels"],calendar:["Calendar & Pricing","View availability · push pricing"],properties:["Properties","Your connected listings"],direct:["Direct Booking Page","Capture fee-free bookings"]};
  const [title,sub]=TITLES[tab];

  return (
    <><style>{S}</style>
    <div className="shell">
      <div className="sidebar">
        <div className="logo"><div className="logo-name">RentalRev</div><div className="logo-badge">Hospitable Live</div></div>
        <div className="nav-section">Dashboard</div>
        {NAV.map(n=><button key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={()=>setTab(n.id)}><span>{n.icon}</span>{n.label}</button>)}
        <div className="sidebar-footer">
          <div className="api-status"><div className={`dot${error?" red":loading?" yellow":""}`}/><span>{error?"Error":loading?"Syncing…":"Connected"}</span></div>
          {lastSync&&<div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>Synced {lastSync.toLocaleTimeString()}</div>}
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>↻ Refresh</button>
            <button className="btn btn-danger btn-sm" onClick={()=>{setToken("");setProxyUrl("");setProps([]);setRes([]);}}>Disconnect</button>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <div><div className="page-title">{title}</div><div className="page-sub">{sub}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span className="badge badge-purple">{props.length} propert{props.length===1?"y":"ies"}</span>
            <span className="badge badge-blue">{res.length} reservations</span>
          </div>
        </div>
        <div className="content">
          {error&&<div className="alert a-red" style={{marginBottom:18}}><span>⚠️</span><span>{error} — <button onClick={load} style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",textDecoration:"underline"}}>retry</button></span></div>}
          {tab==="overview"&&<OverviewTab reservations={res} properties={props} loading={loading}/>}
          {tab==="reservations"&&<ReservationsTab reservations={res} loading={loading}/>}
          {tab==="calendar"&&<CalendarTab properties={props} apiFetch={apiFetch} loading={loading}/>}
          {tab==="properties"&&<PropertiesTab properties={props} loading={loading}/>}
          {tab==="direct"&&<DirectBookingTab properties={props}/>}
        </div>
      </div>
    </div>
    </>
  );
}
