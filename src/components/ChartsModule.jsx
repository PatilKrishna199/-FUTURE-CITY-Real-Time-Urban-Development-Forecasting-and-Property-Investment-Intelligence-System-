/**
 * ChartsModule.jsx
 * FutureCity Analytics & Charts Dashboard.
 * Charts: Multi-city price comparison | Rent yield tracker | ROI simulator |
 *         Infrastructure impact | Risk vs Return scatter
 *
 * Uses: Recharts (install: npm install recharts)
 */

import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ReferenceLine,
} from "recharts";

// ── Data ───────────────────────────────────────────────────────────────────────

const CITIES = ["Delhi NCR", "Mumbai", "Pune", "Hyderabad", "Bangalore", "Chennai"];

/** Historical + predicted price per sqft (₹) */
const PRICE_DATA = [
  { year:"2018", delhi:4200, mumbai:9800, pune:4800, hyderabad:3200, bangalore:5100, chennai:4600 },
  { year:"2019", delhi:4550, mumbai:10200,pune:5200, hyderabad:3600, bangalore:5500, chennai:4900 },
  { year:"2020", delhi:4300, mumbai:9700, pune:4900, hyderabad:3500, bangalore:5200, chennai:4700 },
  { year:"2021", delhi:4800, mumbai:10500,pune:5600, hyderabad:4100, bangalore:5900, chennai:5200 },
  { year:"2022", delhi:5400, mumbai:11800,pune:6200, hyderabad:4900, bangalore:6800, chennai:5800 },
  { year:"2023", delhi:6100, mumbai:13200,pune:7100, hyderabad:5800, bangalore:7600, chennai:6400 },
  { year:"2024", delhi:7000, mumbai:14800,pune:7900, hyderabad:6500, bangalore:8200, chennai:7000 },
  // Predictions
  { year:"2025*",delhi:7800, mumbai:16200,pune:8800, hyderabad:7400, bangalore:9100, chennai:7700 },
  { year:"2026*",delhi:8700, mumbai:18000,pune:9900, hyderabad:8500, bangalore:10200,chennai:8500 },
  { year:"2027*",delhi:9800, mumbai:20100,pune:11200,hyderabad:9800, bangalore:11400,chennai:9400 },
  { year:"2028*",delhi:11000,mumbai:22500,pune:12700,hyderabad:11200,bangalore:12800,chennai:10500},
  { year:"2030*",delhi:13500,mumbai:27000,pune:15500,hyderabad:13800,bangalore:15500,chennai:12800},
];

/** Rental yield % by city */
const RENTAL_DATA = [
  { quarter:"Q1'23", delhi:2.8, mumbai:2.1, pune:3.4, hyderabad:3.8, bangalore:3.9, chennai:3.2 },
  { quarter:"Q2'23", delhi:2.9, mumbai:2.2, pune:3.5, hyderabad:4.0, bangalore:4.1, chennai:3.3 },
  { quarter:"Q3'23", delhi:3.0, mumbai:2.3, pune:3.6, hyderabad:4.2, bangalore:4.2, chennai:3.4 },
  { quarter:"Q4'23", delhi:3.1, mumbai:2.4, pune:3.7, hyderabad:4.3, bangalore:4.4, chennai:3.5 },
  { quarter:"Q1'24", delhi:3.2, mumbai:2.5, pune:3.9, hyderabad:4.5, bangalore:4.6, chennai:3.6 },
  { quarter:"Q2'24", delhi:3.3, mumbai:2.6, pune:4.0, hyderabad:4.7, bangalore:4.8, chennai:3.7 },
  { quarter:"Q3'24", delhi:3.4, mumbai:2.6, pune:4.1, hyderabad:4.9, bangalore:5.0, chennai:3.8 },
  { quarter:"Q4'24", delhi:3.5, mumbai:2.7, pune:4.2, hyderabad:5.1, bangalore:5.2, chennai:3.9 },
];

/** Infrastructure impact on price (% increase per zone type) */
const IMPACT_DATA = [
  { type:"Metro Station",    within1km:45, within3km:28, within5km:15, within10km:8 },
  { type:"Int'l Airport",   within1km:18, within3km:38, within5km:52, within10km:40 },
  { type:"IT Park",         within1km:55, within3km:42, within5km:30, within10km:18 },
  { type:"Ring Road",       within1km:22, within3km:35, within5km:28, within10km:20 },
  { type:"Smart City Zone", within1km:40, within3km:38, within5km:32, within10km:22 },
];

/** Risk vs Return scatter data */
const RISK_RETURN_DATA = [
  { area:"Dwarka Exp.",   risk:12, returnPct:68, size:92, city:"Delhi NCR" },
  { area:"Hinjewadi",     risk:18, returnPct:55, size:88, city:"Pune"     },
  { area:"Navi Mumbai",   risk:42, returnPct:72, size:85, city:"Mumbai"   },
  { area:"Gachibowli",    risk:35, returnPct:43, size:74, city:"Hyderabad"},
  { area:"Whitefield",    risk:28, returnPct:48, size:79, city:"Bangalore"},
  { area:"OMR Corridor",  risk:22, returnPct:38, size:71, city:"Chennai"  },
  { area:"Noida Ext.",    risk:45, returnPct:65, size:68, city:"Delhi NCR"},
  { area:"Baner-Balewadi",risk:25, returnPct:52, size:82, city:"Pune"    },
  { area:"Wakad",         risk:20, returnPct:49, size:77, city:"Pune"    },
  { area:"HITEC City",    risk:30, returnPct:46, size:80, city:"Hyderabad"},
];

/** Zone radar data for hotspot scoring */
const RADAR_ZONES = {
  "Dwarka Exp.": [
    {axis:"Infrastructure",value:88},{axis:"Connectivity",value:92},{axis:"Demand",value:85},
    {axis:"Affordability",value:78},{axis:"Future Growth",value:95},{axis:"Safety",value:82},
  ],
  "Hinjewadi": [
    {axis:"Infrastructure",value:90},{axis:"Connectivity",value:80},{axis:"Demand",value:88},
    {axis:"Affordability",value:72},{axis:"Future Growth",value:92},{axis:"Safety",value:85},
  ],
  "Navi Mumbai": [
    {axis:"Infrastructure",value:82},{axis:"Connectivity",value:75},{axis:"Demand",value:94},
    {axis:"Affordability",value:55},{axis:"Future Growth",value:96},{axis:"Safety",value:70},
  ],
};

// ── Color palette ─────────────────────────────────────────────────────────────

const CITY_COLORS = {
  delhi:    "#3b82f6",
  mumbai:   "#8b5cf6",
  pune:     "#10b981",
  hyderabad:"#f59e0b",
  bangalore:"#ec4899",
  chennai:  "#06b6d4",
};

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label, prefix="₹", suffix="" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#1a2235", border:"0.5px solid rgba(99,179,237,0.25)",
      borderRadius:10, padding:"10px 14px", fontSize:12,
    }}>
      <div style={{ color:"#94a3b8", marginBottom:8 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:4 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:p.color }} />
          <span style={{ color:"#94a3b8" }}>{p.name}:</span>
          <span style={{ color:"#f1f5f9", fontWeight:500 }}>
            {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Shared card wrapper ────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, actions }) {
  return (
    <div style={{
      background:"#111827", border:"0.5px solid rgba(99,179,237,0.12)",
      borderRadius:16, padding:"22px 24px",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:500, color:"#f1f5f9" }}>{title}</div>
          {subtitle && <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>{subtitle}</div>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

// ── ROI Calculator ─────────────────────────────────────────────────────────────

function ROICalculator() {
  const [investment, setInvestment] = useState(5000000);
  const [years, setYears]           = useState(5);
  const [city, setCity]             = useState("pune");

  const growthRates = { delhi:0.118, mumbai:0.125, pune:0.140, hyderabad:0.148, bangalore:0.138, chennai:0.112 };

  const data = useMemo(() => {
    const rate = growthRates[city];
    return Array.from({ length: years + 1 }, (_, i) => ({
      year: `Y${i}`,
      value: Math.round(investment * Math.pow(1 + rate, i)),
    }));
  }, [investment, years, city]);

  const finalValue = data[data.length - 1].value;
  const profit     = finalValue - investment;
  const roi        = Math.round((profit / investment) * 100);

  return (
    <ChartCard
      title="Investment ROI simulator"
      subtitle="Compound appreciation calculator"
      actions={
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{
              padding:"5px 10px", background:"rgba(255,255,255,0.05)",
              border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:7,
              color:"#f1f5f9", fontSize:12, outline:"none",
            }}
          >
            {Object.keys(growthRates).map(c => (
              <option key={c} value={c} style={{ background:"#1a2235" }}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* Sliders */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#94a3b8", marginBottom:6 }}>
            <span>Investment</span>
            <span style={{ color:"#f1f5f9" }}>₹{(investment/100000).toFixed(0)}L</span>
          </div>
          <input type="range" min={500000} max={50000000} step={500000}
            value={investment} onChange={e => setInvestment(Number(e.target.value))}
            style={{ width:"100%" }} />
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#94a3b8", marginBottom:6 }}>
            <span>Horizon</span>
            <span style={{ color:"#f1f5f9" }}>{years} years</span>
          </div>
          <input type="range" min={1} max={15} step={1}
            value={years} onChange={e => setYears(Number(e.target.value))}
            style={{ width:"100%" }} />
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Invested",     value:`₹${(investment/100000).toFixed(0)}L`, color:"#94a3b8" },
          { label:"Predicted value", value:`₹${(finalValue/100000).toFixed(1)}L`, color:"#10b981" },
          { label:"ROI",          value:`+${roi}%`,                            color:"#3b82f6" },
        ].map(s => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(99,179,237,0.1)", borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#64748b", marginBottom:5 }}>{s.label}</div>
            <div style={{ fontSize:18, fontWeight:500, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(99,179,237,0.06)" />
          <XAxis dataKey="year" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}
            tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
          <Tooltip content={<DarkTooltip prefix="₹" />} />
          <ReferenceLine y={investment} stroke="#ef444455" strokeDasharray="4 3" />
          <Line type="monotone" dataKey="value" name="Portfolio value"
            stroke={CITY_COLORS[city]} strokeWidth={2.5} dot={{ r:4, fill:CITY_COLORS[city] }}
            activeDot={{ r:6 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ── Main Charts Module ─────────────────────────────────────────────────────────

export default function ChartsModule() {
  const [priceTab, setPriceTab]     = useState("5Y");
  const [activeCities, setActive]   = useState(new Set(["delhi","mumbai","pune","hyderabad"]));
  const [radarZone, setRadarZone]   = useState("Dwarka Exp.");

  const toggleCity = (c) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(c)) { if (next.size > 1) next.delete(c); }
      else next.add(c);
      return next;
    });
  };

  // Filter price data by tab
  const YEAR_FILTER = { "3Y":3, "5Y":5, "Full":99 };
  const priceData = useMemo(() => {
    const all = PRICE_DATA;
    const n   = YEAR_FILTER[priceTab] || 5;
    return priceTab === "Full" ? all : all.slice(-n - 1);
  }, [priceTab]);

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0f1e",
      fontFamily:"'DM Sans', system-ui, sans-serif", color:"#f1f5f9", padding:24,
    }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:500, marginBottom:4 }}>Market analytics</h2>
        <p style={{ fontSize:14, color:"#64748b" }}>Real-time property intelligence across major Indian metros</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

        {/* ── 1. Multi-city price comparison ── */}
        <ChartCard
          title="Multi-city price comparison"
          subtitle="Historical prices + AI predictions (marked *) · ₹ per sqft"
          actions={
            <div style={{ display:"flex", gap:4 }}>
              {["3Y","5Y","Full"].map(t => (
                <button key={t} onClick={() => setPriceTab(t)} style={{
                  padding:"4px 12px", borderRadius:7, border:"0.5px solid",
                  borderColor: priceTab===t ? "#3b82f6" : "rgba(99,179,237,0.2)",
                  background: priceTab===t ? "rgba(59,130,246,0.15)" : "transparent",
                  color: priceTab===t ? "#60a5fa" : "#64748b",
                  fontSize:12, cursor:"pointer",
                }}>{t}</button>
              ))}
            </div>
          }
        >
          {/* City toggles */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
            {Object.entries(CITY_COLORS).map(([c, color]) => (
              <button
                key={c}
                onClick={() => toggleCity(c)}
                style={{
                  display:"flex", alignItems:"center", gap:6, padding:"4px 10px",
                  borderRadius:6, border:`0.5px solid ${activeCities.has(c) ? color+"66" : "rgba(99,179,237,0.15)"}`,
                  background: activeCities.has(c) ? `${color}15` : "transparent",
                  color: activeCities.has(c) ? color : "#475569",
                  fontSize:12, cursor:"pointer",
                }}
              >
                <div style={{ width:8, height:8, borderRadius:2, background: activeCities.has(c) ? color : "#475569" }} />
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={priceData}>
              <CartesianGrid stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="year" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<DarkTooltip prefix="₹" suffix="/sqft" />} />
              {Object.entries(CITY_COLORS).map(([c, color]) =>
                activeCities.has(c) ? (
                  <Line key={c} type="monotone" dataKey={c} name={c.charAt(0).toUpperCase()+c.slice(1)}
                    stroke={color} strokeWidth={2} dot={false} activeDot={{ r:5 }}
                    strokeDasharray={c === "mumbai" ? "none" : "none"} />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 2. Rental Yield Tracker ── */}
        <ChartCard
          title="Rental yield tracker"
          subtitle="Gross rental yield % by city — quarterly trend"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={RENTAL_DATA}>
              <CartesianGrid stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="quarter" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`} domain={[1.8, 5.8]} />
              <Tooltip content={<DarkTooltip prefix="" suffix="%" />} />
              <Legend
                formatter={v => <span style={{ fontSize:12, color:"#94a3b8" }}>{v}</span>}
                wrapperStyle={{ paddingTop:12 }}
              />
              {Object.entries(CITY_COLORS).map(([c, color]) => (
                <Line key={c} type="monotone" dataKey={c} name={c.charAt(0).toUpperCase()+c.slice(1)}
                  stroke={color} strokeWidth={2} dot={false} activeDot={{ r:4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 3. Infrastructure Impact ── */}
        <ChartCard
          title="Infrastructure impact on property prices"
          subtitle="Estimated % price increase by proximity radius"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={IMPACT_DATA} barGap={4}>
              <CartesianGrid stroke="rgba(99,179,237,0.06)" vertical={false} />
              <XAxis dataKey="type" tick={{ fill:"#64748b", fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`} />
              <Tooltip content={<DarkTooltip prefix="" suffix="%" />} />
              <Bar dataKey="within1km"  name="Within 1km" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="within3km"  name="Within 3km" fill="#8b5cf6" radius={[4,4,0,0]} />
              <Bar dataKey="within5km"  name="Within 5km" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="within10km" name="Within 10km"fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginTop:8 }}>
            {[["#3b82f6","<1km"],["#8b5cf6","<3km"],["#10b981","<5km"],["#f59e0b","<10km"]].map(([c,l]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#94a3b8" }}>
                <span style={{ width:10, height:10, borderRadius:2, background:c, display:"inline-block" }} />{l}
              </span>
            ))}
          </div>
        </ChartCard>

        {/* ── 4. Risk vs Return Scatter ── */}
        <ChartCard
          title="Risk vs return analysis"
          subtitle="Bubble size = investment score. X = risk (lower is better), Y = 5-year predicted return %"
        >
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top:10, right:20, bottom:10, left:0 }}>
              <CartesianGrid stroke="rgba(99,179,237,0.06)" />
              <XAxis dataKey="risk" name="Risk score" type="number" domain={[0,60]}
                tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}
                label={{ value:"Risk →", position:"insideBottom", offset:-5, fill:"#475569", fontSize:11 }} />
              <YAxis dataKey="returnPct" name="5Y return" type="number" domain={[20,90]}
                tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background:"#1a2235", border:"0.5px solid rgba(99,179,237,0.25)", borderRadius:10, padding:"10px 14px", fontSize:12 }}>
                      <div style={{ fontWeight:500, marginBottom:4 }}>{d.area}</div>
                      <div style={{ color:"#94a3b8" }}>{d.city}</div>
                      <div style={{ color:"#10b981", marginTop:4 }}>Return: +{d.returnPct}%</div>
                      <div style={{ color:"#ef4444" }}>Risk: {d.risk}</div>
                      <div style={{ color:"#3b82f6" }}>Score: {d.size}</div>
                    </div>
                  );
                }}
              />
              <Scatter data={RISK_RETURN_DATA} fill="#3b82f6"
                shape={({ cx, cy, payload }) => (
                  <circle cx={cx} cy={cy} r={payload.size / 12}
                    fill={payload.city === "Mumbai" ? "#8b5cf6" : payload.city === "Pune" ? "#10b981" : payload.city === "Hyderabad" ? "#f59e0b" : "#3b82f6"}
                    fillOpacity={0.7} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:12, marginTop:8, flexWrap:"wrap" }}>
            {[["#3b82f6","Delhi NCR"],["#8b5cf6","Mumbai"],["#10b981","Pune"],["#f59e0b","Hyderabad"]].map(([c,l]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#94a3b8" }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block", opacity:0.7 }} />{l}
              </span>
            ))}
          </div>
        </ChartCard>

        {/* ── 5. Hotspot Radar ── */}
        <ChartCard
          title="Zone investment profile"
          subtitle="Multi-dimensional scoring radar — select a zone to compare"
          actions={
            <div style={{ display:"flex", gap:4 }}>
              {Object.keys(RADAR_ZONES).map(z => (
                <button key={z} onClick={() => setRadarZone(z)} style={{
                  padding:"4px 12px", borderRadius:7, border:"0.5px solid",
                  borderColor: radarZone===z ? "#10b981" : "rgba(99,179,237,0.2)",
                  background: radarZone===z ? "rgba(16,185,129,0.12)" : "transparent",
                  color: radarZone===z ? "#10b981" : "#64748b",
                  fontSize:11, cursor:"pointer", whiteSpace:"nowrap",
                }}>{z}</button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={RADAR_ZONES[radarZone]}>
              <PolarGrid stroke="rgba(99,179,237,0.12)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill:"#94a3b8", fontSize:11 }} />
              <PolarRadiusAxis angle={90} domain={[0,100]} tick={{ fill:"#475569", fontSize:9 }} />
              <Radar name={radarZone} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 6. ROI Calculator ── */}
        <ROICalculator />

      </div>
    </div>
  );
}
