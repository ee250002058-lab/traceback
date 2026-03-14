function SearchBar({ search, setSearch }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        padding: "9px 14px",
        flex: 1, maxWidth: "360px",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.15s"
      }}
      onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
      onBlur={e  => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <span style={{ fontSize: "14px", flexShrink: 0, opacity: 0.6 }}>🔍</span>
      <input
        type="text"
        placeholder="Search items, locations..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          border: "none", outline: "none",
          background: "transparent",
          fontSize: "14px",
          color: "var(--text-1)",
          width: "100%"
        }}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          style={{
            background: "none", border: "none",
            cursor: "pointer",
            color: "var(--text-3)",
            fontSize: "13px",
            padding: "0", flexShrink: 0,
            lineHeight: 1
          }}
        >✕</button>
      )}
    </div>
  )
}

export default SearchBar