import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ChevronRight,
  ArrowUpRight,
  SearchCheck,
  Plus,
  Zap,
  Menu,
  X,
  Settings2,
  Github,
  ArrowRight,
  CircleHelp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Heading, Panel, ComingSoon } from "./components/Ui.jsx";
import KeywordStudio from "./tools/keyword-studio/KeywordStudio.jsx";
import { dashboardLink, tools } from "./data/tools.js";

function pageFromUrl() {
  const part = window.location.pathname.split("/").filter(Boolean)[0];
  return ["dashboard", "tools", ...tools.map((t) => t.id)].includes(part)
    ? part
    : "";
}

export default function App() {
  const [page, setPage] = useState(pageFromUrl);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [toastTimer, setToastTimer] = useState(null);
  const go = (next) => {
    window.history.pushState({}, "", next === "dashboard" ? "/" : `/${next}`);
    setPage(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  useEffect(() => {
    const onPop = () => setPage(pageFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(
    () => () => {
      if (toastTimer) clearTimeout(toastTimer);
    },
    [toastTimer],
  );
  const notify = (value) => {
    setToast(value);
    if (toastTimer) clearTimeout(toastTimer);
    setToastTimer(setTimeout(() => setToast(""), 2600));
  };
  const currentTool = tools.find((t) => t.id === page);
  const ToolIcon = currentTool?.icon;
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          <button className="logo" aria-label="SellerKit home">
            <span className="logo-mark">
              <Zap size={20} fill="white" strokeWidth={2.4} />
            </span>
            <span>
              seller<span className="logo-accent">kit</span>
              <small>TOOLS</small>
            </span>
          </button>
          <button
            className="mobile-close icon-button"
            onClick={() => setMobileMenu(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar">AM</div>
          <div className="workspace-name">
            <strong>Amar Mobile</strong>
            <span>Seller utilities</span>
          </div>
          <span className="workspace-caret">
            <ChevronRight size={14} />
          </span>
        </div>
        {/* <div className="side-label">WORKSPACE</div> */}
        {/* <nav className="nav-list" aria-label="Main navigation"><button onClick={()=>go('dashboard')} className={`nav-item ${page==='dashboard'?'active':''}`}><LayoutDashboard size={18}/> Overview</button><button onClick={()=>go('tools')} className={`nav-item ${page==='tools'?'active':''}`}><Settings2 size={18}/> All tools</button></nav> */}
        <div className="side-label second">LISTING TOOLS</div>
        <nav className="nav-list" aria-label="Listing utilities">
          {tools
            .filter((t) => t.category === "Listing tools")
            .map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => go(tool.id)}
                  className={`nav-item ${page === tool.id ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{tool.name}</span>
                  {!tool.available && <span className="nav-soon">Soon</span>}
                </button>
              );
            })}
        </nav>
        {/* <div className="side-label second">OPERATIONS</div>
      <nav className="nav-list" aria-label="Operations utilities">{tools.filter(t=>t.category==='Operations').map(tool=>{const Icon=tool.icon;return <button key={tool.id} onClick={()=>go(tool.id)} className={`nav-item ${page===tool.id?'active':''}`}><Icon size={18}/><span>{tool.name}</span>{!tool.available&&<span className="nav-soon">Soon</span>}</button>;})}</nav>
      <div className="sidebar-bottom"><div className="side-tip"><div className="tip-art"><Sparkles size={19}/></div><strong>Made to grow with you</strong><p>Add a new utility without rebuilding the whole app.</p><button onClick={()=>go('tools')}>Explore tools <ArrowRight size={15}/></button></div><div className="side-version"><span className="version-dot"/> SellerKit <span className="spacer"/> v1.0.0</div></div> */}
      </aside>
      {mobileMenu && (
        <div className="menu-backdrop" onClick={() => setMobileMenu(false)} />
      )}
      <div className="app-main">
        {/* <header className="topbar"><div className="topbar-left"><button className="mobile-open-btn icon-button" aria-label="Open menu" onClick={()=>setMobileMenu(true)}><Menu size={21}/></button><span>Workspace</span><ChevronRight size={14}/><strong>{page==='dashboard'?'Overview':page==='tools'?'All tools':currentTool?.name}</strong></div><div className="topbar-right"><span className="save-indicator"><span/> Auto-saved locally</span><div className="topbar-divider"/><span className="user-avatar">AM</span></div></header> */}

        <main className="content">
          {/* {page==='dashboard' && <Dashboard go={go}/>}
        {page==='tools' && <ToolsDirectory go={go}/>} */}
          {page === "" && <KeywordStudio notify={notify} />}
          {page === "keywords" && <KeywordStudio notify={notify} />}
          {currentTool && !currentTool.available && (
            <ComingSoon tool={currentTool} onBack={() => go("tools")} />
          )}
        </main>
        <footer className="app-footer">
          <span>© SellerKit 2026</span>
          <span>Built for independent marketplace sellers</span>
        </footer>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Dashboard({ go }) {
  const available = tools.filter((t) => t.available).length;
  return (
    <>
      <Heading
        eyebrow="WELCOME TO YOUR WORKSPACE"
        title="Your seller toolkit, all in one place."
        description="Less repetitive work. More time to improve listings, operations and sales."
        right={
          <span className="status-pill">
            <span className="pulse-dot" /> All systems ready
          </span>
        }
      />
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Zap size={14} /> GET STARTED
          </div>
          <h2>
            Smarter listings
            <br />
            start with better keywords.
          </h2>
          <p>
            Generate ready-to-use camera lens search terms for any phone model,
            in seconds.
          </p>
          <button className="button hero-cta" onClick={() => go("keywords")}>
            Open Keyword Studio <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-back">
            <span className="floating-label">Model</span>
            <b>iPhone 17 Pro</b>
          </div>
          <div className="floating-card card-front">
            <span className="floating-label">
              <SearchCheck size={15} /> SEARCH TERM
            </span>
            <b>iPhone 17 Pro camera lens protector</b>
            <span className="mini-pill">High priority</span>
          </div>
          <div className="shine-circle one" />
          <div className="shine-circle two" />
        </div>
      </div>
      <div className="dashboard-section-heading">
        <div>
          <h2>Quick access</h2>
          <p>Pick up where you left off.</p>
        </div>
        <button className="text-link" onClick={() => go("tools")}>
          View all tools <ArrowRight size={16} />
        </button>
      </div>
      <div className="quick-grid">
        <button
          className="quick-card active-card"
          onClick={() => go("keywords")}
        >
          <div className="quick-icon">
            <SearchCheck size={22} />
          </div>
          <span className="quick-status available">● Available now</span>
          <h3>Keyword Studio</h3>
          <p>
            Generate model-specific camera lens keywords and export them in one
            click.
          </p>
          <span className="quick-open">
            Launch tool <ArrowRight size={16} />
          </span>
        </button>
        <button className="quick-card" onClick={() => go("titles")}>
          <div className="quick-icon muted-icon">
            <LayoutDashboard size={22} />
          </div>
          <span className="quick-status">Coming soon</span>
          <h3>Title Builder</h3>
          <p>
            Create consistent marketplace listing titles using reusable
            patterns.
          </p>
          <span className="quick-open">
            Preview module <ArrowRight size={16} />
          </span>
        </button>
        <button className="quick-card" onClick={() => go("profit")}>
          <div className="quick-icon muted-icon">
            <Zap size={22} />
          </div>
          <span className="quick-status">Coming soon</span>
          <h3>Profit Calculator</h3>
          <p>Understand true profit after purchase costs, fees and returns.</p>
          <span className="quick-open">
            Preview module <ArrowRight size={16} />
          </span>
        </button>
      </div>
      <div className="dashboard-bottom">
        <Panel className="mini-panel">
          <div className="section-kicker">YOUR WORKSPACE</div>
          <h3>Small tools. Big time savings.</h3>
          <p>
            SellerKit is modular by design. Each utility is a separate React
            component, so we can keep adding tools while reusing navigation,
            design and deployment.
          </p>
          <div className="mini-stats">
            <div>
              <strong>{available}</strong>
              <span>Active tool</span>
            </div>
            <div>
              <strong>{tools.length - available}</strong>
              <span>On roadmap</span>
            </div>
            <div>
              <strong>0</strong>
              <span>External APIs needed</span>
            </div>
          </div>
        </Panel>
        <Panel className="mini-panel tip-panel">
          <div className="section-kicker">GOOD TO KNOW</div>
          <h3>Your workspace stays yours.</h3>
          <p>
            Current tools run entirely in your browser. Keyword settings are
            stored on this device, and nothing is sent to an external server.
          </p>
          <div className="tip-bottom">
            <CheckCircle2 size={18} /> Works without a database or API key
          </div>
        </Panel>
      </div>
    </>
  );
}

function ToolsDirectory({ go }) {
  return (
    <>
      <Heading
        eyebrow="YOUR TOOLBOX"
        title="Everything you need, one workspace."
        description="A growing collection of focused tools for marketplace sellers."
        right={
          <span className="status-pill">
            {tools.filter((t) => t.available).length} live ·{" "}
            {tools.filter((t) => !t.available).length} planned
          </span>
        }
      />
      {["Listing tools", "Operations"].map((group) => (
        <section key={group} className="directory-section">
          <div className="directory-head">
            <h2>{group}</h2>
            <p>
              {group === "Listing tools"
                ? "Optimize discoverability, titles and catalogue identifiers."
                : "Simplify the operational work behind every sale."}
            </p>
          </div>
          <div className="directory-grid">
            {tools
              .filter((t) => t.category === group)
              .map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    className="directory-card"
                    onClick={() => go(tool.id)}
                  >
                    <div className="directory-top">
                      <span
                        className={`directory-icon ${tool.available ? "live" : ""}`}
                      >
                        <Icon size={23} />
                      </span>
                      <span
                        className={`tiny-status ${tool.available ? "live" : ""}`}
                      >
                        {tool.available ? "Live" : "Planned"}
                      </span>
                    </div>
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                    <span className="directory-link">
                      {tool.available ? "Launch tool" : "View roadmap"}{" "}
                      <ArrowRight size={16} />
                    </span>
                  </button>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}
