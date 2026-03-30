import db from "../config/db.js"

export const getCurrentUser = async (req, res) => {
  try {
    // isAuth middleware ne req.userId set kiya tha
    const userId = req.userId

    // Database se user dhundho
    const sql = "SELECT user_id, name, email, phone, address, role FROM users WHERE user_id = ?"

    db.query(sql, [userId], (err, result) => {
      if(err){
        return res.status(500).json({message: "Database error"})
      }

      if(result.length === 0){
        return res.status(404).json({message: "User not found"})
      }

      // Password nahi bhej rahe — security ke liye
      return res.status(200).json(result[0])
    })

  } catch(error) {
    return res.status(500).json({message: "Get user error"})
  }
}