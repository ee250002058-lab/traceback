import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.svg"

function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const navBg     = darkMode ? "#1e1b4b" : "white"
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
      padding: "10px 20px",
      background: navBg,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      borderRadius: "14px",
      marginBottom: "24px",
      transition: "background 0.3s",
      flexWrap: "wrap",
      gap: "10px"
    }}>

      {/* BRAND */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} alt="Traceback Logo" style={{ width: "38px", height: "38px" }} />
        <h2 style={{
          margin: 0, color: textColor,
          fontSize: "clamp(16px, 3vw, 20px)",
          fontWeight: "800", letterSpacing: "0.3px"
        }}>
          Traceback
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Link to="/" style={linkStyle("/")}>Dashboard</Link>

        {/* TOGGLE SWITCH */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          {/* Sun icon */}
          <span style={{
            fontSize: "13px",
            opacity: darkMode ? 0.4 : 1,
            transition: "opacity 0.3s"
          }}>☀️</span>

          {/* The pill track */}
          <div style={{
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            background: darkMode
              ? "linear-gradient(135deg, #6366f1, #4f46e5)"
              : "#d1d5db",
            position: "relative",
            transition: "background 0.3s",
            boxShadow: darkMode
              ? "0 0 10px rgba(99,102,241,0.5)"
              : "inset 0 1px 3px rgba(0,0,0,0.15)"
          }}>
            {/* The sliding circle */}
            <div style={{
              position: "absolute",
              top: "3px",
              left: darkMode ? "23px" : "3px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            }} />
          </div>

          {/* Moon icon */}
          <span style={{
            fontSize: "13px",
            opacity: darkMode ? 1 : 0.4,
            transition: "opacity 0.3s"
          }}>🌙</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar