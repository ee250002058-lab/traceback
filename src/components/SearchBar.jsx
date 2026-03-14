function SearchBar({ search, setSearch, darkMode }) {
  return (
    <div style={{
      background: darkMode ? "#2d2b55" : "white",
      padding: "11px 16px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
      margin: "20px 0",
      display: "flex",
      alignItems: "center",
      maxWidth: "420px",
      border: `1px solid ${darkMode ? "#4f46e5" : "#e5e7eb"}`,
      transition: "all 0.3s"
    }}>
      <span style={{ marginRight: "8px", fontSize: "17px" }}>🔍</span>
      <input
        type="text"
        placeholder="Search items, locations, categories..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          border: "none", outline: "none",
          width: "100%", fontSize: "14px",
          background: "transparent",
          color: darkMode ? "#e2e8f0" : "#333"
        }}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          style={{
            background: "none", border: "none",
            cursor: "pointer",
            color: darkMode ? "#94a3b8" : "#aaa",
            fontSize: "15px", padding: "0 2px", lineHeight: 1
          }}
        >✕</button>
      )}
    </div>
  )
}

export default SearchBar