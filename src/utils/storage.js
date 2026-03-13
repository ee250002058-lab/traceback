export function loadItems() {
  const saved = localStorage.getItem("items")
  return saved ? JSON.parse(saved) : []
}

export function saveItems(items) {
  localStorage.setItem("items", JSON.stringify(items))
}