import { useState } from "react"

const STATUS_CONFIG = {
  Lost:     { color: "#DC2626", bg: "#FEF2F2", label: "Lost"     },
  Found:    { color: "#059669", bg: "#ECFDF5", label: "Found"    },
  Resolved: { color: "#7C3AED", bg: "#F5F3FF", label: "Resolved" },
}

function ItemCard({ item, deleteItem, resolveItem, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [actionDone,    setActionDone]    = useState(false)

  const s = STATUS_CONFIG[item.status] || STATUS_CONFIG.Lost

  const getIcon = () => {
    const catIcons = {
      Electronics: "💻", Clothing: "👕", Accessories: "👜",
      Documents: "📄", Keys: "🔑", Bags: "🎒", Other: "📦"
    }
    if (item.category && catIcons[item.category]) return catIcons[item.category]
    const n = item.name.toLowerCase()
    if (n.includes("wallet")) return "👛"
    if (n.includes("phone"))  return "📱"
    if (n.includes("laptop")) return "💻"
    if (n.includes("bottle")) return "🥤"
    if (n.includes("bag"))    return "🎒"
    if (n.includes("key"))    return "🔑"
    return "📦"
  }

  const formatDateTime = (dt) => {
    if (!dt) return null
    const d = new Date(dt)
    if (isNaN(d)) return null
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short",
      hour: "2-digit", minute: "2-digit", hour12: true
    })
  }

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
    return `${days}d ago`
  }

  const ACTION = {
    Lost:  { text: "🙋 I Found It", color: "#4F46E5", bg: "#EEF2FF" },
    Found: { text: "✋ Claim Item",  color: "#059669", bg: "#ECFDF5" },
  }
  const action = ACTION[item.status]

  return (
    <div
      className="fade-up"
      style={{
        background: "var(--surface)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)"
        e.currentTarget.style.boxShadow = "var(--shadow-hover)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "var(--shadow-md)"
        setConfirmDelete(false)
        setActionDone(false)
      }}
    >
      {/* Left status strip */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: "3px",
        background: s.color,
        borderRadius: "var(--r-lg) 0 0 var(--r-lg)"
      }} />

      {/* Image */}
      {item.image && (
        <div style={{ marginLeft: "3px" }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%", height: "130px",
              objectFit: "cover", display: "block"
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{
        padding: "14px 14px 14px 18px",
        flex: 1, display: "flex",
        flexDirection: "column"
      }}>

        {/* Top row: icon + status badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px"
        }}>
          <span className="itemIcon" style={{ fontSize: "26px" }}>
            {getIcon()}
          </span>
          <span style={{
            fontSize: "10px",
            fontWeight: "700",
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            color: s.color,
            background: s.bg,
            padding: "3px 8px",
            borderRadius: "20px"
          }}>
            {s.label}
          </span>
        </div>

        {/* Name */}
        <h3 style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "var(--text-1)",
          margin: "0 0 5px",
          lineHeight: "1.3",
          letterSpacing: "-0.2px"
        }}>
          {item.name}
        </h3>

        {/* Category chip */}
        {item.category && (
          <span style={{
            display: "inline-block",
            alignSelf: "flex-start",
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--text-2)",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            padding: "2px 7px",
            borderRadius: "20px",
            marginBottom: "8px"
          }}>
            {item.category}
          </span>
        )}

        {/* Metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "10px" }}>📍</span>
            <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: "500" }}>
              {item.location}
            </span>
          </div>
          {item.dateTime && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "10px" }}>📅</span>
              <span style={{ fontSize: "12px", color: "var(--text-2)" }}>
                {formatDateTime(item.dateTime)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p style={{
            fontSize: "12px",
            color: "var(--text-3)",
            lineHeight: "1.5",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            marginBottom: "6px"
          }}>
            {item.description}
          </p>
        )}

        {/* Posted time */}
        {item.createdAt && (
          <p style={{
            fontSize: "11px",
            color: "var(--text-4)",
            marginBottom: "10px"
          }}>
            Posted {getTimeAgo(item.createdAt)}
          </p>
        )}

        {/* Resolved banner */}
        {item.status === "Resolved" && (
          <div style={{
            background: "var(--resolved-light)",
            borderRadius: "var(--r-sm)",
            padding: "8px 10px",
            fontSize: "12px",
            fontWeight: "600",
            color: "#7C3AED",
            textAlign: "center",
            marginBottom: "10px"
          }}>
            ✅ Item resolved
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "var(--border)",
          margin: "0 0 10px"
        }} />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "5px" }}>

          {/* Primary action */}
          {action && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!actionDone) {
                  setActionDone(true)
                } else {
                  resolveItem(item.id)
                }
              }}
              style={{
                flex: 2,
                padding: "7px 8px",
                background: actionDone ? action.color : action.bg,
                color: actionDone ? "white" : action.color,
                border: "1px solid transparent",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "700",
                transition: "all 0.15s",
                whiteSpace: "nowrap"
              }}
            >
              {actionDone ? "✅ Confirm?" : action.text}
            </button>
          )}

          {/* Edit */}
          {item.status !== "Resolved" && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item) }}
              style={{
                flex: 1,
                padding: "7px",
                background: "var(--surface-2)",
                color: "var(--text-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                transition: "all 0.15s"
              }}
            >
              ✏️ Edit
            </button>
          )}

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (!confirmDelete) {
                setConfirmDelete(true)
                setTimeout(() => setConfirmDelete(false), 3000)
              } else {
                deleteItem(item.id)
              }
            }}
            style={{
              flex: confirmDelete ? 2 : 1,
              padding: "7px",
              background: confirmDelete ? "#DC2626" : "transparent",
              color: confirmDelete ? "white" : "#DC2626",
              border: `1px solid ${confirmDelete ? "#DC2626" : "var(--lost-light)"}`,
              borderRadius: "var(--r-sm)",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              transition: "all 0.15s",
              whiteSpace: "nowrap"
            }}
          >
            {confirmDelete ? "⚠️ Sure?" : "🗑"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard