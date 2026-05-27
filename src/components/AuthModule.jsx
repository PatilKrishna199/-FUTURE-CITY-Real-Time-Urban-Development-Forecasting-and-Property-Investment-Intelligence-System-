/**
 * AuthModule.jsx
 * Complete Auth system for FutureCity
 * - AuthProvider  (context, login, register, logout)
 * - AuthPage      (login / register toggle)
 * - useAuth       (hook)
 */

import { useState, createContext, useContext, useCallback } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("fc_user")) || null; }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("fc_token") || null);

  const login = useCallback(async (email, password) => {
    // Demo accounts — swap for real API when backend ready
    const DEMO = [
      { email:"investor@futurecity.in", password:"Demo@2026", user:{ fullName:"Demo Investor", role:"INVESTOR", city:"Mumbai"    } },
      { email:"admin@futurecity.in",    password:"Admin@2026", user:{ fullName:"Admin User",    role:"ADMIN",    city:"Delhi NCR" } },
      { email:"analyst@futurecity.in",  password:"Demo@2026",  user:{ fullName:"Market Analyst",role:"ANALYST",  city:"Bangalore" } },
    ];
    const match = DEMO.find(d => d.email === email && d.password === password);
    if (!match) throw new Error("Invalid email or password.");
    const tok = "fc-demo-token-" + Date.now();
    localStorage.setItem("fc_token", tok);
    localStorage.setItem("fc_user",  JSON.stringify(match.user));
    setToken(tok);
    setUser(match.user);
    return { token: tok, user: match.user };
  }, []);

  const register = useCallback(async (payload) => {
    // Demo: just store locally
    const newUser = { fullName: payload.fullName, role: payload.role || "INVESTOR", city: payload.city || "" };
    const tok = "fc-new-token-" + Date.now();
    localStorage.setItem("fc_token", tok);
    localStorage.setItem("fc_user",  JSON.stringify(newUser));
    setToken(tok);
    setUser(newUser);
    return { token: tok, user: newUser };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fc_token");
    localStorage.removeItem("fc_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  overlay: {
    position:"fixed", inset:0, background:"rgba(10,15,30,0.92)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:500, padding:24, backdropFilter:"blur(6px)",
  },
  card: {
    background:"#111827", border:"0.5px solid rgba(99,179,237,0.18)",
    borderRadius:20, padding:"40px 44px", width:"100%", maxWidth:440,
    boxShadow:"0 24px 64px rgba(0,0,0,0.6)",
  },
  logo: { display:"flex", alignItems:"center", gap:8, marginBottom:28 },
  logoDot: { width:10, height:10, borderRadius:"50%", background:"#3b82f6", boxShadow:"0 0 6px #3b82f6" },
  logoText: { fontSize:20, fontWeight:500, color:"#3b82f6" },
  h1: { fontSize:26, fontWeight:500, color:"#f1f5f9", marginBottom:6 },
  sub: { fontSize:14, color:"#64748b", marginBottom:28 },
  label: { display:"block", fontSize:12, color:"#94a3b8", marginBottom:6, letterSpacing:"0.03em" },
  input: {
    width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)",
    border:"0.5px solid rgba(99,179,237,0.2)", borderRadius:10,
    color:"#f1f5f9", fontSize:14, outline:"none", marginBottom:16,
    boxSizing:"border-box", transition:"border-color 0.15s",
    fontFamily:"system-ui",
  },
  btn: {
    width:"100%", padding:13, borderRadius:10, border:"none",
    background:"#3b82f6", color:"#fff", fontSize:15, fontWeight:500,
    cursor:"pointer", marginTop:4, transition:"opacity 0.15s", fontFamily:"system-ui",
  },
  error: {
    background:"rgba(239,68,68,0.1)", border:"0.5px solid rgba(239,68,68,0.3)",
    borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:16,
  },
  success: {
    background:"rgba(16,185,129,0.1)", border:"0.5px solid rgba(16,185,129,0.3)",
    borderRadius:8, padding:"10px 14px", fontSize:13, color:"#34d399", marginBottom:16,
  },
  divider: { display:"flex", alignItems:"center", gap:12, margin:"20px 0", color:"#334155", fontSize:12 },
  divLine: { flex:1, height:"0.5px", background:"rgba(99,179,237,0.12)" },
  demo: {
    background:"rgba(59,130,246,0.06)", border:"0.5px solid rgba(59,130,246,0.2)",
    borderRadius:10, padding:"12px 14px", fontSize:12, color:"#94a3b8", marginBottom:16,
  },
  switch: { textAlign:"center", marginTop:22, fontSize:13, color:"#64748b" },
  switchBtn: { color:"#3b82f6", background:"none", border:"none", cursor:"pointer", fontWeight:500, fontSize:13 },
  closeBtn: {
    position:"absolute", top:16, right:20, background:"none", border:"none",
    color:"#64748b", cursor:"pointer", fontSize:22, lineHeight:1,
  },
};

function focusIn(e)  { e.target.style.borderColor = "rgba(59,130,246,0.6)"; }
function focusOut(e) { e.target.style.borderColor = "rgba(99,179,237,0.2)"; }

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSwitch, onClose }) {
  const { login } = useAuth();
  const [form,  setForm]  = useState({ email:"", password:"" });
  const [state, setState] = useState({ loading:false, error:"" });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setState({ loading:false, error:"Please fill all fields." }); return; }
    setState({ loading:true, error:"" });
    try {
      await login(form.email, form.password);
      onClose();
    } catch (err) {
      setState({ loading:false, error:err.message });
    }
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.card, position:"relative" }} onClick={e => e.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>✕</button>

        <div style={S.logo}><div style={S.logoDot}/><span style={S.logoText}>FutureCity</span></div>

        <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, padding:"3px 12px",
          borderRadius:20, background:"rgba(59,130,246,0.1)", border:"0.5px solid rgba(59,130,246,0.3)",
          color:"#60a5fa", marginBottom:20
        }}>🔐 Secure investor access</div>

        <h1 style={S.h1}>Welcome back</h1>
        <p style={S.sub}>Sign in to your investment intelligence dashboard</p>

        {state.error && <div style={S.error}>⚠ {state.error}</div>}

        <form onSubmit={submit}>
          <label style={S.label}>Email address</label>
          <input style={S.input} type="email" placeholder="you@example.com"
            value={form.email} onChange={set("email")} onFocus={focusIn} onBlur={focusOut}/>

          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="••••••••"
            value={form.password} onChange={set("password")} onFocus={focusIn} onBlur={focusOut}/>

          <div style={{ textAlign:"right", marginTop:-10, marginBottom:18 }}>
            <button type="button" style={{ background:"none", border:"none", color:"#3b82f6", fontSize:12, cursor:"pointer" }}>
              Forgot password?
            </button>
          </div>

          <button type="submit" style={{ ...S.btn, opacity: state.loading ? 0.5 : 1 }} disabled={state.loading}>
            {state.loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <div style={S.divider}><div style={S.divLine}/>OR<div style={S.divLine}/></div>

        <div style={S.demo}>
          <div style={{ fontWeight:500, color:"#60a5fa", marginBottom:6 }}>Demo credentials</div>
          <div style={{ marginBottom:3 }}>📧 <code style={{color:"#f1f5f9"}}>investor@futurecity.in</code></div>
          <div style={{ marginBottom:3 }}>🔑 <code style={{color:"#f1f5f9"}}>Demo@2026</code></div>
          <div style={{ marginTop:6, color:"#475569" }}>Admin: <code style={{color:"#94a3b8"}}>admin@futurecity.in</code> / <code style={{color:"#94a3b8"}}>Admin@2026</code></div>
        </div>

        <div style={S.switch}>
          New to FutureCity?{" "}
          <button style={S.switchBtn} onClick={onSwitch}>Create account</button>
        </div>
      </div>
    </div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

const ROLES = [
  { key:"INVESTOR", label:"Individual Investor", icon:"💼", desc:"Personal investment planning" },
  { key:"ANALYST",  label:"Market Analyst",      icon:"📊", desc:"Portfolio & market research"  },
  { key:"BUILDER",  label:"Builder/Developer",   icon:"🏗", desc:"Project visibility & leads"   },
  { key:"ADVISOR",  label:"Financial Advisor",   icon:"🧭", desc:"Client investment advisory"    },
];

function RegisterForm({ onSwitch, onClose }) {
  const { register } = useAuth();
  const [form,  setForm]  = useState({ fullName:"", email:"", phone:"", password:"", confirm:"", role:"INVESTOR", city:"" });
  const [state, setState] = useState({ loading:false, error:"", success:"" });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) { setState({ loading:false, error:"Fill required fields.", success:"" }); return; }
    if (form.password !== form.confirm)  { setState({ loading:false, error:"Passwords do not match.", success:"" }); return; }
    if (form.password.length < 8)        { setState({ loading:false, error:"Password min 8 characters.", success:"" }); return; }
    setState({ loading:true, error:"", success:"" });
    try {
      await register(form);
      setState({ loading:false, error:"", success:"Account created! You are now signed in." });
      setTimeout(onClose, 1500);
    } catch (err) {
      setState({ loading:false, error:err.message, success:"" });
    }
  }

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.card, maxWidth:520, position:"relative", maxHeight:"90vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <button style={S.closeBtn} onClick={onClose}>✕</button>

        <div style={S.logo}><div style={S.logoDot}/><span style={S.logoText}>FutureCity</span></div>
        <h1 style={S.h1}>Create account</h1>
        <p style={S.sub}>Join 12,000+ investors using AI-driven predictions</p>

        {state.error   && <div style={S.error}>⚠ {state.error}</div>}
        {state.success && <div style={S.success}>✓ {state.success}</div>}

        <form onSubmit={submit}>
          {/* Role selector */}
          <label style={S.label}>I am a</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {ROLES.map(r => {
              const active = form.role === r.key;
              return (
                <div key={r.key} onClick={() => setForm(p => ({ ...p, role:r.key }))}
                  style={{ padding:"12px 14px", borderRadius:10, cursor:"pointer", transition:"all 0.15s",
                    border:`0.5px solid ${active?"#3b82f6":"rgba(99,179,237,0.15)"}`,
                    background: active?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.02)",
                  }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{r.icon}</div>
                  <div style={{ fontSize:12, fontWeight:500, color:active?"#60a5fa":"#f1f5f9" }}>{r.label}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{r.desc}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={S.label}>Full name *</label>
              <input style={S.input} placeholder="Arjun Sharma" value={form.fullName} onChange={set("fullName")} onFocus={focusIn} onBlur={focusOut}/>
            </div>
            <div>
              <label style={S.label}>City</label>
              <input style={S.input} placeholder="Mumbai" value={form.city} onChange={set("city")} onFocus={focusIn} onBlur={focusOut}/>
            </div>
          </div>

          <label style={S.label}>Email address *</label>
          <input style={S.input} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onFocus={focusIn} onBlur={focusOut}/>

          <label style={S.label}>Phone (optional)</label>
          <input style={S.input} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} onFocus={focusIn} onBlur={focusOut}/>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={S.label}>Password *</label>
              <input style={S.input} type="password" placeholder="Min 8 chars" value={form.password} onChange={set("password")} onFocus={focusIn} onBlur={focusOut}/>
            </div>
            <div>
              <label style={S.label}>Confirm *</label>
              <input style={S.input} type="password" placeholder="Repeat" value={form.confirm} onChange={set("confirm")} onFocus={focusIn} onBlur={focusOut}/>
            </div>
          </div>

          <div style={{ fontSize:12, color:"#64748b", marginBottom:16 }}>
            By signing up you agree to our{" "}
            <span style={{ color:"#3b82f6", cursor:"pointer" }}>Terms of Service</span> &{" "}
            <span style={{ color:"#3b82f6", cursor:"pointer" }}>Privacy Policy</span>.
          </div>

          <button type="submit" style={{ ...S.btn, opacity:state.loading?0.5:1 }} disabled={state.loading}>
            {state.loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <div style={S.switch}>
          Already have an account?{" "}
          <button style={S.switchBtn} onClick={onSwitch}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

// ─── AuthPage — modal overlay toggled from App ────────────────────────────────

export default function AuthPage({ defaultView = "login", onClose }) {
  const [view, setView] = useState(defaultView);

  return view === "login"
    ? <LoginForm  onSwitch={() => setView("register")} onClose={onClose} />
    : <RegisterForm onSwitch={() => setView("login")}  onClose={onClose} />;
}