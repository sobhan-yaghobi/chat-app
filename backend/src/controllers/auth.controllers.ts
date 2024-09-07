import { Request, Response } from "express"
import { loginSchema, signupSchema } from "../schema/auth.schema"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/auth"
import { findUserById, findUserByUsername } from "../services/user.service"
import prisma from "../db/prisma"

export class ValidationError extends Error {
  constructor(public details: any) {
    super("Validation Error")
    this.name = "ValidationError"
  }
}

// Helper function for error responses
export const handleError = (res: Response, error: unknown) => {
  console.error("Error: ", error)

  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid data",
      errors: error.details,
    })
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  })
}

// Auth Controller
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.user.id)

    if (!user) return res.status(404).json({ status: "fail", message: "User not found" })

    return res.status(200).json(user)
  } catch (error) {
    return handleError(res, error)
  }
}

export const signup = async (req: Request, res: Response) => {
  try {
    const validationResult = signupSchema.safeParse(req.body)

    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.flatten().fieldErrors)
    }

    const { username, password, gender, fullName } = validationResult.data

    const existingUser = await findUserByUsername(username)
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Username already exists",
      })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const profilePic = `https://avatar.iran.liara.run/public/${gender}?username=${username}`

    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        gender,
        password: hashedPassword,
        profilePic,
      },
    })

    generateToken(newUser.id, res)
    return res.status(201).json(newUser)
  } catch (error) {
    return handleError(res, error)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const validationResult = loginSchema.safeParse(req.body)

    if (!validationResult.success) {
      throw new ValidationError(validationResult.error.flatten().fieldErrors)
    }

    const { username, password } = validationResult.data

    const user = await findUserByUsername(username)
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Username  is incorrect",
      })
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        status: "fail",
        message: " password is incorrect",
      })
    }

    generateToken(user.id, res)
    return res.status(200).json(user)
  } catch (error) {
    return handleError(res, error)
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    return res.status(200).json({ status: "success", message: "Logged out successfully" })
  } catch (error) {
    return handleError(res, error)
  }
}
