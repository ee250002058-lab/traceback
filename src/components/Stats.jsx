import { useMemo } from "react"

function Stats({ items, darkMode }) {
  const stats = useMemo(() => ({
    total:    items.length,
    lost:     items.filter(i => i.status === "Lost").length,
    found:    items.filter(i => i.status === "Found").length,
    resolved: items.filter(i => i.status === "Resolved").length,
  }), [items])

  const cardBase = {
    background: darkMode ? "#2d2b55" : "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "all 0.3s"
  }

  const label = (color) => ({
    margin: "6px 0 2px",
    fontSize: "13px",
    fontWeight: "600",
    color: color || (darkMode ? "#94a3b8" : "#666")
  })

  const count = (color) => ({
    fontSize: "30px",
    fontWeight: "800",
    color,
    margin: "0"
  })

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "16px",
      marginBottom: "28px"
    }}>
      <div style={cardBase}>
        <div style={{ fontSize: "26px" }}>📦</div>
        <h3 style={label(darkMode ? "#94a3b8" : "#666")}>Total</h3>
        <p style={count(darkMode ? "#e2e8f0" : "#333")}>{stats.total}</p>
      </div>

      <div style={cardBase}>
        <div style={{ fontSize: "26px" }}>🔴</div>
        <h3 style={label("#ef4444")}>Lost</h3>
        <p style={count("#ef4444")}>{stats.lost}</p>
      </div>

      <div style={cardBase}>
        <div style={{ fontSize: "26px" }}>🟢</div>
        <h3 style={label("#10b981")}>Found</h3>
        <p style={count("#10b981")}>{stats.found}</p>
      </div>

      <div style={cardBase}>
        <div style={{ fontSize: "26px" }}>✅</div>
        <h3 style={label("#6366f1")}>Resolved</h3>
        <p style={count("#6366f1")}>{stats.resolved}</p>
      </div>
    </div>
  )
}

export default Stats