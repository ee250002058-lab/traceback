import * as mobilenet from "@tensorflow-models/mobilenet"
import "@tensorflow/tfjs"

let model = null
let loadPromise = null

export async function loadModel() {
  if (model) return model
  if (loadPromise) return loadPromise

  loadPromise = mobilenet.load()
    .then(m => {
      model = m
      return m
    })
    .catch(err => {
      loadPromise = null
      throw err
    })

  return loadPromise
}

export async function detectObject(imageSrc) {
  try {
    const loadedModel = await loadModel()

    const img = new Image()
    img.src = imageSrc
    img.crossOrigin = "anonymous"

    return await new Promise((resolve) => {
      const timeout = setTimeout(() => resolve("unknown"), 10000)

      img.onload = async () => {
        clearTimeout(timeout)
        try {
          const predictions = await loadedModel.classify(img)
          resolve(predictions[0]?.className || "unknown")
        } catch {
          resolve("unknown")
        }
      }

      img.onerror = () => {
        clearTimeout(timeout)
        resolve("unknown")
      }
    })
  } catch {
    return "unknown"
  }
}