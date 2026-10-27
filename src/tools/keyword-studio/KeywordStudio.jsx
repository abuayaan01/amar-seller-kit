import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Copy,
  Check,
  X,
  ChevronDown,
  Info,
  RotateCcw,
  WandSparkles,
  Layers,
  MousePointerClick,
  Palette,
  CheckSquare,
  Square,
} from "lucide-react";
import { Panel, Heading } from "../../components/Ui.jsx";
import {
  DEFAULT_SETTINGS,
  downloadCsv,
  generateKeywords,
  keywordColonList,
} from "./keywords.js";

const BRANDS = [
  "iPhone",
  "Samsung",
  "Vivo",
  "Oppo",
  "Redmi",
  "Realme",
  "OnePlus",
  "Motorola",
  "Nothing",
  "Google Pixel",
];
const STORAGE_KEY = "sellerkit.keyword-studio.v2";

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved && typeof saved === "object"
      ? { ...DEFAULT_SETTINGS, ...saved }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function KeywordStudio({ notify }) {
  const [settings, setSettings] = useState(readSaved);
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [customBrand, setCustomBrand] = useState(
    () => !BRANDS.includes(readSaved().brand),
  );
  const set = (name, value) => {
    setSelected(null);
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* offline / private browsing */
    }
  }, [settings]);

  const rows = useMemo(() => generateKeywords(settings), [settings]);
  const visible = useMemo(
    () =>
      rows.filter(
        (row) =>
          (priority === "all" || row.priority === priority) &&
          row.keyword.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [rows, priority, search],
  );
  const chosen = useMemo(
    () =>
      selected === null ? rows : rows.filter((r) => selected.includes(r.id)),
    [rows, selected],
  );
  const chosenIds = useMemo(() => new Set(chosen.map((r) => r.id)), [chosen]);
  const allVisibleChecked =
    visible.length > 0 && visible.every((r) => chosenIds.has(r.id));
  const highCount = rows.filter((r) => r.priority === "high").length;
  const colorCount = rows.filter((r) => r.type === "Colour").length;

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev === null ? rows.map((r) => r.id) : prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return [...next];
    });
  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev === null ? rows.map((r) => r.id) : prev);
      if (allVisibleChecked) visible.forEach((r) => next.delete(r.id));
      else visible.forEach((r) => next.add(r.id));
      return [...next];
    });

  async function copy(text, count = 1) {
    try {
      await navigator.clipboard.writeText(text);
      notify(
        count === 1
          ? "Keyword copied to clipboard"
          : `${count} keywords copied`,
      );
    } catch {
      // Allows copying on localhost and in browsers blocking the async Clipboard API.
      try {
        const input = document.createElement("textarea");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const ok = document.execCommand("copy");
        input.remove();
        if (!ok) throw new Error("Copy unsuccessful");
        notify(count === 1 ? "Keyword copied" : `${count} keywords copied`);
      } catch {
        notify("Could not copy. Use HTTPS or localhost for clipboard access.");
      }
    }
  }
  const doExport = () => {
    if (chosen.length === 0) return;
    const slug = `${settings.brand}-${settings.model}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    downloadCsv(chosen, `sellerkit-${slug || "keywords"}.csv`);
    notify(`${chosen.length} keywords exported as CSV`);
  };

  const setBrandSelect = (value) => {
    if (value === "__other") {
      setCustomBrand(true);
      set("brand", "");
    } else {
      setCustomBrand(false);
      set("brand", value);
    }
  };

  return (
    <>
      <Heading
        eyebrow="LISTING OPTIMIZATION / KEYWORD STUDIO"
        title="Find the words buyers use."
        description="Turn one phone model into relevant search keywords, ready for your listings and ad tests."
        right={
          <span className="status-pill">
            <span className="pulse-dot" /> Active tool
          </span>
        }
      />

     

      <Panel className="form-panel">
        <div className="panel-heading">
          <div>
            <div className="section-kicker">01 / INPUT</div>
            <h2>Product details</h2>
            <p>
              Enter your product details to generate a fresh list automatically.
            </p>
          </div>
          <button
            className="button button-subtle reset-btn"
            onClick={() => {
              setSettings(DEFAULT_SETTINGS);
              setCustomBrand(false);
              setSelected(null);
              setPriority("all");
              setSearch("");
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="brand">Phone brand</label>
            <div className="select-shell">
              <select
                id="brand"
                value={customBrand ? "__other" : settings.brand}
                onChange={(e) => setBrandSelect(e.target.value)}
              >
                {BRANDS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
                <option value="__other">Other brand...</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="model">
              Phone model <span className="required">*</span>
            </label>
            <input
              id="model"
              value={settings.model}
              onChange={(e) => set("model", e.target.value)}
              placeholder="e.g. 17 Pro or S24 Ultra"
            />
          </div>
          <div className="field">
            <label htmlFor="color">
              Product colour <span className="optional">optional</span>
            </label>
            <input
              id="color"
              value={settings.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="e.g. Lavender, Black"
              disabled={!settings.useColor}
            />
          </div>
        </div>
        {customBrand && (
          <div className="field custom-brand">
            <label htmlFor="custom-brand">
              Custom phone brand <span className="required">*</span>
            </label>
            <input
              id="custom-brand"
              autoFocus
              value={settings.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Enter manufacturer / brand"
            />
          </div>
        )}
        <div className="form-divider" />
        <div className="option-title">
          Include product-specific variations{" "}
          <span>Match these to the actual item you're selling</span>
        </div>
        <div className="toggles-grid">
          <label className="option-card">
            <input
              type="checkbox"
              checked={settings.useColor}
              onChange={(e) => set("useColor", e.target.checked)}
            />
            <span className="fake-checkbox">
              <Check size={13} />
            </span>
            <span className="option-symbol purple">
              <Palette size={18} />
            </span>
            <span>
              <b>Colour variants</b>
              <small>e.g. Lavender camera lens protector</small>
            </span>
          </label>
          <label className="option-card">
            <input
              type="checkbox"
              checked={settings.ringStyle}
              onChange={(e) => set("ringStyle", e.target.checked)}
            />
            <span className="fake-checkbox">
              <Check size={13} />
            </span>
            <span className="option-symbol blue">
              <Layers size={18} />
            </span>
            <span>
              <b>Camera ring terms</b>
              <small>Only for ring-style protectors</small>
            </span>
          </label>
        </div>
      </Panel>

      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-top">
            <span>Total keywords</span>
            <span className="metric-icon purple">
              <Layers size={17} />
            </span>
          </div>
          <strong>{rows.length}</strong>
          <small>Generated variations</small>
        </div>
        <div className="metric">
          <div className="metric-top">
            <span>High priority</span>
            <span className="metric-icon green">
              <Check size={17} />
            </span>
          </div>
          <strong>{highCount}</strong>
          <small>Research-informed terms</small>
        </div>
        <div className="metric">
          <div className="metric-top">
            <span>Colour variations</span>
            <span className="metric-icon blue">
              <Palette size={17} />
            </span>
          </div>
          <strong>{colorCount}</strong>
          <small>Model + colour searches</small>
        </div>
        <div className="metric">
          <div className="metric-top">
            <span>Selected for export</span>
            <span className="metric-icon amber">
              <CheckSquare size={17} />
            </span>
          </div>
          <strong>{chosen.length}</strong>
          <small>Customizable keyword list</small>
        </div>
      </div>

      <Panel className="results-panel">
        <div className="results-head">
          <div>
            <div className="section-kicker">02 / OUTPUT</div>
            <h2>
              Generated keywords{" "}
              <span className="count-badge">{visible.length}</span>
            </h2>
            <p>Filter, review and select only the keywords you want to use.</p>
          </div>
          <div className="result-actions">
            <button
              className="button button-outline"
              disabled={!chosen.length}
              onClick={() =>
                copy(chosen.map((r) => r.keyword).join("\n"), chosen.length)
              }
            >
              <Copy size={16} /> Copy selected
            </button>
            <button
              className="button button-outline"
              disabled={!chosen.length}
              onClick={() => copy(keywordColonList(chosen), chosen.length)}
            >
              <Copy size={16} /> Copy :: list
            </button>
            <button
              className="button button-primary"
              disabled={!chosen.length}
              onClick={doExport}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
        <div className="filterbar">
          <div className="search-shell">
            <Search size={16} />
            <input
              aria-label="Search generated keywords"
              placeholder="Search generated keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button aria-label="Clear search" onClick={() => setSearch("")}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="segmented" role="group" aria-label="Priority filter">
            {[
              ["all", "All"],
              ["high", "High"],
              ["medium", "Medium"],
              ["test", "Test"],
            ].map(([v, label]) => (
              <button
                key={v}
                className={priority === v ? "on" : ""}
                aria-pressed={priority === v}
                onClick={() => setPriority(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
          <table className="keyword-table">
            <thead>
              <tr>
                <th className="check-col">
                  <button
                    className="select-all"
                    onClick={toggleAllVisible}
                    disabled={!visible.length}
                    aria-label={
                      allVisibleChecked
                        ? "Deselect visible keywords"
                        : "Select visible keywords"
                    }
                  >
                    {allVisibleChecked ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th>Keyword</th>
                <th>Priority</th>
                <th>Intent / type</th>
                <th className="action-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td>
                    <label className="row-checkbox">
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.keyword}`}
                        checked={chosenIds.has(row.id)}
                        onChange={() => toggle(row.id)}
                      />
                      <span className="fake-checkbox">
                        <Check size={12} />
                      </span>
                    </label>
                  </td>
                  <td className="keyword-name">{row.keyword}</td>
                  <td>
                    <span className={`priority-tag ${row.priority}`}>
                      <span />{" "}
                      {row.priority[0].toUpperCase() + row.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="intent">{row.intent}</span>
                    {row.type === "Colour" && (
                      <span className="color-dot" title="Colour variant" />
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      title="Copy keyword"
                      aria-label={`Copy ${row.keyword}`}
                      onClick={() => copy(row.keyword)}
                    >
                      <Copy size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <Search size={25} />
                      <strong>No matching keywords</strong>
                      <span>
                        {rows.length === 0
                          ? "Enter a phone brand and model above."
                          : "Try another search or priority filter."}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            Showing <strong>{visible.length}</strong> of {rows.length} generated
            keywords
          </span>
          <span>
            <Info size={14} /> High priority ≠ proven sales. Validate with
            clicks, orders and conversion data.
          </span>
        </div>
      </Panel>
      <div className="bottom-note">
        <Info size={17} />
        <div>
          <strong>Relevance over volume.</strong> Searches such as “camera lens”
          can also mean replacement camera parts. Use only accurate product
          terms and test broad keywords separately. Competitor CTR and
          impression share are not conversion metrics.
        </div>
      </div>
    </>
  );
}
