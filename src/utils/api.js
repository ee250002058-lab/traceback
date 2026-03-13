const BASE_URL = "http://localhost:5000/api/items"

async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options)
      // Don't retry on 400 — it's a data problem not a network problem
      if (res.status === 400) {
        const err = await res.json()
        throw new Error(`400: ${err.details || err.error || "Bad request"}`)
      }
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      return res
    } catch (err) {
      if (err.message.startsWith("400")) throw err
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw err
      }
    }
  }
}

export async function fetchItems() {
  const res = await fetchWithRetry(BASE_URL)
  const items = await res.json()
  return items.map(normalise)
}

export async function createItem(item) {
  const res = await fetchWithRetry(BASE_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(item)
  })
  return normalise(await res.json())
}

export async function updateItem(item) {
  const res = await fetchWithRetry(`${BASE_URL}/${item._id || item.id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(item)
  })
  return normalise(await res.json())
}

export async function resolveItem(id) {
  const res = await fetchWithRetry(`${BASE_URL}/${id}/resolve`, {
    method: "PATCH"
  })
  return normalise(await res.json())
}

export async function deleteItem(id) {
  await fetchWithRetry(`${BASE_URL}/${id}`, {
    method: "DELETE"
  })
  return true
}

function normalise(item) {
  return { ...item, id: item._id || item.id }
}