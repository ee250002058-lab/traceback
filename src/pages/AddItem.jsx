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
      setError(err.message || "Failed to save. Make sure server is running.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: "540px", margin: "0 auto", animation: "fadeUp 0.3s ease" }}>

      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none", border: "none",
          color: "var(--text-2)", cursor: "pointer",
          fontSize: "13px", fontWeight: "600",
          marginBottom: "16px", padding: "0",
          display: "flex", alignItems: "center", gap: "5px",
          transition: "color 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}
      >
        ← Back
      </button>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-2xl)",
        padding: "28px 28px 32px",
        boxShadow: "var(--shadow-lg)"
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "22px", fontWeight: "800",
          color: "var(--text-1)",
          marginBottom: "22px",
          letterSpacing: "-0.3px"
        }}>
          Report an Item
        </h2>

        {error && (
          <div style={{
            background: "var(--lost-light)",
            border: "1px solid var(--lost)",
            color: "var(--lost)",
            padding: "10px 14px", borderRadius: "var(--r-md)",
            marginBottom: "14px", fontSize: "13px", fontWeight: "500"
          }}>
            ⚠️ {error}
          </div>
        )}

        {saving && (
          <div style={{
            background: "var(--primary-light)",
            color: "var(--primary)",
            padding: "10px 14px", borderRadius: "var(--r-md)",
            marginBottom: "14px", fontSize: "13px", fontWeight: "500"
          }}>
            ⏳ Saving...
          </div>
        )}

        <ItemForm addItem={addItem} />
      </div>
    </div>
  )
}

export default AddItem