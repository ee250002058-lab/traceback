function FilterButtons({ filter, setFilter }) {
  const filters = [
    { label: "All",       value: "All",      color: "var(--primary)", bg: "var(--primary-light)" },
    { label: "🔴 Lost",   value: "Lost",     color: "var(--lost)",    bg: "var(--lost-light)"    },
    { label: "🟢 Found",  value: "Found",    color: "var(--found)",   bg: "var(--found-light)"   },
    { label: "✅ Resolved",value: "Resolved", color: "var(--resolved)",bg: "var(--resolved-light)"},
  ]

  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "10px 0" }}>
      {filters.map(({ label, value, color, bg }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            border: filter === value ? "1px solid transparent" : "1px solid var(--border)",
            background: filter === value ? bg : "var(--surface)",
            color: filter === value ? color : "var(--text-2)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.15s"
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons