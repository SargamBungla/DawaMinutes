import db from "../config/db.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"

export const signUp = async(req, res) => {
  try {
    const {name, email, password, phone, address, role} = req.body

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    if(existing.length > 0) return res.status(400).json({ message: "User already exists." })
    if(password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." })
    if(phone.toString().length !== 10) return res.status(400).json({ message: "Phone must be exactly 10 digits." })

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone, address, role || "customer"]
    )

    const token = genToken(result.insertId)
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
    return res.status(201).json({ message: "User registered successfully!", user: { userId: result.insertId, name, email, phone, address, role: role || "customer" } })

  } catch(error) {
    return res.status(500).json({ message: `Sign up error: ${error}` })
  }
}

export const signIn = async(req, res) => {
  try {
    const { email, password } = req.body
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if(result.length === 0) return res.status(400).json({ message: "User does not exist." })

    const user = result[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({ message: "Incorrect password." })

    const token = genToken(user.user_id)
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })

    const { password: pwd, ...safeUser } = user
    return res.status(200).json({ message: "Login successful!", user: safeUser })

  } catch(error) {
    return res.status(500).json({ message: `Sign in error: ${error}` })
  }
}

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
    return res.status(200).json({ message: "log out successfully" })
  } catch(error) {
    return res.status(500).json({ message: `Sign out error: ${error}` })
  }
}
