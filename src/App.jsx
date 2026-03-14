import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import AddItem   from "./pages/AddItem"
import Navbar    from "./components/Navbar"

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={darkMode ? "dark" : ""}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "24px 20px",
        transition: "background 0.3s"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/"    element={<Dashboard />} />
          <Route path="/add" element={<AddItem />} />
        </Routes>
      </div>
    </div>
  )
}

export default App