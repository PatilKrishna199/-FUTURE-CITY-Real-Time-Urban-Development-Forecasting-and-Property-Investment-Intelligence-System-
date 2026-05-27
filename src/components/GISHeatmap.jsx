/**
 * RealMap.jsx
 * Live Leaflet.js map with 4 working layers:
 * - Growth Heatmap (leaflet.heat)
 * - Infrastructure markers (pulsing icons + popups)
 * - Metro Corridors (polylines + station dots)
 * - Risk Zones (colored circles)
 *
 * CDN loaded — no extra npm install needed beyond react
 */

import { useEffect, useRef, useState } from "react";

// ── Heatmap intensity points [lat, lng, intensity] ───────────────────────────
const HEAT_POINTS = [
  // Delhi NCR
  [28.6139,77.2090,0.95],[28.5355,77.3910,0.88],[28.6304,77.2177,0.80],
  [28.7041,77.1025,0.75],[28.4595,77.0266,0.85],[28.5012,77.0870,0.78],
  [28.4089,77.3178,0.82],[28.6692,77.4538,0.70],
  // Mumbai
  [19.0760,72.8777,0.90],[19.1136,72.8697,0.82],[19.2183,72.9781,0.92],
  [18.9220,72.8347,0.70],[19.0330,73.0297,0.87],[19.1644,72.9454,0.79],
  // Pune
  [18.5204,73.8567,0.83],[18.5642,73.7769,0.91],[18.6298,73.7997,0.86],
  [18.4529,73.8499,0.72],[18.5822,73.9197,0.79],[18.6167,73.7378,0.85],
  // Hyderabad
  [17.3850,78.4867,0.88],[17.4435,78.3772,0.85],[17.4947,78.3996,0.78],
  [17.3312,78.5531,0.74],[17.5041,78.3104,0.82],
  // Bangalore
  [12.9716,77.5946,0.87],[12.9279,77.6271,0.82],[13.0358,77.5970,0.79],
  [12.8563,77.6245,0.76],[12.9352,77.6244,0.83],
  // Chennai
  [13.0827,80.2707,0.76],[13.1067,80.1080,0.81],[13.0524,80.2505,0.73],
  // Ahmedabad
  [23.0225,72.5714,0.74],[23.0732,72.5038,0.70],
  // Kolkata
  [22.5726,88.3639,0.72],[22.6213,88.3981,0.68],
  // Jaipur
  [26.9124,75.7873,0.71],[26.8467,75.8108,0.67],
  // Surat
  [21.1702,72.8311,0.69],
  // Lucknow
  [26.8467,80.9462,0.65],[26.9124,81.0000,0.60],
  // Nagpur
  [21.1458,79.0882,0.68],
  // Chandigarh
  [30.7333,76.7794,0.66],
  // Kochi
  [9.9312,76.2673,0.73],[10.0467,76.3254,0.70],
];

// ── Infrastructure projects ───────────────────────────────────────────────────
const INFRA_PROJECTS = [
  { id:1,  lat:28.6139, lng:77.2890, type:"metro",   name:"Delhi-Meerut RRTS",          city:"Delhi NCR",  status:"active",  impact:"+35%", completion:"2027" },
  { id:2,  lat:19.2183, lng:73.0797, type:"airport",  name:"Navi Mumbai Airport",         city:"Mumbai",     status:"active",  impact:"+55%", completion:"2028" },
  { id:3,  lat:18.6298, lng:73.7997, type:"highway",  name:"Pune Ring Road Phase 2",       city:"Pune",       status:"planned", impact:"+28%", completion:"2029" },
  { id:4,  lat:17.4435, lng:78.3772, type:"sez",      name:"Hyderabad IT SEZ Expansion",   city:"Hyderabad",  status:"review",  impact:"+42%", completion:"2028" },
  { id:5,  lat:28.4595, lng:77.0266, type:"metro",   name:"Dwarka Expressway Metro",       city:"Delhi NCR",  status:"active",  impact:"+40%", completion:"2026" },
  { id:6,  lat:12.9716, lng:77.5946, type:"highway",  name:"Bangalore Peripheral Ring Rd", city:"Bangalore",  status:"planned", impact:"+32%", completion:"2030" },
  { id:7,  lat:19.0760, lng:72.8777, type:"metro",   name:"Mumbai Metro Line 3",           city:"Mumbai",     status:"active",  impact:"+30%", completion:"2025" },
  { id:8,  lat:13.0827, lng:80.2707, type:"highway",  name:"Chennai Outer Ring Road",       city:"Chennai",    status:"active",  impact:"+25%", completion:"2026" },
  { id:9,  lat:23.0225, lng:72.5714, type:"metro",   name:"Ahmedabad Metro Phase 2",        city:"Ahmedabad",  status:"active",  impact:"+28%", completion:"2027" },
  { id:10, lat:22.5726, lng:88.3639, type:"sez",      name:"Kolkata IT Hub Rajarhat",        city:"Kolkata",    status:"review",  impact:"+35%", completion:"2028" },
  { id:11, lat:21.1458, lng:79.0882, type:"highway",  name:"Nagpur MIHAN Expansion",        city:"Nagpur",     status:"active",  impact:"+45%", completion:"2027" },
  { id:12, lat:26.9124, lng:75.7873, type:"metro",   name:"Jaipur Metro Phase 2",           city:"Jaipur",     status:"planned", impact:"+22%", completion:"2030" },
];

// ── Metro corridors ───────────────────────────────────────────────────────────
const METRO_CORRIDORS = [
  { id:"delhi-meerut", name:"Delhi–Meerut RRTS",      color:"#3b82f6",
    coords:[[28.7041,77.1025],[28.6304,77.2177],[28.6139,77.2090],[28.5355,77.3910]] },
  { id:"pune-metro",   name:"Pune Metro Phase 2",      color:"#10b981",
    coords:[[18.4529,73.8499],[18.5204,73.8567],[18.5642,73.7769],[18.6298,73.7997]] },
  { id:"hyd-metro",    name:"Hyderabad Metro Ext.",    color:"#8b5cf6",
    coords:[[17.3850,78.4867],[17.4435,78.3772],[17.4947,78.3996]] },
  { id:"mum-metro",    name:"Mumbai Metro Line 3",     color:"#f59e0b",
    coords:[[19.0760,72.8777],[19.0500,72.8900],[19.0200,72.8500],[18.9220,72.8347]] },
  { id:"blr-metro",    name:"Bangalore Metro Green",   color:"#06b6d4",
    coords:[[12.8563,77.6245],[12.9279,77.6271],[12.9716,77.5946],[13.0358,77.5970]] },
];

// ── Risk zones ────────────────────────────────────────────────────────────────
const RISK_ZONES = [
  { lat:19.0760, lng:72.8777, radius:12000, score:42, area:"Nalasopara",      color:"#f59e0b" },
  { lat:28.9000, lng:77.1500, radius:10000, score:58, area:"Bhiwadi",         color:"#ef4444" },
  { lat:13.0200, lng:80.1700, radius:8000,  score:35, area:"Redhills",        color:"#f59e0b" },
  { lat:17.3200, lng:78.5500, radius:9000,  score:28, area:"Saroornagar",     color:"#10b981" },
  { lat:12.8900, lng:77.5500, radius:7000,  score:22, area:"Bannerghatta",    color:"#10b981" },
];

// ── Icon helpers ──────────────────────────────────────────────────────────────
const TYPE_COLORS  = { metro:"#3b82f6", airport:"#10b981", highway:"#f59e0b", sez:"#8b5cf6" };
const STATUS_COLORS= { active:"#10b981", planned:"#f59e0b", review:"#3b82f6" };
const TYPE_ICONS   = { metro:"🚇", airport:"✈️", highway:"🛣️", sez:"🏗️" };

const LAYERS_LIST  = ["Heatmap","Infrastructure","Metro Lines","Risk Zones"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function RealMap() {
  const mapRef     = useRef(null);   // DOM node
  const leafletRef = useRef(null);   // Leaflet map instance
  const layersRef  = useRef({});     // { heatmap, infra, metro, risk }

  const [activeLayer, setActiveLayer] = useState("Heatmap");
  const [mapReady,    setMapReady]    = useState(false);
  const [selected,    setSelected]    = useState(null);

  // ── Load Leaflet + leaflet.heat from CDN then init ──────────────────────────
  useEffect(() => {
    if (leafletRef.current) return;

    const addCss = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    };

    const addScript = (src, onload) => {
      if (document.querySelector(`script[src="${src}"]`)) { onload(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = onload;
      document.head.appendChild(s);
    };

    addCss("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    addScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", () => {
      addScript("https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js", () => {
        initMap();
      });
    });

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  function initMap() {
    const L = window.L;
    if (!L || !mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
    });

    // Dark CartoDB tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap © CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    leafletRef.current = map;

    buildHeatmapLayer(L, map);
    buildInfraLayer(L, map);
    buildMetroLayer(L, map);
    buildRiskLayer(L, map);

    // Default: show heatmap
    layersRef.current.heatmap?.addTo(map);
    setMapReady(true);
  }

  // ── Heatmap ─────────────────────────────────────────────────────────────────
  function buildHeatmapLayer(L, map) {
    const heat = L.heatLayer(HEAT_POINTS, {
      radius: 40, blur: 28, maxZoom: 10,
      gradient: { 0.0:"#042c53", 0.3:"#185fa5", 0.5:"#0f6e56", 0.7:"#f59e0b", 0.9:"#10b981", 1.0:"#00ff88" },
    });
    layersRef.current.heatmap = heat;
  }

  // ── Infrastructure markers ───────────────────────────────────────────────────
  function buildInfraLayer(L, map) {
    const group = L.layerGroup();

    INFRA_PROJECTS.forEach(proj => {
      const color       = TYPE_COLORS[proj.type]   || "#3b82f6";
      const statusColor = STATUS_COLORS[proj.status]|| "#10b981";

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="width:34px;height:34px;border-radius:50%;background:${color}22;
            border:2px solid ${color};display:flex;align-items:center;justify-content:center;
            font-size:15px;cursor:pointer;box-shadow:0 0 12px ${color}66;
            animation:fcPulse 2s ease-in-out infinite;">
            ${TYPE_ICONS[proj.type]}
          </div>
          <style>@keyframes fcPulse{0%,100%{box-shadow:0 0 8px ${color}44;}50%{box-shadow:0 0 22px ${color}99;}}</style>`,
        iconSize: [34,34], iconAnchor: [17,17],
      });

      const marker = L.marker([proj.lat, proj.lng], { icon });

      marker.bindPopup(`
        <div style="background:#1a2235;color:#f1f5f9;border:1px solid ${color}44;border-radius:10px;
          padding:14px;min-width:220px;font-family:system-ui;font-size:13px;">
          <div style="font-weight:600;margin-bottom:5px;">${proj.name}</div>
          <div style="font-size:11px;color:#94a3b8;margin-bottom:10px;">${proj.city}</div>
          <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px;">
            <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:${statusColor}22;
              color:${statusColor};border:1px solid ${statusColor}44;">${proj.status.toUpperCase()}</span>
            <span style="font-size:10px;padding:2px 8px;border-radius:4px;background:#10b98122;
              color:#10b981;border:1px solid #10b98144;">Impact ${proj.impact}</span>
          </div>
          <div style="font-size:12px;color:#94a3b8;">
            Completion: <span style="color:#f1f5f9;">${proj.completion}</span>
          </div>
        </div>`, { maxWidth:260 });

      marker.addTo(group);
    });

    layersRef.current.infra = group;
  }

  // ── Metro corridors ──────────────────────────────────────────────────────────
  function buildMetroLayer(L, map) {
    const group = L.layerGroup();

    METRO_CORRIDORS.forEach(corridor => {
      const poly = L.polyline(corridor.coords, {
        color: corridor.color, weight: 3, opacity: 0.85, dashArray: "8,4",
      });
      poly.bindTooltip(corridor.name, { direction:"top", sticky:true });
      poly.addTo(group);

      // Station dots
      corridor.coords.forEach(coord => {
        L.circleMarker(coord, {
          radius: 5, fillColor: corridor.color, color: "#0a0f1e",
          weight: 2, opacity: 1, fillOpacity: 0.9,
        }).addTo(group);
      });
    });

    layersRef.current.metro = group;
  }

  // ── Risk zones ───────────────────────────────────────────────────────────────
  function buildRiskLayer(L, map) {
    const group = L.layerGroup();

    RISK_ZONES.forEach(zone => {
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius, color: zone.color, fillColor: zone.color,
        fillOpacity: 0.15, weight: 1.5, dashArray: "6,3",
      });
      circle.bindPopup(`
        <div style="background:#1a2235;color:#f1f5f9;border-radius:8px;padding:12px;min-width:160px;font-family:system-ui;">
          <div style="font-weight:600;margin-bottom:4px;">${zone.area}</div>
          <div style="font-size:12px;color:#94a3b8;">Risk Score:
            <span style="color:${zone.color};font-weight:600;"> ${zone.score}/100</span>
          </div>
        </div>`, { maxWidth:200 });
      circle.addTo(group);
    });

    layersRef.current.risk = group;
  }

  // ── Toggle layer ─────────────────────────────────────────────────────────────
  function switchLayer(name) {
    const map = leafletRef.current;
    if (!map) return;

    // Remove all layers
    Object.values(layersRef.current).forEach(l => {
      if (l && map.hasLayer(l)) map.removeLayer(l);
    });

    // Add chosen layer
    const key = { "Heatmap":"heatmap","Infrastructure":"infra","Metro Lines":"metro","Risk Zones":"risk" }[name];
    if (key && layersRef.current[key]) {
      layersRef.current[key].addTo(map);
    }

    setActiveLayer(name);
    setSelected(null);
  }

  // ── Legend content ────────────────────────────────────────────────────────────
  const legends = {
    Heatmap: [
      { color:"#00ff88", label:"High growth" },
      { color:"#f59e0b", label:"Moderate" },
      { color:"#3b82f6", label:"Emerging" },
    ],
    Infrastructure: Object.entries(TYPE_COLORS).map(([k,c])=>({ color:c, label:`${TYPE_ICONS[k]} ${k}` })),
    "Metro Lines": METRO_CORRIDORS.map(c=>({ color:c.color, label:c.name, line:true })),
    "Risk Zones": [
      { color:"#10b981", label:"Low risk (<30)" },
      { color:"#f59e0b", label:"Medium (30–55)" },
      { color:"#ef4444", label:"High risk (>55)" },
    ],
  };

  return (
    <div style={{ fontFamily:"system-ui", color:"#f1f5f9" }}>

      {/* Layer buttons */}
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        {LAYERS_LIST.map(name => (
          <button key={name} onClick={() => switchLayer(name)} style={{
            padding:"7px 16px", borderRadius:8, border:"0.5px solid",
            borderColor: activeLayer===name ? "#3b82f6" : "rgba(99,179,237,0.2)",
            background: activeLayer===name ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
            color: activeLayer===name ? "#60a5fa" : "#94a3b8",
            fontSize:13, cursor:"pointer", transition:"all 0.15s",
          }}>
            {{ "Heatmap":"🌡", "Infrastructure":"🏗", "Metro Lines":"🚇", "Risk Zones":"⚠️" }[name]} {name}
          </button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:12, color:"#64748b" }}>
          {INFRA_PROJECTS.length} projects · {HEAT_POINTS.length} zones
        </span>
      </div>

      {/* Map wrapper */}
      <div style={{ borderRadius:16, overflow:"hidden", border:"0.5px solid rgba(99,179,237,0.15)", position:"relative" }}>
        <div ref={mapRef} style={{ height:500, width:"100%", background:"#0d1929" }} />

        {/* Loading overlay */}
        {!mapReady && (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", background:"#0d1929", color:"#94a3b8", gap:12
          }}>
            <div style={{ width:36, height:36, border:"3px solid rgba(59,130,246,0.2)",
              borderTopColor:"#3b82f6", borderRadius:"50%", animation:"spin 0.8s linear infinite"
            }}/>
            <span style={{ fontSize:13 }}>Loading map…</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* Legend */}
        {mapReady && (
          <div style={{ position:"absolute", bottom:48, left:12, background:"rgba(10,15,30,0.92)",
            border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:10, padding:"10px 14px",
            backdropFilter:"blur(6px)", zIndex:1000
          }}>
            {(legends[activeLayer]||[]).map((row,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, fontSize:11, color:"#94a3b8" }}>
                {row.line
                  ? <div style={{ width:16, height:2, background:row.color, borderRadius:1 }}/>
                  : <div style={{ width:10, height:10, borderRadius:"50%", background:row.color, flexShrink:0 }}/>
                }
                {row.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected project card */}
      {selected && (
        <div style={{ marginTop:12, background:"#1a2235",
          border:`0.5px solid ${TYPE_COLORS[selected.type]}44`, borderRadius:12, padding:"14px 18px",
          display:"flex", alignItems:"center", gap:16, flexWrap:"wrap"
        }}>
          <div style={{ fontSize:28 }}>{TYPE_ICONS[selected.type]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:500, fontSize:14 }}>{selected.name}</div>
            <div style={{ fontSize:12, color:"#94a3b8" }}>{selected.city}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:500, color:"#10b981" }}>{selected.impact}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>price impact</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:14, color:"#f1f5f9" }}>{selected.completion}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>completion</div>
          </div>
          <button onClick={()=>setSelected(null)}
            style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
      )}
    </div>
  );
}