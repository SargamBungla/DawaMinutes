import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err.message)
  } else {
    console.log("MySQL connected successfully!")
    connection.release()
  }
})

export default pool.promise()
