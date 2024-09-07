import { z } from "zod"

export const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
    gender: z.enum(["boy", "girl"], { required_error: "Gender is required" }),
  })
  // Custom validation to check if password and confirmPassword are the same
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Path for error message
    message: "Passwords do not match",
  })

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})
