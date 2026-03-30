import db from "../config/db.js"
import { sanitizeCartDiscount } from "../config/cartOffers.js"
import { ensureMedicinesForItems } from "../utils/ensureMedicines.js"

function lineAmountsAfterDiscount(items, discountTotal) {
  const lines = items.map((item) => ({
    item,
    gross: Number(item.price) * Number(item.qty),
  }))
  const subtotal = lines.reduce((s, l) => s + l.gross, 0)
  if (subtotal <= 0 || discountTotal <= 0) {
    return lines.map((l) => ({ ...l, net: l.gross }))
  }
  const cap = Math.min(discountTotal, subtotal)
  let allocated = 0
  return lines.map((l, idx) => {
    let share = 0
    if (idx === lines.length - 1) {
      share = Math.min(cap - allocated, l.gross)
    } else {
      share = Math.min(Math.floor((cap * l.gross) / subtotal), l.gross)
      allocated += share
    }
    return { ...l, net: Math.max(0, l.gross - share) }
  })
}

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId
    const { items, delivery_address, delivery_lat, delivery_lng, cart_discount } =
      req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const subtotal = items.reduce(
      (s, item) => s + Number(item.price) * Number(item.qty),
      0,
    )
    const discount = sanitizeCartDiscount(subtotal, cart_discount)
    const withNet = lineAmountsAfterDiscount(items, discount)

    const insertSql = `
      INSERT INTO orders (user_id, medicine_id, quantity, price, total_amount, status, medicine_name, brand, delivery_address, delivery_lat, delivery_lng)
      VALUES ?
    `

    const values = withNet.map(({ item, net }) => [
      userId,
      item.medicine_id,
      item.qty,
      item.price,
      net,
      "Pending",
      item.name,
      item.brand,
      delivery_address || null,
      delivery_lat || null,
      delivery_lng || null,
    ])

    const orderItems = withNet.map((w) => w.item)
    ensureMedicinesForItems(orderItems, (ensureErr) => {
      if (ensureErr) {
        console.log("ENSURE MEDICINES ERROR:", ensureErr)
        return res.status(500).json({
          message: "Database error",
          error: ensureErr.message || ensureErr,
        })
      }

      db.query(insertSql, [values], (err, result) => {
        if (err) {
          console.log("DB ERROR:", err)
          return res.status(500).json({ message: "Database error", error: err })
        }
        return res.status(201).json({ message: "Order placed successfully!" })
      })
    })
  } catch (error) {
    return res.status(500).json({ message: `Order error: ${error}` })
  }
}


export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId

    const sql = `
      SELECT
        o.order_id, o.quantity, o.price, o.total_amount, o.status, o.order_date,
        o.medicine_id, o.medicine_name, o.brand,
        o.delivery_lat, o.delivery_lng, o.rider_lat, o.rider_lng,
        m.image_url AS medicine_image_url
      FROM orders o
      LEFT JOIN medicines m ON o.medicine_id = m.medicine_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC
    `
    // ↑ Koi status filter nahi — sab orders aayenge (Pending, Out for Delivery, Delivered sab)

    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err })

      const grouped = {}
      result.forEach((row) => {
        const key = new Date(row.order_date).toISOString().slice(0, 19)
        if (!grouped[key]) {
          grouped[key] = {
            order_date: row.order_date,
            status: row.status,
            delivery_lat: row.delivery_lat,
            delivery_lng: row.delivery_lng,
            rider_lat: row.rider_lat,
            rider_lng: row.rider_lng,
            items: [],
            total: 0,
          }
        }
        grouped[key].items.push({
          order_id: row.order_id,
          medicine_id: row.medicine_id,
          medicine_name: row.medicine_name,
          brand: row.brand,
          quantity: row.quantity,
          price: row.price,
          total_amount: row.total_amount,
          medicine_image_url: row.medicine_image_url || null,
        })
        grouped[key].total += parseFloat(row.total_amount)
      })

      return res.status(200).json({ orders: Object.values(grouped) })
    })
  } catch (error) {
    return res.status(500).json({ message: `Get orders error: ${error}` })
  }
}





/** All orders for seller/admin dashboard (grouped by customer + timestamp). */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const sql = `
      SELECT 
        o.order_id, o.user_id, o.quantity, o.price, o.total_amount,
        o.status, o.order_date, o.medicine_id, o.medicine_name, o.brand,
        o.delivery_address, o.delivery_lat, o.delivery_lng,
        u.name AS customer_name, u.phone,
        m.image_url AS medicine_image_url
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN medicines m ON o.medicine_id = m.medicine_id
      ORDER BY o.order_date DESC
    `

    db.query(sql, (err, result) => {
      if (err) {
        console.log("DB ERROR:", err)
        return res.status(500).json({ message: "Database error", error: err })
      }

      const grouped = {}
      result.forEach((row) => {
        const key = `${row.user_id}_${new Date(row.order_date).toISOString().slice(0, 19)}`
        if (!grouped[key]) {
          grouped[key] = {
            key,
            customer_name: row.customer_name,
            delivery_address: row.delivery_address,
            delivery_lat: row.delivery_lat,
            delivery_lng: row.delivery_lng,
            phone: row.phone,
            order_date: row.order_date,
            status: row.status,
            items: [],
            total: 0,
          }
        }
        grouped[key].items.push({
          order_id: row.order_id,
          medicine_name: row.medicine_name,
          medicine_id: row.medicine_id, 
          brand: row.brand,
          quantity: row.quantity,
          total_amount: row.total_amount,
          medicine_image_url: row.medicine_image_url || null,
        })
        grouped[key].total += parseFloat(row.total_amount)
      })

      return res.status(200).json({ orders: Object.values(grouped) })
    })
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` })
  }
}

export const getPendingOrders = async (req, res) => {
  try {
    const sql = `
      SELECT 
        o.order_id, o.user_id, o.quantity, o.price, o.total_amount,
        o.status, o.order_date, o.medicine_id, o.medicine_name, o.brand,
        o.delivery_address, o.delivery_lat, o.delivery_lng,
        u.name AS customer_name, u.phone,
        m.image_url AS medicine_image_url
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN medicines m ON o.medicine_id = m.medicine_id
      WHERE o.status = 'Pending'
      ORDER BY o.order_date DESC
    `

    db.query(sql, (err, result) => {
      if (err) {
        console.log("DB ERROR:", err)
        return res.status(500).json({ message: "Database error", error: err })
      }

      const grouped = {}
      result.forEach((row) => {
        const key = `${row.user_id}_${new Date(row.order_date).toISOString().slice(0, 19)}`
        if (!grouped[key]) {
          grouped[key] = {
            key,
            customer_name: row.customer_name,
            delivery_address: row.delivery_address,
            delivery_lat: row.delivery_lat,
            delivery_lng: row.delivery_lng,
            phone: row.phone,
            order_date: row.order_date,
            status: row.status,
            items: [],
            total: 0,
          }
        }
        grouped[key].items.push({
          order_id: row.order_id,
          medicine_name: row.medicine_name,
          brand: row.brand,
          quantity: row.quantity,
          total_amount: row.total_amount,
          medicine_image_url: row.medicine_image_url || null,
        })
        grouped[key].total += parseFloat(row.total_amount)
      })

      return res.status(200).json({ orders: Object.values(grouped) })
    })
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` })
  }
}

export const acceptOrder = async (req, res) => {
  try {
    const { order_ids } = req.body

    if (!order_ids || order_ids.length === 0) {
      return res.status(400).json({ message: "No order ids provided" })
    }

    const sql = `UPDATE orders SET status = 'Out for Delivery' WHERE order_id IN (?)`

    db.query(sql, [order_ids], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err)
        return res.status(500).json({ message: "Database error", error: err })
      }
      return res.status(200).json({ message: "Order accepted!" })
    })
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` })
  }
}

export const markDelivered = async (req, res) => {
  try {
    const { order_ids } = req.body

    if (!order_ids || order_ids.length === 0) {
      return res.status(400).json({ message: "No order ids provided" })
    }

    const sql = `UPDATE orders SET status = 'Delivered' WHERE order_id IN (?)`

    db.query(sql, [order_ids], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err)
        return res.status(500).json({ message: "Database error", error: err })
      }
      return res.status(200).json({ message: "Order delivered!" })
    })
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` })
  }
}

export const getAcceptedOrders = async (req, res) => {
  try {
    const sql = `
      SELECT 
        o.order_id, o.user_id, o.quantity, o.price, o.total_amount,
        o.status, o.order_date, o.medicine_id, o.medicine_name, o.brand,
        o.delivery_address, o.delivery_lat, o.delivery_lng,
        u.name AS customer_name, u.phone,
        m.image_url AS medicine_image_url
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      LEFT JOIN medicines m ON o.medicine_id = m.medicine_id
      WHERE o.status = 'Out for Delivery'
      ORDER BY o.order_date DESC
    `

    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err })

      const grouped = {}
      result.forEach((row) => {
        const key = `${row.user_id}_${new Date(row.order_date).toISOString().slice(0, 19)}`
        if (!grouped[key]) {
          grouped[key] = {
            key,
            customer_name: row.customer_name,
            delivery_address: row.delivery_address,
            delivery_lat: row.delivery_lat,
            delivery_lng: row.delivery_lng,
            phone: row.phone,
            order_date: row.order_date,
            status: row.status,
            items: [],
            total: 0,
          }
        }
        grouped[key].items.push({
          order_id: row.order_id,
          medicine_name: row.medicine_name,
          brand: row.brand,
          quantity: row.quantity,
          total_amount: row.total_amount,
          medicine_image_url: row.medicine_image_url || null,
        })
        grouped[key].total += parseFloat(row.total_amount)
      })

      return res.status(200).json({ orders: Object.values(grouped) })
    })
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` })
  }
}

export const updateRiderLocation = async (req, res) => {
  try {
    const { order_ids, rider_lat, rider_lng } = req.body

    if (!order_ids || order_ids.length === 0) {
      return res.status(400).json({ message: "No order ids" })
    }

    const sql = `
      UPDATE orders SET rider_lat = ?, rider_lng = ?
      WHERE order_id IN (?)
    `

    db.query(sql, [rider_lat, rider_lng, order_ids], (err) => {
      if (err) {
        console.log("DB ERROR:", err)
        return res.status(500).json({ message: "Database error", error: err })
      }
      return res.status(200).json({ message: "Location updated" })
    })
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` })
  }
}