import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.svg"

function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
      height: "54px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-xl)",
      marginBottom: "20px"
    }}>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <img src={logo} alt="Traceback" style={{ width: "30px", height: "30px" }} />
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: "700",
          fontSize: "17px",
          color: "var(--text-1)",
          letterSpacing: "-0.3px"
        }}>
          Traceback
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
            color: isActive("/") ? "var(--primary)" : "var(--text-2)",
            background: isActive("/") ? "var(--primary-light)" : "transparent",
            padding: "6px 12px",
            borderRadius: "var(--r-md)",
            transition: "all 0.15s"
          }}
        >
          Dashboard
        </Link>

        {/* Dark mode toggle */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            cursor: "pointer",
            padding: "5px 10px",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            background: "var(--surface-2)",
            userSelect: "none",
            transition: "all 0.2s"
          }}
        >
          <span style={{ fontSize: "12px", opacity: darkMode ? 0.35 : 1, transition: "opacity 0.2s" }}>☀️</span>

          <div style={{
            width: "34px", height: "18px", borderRadius: "9px",
            background: darkMode ? "var(--primary)" : "var(--border)",
            position: "relative", transition: "background 0.25s"
          }}>
            <div style={{
              position: "absolute", top: "2px",
              left: darkMode ? "18px" : "2px",
              width: "14px", height: "14px", borderRadius: "50%",
              background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)"
            }} />
          </div>

          <span style={{ fontSize: "12px", opacity: darkMode ? 1 : 0.35, transition: "opacity 0.2s" }}>🌙</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar