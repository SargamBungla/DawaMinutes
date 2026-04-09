import db from "../config/db.js"

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const [result] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId])

    if(result.length === 0) return res.status(400).json({ message: "User not found." })

    const { password, ...safeUser } = result[0]
    return res.status(200).json(safeUser)

  } catch(error) {
    return res.status(500).json({ message: `Get user error: ${error}` })
  }
}
