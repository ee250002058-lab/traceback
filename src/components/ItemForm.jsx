import { useState } from "react"

const CATEGORIES = ["Electronics", "Clothing", "Accessories", "Documents", "Keys", "Bags", "Other"]
const MAX_MB = 2

function ItemForm({ addItem, initialValues = null, isEdit = false }) {
  const [name,        setName]        = useState(initialValues?.name        || "")
  const [location,    setLocation]    = useState(initialValues?.location    || "")
  const [status,      setStatus]      = useState(initialValues?.status      || "Lost")
  const [image,       setImage]       = useState(initialValues?.image       || null)
  const [description, setDescription] = useState(initialValues?.description || "")
  const [category,    setCategory]    = useState(initialValues?.category    || "")
  const [dateTime,    setDateTime]    = useState(initialValues?.dateTime    || "")
  const [imageError,  setImageError]  = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (imageError) return
    addItem({
      ...(initialValues || {}),
      name, location, status, description, category, dateTime, image,
      ...(!isEdit && { createdAt: Date.now() })
    })
    if (!isEdit) {
      setName(""); setLocation(""); setStatus("Lost")
      setImage(null); setDescription("")
      setCategory(""); setDateTime(""); setImageError("")
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setImageError("")
    if (file) {
      if (file.size / 1024 / 1024 > MAX_MB) {
        setImageError(`File too large (${(file.size/1024/1024).toFixed(1)}MB). Max ${MAX_MB}MB.`)
        e.target.value = ""
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const inputStyle = {
    padding: "11px 13px",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    background: "white",
    color: "#1e1b4b"
  }

  const labelStyle = {
    fontSize: "11px", fontWeight: "700",
    color: "#888", marginBottom: "5px",
    display: "block", textTransform: "uppercase",
    letterSpacing: "0.5px"
  }

  return (
    <div style={{
      background: "white", padding: "24px",
      borderRadius: "14px",
      boxShadow: isEdit ? "none" : "0 6px 20px rgba(0,0,0,0.07)",
      maxWidth: "500px", margin: "auto"
    }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        <div>
          <label style={labelStyle}>Item Name *</label>
          <input type="text" placeholder="e.g. Black Leather Wallet"
            value={name} onChange={e => setName(e.target.value)}
            required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Select a category...</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Location *</label>
          <input type="text" placeholder="Where was it lost / found?"
            value={location} onChange={e => setLocation(e.target.value)}
            required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Date & Time (optional)</label>
          <input type="datetime-local" value={dateTime}
            onChange={e => setDateTime(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea placeholder="Color, brand, markings, any extra details..."
            value={description} onChange={e => setDescription(e.target.value)}
            rows="3" style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
            <option value="Lost">🔴 Lost</option>
            <option value="Found">🟢 Found</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Photo (optional · max {MAX_MB} MB)</label>
          <input type="file" accept="image/*" onChange={handleImageUpload}
            style={{ fontSize: "13px" }} />
          {imageError && (
            <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0" }}>
              ⚠️ {imageError}
            </p>
          )}
        </div>

        {image && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={image} alt="Preview"
              style={{ width: "130px", borderRadius: "8px", boxShadow: "0 3px 10px rgba(0,0,0,0.12)" }} />
            <button type="button" onClick={() => setImage(null)} style={{
              position: "absolute", top: "-7px", right: "-7px",
              background: "#ef4444", color: "white", border: "none",
              borderRadius: "50%", width: "22px", height: "22px",
              cursor: "pointer", fontSize: "11px", fontWeight: "bold",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>✕</button>
          </div>
        )}

        <button
          type="submit"
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.4)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"
          }}
          style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "white", border: "none",
            padding: "13px", borderRadius: "10px",
            cursor: "pointer", fontWeight: "700", fontSize: "16px",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
        >
          {isEdit ? "💾 Save Changes" : "➕ Add Item"}
        </button>
      </form>
    </div>
  )
}

export default ItemForm