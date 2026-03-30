import jwt from "jsonwebtoken"

const genToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
  return token  // ← return karna zaroori hai!
}

export default genToken  // ← export karna zaroori hai!