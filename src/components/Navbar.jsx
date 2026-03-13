import { Link, useLocation } from "react-router-dom"

function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const navBg    = darkMode ? "#1e1b4b" : "white"
  const textColor = darkMode ? "#e2e8f0" : "#1e1b4b"

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#6366f1" : (darkMode ? "#94a3b8" : "#555"),
    fontWeight: isActive(path) ? "700" : "500",
    fontSize: "15px",
    padding: "7px 14px",
    borderRadius: "8px",
    background: isActive(path)
      ? (darkMode ? "rgba(99,102,241,0.2)" : "#eef2ff")
      : "transparent",
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  })

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      background: navBg,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      borderRadius: "14px",
      marginBottom: "24px",
      transition: "background 0.3s",
      flexWrap: "wrap",
      gap: "10px"
    }}>

      {/* BRAND */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "22px" }}>🔎</span>
        <h2 style={{
          margin: 0, color: textColor,
          fontSize: "clamp(16px, 3vw, 20px)",
          fontWeight: "800"
        }}>
          Traceback
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <Link to="/" style={linkStyle("/")}>Dashboard</Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          style={{
            background: darkMode ? "#312e81" : "#f3f4f6",
            border: "none",
            borderRadius: "8px",
            padding: "7px 10px",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "4px",
            transition: "all 0.2s"
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

    </div>
  )
}

export default Navbar