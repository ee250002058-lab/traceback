import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import AddItem from "./pages/AddItem"
import Navbar from "./components/Navbar"

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg, #1e1b4b, #0f172a)"
        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
      padding: "28px 20px",
      transition: "background 0.4s ease"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/"    element={<Dashboard darkMode={darkMode} />} />
          <Route path="/add" element={<AddItem />} />
        </Routes>
      </div>
    </div>
  )
}

export default App