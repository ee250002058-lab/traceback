import ItemForm   from "../components/ItemForm.jsx"
import { useNavigate } from "react-router-dom"
import { createItem }  from "../utils/api.js"
import { useState }    from "react"

function AddItem() {
  const navigate            = useNavigate()
  const [error,  setError]  = useState("")
  const [saving, setSaving] = useState(false)

  const addItem = async (item) => {
    setSaving(true); setError("")
    try {
      await createItem(item)
      navigate("/")
    } catch (err) {
      setError(err.message || "Failed to save item.")
    } finally {
      setSaving(false)
    }
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

      {error && (
        <div style={{
          background: "#fee2e2", color: "#ef4444",
          padding: "12px 16px", borderRadius: "8px",
          marginBottom: "16px", fontSize: "14px", fontWeight: "500"
        }}>
          ⚠️ {error}
        </div>
      )}

      {saving && (
        <div style={{
          background: "#eef2ff", color: "#4f46e5",
          padding: "12px 16px", borderRadius: "8px",
          marginBottom: "16px", fontSize: "14px", fontWeight: "500"
        }}>
          ⏳ Saving item...
        </div>
      )}

      <ItemForm addItem={addItem} />
    </div>
  )
}

export default AddItem