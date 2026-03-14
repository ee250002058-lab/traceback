import { useMemo } from "react"

function Stats({ items }) {
  const stats = useMemo(() => ({
    total:    items.length,
    lost:     items.filter(i => i.status === "Lost").length,
    found:    items.filter(i => i.status === "Found").length,
    resolved: items.filter(i => i.status === "Resolved").length,
  }), [items])

  const cards = [
    { label: "Total",    value: stats.total,    accent: "var(--primary)",  bg: "var(--primary-light)",  icon: "📦" },
    { label: "Lost",     value: stats.lost,     accent: "var(--lost)",     bg: "var(--lost-light)",     icon: "🔴" },
    { label: "Found",    value: stats.found,    accent: "var(--found)",    bg: "var(--found-light)",    icon: "🟢" },
    { label: "Resolved", value: stats.resolved, accent: "var(--resolved)", bg: "var(--resolved-light)", icon: "✅" },
  ]

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "12px",
      marginBottom: "24px"
    }}>
      {cards.map(({ label, value, accent, bg, icon }) => (
        <div key={label} style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "16px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Top accent strip */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "3px",
            background: accent,
            borderRadius: "var(--r-lg) var(--r-lg) 0 0"
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "8px"
              }}>
                {label}
              </p>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "30px",
                fontWeight: "800",
                color: "var(--text-1)",
                lineHeight: 1
              }}>
                {value}
              </p>
            </div>

            <div style={{
              width: "34px", height: "34px",
              background: bg,
              borderRadius: "var(--r-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px"
            }}>
              {icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Stats