import { useState } from "react"

function ItemCard({ item, deleteItem, resolveItem, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [actionDone,    setActionDone]    = useState(false)

  const getIcon = () => {
    const categoryIcons = {
      Electronics: "💻", Clothing: "👕", Accessories: "👜",
      Documents: "📄", Keys: "🔑", Bags: "🎒", Other: "📦"
    }
    if (item.category && categoryIcons[item.category])
      return categoryIcons[item.category]

    const name = item.name.toLowerCase()
    if (name.includes("wallet"))  return "👛"
    if (name.includes("bottle"))  return "🥤"
    if (name.includes("phone"))   return "📱"
    if (name.includes("laptop"))  return "💻"
    if (name.includes("bag"))     return "🎒"
    if (name.includes("key"))     return "🔑"
    return "📦"
  }

  // Format the user-entered dateTime nicely
  const formatDateTime = (dt) => {
    if (!dt) return null
    const d = new Date(dt)
    if (isNaN(d)) return null
    return d.toLocaleString("en-IN", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  // How long ago was it posted (createdAt)
  const getTimeAgo = (ts) => {
    if (!ts) return null
    const diff  = Date.now() - ts
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  < 1)   return "Just now"
    if (mins  < 60)  return `${mins}m ago`
    if (hours < 24)  return `${hours}h ago`
    if (days  === 1) return "Yesterday"
    return `${days} days ago`
  }

  const statusConfig = {
    Lost:     { color: "#ef4444", bg: "#fee2e2", border: "transparent" },
    Found:    { color: "#10b981", bg: "#d1fae5", border: "transparent" },
    Resolved: { color: "#6366f1", bg: "#eef2ff", border: "#6366f1"    },
  }
  const s = statusConfig[item.status] || statusConfig.Lost

  const handleAction = (e) => {
    e.stopPropagation()
    if (!actionDone) {
      setActionDone(true)
    } else {
      resolveItem(item.id)
    }
  }

  const actionButton = () => {
    if (item.status === "Lost") return {
      idle:      "🙋 I Found It!",
      confirm:   "✅ Confirm?",
      idleBg:    "#3b82f6",
      confirmBg: "#10b981",
    }
    if (item.status === "Found") return {
      idle:      "✋ Claim Item",
      confirm:   "✅ Confirm?",
      idleBg:    "#10b981",
      confirmBg: "#6366f1",
    }
    return null
  }

  const btn = actionButton()

  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "18px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        transition: "all 0.25s ease",
        position: "relative",
        border: `2px solid ${s.border}`,
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"
        e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.14)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0) scale(1)"
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"
        setConfirmDelete(false)
        setActionDone(false)
      }}
    >

      {/* STATUS BADGE */}
      <div style={{
        position: "absolute", top: "12px", right: "12px",
        background: s.bg, color: s.color,
        padding: "3px 10px", borderRadius: "20px",
        fontSize: "11px", fontWeight: "700"
      }}>
        {item.status}
      </div>

      {/* ICON */}
      <div className="itemIcon" style={{ fontSize: "32px", marginBottom: "6px" }}>
        {getIcon()}
      </div>

      {/* IMAGE */}
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "100%", height: "150px",
            objectFit: "cover", borderRadius: "10px",
            marginBottom: "10px"
          }}
        />
      )}

      {/* NAME */}
      <h3 style={{
        margin: "4px 0", fontSize: "17px",
        color: "#1e1b4b", fontWeight: "700",
        paddingRight: "70px" // space for status badge
      }}>
        {item.name}
      </h3>

      {/* CATEGORY */}
      {item.category && (
        <span style={{
          display: "inline-block",
          background: "#f3f4f6", color: "#555",
          fontSize: "11px", fontWeight: "600",
          padding: "2px 8px", borderRadius: "12px",
          marginBottom: "6px", alignSelf: "flex-start"
        }}>
          {item.category}
        </span>
      )}

      {/* LOCATION */}
      <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>
        📍 {item.location}
      </p>

      {/* USER-ENTERED DATE/TIME */}
      {item.dateTime && (
        <p style={{ color: "#666", fontSize: "13px", margin: "4px 0" }}>
          📅 {formatDateTime(item.dateTime)}
        </p>
      )}

      {/* DESCRIPTION */}
      {item.description && (
        <p style={{
          color: "#888", fontSize: "12px",
          margin: "6px 0", lineHeight: "1.5",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          flex: 1
        }}>
          {item.description}
        </p>
      )}

      {/* POSTED TIMESTAMP */}
      {item.createdAt && (
        <p style={{ color: "#ccc", fontSize: "11px", margin: "6px 0 10px" }}>
          🕐 Posted {getTimeAgo(item.createdAt)}
        </p>
      )}

      {/* RESOLVED BANNER */}
      {item.status === "Resolved" && (
        <div style={{
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          borderRadius: "8px", padding: "9px",
          textAlign: "center", fontSize: "13px",
          fontWeight: "600", color: "#4f46e5",
          marginBottom: "10px"
        }}>
          ✅ This item has been resolved
        </div>
      )}

      {/* ACTION BUTTONS ROW */}
      <div style={{ display: "flex", gap: "6px", marginTop: "auto" }}>

        {/* I Found It / Claim Item */}
        {btn && (
          <button
            onClick={handleAction}
            style={{
              flex: 2, padding: "8px 6px",
              background: actionDone ? btn.confirmBg : btn.idleBg,
              color: "white", border: "none",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "12px", fontWeight: "600",
              transition: "all 0.2s", lineHeight: "1.3"
            }}
          >
            {actionDone ? btn.confirm : btn.idle}
          </button>
        )}

        {/* EDIT — only for non-resolved items */}
        {item.status !== "Resolved" && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item) }}
            style={{
              flex: 1, padding: "8px 6px",
              background: "#f3f4f6", color: "#4f46e5",
              border: "1.5px solid #e0e7ff",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "13px", fontWeight: "600",
              transition: "all 0.2s"
            }}
          >
            ✏️
          </button>
        )}

        {/* DELETE */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!confirmDelete) {
              setConfirmDelete(true)
            } else {
              deleteItem(item.id)
            }
          }}
          style={{
            flex: 1, padding: "8px 6px",
            background: confirmDelete ? "#ef4444" : "#fee2e2",
            color: confirmDelete ? "white" : "#ef4444",
            border: "none", borderRadius: "8px",
            cursor: "pointer", fontSize: "12px",
            fontWeight: "600", transition: "all 0.2s"
          }}
        >
          {confirmDelete ? "Sure?" : "🗑"}
        </button>

      </div>
    </div>
  )
}

export default ItemCard