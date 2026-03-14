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
        setImageError(`Too large (${(file.size/1024/1024).toFixed(1)}MB). Max ${MAX_MB}MB.`)
        e.target.value = ""
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const input = {
    width: "100%",
    padding: "9px 12px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    fontSize: "14px",
    color: "var(--text-1)",
    outline: "none",
    transition: "border-color 0.15s"
  }

  const label = {
    fontSize: "11px",
    fontWeight: "700",
    color: "var(--text-3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: "5px"
  }

  const focusIn  = e => { e.target.style.borderColor = "var(--primary)" }
  const focusOut = e => { e.target.style.borderColor = "var(--border)" }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      <div>
        <label style={label}>Item Name *</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Black Leather Wallet" required
          style={input} onFocus={focusIn} onBlur={focusOut}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          <label style={label}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={input} onFocus={focusIn} onBlur={focusOut}>
            <option value="">Select...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={input} onFocus={focusIn} onBlur={focusOut}>
            <option value="Lost">🔴 Lost</option>
            <option value="Found">🟢 Found</option>
          </select>
        </div>
      </div>

      <div>
        <label style={label}>Location *</label>
        <input
          type="text" value={location} onChange={e => setLocation(e.target.value)}
          placeholder="Where was it lost / found?" required
          style={input} onFocus={focusIn} onBlur={focusOut}
        />
      </div>

      <div>
        <label style={label}>Date & Time</label>
        <input
          type="datetime-local" value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          style={input} onFocus={focusIn} onBlur={focusOut}
        />
      </div>

      <div>
        <label style={label}>Description</label>
        <textarea
          value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Color, brand, markings, any details..."
          rows="3" style={{ ...input, resize: "vertical" }}
          onFocus={focusIn} onBlur={focusOut}
        />
      </div>

      <div>
        <label style={label}>Photo (optional · max {MAX_MB}MB)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload}
          style={{ fontSize: "13px", color: "var(--text-2)" }} />
        {imageError && (
          <p style={{ color: "var(--lost)", fontSize: "12px", marginTop: "4px" }}>
            ⚠️ {imageError}
          </p>
        )}
      </div>

      {image && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={image} alt="Preview" style={{
            width: "110px", height: "80px",
            objectFit: "cover",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--border)"
          }} />
          <button type="button" onClick={() => setImage(null)} style={{
            position: "absolute", top: "-6px", right: "-6px",
            background: "var(--lost)", color: "white",
            border: "none", borderRadius: "50%",
            width: "18px", height: "18px",
            cursor: "pointer", fontSize: "9px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold"
          }}>✕</button>
        </div>
      )}

      <button
        type="submit"
        style={{
          background: "var(--primary)",
          color: "white", border: "none",
          padding: "11px", borderRadius: "var(--r-md)",
          cursor: "pointer", fontWeight: "700",
          fontSize: "14px", transition: "background 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
      >
        {isEdit ? "Save Changes" : "Add Item"}
      </button>
    </form>
  )
}

export default ItemForm