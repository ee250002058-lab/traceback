import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import ItemCard      from "../components/ItemCard.jsx"
import SearchBar     from "../components/SearchBar.jsx"
import FilterButtons from "../components/FilterButtons.jsx"
import Stats         from "../components/Stats.jsx"
import EditModal     from "../components/EditModal.jsx"
import { Link }      from "react-router-dom"
import { detectObject } from "../utils/imageMatcher"
import {
  fetchItems,
  deleteItem  as apiDelete,
  resolveItem as apiResolve,
  updateItem  as apiUpdate
} from "../utils/api.js"

// ── helpers ────────────────────────────────────────────────────────────────────
const norm = (s = "") => s.toLowerCase().trim().replace(/\s+/g, " ")
const locMatch = (a, b) => {
  const [na, nb] = [norm(a), norm(b)]
  if (!na || !nb) return false
  return na === nb || na.includes(nb) || nb.includes(na)
}
const STOP = new Set(["a","an","the","and","or","is","it","in","on","at","to","of","for","was","were","has","have","with","this","that","my","i","me","been"])
const kw   = (s = "") => norm(s).split(" ").filter(w => w.length > 2 && !STOP.has(w))
const shKw  = (a, b)  => { const sa = new Set(kw(a)), sb = new Set(kw(b)); return [...sa].filter(w => sb.has(w)).length }
const nameRel = (a, b) => {
  const [na, nb] = [norm(a), norm(b)]
  if (!na || !nb) return false
  return na === nb || na.includes(nb) || nb.includes(na) || shKw(a, b) >= 1
}
const CACHE = "traceback_items_cache"
const loadCache = () => { try { const c = localStorage.getItem(CACHE); return c ? JSON.parse(c) : [] } catch { return [] } }
const saveCache = (d) => { try { localStorage.setItem(CACHE, JSON.stringify(d)) } catch {} }

// ── component ──────────────────────────────────────────────────────────────────
function Dashboard() {
  const [items,          setItems]          = useState(loadCache)
  const [syncing,        setSyncing]        = useState(false)
  const [syncError,      setSyncError]      = useState(false)
  const [search,         setSearch]         = useState("")
  const [filter,         setFilter]         = useState("All")
  const [sortBy,         setSortBy]         = useState("newest")
  const [showMatchAlert, setShowMatchAlert] = useState(true)
  const [matches,        setMatches]        = useState([])
  const [aiLoading,      setAiLoading]      = useState(false)
  const [editingItem,    setEditingItem]    = useState(null)

  const detCache = useRef({})
  const itemsRef = useRef(items)
  useEffect(() => { itemsRef.current = items }, [items])

  // ── Sync ──────────────────────────────────────────────────────────────────
  const syncItems = useCallback(async (silent = false) => {
    if (!silent) setSyncing(true)
    try {
      const data = await fetchItems()
      setItems(data); saveCache(data); setSyncError(false)
    } catch {
      if (!silent) setSyncError(true)
    } finally {
      if (!silent) setSyncing(false)
    }
  }, [])

  useEffect(() => { syncItems(true) }, [syncItems])
  useEffect(() => {
    const t = setInterval(() => syncItems(true), 10000)
    return () => clearInterval(t)
  }, [syncItems])

  // ── Actions ───────────────────────────────────────────────────────────────
  const deleteItem = useCallback(async (id) => {
    const prev = itemsRef.current
    const next = prev.filter(i => i.id !== id)
    setItems(next); saveCache(next)
    try { await apiDelete(id) } catch { setItems(prev); saveCache(prev) }
  }, [])

  const resolveItem = useCallback(async (id) => {
    const prev = itemsRef.current
    const next = prev.map(i => i.id === id ? { ...i, status: "Resolved" } : i)
    setItems(next); saveCache(next)
    try { await apiResolve(id) } catch { setItems(prev); saveCache(prev) }
  }, [])

  const editItem = useCallback(async (updated) => {
    const prev = itemsRef.current
    const next = prev.map(i => i.id === updated.id ? updated : i)
    setItems(next); saveCache(next)
    try { await apiUpdate(updated) } catch { setItems(prev); saveCache(prev) }
  }, [])

  // ── Filtering + Sorting ───────────────────────────────────────────────────
  const filteredItems = useMemo(() => items
    .filter(item => {
      const q = norm(search)
      return (
        norm(item.name).includes(q)        ||
        norm(item.location).includes(q)    ||
        norm(item.category).includes(q)    ||
        norm(item.description).includes(q)
      ) && (filter === "All" || item.status === filter)
    })
    .sort((a, b) => {
      const [aT, bT] = [a.createdAt || 0, b.createdAt || 0]
      if (sortBy === "newest") return bT - aT
      if (sortBy === "oldest") return aT - bT
      if (sortBy === "az")     return norm(a.name).localeCompare(norm(b.name))
      if (sortBy === "za")     return norm(b.name).localeCompare(norm(a.name))
      return 0
    }), [items, search, filter, sortBy])

  // ── AI Matching ───────────────────────────────────────────────────────────
  const findMatchesWithAI = useCallback(async (cur) => {
    const lost = cur.filter(i => i.status === "Lost")
    const found = cur.filter(i => i.status === "Found")
    const results = []; const seen = new Set()

    for (const l of lost) {
      for (const f of found.filter(f => locMatch(f.location, l.location))) {
        const key = [l.id, f.id].sort().join("|")
        if (seen.has(key)) continue; seen.add(key)
        let s = 0, mx = 0
        mx += 2; if (nameRel(l.name, f.name)) s += 2
        mx += 1; if (locMatch(l.location, f.location)) s += 1
        if (l.category && f.category) { mx += 1; if (norm(l.category) === norm(f.category)) s += 1 }
        if (l.description && f.description) { mx += 1; if (shKw(l.description, f.description) >= 1) s += 1 }
        if (l.image && f.image) {
          mx += 2
          try {
            if (!detCache.current[l.id]) detCache.current[l.id] = await detectObject(l.image)
            if (!detCache.current[f.id]) detCache.current[f.id] = await detectObject(f.image)
            const [lo, fo] = [detCache.current[l.id], detCache.current[f.id]]
            if (lo && fo && lo !== "unknown" && lo === fo) s += 2
          } catch {}
        }
        if (mx > 0 && s >= mx * 0.6)
          results.push({ lost: l, found: f, confidence: Math.round(s / mx * 100) })
      }
    }
    return results.sort((a, b) => b.confidence - a.confidence)
  }, [])

  useEffect(() => {
    let cancel = false
    const t = setTimeout(async () => {
      setAiLoading(true)
      try {
        const r = await findMatchesWithAI(items)
        if (!cancel) { setMatches(r); if (r.length > 0) setShowMatchAlert(true) }
      } catch {}
      finally { if (!cancel) setAiLoading(false) }
    }, 800)
    return () => { cancel = true; clearTimeout(t) }
  }, [items, findMatchesWithAI])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={editItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Page Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(22px, 5vw, 32px)",
            fontWeight: "800",
            color: "var(--text-1)",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
            margin: "0 0 4px"
          }}>
            Lost & Found
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: syncError ? "var(--lost)" : "var(--found)",
              animation: "pulse-dot 2s infinite"
            }} />
            <span style={{ fontSize: "12px", color: "var(--text-3)", fontWeight: "500" }}>
              {syncError ? "Offline · cached data" : syncing ? "Syncing..." : "Live"}
            </span>
            {aiLoading && (
              <span style={{ fontSize: "12px", color: "var(--primary)", marginLeft: "6px" }}>
                · 🤖 Scanning...
              </span>
            )}
          </div>
        </div>

        <Link to="/add" style={{ textDecoration: "none" }}>
          <button style={{
            background: "var(--primary)",
            color: "white", border: "none",
            padding: "10px 18px", borderRadius: "var(--r-md)",
            fontSize: "13px", fontWeight: "700",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            transition: "background 0.15s",
            boxShadow: "0 2px 8px rgba(79,70,229,0.3)"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
          >
            + Report Item
          </button>
        </Link>
      </div>

      <Stats items={items} />

      {/* AI Match Banner */}
      {matches.length > 0 && showMatchAlert && (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--primary-muted)",
          borderRadius: "var(--r-lg)",
          padding: "14px 18px",
          marginBottom: "18px",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "26px", height: "26px",
                background: "var(--primary-light)",
                borderRadius: "var(--r-sm)",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "13px"
              }}>⚡</div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-1)" }}>
                {matches.length} Possible Match{matches.length > 1 ? "es" : ""}
              </span>
            </div>
            <button onClick={() => setShowMatchAlert(false)} style={{
              background: "none", border: "none",
              cursor: "pointer", color: "var(--text-3)", fontSize: "13px"
            }}>✕</button>
          </div>

          {matches.map((m, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "9px 12px",
              background: "var(--surface-2)",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              marginBottom: i < matches.length - 1 ? "6px" : "0"
            }}>
              <span style={{ fontSize: "12px", flex: 1, color: "var(--text-2)" }}>
                Lost <strong style={{ color: "var(--text-1)" }}>"{m.lost.name}"</strong>
                {" "}→ Found <strong style={{ color: "var(--text-1)" }}>"{m.found.name}"</strong>
                {" "}at <strong style={{ color: "var(--text-1)" }}>{m.lost.location}</strong>
              </span>
              <span style={{
                fontSize: "10px", fontWeight: "700",
                padding: "2px 7px", borderRadius: "20px",
                background: m.confidence >= 80 ? "#ECFDF5" : m.confidence >= 60 ? "#FFFBEB" : "#FEF2F2",
                color:      m.confidence >= 80 ? "#059669" : m.confidence >= 60 ? "#D97706" : "#DC2626"
              }}>
                {m.confidence}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        display: "flex", gap: "8px",
        alignItems: "center", flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: "4px"
      }}>
        <SearchBar search={search} setSearch={setSearch} />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: "9px 12px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            fontSize: "13px", fontWeight: "600",
            color: "var(--text-2)",
            cursor: "pointer"
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      <FilterButtons filter={filter} setFilter={setFilter} />

      <p style={{
        fontSize: "12px", color: "var(--text-3)",
        fontWeight: "500", margin: "6px 0 16px"
      }}>
        {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
        gap: "14px"
      }}>

        {items.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1", textAlign: "center",
            padding: "80px 20px"
          }}>
            <div style={{ fontSize: "52px", marginBottom: "20px" }}>📭</div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "22px", fontWeight: "700",
              color: "var(--text-1)", marginBottom: "8px"
            }}>Nothing here yet</h3>
            <p style={{
              color: "var(--text-3)", fontSize: "14px", marginBottom: "28px"
            }}>
              Be the first to report a lost or found item on campus.
            </p>
            <Link to="/add" style={{
              display: "inline-block",
              background: "var(--primary)",
              color: "white", textDecoration: "none",
              padding: "11px 28px", borderRadius: "var(--r-md)",
              fontWeight: "700", fontSize: "14px"
            }}>
              + Report an Item
            </Link>
          </div>

        ) : filteredItems.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1", textAlign: "center",
            padding: "60px 20px"
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
            <p style={{ color: "var(--text-3)", fontSize: "14px" }}>
              No items match your search or filter.
            </p>
          </div>

        ) : (
          <>
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                deleteItem={deleteItem}
                resolveItem={resolveItem}
                onEdit={setEditingItem}
              />
            ))}

            {/* Add card */}
            <Link to="/add" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--r-lg)",
                  minHeight: "180px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  color: "var(--text-3)",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--primary-muted)"
                  e.currentTarget.style.color = "var(--primary)"
                  e.currentTarget.style.background = "var(--primary-light)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.color = "var(--text-3)"
                  e.currentTarget.style.background = "var(--surface)"
                }}
              >
                <span style={{ fontSize: "24px", marginBottom: "6px" }}>+</span>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Report Item</span>
              </div>
            </Link>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}

export default Dashboard