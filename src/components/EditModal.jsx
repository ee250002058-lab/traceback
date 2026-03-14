import ItemForm from "./ItemForm.jsx"

function EditModal({ item, onSave, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-2xl)",
          width: "100%", maxWidth: "500px",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          animation: "fadeUp 0.25s ease"
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 24px 16px",
          borderBottom: "1px solid var(--border)"
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "19px", fontWeight: "700",
            color: "var(--text-1)", letterSpacing: "-0.2px"
          }}>
            Edit Item
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              width: "28px", height: "28px",
              cursor: "pointer",
              color: "var(--text-2)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >✕</button>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          <ItemForm
            addItem={(updated) => { onSave(updated); onClose() }}
            initialValues={item}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  )
}

export default EditModal