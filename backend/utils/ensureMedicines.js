import db from "../config/db.js"

const SHORT = 25

function clip(str, max) {
  const s = String(str ?? "").trim()
  if (!s) return ""
  return s.length <= max ? s : s.slice(0, max)
}

/** Path-only images fit VARCHAR(255). Base64 needs TEXT — run schema/medicines_image_url.sql */
function pickImageUrl(item) {
  const path = item.image
  if (typeof path === "string" && path.length && !path.startsWith("data:")) {
    return path.length <= 255 ? path : path.slice(0, 255)
  }
  const data = item.imageDataUrl
  if (typeof data === "string" && data.startsWith("data:image")) {
    return data.length <= 65535 ? data : data.slice(0, 65535)
  }
  return null
}

/**
 * Upsert medicines so orders FK passes. Matches DawaMinute schema:
 * medicine_id (PK), name, brand, description, price, stock, category, image_url
 */
export function ensureMedicinesForItems(items, callback) {
  const byId = new Map()
  for (const item of items) {
    const id = item.medicine_id
    if (id == null) continue
    if (!byId.has(id)) {
      const desc = String(item.description ?? "").trim()
      byId.set(id, {
        medicine_id: id,
        name: clip(item.name, SHORT) || "Medicine",
        brand: clip(item.brand, SHORT) || "—",
        description: desc.length ? desc.slice(0, 60000) : null,
        price: Number(item.price) || 0,
        stock: Math.max(0, Math.floor(Number(item.stock)) || 0),
        category: clip(item.category, SHORT) || "General",
        image_url: pickImageUrl(item),
      })
    }
  }
  const rows = [...byId.values()]
  if (rows.length === 0) {
    return callback(new Error("No valid medicine_id in cart"))
  }

  const sql = `
    INSERT INTO medicines (medicine_id, name, brand, description, price, stock, category, image_url)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      brand = VALUES(brand),
      description = VALUES(description),
      price = VALUES(price),
      stock = VALUES(stock),
      category = VALUES(category),
      image_url = VALUES(image_url)
  `

  const values = rows.map((r) => [
    r.medicine_id,
    r.name,
    r.brand,
    r.description,
    r.price,
    r.stock,
    r.category,
    r.image_url,
  ])

  db.query(sql, [values], (err, result) => {
    const msg = `${err?.message || ""} ${err?.sqlMessage || ""}`
    const imageTooLong =
      err &&
      (err.errno === 1406 ||
        /image_url|Data too long/i.test(msg))
    if (imageTooLong) {
      const valuesNoImg = rows.map((r) => [
        r.medicine_id,
        r.name,
        r.brand,
        r.description,
        r.price,
        r.stock,
        r.category,
        null,
      ])
      return db.query(sql, [valuesNoImg], callback)
    }
    callback(err, result)
  })
}
