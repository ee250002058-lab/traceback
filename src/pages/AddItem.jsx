import ItemForm from "../components/ItemForm.jsx"
import { useNavigate } from "react-router-dom"
import { loadItems, saveItems } from "../utils/storage.js"

function AddItem() {
  const navigate = useNavigate()

  const addItem = (item) => {
    const existing = loadItems()
    saveItems([...existing, item])
    navigate("/")
  }

  return (
    <div style={{
      padding: "40px", maxWidth: "620px", margin: "auto",
      background: "white", borderRadius: "18px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none", border: "none",
          color: "#6366f1", cursor: "pointer",
          fontSize: "15px", fontWeight: "600",
          marginBottom: "20px", padding: "0",
          display: "flex", alignItems: "center", gap: "6px"
        }}
      >
        ← Back
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "28px", fontSize: "26px", color: "#1e1b4b" }}>
        ➕ Add Lost / Found Item
      </h2>

      <ItemForm addItem={addItem} />
    </div>
  )
}

export default AddItem