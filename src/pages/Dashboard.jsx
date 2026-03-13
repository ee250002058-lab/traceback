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

// ─── helpers ──────────────────────────────────────────────────────────────────
const norm = (s = "") => s.toLowerCase().trim().replace(/\s+/g, " ")

const locationsMatch = (a, b) => {
  const na = norm(a), nb = norm(b)
  if (!na || !nb) return false
  return na === nb || na.includes(nb) || nb.includes(na)
}

const STOP_WORDS = new Set([
  "a","an","the","and","or","is","it","in","on","at","to","of","for",
  "was","were","has","have","with","this","that","my","i","me","been"
])
const keywords = (s = "") =>
  norm(s).split(" ").filter(w => w.length > 2 && !STOP_WORDS.has(w))

const sharedKeywordCount = (a, b) => {
  const sa = new Set(keywords(a))
  const sb = new Set(keywords(b))
  return [...sa].filter(w => sb.has(w)).length
}

const namesAreRelated = (a, b) => {
  const na = norm(a), nb = norm(b)
  if (!na || !nb) return false
  if (na === nb) return true
  if (na.includes(nb) || nb.includes(na)) return true
  return sharedKeywordCount(a, b) >= 1
}

const CACHE_KEY = "traceback_items_cache"
const loadCache = () => {
  try {
    const c = localStorage.getItem(CACHE_KEY)
    return c ? JSON.parse(c) : []
  } catch { return [] }
}
const saveCache = (items) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)) } catch {}
}

// ─── component ────────────────────────────────────────────────────────────────
function Dashboard({ darkMode }) {
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

  // Use refs to avoid stale closures in callbacks
  const detectedCache = useRef({})
  const itemsRef      = useRef(items)
  useEffect(() => { itemsRef.current = items }, [items])

  // ── Sync ──────────────────────────────────────────────────────────────────
  const syncItems = useCallback(async (isBackground = false) => {
    if (!isBackground) setSyncing(true)
    try {
      const data = await fetchItems()
      setItems(data)
      saveCache(data)
      setSyncError(false)
    } catch {
      if (!isBackground) setSyncError(true)
    } finally {
      if (!isBackground) setSyncing(false)
    }
  }, [])

  useEffect(() => { syncItems(true) }, [syncItems])

  useEffect(() => {
    const interval = setInterval(() => syncItems(true), 10000)
    return () => clearInterval(interval)
  }, [syncItems])

  // ── Actions ───────────────────────────────────────────────────────────────
  const deleteItem = useCallback(async (id) => {
    const prev    = itemsRef.current
    const updated = prev.filter(item => item.id !== id)
    setItems(updated)
    saveCache(updated)
    try {
      await apiDelete(id)
    } catch {
      setItems(prev)
      saveCache(prev)
    }
  }, [])

  const resolveItem = useCallback(async (id) => {
    const prev    = itemsRef.current
    const updated = prev.map(item =>
      item.id === id ? { ...item, status: "Resolved" } : item
    )
    setItems(updated)
    saveCache(updated)
    try {
      await apiResolve(id)
    } catch {
      setItems(prev)
      saveCache(prev)
    }
  }, [])

  const editItem = useCallback(async (updatedItem) => {
    const prev    = itemsRef.current
    const updated = prev.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    )
    setItems(updated)
    saveCache(updated)
    try {
      await apiUpdate(updatedItem)
    } catch {
      setItems(prev)
      saveCache(prev)
    }
  }, [])

  // ── Filtering + Sorting ───────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const q = norm(search)
        const matchesSearch =
          norm(item.name).includes(q)        ||
          norm(item.location).includes(q)    ||
          norm(item.category).includes(q)    ||
          norm(item.description).includes(q)
        const matchesFilter = filter === "All" || item.status === filter
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        const aT = a.createdAt || 0
        const bT = b.createdAt || 0
        if (sortBy === "newest") return bT - aT
        if (sortBy === "oldest") return aT - bT
        if (sortBy === "az")     return norm(a.name).localeCompare(norm(b.name))
        if (sortBy === "za")     return norm(b.name).localeCompare(norm(a.name))
        return 0
      })
  }, [items, search, filter, sortBy])

  // ── AI Matching ───────────────────────────────────────────────────────────
  const findMatchesWithAI = useCallback(async (currentItems) => {
    const lostItems  = currentItems.filter(i => i.status === "Lost")
    const foundItems = currentItems.filter(i => i.status === "Found")
    const results    = []
    const seenPairs  = new Set()

    for (const lost of lostItems) {
      const candidates = foundItems.filter(f =>
        locationsMatch(f.location, lost.location)
      )
      for (const found of candidates) {
        const pairKey = [lost.id, found.id].sort().join("|")
        if (seenPairs.has(pairKey)) continue
        seenPairs.add(pairKey)

        let score = 0, maxScore = 0

        maxScore += 2
        if (namesAreRelated(lost.name, found.name)) score += 2
        maxScore += 1
        if (locationsMatch(lost.location, found.location)) score += 1

        if (lost.category && found.category) {
          maxScore += 1
          if (norm(lost.category) === norm(found.category)) score += 1
        }
        if (lost.description && found.description) {
          maxScore += 1
          if (sharedKeywordCount(lost.description, found.description) >= 1) score += 1
        }
        if (lost.image && found.image) {
          maxScore += 2
          try {
            if (!detectedCache.current[lost.id])
              detectedCache.current[lost.id]  = await detectObject(lost.image)
            if (!detectedCache.current[found.id])
              detectedCache.current[found.id] = await detectObject(found.image)
            const lObj = detectedCache.current[lost.id]
            const fObj = detectedCache.current[found.id]
            if (lObj && fObj && lObj !== "unknown" && lObj === fObj) score += 2
          } catch {}
        }

        if (maxScore > 0 && score >= maxScore * 0.60) {
          results.push({ lost, found, confidence: Math.round((score / maxScore) * 100) })
        }
      }
    }
    return results.sort((a, b) => b.confidence - a.confidence)
  }, [])

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setAiLoading(true)
      try {
        const result = await findMatchesWithAI(items)
        if (!cancelled) {
          setMatches(result)
          if (result.length > 0) setShowMatchAlert(true)
        }
      } catch {}
      finally { if (!cancelled) setAiLoading(false) }
    }, 800)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [items, findMatchesWithAI])

  // ── Theme ─────────────────────────────────────────────────────────────────
  const t = {
    bg:      darkMode ? "#1a1a2e" : "white",
    text:    darkMode ? "#e2e8f0" : "#1e1b4b",
    subtext: darkMode ? "#94a3b8" : "#666",
    border:  darkMode ? "#2d2b55" : "#e5e7eb",
    cardBg:  darkMode ? "#2d2b55" : "#f9fafb",
  }

  return (
    <>
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={editItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      <div style={{
        maxWidth: "1200px", margin: "auto",
        background: t.bg,
        padding: "clamp(20px, 4vw, 40px)",
        borderRadius: "18px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        transition: "background 0.3s"
      }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: "800", color: t.text, margin: "0 0 6px"
          }}>
            🔎 Traceback
          </h1>
          <p style={{ fontSize: "clamp(13px, 2vw, 16px)", color: t.subtext, margin: 0 }}>
            Smart Lost & Found System
          </p>

          {/* Live indicator */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "6px",
            marginTop: "8px", fontSize: "12px",
            color: syncError ? "#ef4444" : "#10b981"
          }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: syncError ? "#ef4444" : "#10b981",
              boxShadow: syncError ? "0 0 6px #ef4444" : "0 0 6px #10b981"
            }} />
            {syncError ? "Backend offline — showing cached data"
              : syncing ? "Syncing..." : "Live"}
          </div>

          {aiLoading && (
            <p style={{ fontSize: "13px", color: "#6366f1", marginTop: "6px", fontWeight: "500" }}>
              🤖 AI scanning for matches...
            </p>
          )}
        </div>

        <Stats items={items} darkMode={darkMode} />

        {/* AI MATCH BANNER */}
        {matches.length > 0 && showMatchAlert && (
          <>
            <div style={{
              background: darkMode ? "#1e1b4b" : "#eef2ff",
              border: "1px solid #6366f1",
              padding: "11px 16px", borderRadius: "10px",
              marginBottom: "10px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "8px"
            }}>
              <span style={{ fontWeight: "600", color: "#4f46e5", fontSize: "14px" }}>
                🔔 AI found {matches.length} possible match{matches.length > 1 ? "es" : ""}
              </span>
              <button
                onClick={() => setShowMatchAlert(false)}
                style={{
                  border: "none", background: "transparent",
                  cursor: "pointer", fontSize: "15px", color: "#6366f1"
                }}
              >✕</button>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #fde68a, #fcd34d)",
              padding: "16px 20px", marginBottom: "24px",
              borderRadius: "12px", boxShadow: "0 4px 14px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "15px", color: "#1e1b4b" }}>
                ⚡ Possible Matches
              </h3>
              {matches.map((match, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "8px", padding: "10px 14px",
                  marginBottom: i < matches.length - 1 ? "8px" : "0",
                  fontSize: "13px", color: "#1e1b4b"
                }}>
                  🔍 Lost <b>"{match.lost.name}"</b> at <b>{match.lost.location}</b>
                  {" "}may match Found <b>"{match.found.name}"</b> — Confidence:{" "}
                  <b style={{
                    color: match.confidence >= 80 ? "#16a34a"
                         : match.confidence >= 60 ? "#d97706" : "#dc2626"
                  }}>
                    {match.confidence}%
                  </b>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SEARCH + SORT */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: "12px", alignItems: "center",
          justifyContent: "space-between"
        }}>
          <SearchBar search={search} setSearch={setSearch} darkMode={darkMode} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: "10px 14px", borderRadius: "10px",
              border: `1px solid ${t.border}`,
              background: darkMode ? "#2d2b55" : "white",
              color: darkMode ? "#e2e8f0" : "#333",
              fontSize: "14px", fontWeight: "500",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)"
            }}
          >
            <option value="newest">🕐 Newest First</option>
            <option value="oldest">🕑 Oldest First</option>
            <option value="az">🔤 A → Z</option>
            <option value="za">🔤 Z → A</option>
          </select>
        </div>

        <FilterButtons filter={filter} setFilter={setFilter} darkMode={darkMode} />

        <p style={{ color: t.subtext, fontSize: "13px", margin: "8px 0 16px" }}>
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
        </p>

        {/* GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
          gap: "20px"
        }}>
          {items.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1", textAlign: "center",
              padding: "60px 20px", color: t.subtext
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
              <h3 style={{ fontSize: "22px", color: t.text, margin: "0 0 8px" }}>
                No items yet!
              </h3>
              <p style={{ fontSize: "15px", marginBottom: "24px" }}>
                Be the first to report a lost or found item.
              </p>
              <Link to="/add" style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white", textDecoration: "none",
                padding: "13px 30px", borderRadius: "10px",
                fontWeight: "700", fontSize: "15px",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)"
              }}>
                ➕ Add Your First Item
              </Link>
            </div>

          ) : filteredItems.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1", textAlign: "center",
              padding: "50px 20px", color: t.subtext
            }}>
              <div style={{ fontSize: "50px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontSize: "15px" }}>
                No items match your search. Try different keywords or filters.
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

              <Link to="/add" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: t.cardBg, borderRadius: "14px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: "#6366f1", cursor: "pointer",
                    border: `2px dashed ${darkMode ? "#4f46e5" : "#c7d2fe"}`,
                    minHeight: "220px", textAlign: "center",
                    transition: "all 0.25s ease"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"
                    e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.14)"
                    e.currentTarget.style.background = darkMode ? "#312e81" : "#eef2ff"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.background = t.cardBg
                  }}
                >
                  <div style={{ fontSize: "46px", marginBottom: "10px" }}>➕</div>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>Add Item</h3>
                  <p style={{ fontSize: "12px", color: t.subtext, marginTop: "4px" }}>
                    Report lost or found
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  )
}

export default Dashboard