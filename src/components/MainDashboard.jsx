/**
 * FutureCity.jsx  — UPDATED
 * Plugs in: RealMap, AdminPanel, expanded AI, Builders/Investors sections
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import RealMap    from "./GISHeatmap";
import AdminPanel from "./AdminDashboard";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Dashboard","Heatmaps","Predictions","Infrastructure","Builders","AI Advisor"];

const STATS = [
  { num:"1,240+", label:"Zones Analyzed" },
  { num:"87%",    label:"Prediction Accuracy" },
  { num:"340+",   label:"Infra Projects Tracked" },
  { num:"₹2.3Cr", label:"Avg ROI Identified" },
];

const HOTSPOTS = [
  { id:1, city:"Dwarka Expressway",  zone:"Delhi NCR — Residential", score:92, scoreClass:"high", growth:"+68%", years:"5yr", price:"₹7,200/sqft", risk:"Low",  barColor:"#10b981" },
  { id:2, city:"Hinjewadi Phase III",zone:"Pune — Commercial",       score:88, scoreClass:"high", growth:"+55%", years:"5yr", price:"₹8,100/sqft", risk:"Low",  barColor:"#10b981" },
  { id:3, city:"Navi Mumbai Airport",zone:"Mumbai — Mixed",          score:85, scoreClass:"high", growth:"+72%", years:"7yr", price:"₹12,400/sqft",risk:"Med",  barColor:"#10b981" },
  { id:4, city:"Gachibowli East",    zone:"Hyderabad — Tech",        score:74, scoreClass:"mid",  growth:"+43%", years:"5yr", price:"₹6,800/sqft", risk:"Med",  barColor:"#f59e0b" },
];

const CHART_DATA = {
  "5Y": [
    { yr:"2025",dw:7200, hi:8100, nm:12400,gc:6800 },
    { yr:"2026",dw:8100, hi:8800, nm:13500,gc:7200 },
    { yr:"2027",dw:9200, hi:9600, nm:15000,gc:7900 },
    { yr:"2028",dw:10400,hi:10500,nm:16800,gc:8500 },
    { yr:"2029",dw:11800,hi:11400,nm:18400,gc:9100 },
    { yr:"2030",dw:12100,hi:12600,nm:21300,gc:9700 },
  ],
  "3Y": [
    { yr:"2025",dw:7200, hi:8100, nm:12400,gc:6800 },
    { yr:"2026",dw:8100, hi:8800, nm:13500,gc:7200 },
    { yr:"2027",dw:9200, hi:9600, nm:15000,gc:7900 },
    { yr:"2028",dw:10400,hi:10500,nm:16800,gc:8500 },
  ],
  "10Y": [
    { yr:"2025",dw:7200, hi:8100, nm:12400,gc:6800  },
    { yr:"2027",dw:9200, hi:9600, nm:15000,gc:7900  },
    { yr:"2029",dw:11800,hi:11400,nm:18400,gc:9100  },
    { yr:"2031",dw:13800,hi:14100,nm:24000,gc:10400 },
    { yr:"2033",dw:17400,hi:17700,nm:30400,gc:12100 },
    { yr:"2035",dw:22000,hi:22200,nm:38500,gc:14200 },
  ],
};

const INFRA = [
  { icon:"🚇",iconBg:"rgba(59,130,246,0.12)", name:"Delhi-Meerut RRTS",  loc:"NCR Region",        statusClass:"fc-status-active",  statusDot:"#10b981",statusText:"Under Construction",impact:"+35%",radius:"3km"  },
  { icon:"✈️",iconBg:"rgba(16,185,129,0.12)", name:"Navi Mumbai Airport",loc:"Thane District",    statusClass:"fc-status-active",  statusDot:"#10b981",statusText:"Phase 1 Active",    impact:"+55%",radius:"10km" },
  { icon:"🛣️",iconBg:"rgba(245,158,11,0.12)", name:"Pune Ring Road",     loc:"Pune Metropolitan", statusClass:"fc-status-planned", statusDot:"#f59e0b",statusText:"DPR Approved",       impact:"+28%",radius:"5km"  },
  { icon:"🏗️",iconBg:"rgba(139,92,246,0.12)", name:"Hyderabad IT SEZ",   loc:"Genome Valley",     statusClass:"fc-status-review",  statusDot:"#3b82f6",statusText:"Env. Review",        impact:"+42%",radius:"8km"  },
];

const RISKS = [
  { area:"Dwarka Exp.", score:12,cls:"fc-risk-low",fill:"#10b981",tags:["Low flood","Clear title"] },
  { area:"Hinjewadi",   score:18,cls:"fc-risk-low",fill:"#10b981",tags:["Stable demand","RERA"] },
  { area:"Navi Mumbai", score:42,cls:"fc-risk-med",fill:"#f59e0b",tags:["Flood zone","High demand"] },
  { area:"Gachibowli",  score:35,cls:"fc-risk-med",fill:"#f59e0b",tags:["IT dependent","Med supply"] },
];

const BASE_DATA = [
  { area:"Dwarka Exp.", base:7200,  rate:0.108 },
  { area:"Hinjewadi",   base:8100,  rate:0.092 },
  { area:"Navi Mumbai", base:12400, rate:0.114 },
  { area:"Gachibowli",  base:6800,  rate:0.075 },
];

// Builders showcase data
const BUILDERS_SHOWCASE = [
  { name:"Godrej Properties", city:"Mumbai",    score:94, projects:48,  badge:"🏆 Top Rated",   color:"#10b981", founded:1897, revenue:"₹8,200Cr" },
  { name:"Prestige Estates",  city:"Bangalore", score:91, projects:82,  badge:"⭐ 5-Star",      color:"#10b981", founded:1986, revenue:"₹6,400Cr" },
  { name:"DLF Limited",       city:"Delhi NCR", score:88, projects:120, badge:"✅ Verified",    color:"#10b981", founded:1946, revenue:"₹14,000Cr"},
  { name:"Sobha Ltd",         city:"Bangalore", score:89, projects:54,  badge:"🎖 Quality",     color:"#10b981", founded:1995, revenue:"₹3,200Cr" },
  { name:"Lodha Group",       city:"Mumbai",    score:85, projects:67,  badge:"✅ Verified",    color:"#10b981", founded:1980, revenue:"₹9,100Cr" },
  { name:"Puravankara",       city:"Bangalore", score:82, projects:41,  badge:"✅ Verified",    color:"#3b82f6", founded:1975, revenue:"₹2,100Cr" },
];

// Investors showcase
const INVESTORS_SHOWCASE = [
  { name:"Rahul Gupta",  city:"Delhi NCR", budget:"₹1–2Cr",   roi:"+52%", portfolio:5, type:"Mixed",       avatar:"R", color:"#3b82f6" },
  { name:"Karan Mehta",  city:"Mumbai",    budget:"₹2–5Cr",   roi:"+48%", portfolio:7, type:"Luxury",      avatar:"K", color:"#8b5cf6" },
  { name:"Vikram Nair",  city:"Hyderabad", budget:"₹75L–1.5Cr",roi:"+61%",portfolio:4, type:"Commercial",  avatar:"V", color:"#10b981" },
  { name:"Arjun Sharma", city:"Mumbai",    budget:"₹50L–1Cr", roi:"+34%", portfolio:3, type:"Residential", avatar:"A", color:"#f59e0b" },
];

// ─── FULL AI RESPONSE BANK ─────────────────────────────────────────────────────
const AI_BANK = {
  // Maharashtra
  pune:       "**Pune** top pick: **Hinjewadi Phase III** (score 88). Pune Metro Phase 2 + 3 IT parks → **+55% by 2030**. Entry ₹8,100/sqft → ₹12,500–14,000. Risk: Low.",
  mumbai:     "**Mumbai**: **Navi Mumbai Airport zone** (score 85). Airport opening 2028 triggers massive demand. Entry ₹12,400 → ₹21,000+ by 2032. Risk: Medium (flood check needed).",
  nagpur:     "**Nagpur**: MIHAN SEZ + proposed Samruddhi Mahamarg terminus → hotspot. Entry prices still at ₹3,800–5,200/sqft. Predicted **+45% by 2028**. Risk: Low.",
  nashik:     "**Nashik**: Smart City + upcoming expressway connectivity. Entry ₹3,200–4,100/sqft. Predicted **+38% in 5yr**. Risk: Low.",
  aurangabad: "**Chhatrapati Sambhajinagar**: Delhi–Mumbai Industrial Corridor (DMIC) node. Industrial + residential demand rising. Entry ₹2,800/sqft → predicted +40%.",
  // Delhi NCR
  delhi:      "**Delhi NCR**: **Dwarka Expressway** (score 92) — metro + Ring Road = dual boost. Entry ₹7,200 → ₹12,100 by 2030. **+68%**. Risk: Very Low.",
  noida:      "**Noida**: Sector 150 eco zone + Jewar Airport proximity. Entry ₹5,800–7,200/sqft. Jewar will add **+40–50%** in 5–8 years. Risk: Medium.",
  gurgaon:    "**Gurugram**: Dwarka Expressway corridor already moved. New hotspot: **SPR-Sohna Road** stretch. Entry ₹8,500/sqft → predicted +35% with metro extension.",
  // Karnataka
  bangalore:  "**Bangalore**: Peripheral Ring Road corridor — **Hoskote, Devanahalli** are undervalued. Entry ₹4,500–6,000/sqft. Predicted **+45–60% by 2030**. Risk: Low.",
  mysuru:     "**Mysuru**: IT corridor between Mysuru–Bangalore developing rapidly. Entry ₹3,100/sqft. Predicted +32% in 5yr. Risk: Low.",
  // Telangana
  hyderabad:  "**Hyderabad**: **Gachibowli East + IT SEZ** (score 74). Genome Valley expansion. Entry ₹6,800 → ₹9,700 by 2030. **+43%**. Risk: Medium.",
  warangal:   "**Warangal**: Emerging IT hub. TSRTC highway expansion + new university zone. Entry ₹2,100/sqft. Predicted +28% in 5yr.",
  // Tamil Nadu
  chennai:    "**Chennai**: OMR Phase 2 + Outer Ring Road corridor. Entry ₹5,800–7,200/sqft. Predicted **+38% by 2030**. Risk: Low.",
  coimbatore: "**Coimbatore**: Textile + IT hybrid city. Smart City fund disbursed. Entry ₹3,400/sqft. Predicted +30% in 5yr. Risk: Low.",
  madurai:    "**Madurai**: Tourism + AIIMS hospital zone driving demand. Entry ₹2,600/sqft. Predicted +25% in 5yr.",
  // Gujarat
  ahmedabad:  "**Ahmedabad**: Metro Phase 2 + GIFT City proximity. Entry ₹4,200–5,800/sqft. GIFT City premium zones predicted **+50% in 7yr**.",
  surat:      "**Surat**: Diamond bourse + textile city modernisation. Entry ₹4,100/sqft. Predicted +35% in 5yr. Risk: Low.",
  vadodara:   "**Vadodara**: DMIC industrial corridor + Expressway. Entry ₹3,600/sqft. Predicted +30% in 5yr.",
  // Rajasthan
  jaipur:     "**Jaipur**: Metro Phase 2 + Delhi–Mumbai Expressway proximity. Entry ₹4,400/sqft. Predicted **+30% by 2030**. Risk: Low.",
  udaipur:    "**Udaipur**: Tourism + IT park drive residential demand. Entry ₹3,200/sqft. Predicted +22% in 5yr.",
  // West Bengal
  kolkata:    "**Kolkata**: Rajarhat New Town IT hub expanding. Entry ₹4,800/sqft. Metro expansion + airport proximity. Predicted **+35% by 2030**.",
  // Punjab
  chandigarh: "**Chandigarh/Mohali**: IT + pharma hub. Aerocity Mohali is the hotspot. Entry ₹5,800/sqft. Predicted +32% in 5yr. Risk: Low.",
  ludhiana:   "**Ludhiana**: Industrial + residential demand rising. Entry ₹3,400/sqft. Predicted +20% in 5yr.",
  // Kerala
  kochi:      "**Kochi**: Metro expansion + IT SEZ Infopark. Kakkanad zone. Entry ₹5,200/sqft. Predicted **+38% by 2030**. Risk: Low.",
  trivandrum: "**Thiruvananthapuram**: Technopark Phase 3 + smart city. Entry ₹4,100/sqft. Predicted +28% in 5yr.",
  // Madhya Pradesh
  indore:     "**Indore**: Cleanest city + IT growth. Entry ₹3,800/sqft. Super Corridor is the hotspot. Predicted **+35% in 5yr**.",
  bhopal:     "**Bhopal**: Smart City + AIIMS + metro proposed. Entry ₹3,200/sqft. Predicted +25% in 5yr.",
  // Haryana
  faridabad:  "**Faridabad**: Delhi proximity + metro. Entry ₹5,400/sqft. Predicted +28% in 5yr. Risk: Medium.",
  // Budget / generic
  budget:     "With ₹20–50L budget, I recommend **Nashik, Nagpur SEZ zone, Warangal, Mysuru, or Navi Mumbai periphery** — all offer 35–50% upside at lower ticket sizes. Would you like a detailed comparison?",
  risk:       "FutureCity risk scores (1–100): **<25 = Low** (flood/legal clear), **25–50 = Medium** (some dependency), **>50 = High** (caution: legal disputes or saturation). Always verify RERA status before investing.",
  metro:      "Metro expansion is the #1 price catalyst. Zones within **3km of a new metro station** historically appreciate **30–45%** within 5 years of announcement. Delhi, Mumbai, Pune, Hyderabad, Bangalore all have active expansions.",
  airport:    "Airport proximity (5–15km) is a super-catalyst. **Navi Mumbai Airport** is the biggest upcoming trigger in India — expect 50–60% appreciation in nearby zones by 2030.",
  it:         "IT parks drive both commercial and residential demand. **Hyderabad (Genome Valley), Pune (Hinjewadi), Bangalore (Whitefield/ORR), Chennai (OMR)** are the strongest IT corridors right now.",
  default:    "I can analyse investment opportunities across all major Indian cities. Tell me your **city, budget, and investment horizon** and I'll give you a detailed recommendation. Or ask about specific topics: metro impact, risk scores, builder reputation, or rental yields.",
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  // City matches
  if (m.includes("pune")||m.includes("hinjewadi"))                   return AI_BANK.pune;
  if (m.includes("mumbai")||m.includes("navi mumbai"))               return AI_BANK.mumbai;
  if (m.includes("nagpur"))                                          return AI_BANK.nagpur;
  if (m.includes("nashik"))                                          return AI_BANK.nashik;
  if (m.includes("aurangabad")||m.includes("sambhajinagar"))         return AI_BANK.aurangabad;
  if (m.includes("delhi")||m.includes("ncr")||m.includes("dwarka")) return AI_BANK.delhi;
  if (m.includes("noida")||m.includes("jewar"))                     return AI_BANK.noida;
  if (m.includes("gurgaon")||m.includes("gurugram"))                return AI_BANK.gurgaon;
  if (m.includes("bangalore")||m.includes("bengaluru")||m.includes("hoskote")) return AI_BANK.bangalore;
  if (m.includes("mysuru")||m.includes("mysore"))                   return AI_BANK.mysuru;
  if (m.includes("hyderabad")||m.includes("gachibowli")||m.includes("hitec")) return AI_BANK.hyderabad;
  if (m.includes("warangal"))                                        return AI_BANK.warangal;
  if (m.includes("chennai")||m.includes("omr"))                     return AI_BANK.chennai;
  if (m.includes("coimbatore"))                                      return AI_BANK.coimbatore;
  if (m.includes("madurai"))                                         return AI_BANK.madurai;
  if (m.includes("ahmedabad")||m.includes("gift city"))             return AI_BANK.ahmedabad;
  if (m.includes("surat"))                                          return AI_BANK.surat;
  if (m.includes("vadodara")||m.includes("baroda"))                 return AI_BANK.vadodara;
  if (m.includes("jaipur"))                                         return AI_BANK.jaipur;
  if (m.includes("udaipur"))                                        return AI_BANK.udaipur;
  if (m.includes("kolkata")||m.includes("calcutta")||m.includes("rajarhat")) return AI_BANK.kolkata;
  if (m.includes("chandigarh")||m.includes("mohali"))               return AI_BANK.chandigarh;
  if (m.includes("ludhiana"))                                        return AI_BANK.ludhiana;
  if (m.includes("kochi")||m.includes("cochin")||m.includes("kakkanad")) return AI_BANK.kochi;
  if (m.includes("thiruvananthapuram")||m.includes("trivandrum"))   return AI_BANK.trivandrum;
  if (m.includes("indore")||m.includes("super corridor"))           return AI_BANK.indore;
  if (m.includes("bhopal"))                                         return AI_BANK.bhopal;
  if (m.includes("faridabad"))                                      return AI_BANK.faridabad;
  // Topic matches
  if (m.includes("budget")||m.includes("lakh")||m.includes("₹"))   return AI_BANK.budget;
  if (m.includes("risk"))                                           return AI_BANK.risk;
  if (m.includes("metro"))                                          return AI_BANK.metro;
  if (m.includes("airport"))                                        return AI_BANK.airport;
  if (m.includes("it park")||m.includes("tech park")||m.includes("software")) return AI_BANK.it;
  return AI_BANK.default;
}

// ─── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#1a2235",border:"0.5px solid rgba(99,179,237,0.2)",borderRadius:10,padding:"10px 14px",fontSize:12 }}>
      <div style={{ color:"#94a3b8",marginBottom:6 }}>{label}</div>
      {payload.map(p=>(
        <div key={p.name} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
          <div style={{ width:8,height:8,borderRadius:2,background:p.color }}/>
          <span style={{ color:"#94a3b8" }}>{p.name}:</span>
          <span style={{ color:"#f1f5f9",fontWeight:500 }}>₹{p.value?.toLocaleString()}/sqft</span>
        </div>
      ))}
    </div>
  );
}

function HotspotModal({ hotspot, onClose }) {
  if (!hotspot) return null;
  return (
    <div className="fc-modal-overlay" onClick={onClose}>
      <div className="fc-modal" onClick={e=>e.stopPropagation()}>
        <div className="fc-modal-header">
          <div>
            <div className="fc-modal-title">{hotspot.city}</div>
            <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{hotspot.zone}</div>
          </div>
          <button className="fc-modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:18 }}>
          {[
            { label:"Growth Score",   value:hotspot.score,  color:hotspot.scoreClass==="high"?"#10b981":"#f59e0b" },
            { label:"Appreciation",   value:hotspot.growth, color:"#10b981" },
            { label:"Risk Level",     value:hotspot.risk,   color:hotspot.risk==="Low"?"#10b981":"#f59e0b" },
          ].map(s=>(
            <div key={s.label} style={{ background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(99,179,237,0.12)",borderRadius:10,padding:12,textAlign:"center" }}>
              <div style={{ fontSize:11,color:"#64748b",marginBottom:5 }}>{s.label}</div>
              <div style={{ fontSize:18,fontWeight:500,color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:13,color:"#94a3b8",lineHeight:1.7,marginBottom:16 }}>
          Strong infrastructure-driven growth signals detected. FutureCity AI predicts consistent appreciation based on metro proximity, commercial activity, and migration data.
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button style={{ flex:1,padding:10,borderRadius:8,background:"#3b82f6",border:"none",color:"#fff",fontSize:13,cursor:"pointer" }}>View Full Analysis</button>
          <button style={{ flex:1,padding:10,borderRadius:8,background:"transparent",border:"0.5px solid rgba(99,179,237,0.2)",color:"#94a3b8",fontSize:13,cursor:"pointer" }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function FutureCity({ user, onLogout, onSignIn, onGetStarted }) {
  const [showAdmin,    setShowAdmin]    = useState(false);
  const [activeNav,    setActiveNav]    = useState("Dashboard");
  const [chartTab,     setChartTab]     = useState("5Y");
  const [year,         setYear]         = useState(2027);
  const [selected,     setSelected]     = useState(null);
  const [chatInput,    setChatInput]    = useState("");
  const [typing,       setTyping]       = useState(false);
  const [messages,     setMessages]     = useState([
    { role:"ai",   text:"Hello! I'm your AI investment advisor. I cover **all major Indian cities** — Delhi NCR, Mumbai, Pune, Bangalore, Hyderabad, Chennai, Ahmedabad, Kolkata, Jaipur, Kochi, Indore, Nagpur, and more. What's your investment goal?" },
    { role:"user", text:"Where should I invest ₹50 lakh near Pune?" },
    { role:"ai",   text:"**Hinjewadi Phase III** (score 88/100) — Pune Metro Phase 2 + 3 IT parks drive **+55% by 2030**. Entry ₹8,100/sqft → ₹12,500–14,000. Risk: Low. Want me to compare with other Pune zones like Baner or Wakad?" },
  ]);
  const chatEndRef = useRef(null);

  // Section refs for smooth scroll
  const refs = {
    "Dashboard":    useRef(null),
    "Heatmaps":     useRef(null),
    "Predictions":  useRef(null),
    "Infrastructure":useRef(null),
    "Builders":     useRef(null),
    "AI Advisor":   useRef(null),
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  const timelinePreds = useMemo(() => {
    const yrs = year - 2025;
    return BASE_DATA.map(d => {
      const pred = Math.round(d.base * Math.pow(1 + d.rate, yrs));
      const pct  = Math.round(((pred - d.base) / d.base) * 100);
      return { area:d.area, pred, pct };
    });
  }, [year]);

  const sendMessage = useCallback(() => {
    const val = chatInput.trim();
    if (!val || typing) return;
    setChatInput("");
    setMessages(p => [...p, { role:"user", text:val }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { role:"ai", text:getAIResponse(val) }]);
      setTyping(false);
    }, 900 + Math.random() * 500);
  }, [chatInput, typing]);

  function renderMsg(text) {
    return text.split(/\*\*(.*?)\*\*/g).map((p,i) =>
      i%2===1 ? <strong key={i}>{p}</strong> : p
    );
  }

  function navClick(link) {
    setActiveNav(link);
    refs[link]?.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  if (showAdmin) {
    return <AdminPanel onBack={()=>setShowAdmin(false)} user={user} />;
  }

  return (
    <div className="fc-root">

      {/* ── NAV ── */}
      <nav className="fc-nav">
        <div className="fc-logo"><div className="fc-logo-dot"/>FutureCity</div>
        <div className="fc-nav-links">
          {NAV_LINKS.map(l=>(
            <button key={l} className={`fc-nav-link${activeNav===l?" active":""}`} onClick={()=>navClick(l)}>{l}</button>
          ))}
        </div>
        <div className="fc-nav-right">
          <span className="fc-badge">Beta</span>
          {user ? (
            <>
              <span style={{ fontSize:12,color:"#64748b" }}>{user.fullName}</span>
              <button className="fc-btn fc-btn-ghost" onClick={()=>setShowAdmin(true)}>⚙ Admin</button>
              <button className="fc-btn fc-btn-ghost" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <>
              <button className="fc-btn fc-btn-ghost" onClick={onSignIn}>Sign in</button>
              <button className="fc-btn fc-btn-primary" onClick={onGetStarted}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="fc-hero" ref={refs["Dashboard"]}>
        <div className="fc-hero-pill">⚡ AI-Powered Property Intelligence Platform</div>
        <h1>Invest <span>before</span> prices rise</h1>
        <p>FutureCity uses AI, government project data, and infrastructure analytics to predict which locations across India will become highly valuable in the next 3–10 years.</p>
        <div className="fc-hero-actions">
          <button className="fc-hero-btn fc-hero-btn-primary" onClick={()=>navClick("Heatmaps")}>Explore Growth Map ↗</button>
          <button className="fc-hero-btn fc-hero-btn-secondary" onClick={()=>navClick("AI Advisor")}>Ask AI Advisor</button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="fc-stats">
        {STATS.map(s=>(
          <div key={s.label} className="fc-stat">
            <div className="fc-stat-num">{s.num}</div>
            <div className="fc-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── REAL MAP ── */}
      <div className="fc-section" ref={refs["Heatmaps"]}>
        <div className="fc-section-header">
          <div className="fc-section-title">🗺 Growth Heatmap — India <span className="fc-section-tag">Live</span></div>
        </div>
        <RealMap />
      </div>

      {/* ── HOTSPOTS ── */}
      <div className="fc-section">
        <div className="fc-section-header">
          <div className="fc-section-title">🔥 Top Investment Hotspots</div>
          <button style={{ fontSize:12,color:"var(--fc-accent)",background:"none",border:"none",cursor:"pointer" }}
            onClick={()=>navClick("Predictions")}>View all →</button>
        </div>
        <div className="fc-hotspots">
          {HOTSPOTS.map(h=>(
            <div key={h.id} className="fc-hotspot" onClick={()=>setSelected(h)}>
              <div className="fc-hotspot-top">
                <div><div className="fc-hotspot-city">{h.city}</div><div className="fc-hotspot-zone">{h.zone}</div></div>
                <div className={`fc-score ${h.scoreClass}`}>{h.score}</div>
              </div>
              <div className="fc-hotspot-bar">
                <div className="fc-hotspot-fill" style={{ width:`${h.score}%`,background:h.barColor }}/>
              </div>
              <div className="fc-hotspot-meta">
                <span><span className="fc-up">↑{h.growth}</span> {h.years}</span>
                <span>{h.price}</span>
                <span>Risk: {h.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRICE CHART ── */}
      <div className="fc-section" ref={refs["Predictions"]}>
        <div className="fc-chart-wrap">
          <div className="fc-chart-header">
            <div>
              <div className="fc-chart-title">Price appreciation forecast</div>
              <div className="fc-chart-sub">Predicted growth · INR/sqft</div>
            </div>
            <div className="fc-chart-tabs">
              {["5Y","3Y","10Y"].map(t=>(
                <button key={t} className={`fc-chart-tab${chartTab===t?" active":""}`} onClick={()=>setChartTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="fc-chart-legend">
            {[["#10b981","Dwarka Exp."],["#3b82f6","Hinjewadi"],["#8b5cf6","Navi Mumbai"],["#f59e0b","Gachibowli"]].map(([c,l])=>(
              <span key={l} style={{ display:"flex",alignItems:"center",gap:4 }}>
                <span className="fc-legend-swatch" style={{ background:c }}/>{l}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CHART_DATA[chartTab]}>
              <CartesianGrid stroke="rgba(99,179,237,0.06)"/>
              <XAxis dataKey="yr" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Line type="monotone" dataKey="dw" name="Dwarka Exp."  stroke="#10b981" strokeWidth={2} dot={{ r:3 }} activeDot={{ r:5 }}/>
              <Line type="monotone" dataKey="hi" name="Hinjewadi"    stroke="#3b82f6" strokeWidth={2} dot={{ r:3 }} activeDot={{ r:5 }}/>
              <Line type="monotone" dataKey="nm" name="Navi Mumbai"  stroke="#8b5cf6" strokeWidth={2} dot={{ r:3 }} activeDot={{ r:5 }}/>
              <Line type="monotone" dataKey="gc" name="Gachibowli"   stroke="#f59e0b" strokeWidth={2} dot={{ r:3 }} strokeDasharray="4 3" activeDot={{ r:5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── INFRASTRUCTURE ── */}
      <div className="fc-section" ref={refs["Infrastructure"]}>
        <div className="fc-section-header">
          <div className="fc-section-title">🏗 Infrastructure Intelligence</div>
          <span className="fc-section-tag">340 projects</span>
        </div>
        <div className="fc-infra-grid">
          {INFRA.map(p=>(
            <div key={p.name} className="fc-infra-card">
              <div className="fc-infra-top">
                <div className="fc-infra-icon" style={{ background:p.iconBg }}>{p.icon}</div>
                <div><div className="fc-infra-name">{p.name}</div><div className="fc-infra-loc">{p.loc}</div></div>
              </div>
              <div style={{ marginBottom:8 }}>
                <span className={`fc-infra-status ${p.statusClass}`}>
                  <span style={{ width:5,height:5,borderRadius:"50%",background:p.statusDot,display:"inline-block" }}/>
                  {p.statusText}
                </span>
              </div>
              <div className="fc-infra-impact">
                Estimated price impact: <span className="fc-impact-val">{p.impact}</span> within {p.radius} radius
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RISK ANALYSIS ── */}
      <div className="fc-section">
        <div className="fc-section-header">
          <div className="fc-section-title">🛡 Area Risk Analysis</div>
        </div>
        <div className="fc-risk-grid">
          {RISKS.map(r=>(
            <div key={r.area} className="fc-risk-card">
              <div className="fc-risk-header">
                <div className="fc-risk-area">{r.area}</div>
                <div className={`fc-risk-score ${r.cls}`}>{r.score}</div>
              </div>
              <div className="fc-risk-bar"><div className="fc-risk-fill" style={{ width:`${r.score}%`,background:r.fill }}/></div>
              <div className="fc-risk-tags">{r.tags.map(t=><span key={t} className="fc-risk-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="fc-section">
        <div className="fc-timeline">
          <div className="fc-timeline-title">⏱ Future timeline simulation</div>
          <div className="fc-year-display">{year}</div>
          <div className="fc-slider-wrap">
            <div className="fc-slider-label"><span>2025</span><span>2030</span><span>2035</span></div>
            <input type="range" min="2025" max="2035" step="1" value={year} onChange={e=>setYear(Number(e.target.value))} style={{ width:"100%" }}/>
          </div>
          <div className="fc-timeline-predictions">
            {timelinePreds.map(p=>(
              <div key={p.area} className="fc-pred-card">
                <div className="fc-pred-area">{p.area}</div>
                <div className="fc-pred-val">₹{p.pred.toLocaleString()}</div>
                <div className="fc-pred-change">+{p.pct}% from today</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BUILDERS SECTION ── */}
      <div className="fc-section" ref={refs["Builders"]}>
        <div className="fc-section-header">
          <div className="fc-section-title">🏗 Top Verified Builders</div>
          <button style={{ fontSize:12,color:"var(--fc-accent)",background:"none",border:"none",cursor:"pointer" }}
            onClick={()=>setShowAdmin(true)}>View all in Admin →</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginBottom:32 }}>
          {BUILDERS_SHOWCASE.map(b=>(
            <div key={b.name} style={{ background:"var(--fc-card)",border:"0.5px solid rgba(99,179,237,0.12)",
              borderRadius:14,padding:"18px 20px",borderLeft:`3px solid ${b.color}`,
              transition:"all 0.15s",cursor:"pointer"
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
                <div style={{ width:42,height:42,borderRadius:10,background:`${b.color}18`,
                  border:`1.5px solid ${b.color}44`,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:20
                }}>🏢</div>
                <div>
                  <div style={{ fontWeight:500,fontSize:14 }}>{b.name}</div>
                  <div style={{ fontSize:11,color:"#64748b" }}>{b.city}</div>
                </div>
                <div style={{ marginLeft:"auto",fontSize:11,padding:"2px 8px",borderRadius:4,
                  background:"rgba(16,185,129,0.1)",color:"#10b981",border:"0.5px solid rgba(16,185,129,0.3)"
                }}>{b.badge}</div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12 }}>
                {[["Score",b.score,b.color],["Projects",b.projects,"#f1f5f9"],["Since",b.founded,"#94a3b8"]].map(([k,v,c])=>(
                  <div key={k} style={{ textAlign:"center",background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"6px 4px" }}>
                    <div style={{ fontSize:10,color:"#64748b",marginBottom:2 }}>{k}</div>
                    <div style={{ fontWeight:500,color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Investor section */}
        <div className="fc-section-header" style={{ marginTop:8 }}>
          <div className="fc-section-title">💼 Active Investors</div>
          <button style={{ fontSize:12,color:"var(--fc-accent)",background:"none",border:"none",cursor:"pointer" }}
            onClick={()=>setShowAdmin(true)}>Manage in Admin →</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12 }}>
          {INVESTORS_SHOWCASE.map(inv=>(
            <div key={inv.name} style={{ background:"var(--fc-card)",border:"0.5px solid rgba(99,179,237,0.12)",
              borderRadius:12,padding:"16px 18px"
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${inv.color},${inv.color}88)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:16,fontWeight:600,color:"#fff",flexShrink:0
                }}>{inv.avatar}</div>
                <div>
                  <div style={{ fontWeight:500,fontSize:13 }}>{inv.name}</div>
                  <div style={{ fontSize:11,color:"#64748b" }}>{inv.city} · {inv.type}</div>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12 }}>
                {[["Budget",inv.budget,"#f1f5f9"],["ROI",inv.roi,"#10b981"],
                  ["Portfolio",`${inv.portfolio} props`,"#f1f5f9"],["Horizon","—","#64748b"]
                ].map(([k,v,c])=>(
                  <div key={k} style={{ background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"6px 8px" }}>
                    <div style={{ fontSize:10,color:"#64748b",marginBottom:2 }}>{k}</div>
                    <div style={{ color:c,fontWeight:500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI ADVISOR ── */}
      <div className="fc-section" ref={refs["AI Advisor"]}>
        <div className="fc-section-header">
          <div className="fc-section-title">🤖 AI Investment Advisor</div>
        </div>
        <div className="fc-advisor">
          <div className="fc-advisor-header">
            <div className="fc-ai-avatar">AI</div>
            <div>
              <div className="fc-advisor-title">FutureCity Intelligence</div>
              <div className="fc-advisor-sub">Covers all major cities across 28 Indian states</div>
            </div>
            <div className="fc-advisor-status"><div className="fc-status-dot"/>Online</div>
          </div>
          <div className="fc-chat-area">
            {messages.map((m,i)=>(
              <div key={i} className={`fc-msg fc-msg-${m.role}`}>
                <div className="fc-msg-bubble">{renderMsg(m.text)}</div>
              </div>
            ))}
            {typing && (
              <div className="fc-msg fc-msg-ai">
                <div className="fc-typing"><span/><span/><span/></div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div className="fc-chat-input">
            <input className="fc-chat-field" type="text"
              placeholder="Ask about Delhi, Mumbai, Pune, Bangalore, Hyderabad, Chennai, Kolkata, Kochi…"
              value={chatInput} onChange={e=>setChatInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendMessage()} disabled={typing}/>
            <button className="fc-send-btn" onClick={sendMessage} disabled={typing||!chatInput.trim()}>➤</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="fc-footer">
        <div className="fc-footer-logo">FutureCity</div>
        <div className="fc-footer-links">
          <span>Architecture</span>
          <span>API Docs</span>
          <span>Pricing</span>
          <span>About</span>
        </div>
        <div className="fc-footer-copy">© 2026 FutureCity Intelligence Platform. All rights reserved.</div>
      </div>

      <HotspotModal hotspot={selected} onClose={()=>setSelected(null)}/>
    </div>
  );
}