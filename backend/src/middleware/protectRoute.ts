import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "../db/prisma"
import { User } from "@prisma/client"

interface DecodedToken extends jwt.JwtPayload {
  userId: string
}

declare global {
  namespace Express {
    export interface Request {
      user: User
    }
  }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ status: "fail", message: "Unauthorized token" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken

    if (!decoded)
      return res.status(401).json({ status: "fail", message: "Unauthorized invalid token" })

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })

    if (!user) return res.status(404).json({ status: "fail", message: "User not found" })

    req.user = user
    next()
  } catch (error) {
    console.log("Error in protectRoute middleware : ", error)
    res.status(500).json({ status: "fail", message: "Internal Server Error" })
  }
}
