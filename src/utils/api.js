const BASE_URL = "http://localhost:5000/api/items"

// Retry a fetch up to `retries` times with a delay between attempts
async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      return res
    } catch (err) {
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw err
      }
    }
  }
}

// ── Fetch all items ───────────────────────────────────────────────────────────
export async function fetchItems() {
  const res = await fetchWithRetry(BASE_URL)
  const items = await res.json()
  return items.map(normalise)
}

// ── Create new item ───────────────────────────────────────────────────────────
export async function createItem(item) {
  const res = await fetchWithRetry(BASE_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(item)
  })
  return normalise(await res.json())
}

// ── Update item ───────────────────────────────────────────────────────────────
export async function updateItem(item) {
  const res = await fetchWithRetry(`${BASE_URL}/${item._id || item.id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(item)
  })
  return normalise(await res.json())
}

// ── Resolve item ──────────────────────────────────────────────────────────────
export async function resolveItem(id) {
  const res = await fetchWithRetry(`${BASE_URL}/${id}/resolve`, {
    method: "PATCH"
  })
  return normalise(await res.json())
}

// ── Delete item ───────────────────────────────────────────────────────────────
export async function deleteItem(id) {
  await fetchWithRetry(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
  return true
}

// ── Helper ────────────────────────────────────────────────────────────────────
function normalise(item) {
  return { ...item, id: item._id || item.id }
}