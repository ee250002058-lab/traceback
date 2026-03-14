function FilterButtons({ filter, setFilter, darkMode }) {
  const filters = [
    { label: "📋 All",       value: "All",      activeColor: "#4f46e5" },
    { label: "🔴 Lost",      value: "Lost",     activeColor: "#ef4444" },
    { label: "🟢 Found",     value: "Found",    activeColor: "#10b981" },
    { label: "✅ Resolved",  value: "Resolved", activeColor: "#6366f1" },
  ]

  return (
    <div style={{ display: "flex", gap: "8px", margin: "15px 0", flexWrap: "wrap" }}>
      {filters.map(({ label, value, activeColor }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
            background: filter === value
              ? activeColor
              : (darkMode ? "#2d2b55" : "#f3f4f6"),
            color: filter === value ? "white" : (darkMode ? "#94a3b8" : "#555"),
            boxShadow: filter === value ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
            transition: "all 0.2s"
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons