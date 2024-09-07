import jwt from "jsonwebtoken"

import { Response } from "express"

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "10d",
  })

  const tenDay = 10 * 24 * 60 * 60
  res.cookie("jwt", token, {
    maxAge: tenDay,
    httpOnly: true,
    sameSite: "strict",
    // secure: true,
  })

  return token
}
