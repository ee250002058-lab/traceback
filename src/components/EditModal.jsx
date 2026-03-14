import ItemForm from "./ItemForm.jsx"

function EditModal({ item, onSave, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "28px",
          width: "100%", maxWidth: "520px",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          position: "relative"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "#f3f4f6", border: "none",
            borderRadius: "8px", width: "32px", height: "32px",
            cursor: "pointer", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#555"
          }}
        >✕</button>

        <h2 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: "800", color: "#1e1b4b" }}>
          ✏️ Edit Item
        </h2>

        <ItemForm
          addItem={(updated) => { onSave(updated); onClose() }}
          initialValues={item}
          isEdit={true}
        />
      </div>
    </div>
  )
}

export default EditModal