import prisma from "../db/prisma"

// Retrieves user by ID
export const findUserById = async (userId: string) => {
  return await prisma.user.findUnique({ where: { id: userId } })
}

// Retrieves user by username
export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } })
}
