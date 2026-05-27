/**
 * AdminPanel.jsx
 * Full Admin Control Panel for FutureCity
 * Tabs: Overview | Builders | Investors | Alerts | Users
 */

import { useState } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const SYSTEM_METRICS = [
  { label: "Active Users",      value: "12,480", delta: "+8.4%",  icon: "👤", color: "#3b82f6" },
  { label: "Predictions Run",   value: "1.24M",  delta: "+12.1%", icon: "🤖", color: "#8b5cf6" },
  { label: "Alerts Sent Today", value: "8,340",  delta: "+3.7%",  icon: "🔔", color: "#f59e0b" },
  { label: "API Requests/min",  value: "4,220",  delta: "+5.2%",  icon: "⚡", color: "#10b981" },
];

const BUILDERS = [
  { id:1, name:"Godrej Properties",  city:"Mumbai",    score:94, projects:48,  delays:2,  complaints:12,  legal:0,  quality:4.7, status:"Verified",    revenue:"₹8,200Cr", founded:1897, badges:["RERA Compliant","Zero Legal Issues","Top Rated"] },
  { id:2, name:"DLF Limited",        city:"Delhi NCR", score:88, projects:120, delays:8,  complaints:45,  legal:1,  quality:4.4, status:"Verified",    revenue:"₹14,000Cr",founded:1946, badges:["RERA Compliant","Premium Segment"] },
  { id:3, name:"Prestige Estates",   city:"Bangalore", score:91, projects:82,  delays:3,  complaints:18,  legal:0,  quality:4.6, status:"Verified",    revenue:"₹6,400Cr", founded:1986, badges:["RERA Compliant","5-Star Rated"] },
  { id:4, name:"Lodha Group",        city:"Mumbai",    score:85, projects:67,  delays:5,  complaints:28,  legal:0,  quality:4.5, status:"Verified",    revenue:"₹9,100Cr", founded:1980, badges:["RERA Compliant","Luxury Developer"] },
  { id:5, name:"Sobha Ltd",          city:"Bangalore", score:89, projects:54,  delays:2,  complaints:14,  legal:0,  quality:4.7, status:"Verified",    revenue:"₹3,200Cr", founded:1995, badges:["RERA Compliant","Quality Award"] },
  { id:6, name:"Puravankara",        city:"Bangalore", score:82, projects:41,  delays:4,  complaints:22,  legal:0,  quality:4.3, status:"Verified",    revenue:"₹2,100Cr", founded:1975, badges:["RERA Compliant","South India"] },
  { id:7, name:"Omaxe Group",        city:"NCR",       score:58, projects:34,  delays:18, complaints:134, legal:4,  quality:3.1, status:"Flagged",     revenue:"₹1,200Cr", founded:1987, badges:["Delayed Projects","Legal Disputes"] },
  { id:8, name:"Unitech Group",      city:"Delhi",     score:22, projects:15,  delays:41, complaints:890, legal:23, quality:1.8, status:"Blacklisted", revenue:"₹400Cr",   founded:1971, badges:["Blacklisted","Court Orders"] },
];

const INVESTORS = [
  { id:1,  name:"Arjun Sharma",    city:"Mumbai",    budget:"₹50L–1Cr",    type:"Residential", horizon:"5yr",  risk:"Low",    portfolio:3, roi:"+34%", status:"Active",   joined:"Jan 2024" },
  { id:2,  name:"Priya Menon",     city:"Bangalore", budget:"₹25–50L",     type:"Commercial",  horizon:"3yr",  risk:"Medium", portfolio:1, roi:"+18%", status:"Active",   joined:"Mar 2024" },
  { id:3,  name:"Rahul Gupta",     city:"Delhi NCR", budget:"₹1–2Cr",      type:"Mixed",       horizon:"7yr",  risk:"Low",    portfolio:5, roi:"+52%", status:"Active",   joined:"Nov 2023" },
  { id:4,  name:"Sneha Patil",     city:"Pune",      budget:"₹20–40L",     type:"Residential", horizon:"5yr",  risk:"Low",    portfolio:2, roi:"+28%", status:"Active",   joined:"Feb 2024" },
  { id:5,  name:"Vikram Nair",     city:"Hyderabad", budget:"₹75L–1.5Cr",  type:"Commercial",  horizon:"10yr", risk:"Low",    portfolio:4, roi:"+61%", status:"Active",   joined:"Oct 2023" },
  { id:6,  name:"Meera Iyer",      city:"Chennai",   budget:"₹30–60L",     type:"Residential", horizon:"5yr",  risk:"Medium", portfolio:2, roi:"+22%", status:"Active",   joined:"Apr 2024" },
  { id:7,  name:"Karan Mehta",     city:"Mumbai",    budget:"₹2–5Cr",      type:"Luxury",      horizon:"5yr",  risk:"Low",    portfolio:7, roi:"+48%", status:"Premium",  joined:"Jun 2023" },
  { id:8,  name:"Anita Desai",     city:"Ahmedabad", budget:"₹15–25L",     type:"Residential", horizon:"3yr",  risk:"High",   portfolio:1, roi:"+9%",  status:"Pending",  joined:"May 2024" },
];

const ALERTS = [
  { id:1, type:"🔥 HOTSPOT",    area:"Dwarka Expressway Ext.", city:"Delhi NCR", priority:"HIGH",   sent:1240, status:"Active",  time:"2 min ago"  },
  { id:2, type:"🚇 METRO",      area:"Hinjewadi Phase 3",      city:"Pune",      priority:"HIGH",   sent:980,  status:"Active",  time:"15 min ago" },
  { id:3, type:"📈 PRICE SURGE",area:"Whitefield",             city:"Bangalore", priority:"MEDIUM", sent:640,  status:"Active",  time:"1 hr ago"   },
  { id:4, type:"⚠️ RISK",       area:"Nalasopara East",        city:"Mumbai",    priority:"HIGH",   sent:2100, status:"Sent",    time:"2 hr ago"   },
  { id:5, type:"🏗 INFRA",      area:"Genome Valley Ext.",     city:"Hyderabad", priority:"MEDIUM", sent:880,  status:"Sent",    time:"4 hr ago"   },
  { id:6, type:"🚨 BUILDER",    area:"Sector 150 Noida",       city:"Noida",     priority:"LOW",    sent:340,  status:"Sent",    time:"6 hr ago"   },
];

const USERS = [
  { id:1, name:"Arjun Sharma",  email:"arjun@gmail.com",  role:"INVESTOR", city:"Mumbai",    joined:"1d ago",  status:"Active"  },
  { id:2, name:"Priya Menon",   email:"priya@hdfc.com",   role:"ANALYST",  city:"Bangalore", joined:"2d ago",  status:"Active"  },
  { id:3, name:"Rahul Gupta",   email:"rahul@gmail.com",  role:"INVESTOR", city:"Delhi",     joined:"2d ago",  status:"Active"  },
  { id:4, name:"Sneha Patil",   email:"sneha@gmail.com",  role:"BUILDER",  city:"Pune",      joined:"3d ago",  status:"Pending" },
  { id:5, name:"Vikram Nair",   email:"vikram@icici.com", role:"ADVISOR",  city:"Hyderabad", joined:"4d ago",  status:"Active"  },
  { id:6, name:"Meera Iyer",    email:"meera@gmail.com",  role:"INVESTOR", city:"Chennai",   joined:"5d ago",  status:"Active"  },
];

const HEALTH = [
  { name:"PostgreSQL",  status:"Healthy",  latency:"2ms",   color:"#10b981" },
  { name:"Redis Cache", status:"Healthy",  latency:"0.4ms", color:"#10b981" },
  { name:"Kafka",       status:"Healthy",  latency:"12ms",  color:"#10b981" },
  { name:"ML API",      status:"Healthy",  latency:"240ms", color:"#10b981" },
  { name:"PostGIS",     status:"Healthy",  latency:"5ms",   color:"#10b981" },
  { name:"Kubernetes",  status:"4/4 pods", latency:"—",     color:"#3b82f6" },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function MetricCard({ label, value, delta, icon, color }) {
  const pos = delta.startsWith("+");
  return (
    <div style={{ background:"#1a2235", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:14, padding:"18px 20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ fontSize:24 }}>{icon}</div>
        <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20,
          background: pos?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",
          color: pos?"#10b981":"#ef4444",
          border:`0.5px solid ${pos?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)"}`
        }}>{delta}</span>
      </div>
      <div style={{ fontSize:26, fontWeight:500, color, marginTop:12 }}>{value}</div>
      <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>{label}</div>
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score>=80?"#10b981":score>=60?"#f59e0b":"#ef4444";
  return (
    <div style={{ width:44, height:44, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
      background:`${color}18`, border:`2px solid ${color}44`, fontSize:14, fontWeight:500, color, flexShrink:0
    }}>{score}</div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Verified:    ["rgba(16,185,129,0.12)","#10b981","rgba(16,185,129,0.3)"],
    Flagged:     ["rgba(245,158,11,0.12)","#f59e0b","rgba(245,158,11,0.3)"],
    Blacklisted: ["rgba(239,68,68,0.12)", "#ef4444","rgba(239,68,68,0.3)"],
    Active:      ["rgba(16,185,129,0.12)","#10b981","rgba(16,185,129,0.3)"],
    Premium:     ["rgba(139,92,246,0.12)","#a78bfa","rgba(139,92,246,0.3)"],
    Pending:     ["rgba(245,158,11,0.12)","#f59e0b","rgba(245,158,11,0.3)"],
  };
  const [bg,color,border] = map[status]||map.Active;
  return <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4, background:bg, color, border:`0.5px solid ${border}` }}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const map = {
    HIGH:   ["rgba(239,68,68,0.12)", "#f87171","rgba(239,68,68,0.3)"],
    MEDIUM: ["rgba(245,158,11,0.12)","#fbbf24","rgba(245,158,11,0.3)"],
    LOW:    ["rgba(59,130,246,0.12)","#60a5fa","rgba(59,130,246,0.3)"],
  };
  const [bg,color,border] = map[priority]||map.LOW;
  return <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, background:bg, color, border:`0.5px solid ${border}` }}>{priority}</span>;
}

const tabStyle = (active) => ({
  padding:"8px 18px", border:"none", cursor:"pointer",
  background: active ? "rgba(59,130,246,0.15)" : "transparent",
  color: active ? "#60a5fa" : "#64748b",
  fontSize:13,
  borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent",
  transition:"all 0.15s",
});

// ── TABS ─────────────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:24 }}>
        {SYSTEM_METRICS.map(m => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Health */}
      <div style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:14, padding:"20px 22px", marginBottom:20 }}>
        <div style={{ fontSize:14, fontWeight:500, marginBottom:16 }}>Infrastructure health</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
          {HEALTH.map(s => (
            <div key={s.name} style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(99,179,237,0.1)", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:12, color:"#94a3b8", marginBottom:6 }}>{s.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:s.color }} />
                <span style={{ fontSize:12, color:s.color }}>{s.status}</span>
              </div>
              <div style={{ fontSize:11, color:"#475569", marginTop:4 }}>Latency: {s.latency}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:14, padding:"20px 22px" }}>
        <div style={{ fontSize:14, fontWeight:500, marginBottom:14 }}>Platform activity — last 24h</div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"0.5px solid rgba(99,179,237,0.12)" }}>
              {["Event","Count","Trend","Status"].map(h=>(
                <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"#64748b", fontWeight:400, fontSize:12 }}>{h}</th>
              ))}
            </tr>
          </thead>
<tbody>
  {[
    ["Predictions generated", "48,920", "+14%", "Normal"],
    ["Map tile requests", "1.2M", "+8%", "Cached"],
    ["AI chat queries", "6,340", "+22%", "Normal"],
    ["New registrations", "124", "+31%", "Monitoring"],
    ["Failed API calls", "18", "-40%", "Healthy"],
  ].map(([evt, cnt, tr, st]) => (
    <tr
      key={evt}
      style={{
        borderBottom: "0.5px solid rgba(99,179,237,0.06)",
      }}
    >
      <td
        style={{
          padding: "10px 12px",
          color: "#cbd5e1",
        }}
      >
        {evt}
      </td>

      <td
        style={{
          padding: "10px 12px",
          fontWeight: 500,
        }}
      >
        {cnt}
      </td>

      <td
        style={{
          padding: "10px 12px",
          color: tr.startsWith("+")
            ? "#10b981"
            : "#ef4444",
        }}
      >
        {tr}
      </td>

      <td style={{ padding: "10px 12px" }}>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 4,
            background: ["Healthy", "Normal", "Cached"].includes(st)
              ? "rgba(16,185,129,0.1)"
              : "rgba(245,158,11,0.1)",
            color: ["Healthy", "Normal", "Cached"].includes(st)
              ? "#10b981"
              : "#f59e0b",
          }}
        >
          {st}
        </span>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </>
  );
}

function BuildersTab() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = BUILDERS.filter(b => filter==="All" || b.status===filter);

  return (
    <>
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        {["All","Verified","Flagged","Blacklisted"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"6px 16px", borderRadius:8, border:"0.5px solid",
            borderColor: filter===f?"#3b82f6":"rgba(99,179,237,0.2)",
            background: filter===f?"rgba(59,130,246,0.15)":"transparent",
            color: filter===f?"#60a5fa":"#94a3b8", fontSize:12, cursor:"pointer"
          }}>{f}</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:12, color:"#64748b" }}>{filtered.length} builders</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(b=>(
          <div key={b.id} style={{
            background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:14, padding:"18px 20px",
            borderLeft:`3px solid ${b.status==="Verified"?"#10b981":b.status==="Flagged"?"#f59e0b":"#ef4444"}`,
            cursor:"pointer",
          }} onClick={()=>setSelected(selected?.id===b.id?null:b)}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:14, flexWrap:"wrap" }}>
              <ScoreBadge score={b.score} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:500, fontSize:15 }}>{b.name}</span>
                  <StatusBadge status={b.status} />
                  <span style={{ fontSize:12, color:"#64748b" }}>{b.city}</span>
                </div>
                <div style={{ display:"flex", gap:16, fontSize:12, color:"#94a3b8", marginBottom:8, flexWrap:"wrap" }}>
                  <span>Projects: <b style={{color:"#f1f5f9"}}>{b.projects}</b></span>
                  <span>Delays: <b style={{color:b.delays>10?"#ef4444":"#f1f5f9"}}>{b.delays}</b></span>
                  <span>Complaints: <b style={{color:b.complaints>50?"#ef4444":"#f1f5f9"}}>{b.complaints}</b></span>
                  <span>Legal: <b style={{color:b.legal>0?"#ef4444":"#10b981"}}>{b.legal}</b></span>
                  <span>Quality: <b style={{color:"#f59e0b"}}>★ {b.quality}</b></span>
                  <span>Revenue: <b style={{color:"#f1f5f9"}}>{b.revenue}</b></span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {b.badges.map(badge=>(
                    <span key={badge} style={{ fontSize:10, padding:"2px 8px", borderRadius:4,
                      background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(99,179,237,0.15)", color:"#94a3b8"
                    }}>{badge}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Expanded detail */}
            {selected?.id===b.id && (
              <div style={{ marginTop:16, paddingTop:16, borderTop:"0.5px solid rgba(99,179,237,0.1)",
                display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10
              }}>
                {[
                  {label:"Founded",value:b.founded},
                  {label:"Total Projects",value:b.projects},
                  {label:"Avg Quality",value:`★ ${b.quality}`},
                  {label:"Revenue",value:b.revenue},
                ].map(s=>(
                  <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:11, color:"#64748b", marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontSize:14, fontWeight:500, color:"#f1f5f9" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function InvestorsTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = INVESTORS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
        <input placeholder="Search investors..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"8px 14px", background:"rgba(255,255,255,0.04)",
            border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:8, color:"#f1f5f9", fontSize:13, outline:"none"
          }}/>
        <span style={{ alignSelf:"center", fontSize:12, color:"#64748b" }}>{filtered.length} investors</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12 }}>
        {filtered.map(inv=>(
          <div key={inv.id} style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:14, padding:"16px 18px",
            cursor:"pointer", transition:"all 0.15s",
            borderColor: selected?.id===inv.id ? "#3b82f6" : "rgba(99,179,237,0.12)"
          }} onClick={()=>setSelected(selected?.id===inv.id?null:inv)}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:500, color:"#fff", flexShrink:0
              }}>{inv.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:14 }}>{inv.name}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{inv.city}</div>
              </div>
              <StatusBadge status={inv.status} />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:12 }}>
              {[
                ["Budget",inv.budget],["Type",inv.type],
                ["Horizon",inv.horizon],["Risk",inv.risk],
              ].map(([k,v])=>(
                <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"6px 8px" }}>
                  <div style={{ color:"#64748b", marginBottom:2 }}>{k}</div>
                  <div style={{ color:"#f1f5f9", fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>

            {selected?.id===inv.id && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:"0.5px solid rgba(99,179,237,0.1)" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, fontSize:12 }}>
                  {[
                    ["Portfolio",`${inv.portfolio} props`],
                    ["ROI",inv.roi],
                    ["Joined",inv.joined],
                  ].map(([k,v])=>(
                    <div key={k} style={{ textAlign:"center", background:"rgba(255,255,255,0.03)", borderRadius:6, padding:"8px" }}>
                      <div style={{ color:"#64748b", fontSize:11, marginBottom:3 }}>{k}</div>
                      <div style={{ color: k==="ROI"?"#10b981":"#f1f5f9", fontWeight:500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function AlertsTab() {
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState(ALERTS);

  const filtered = alerts.filter(a =>
    a.area.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
        <input placeholder="Search alerts..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"8px 14px", background:"rgba(255,255,255,0.04)",
            border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:8, color:"#f1f5f9", fontSize:13, outline:"none"
          }}/>
        <button style={{ padding:"8px 18px", borderRadius:8, background:"#3b82f6", border:"none", color:"#fff", fontSize:13, cursor:"pointer" }}>
          + New Alert
        </button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(a=>(
          <div key={a.id} style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.1)", borderRadius:12,
            padding:"14px 18px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"
          }}>
            <div style={{ fontSize:20 }}>{a.type.split(" ")[0]}</div>
            <div style={{ flex:1, minWidth:140 }}>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{a.area}</div>
              <div style={{ fontSize:11, color:"#64748b" }}>{a.city} · {a.time}</div>
            </div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>📨 {a.sent.toLocaleString()}</div>
            <PriorityBadge priority={a.priority} />
            <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4,
              background: a.status==="Active"?"rgba(16,185,129,0.1)":"rgba(99,179,237,0.08)",
              color: a.status==="Active"?"#10b981":"#94a3b8",
              border:`0.5px solid ${a.status==="Active"?"rgba(16,185,129,0.3)":"rgba(99,179,237,0.15)"}`
            }}>{a.status}</span>
            <button onClick={()=>setAlerts(prev=>prev.filter(x=>x.id!==a.id))}
              style={{ fontSize:12, padding:"5px 12px", borderRadius:7, background:"rgba(239,68,68,0.1)",
                border:"0.5px solid rgba(239,68,68,0.3)", color:"#f87171", cursor:"pointer"
              }}>Dismiss</button>
          </div>
        ))}
      </div>
    </>
  );
}

function UsersTab() {
  return (
    <div style={{ background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)", borderRadius:14, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ borderBottom:"0.5px solid rgba(99,179,237,0.12)", background:"rgba(59,130,246,0.04)" }}>
            {["User","Email","Role","City","Joined","Status","Actions"].map(h=>(
              <th key={h} style={{ padding:"12px 16px", textAlign:"left", color:"#64748b", fontWeight:400, fontSize:12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {USERS.map(u=>(
            <tr key={u.id} style={{ borderBottom:"0.5px solid rgba(99,179,237,0.06)" }}>
              <td style={{ padding:"12px 16px", fontWeight:500 }}>{u.name}</td>
              <td style={{ padding:"12px 16px", color:"#94a3b8" }}>{u.email}</td>
              <td style={{ padding:"12px 16px" }}>
                <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4,
                  background:"rgba(139,92,246,0.1)", color:"#a78bfa", border:"0.5px solid rgba(139,92,246,0.3)"
                }}>{u.role}</span>
              </td>
              <td style={{ padding:"12px 16px", color:"#94a3b8" }}>{u.city}</td>
              <td style={{ padding:"12px 16px", color:"#64748b" }}>{u.joined}</td>
              <td style={{ padding:"12px 16px" }}><StatusBadge status={u.status} /></td>
              <td style={{ padding:"12px 16px" }}>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={{ fontSize:11, padding:"4px 10px", borderRadius:6,
                    background:"rgba(59,130,246,0.1)", border:"0.5px solid rgba(59,130,246,0.3)",
                    color:"#60a5fa", cursor:"pointer"
                  }}>View</button>
                  <button style={{ fontSize:11, padding:"4px 10px", borderRadius:6,
                    background:"rgba(239,68,68,0.08)", border:"0.5px solid rgba(239,68,68,0.3)",
                    color:"#f87171", cursor:"pointer"
                  }}>Block</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

export default function AdminPanel({ onBack, user }) {
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    { key:"overview",  label:"📊 Overview"   },
    { key:"builders",  label:"🏗 Builders"   },
    { key:"investors", label:"💼 Investors"  },
    { key:"alerts",    label:"🔔 Alerts"     },
    { key:"users",     label:"👥 Users"      },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0f1e", fontFamily:"system-ui", color:"#f1f5f9" }}>

      {/* Header */}
      <div style={{ background:"#111827", borderBottom:"0.5px solid rgba(99,179,237,0.12)",
        padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:100
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:20 }}>←</button>
          <span style={{ color:"#3b82f6", fontSize:16, fontWeight:500 }}>⬡ FutureCity</span>
          <span style={{ color:"#334155" }}>/</span>
          <span style={{ fontSize:14, color:"#94a3b8" }}>Admin Console</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#10b981" }} />
          <span style={{ fontSize:12, color:"#10b981" }}>All systems operational</span>
          {user && <span style={{ fontSize:12, color:"#64748b", marginLeft:8 }}>{user.fullName}</span>}
        </div>
      </div>

      <div style={{ padding:"0 24px" }}>
        {/* Tab bar */}
        <div style={{ display:"flex", gap:4, borderBottom:"0.5px solid rgba(99,179,237,0.1)",
          paddingTop:16, marginBottom:24
        }}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)} style={tabStyle(activeTab===t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab==="overview"  && <OverviewTab />}
        {activeTab==="builders"  && <BuildersTab />}
        {activeTab==="investors" && <InvestorsTab />}
        {activeTab==="alerts"    && <AlertsTab />}
        {activeTab==="users"     && <UsersTab />}

        <div style={{ height:40 }} />
      </div>
    </div>
  );
}