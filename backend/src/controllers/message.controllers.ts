import { Request, Response } from "express"
import {
  createNewMessage,
  getConversation,
  getConversationMessagesByOrder,
  updateConversationMessages,
} from "../services/message.service"
import { sendMessageSchema } from "../schema/message.schema"
import { handleError, ValidationError } from "./auth.controllers"
import prisma from "../db/prisma"

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const validationResult = sendMessageSchema.safeParse(req.body)

    if (!validationResult.success)
      throw new ValidationError(validationResult.error.flatten().fieldErrors)

    const { id: receiverId } = req.params
    const senderId = req.user.id

    const isSenderIdOrReceiverIdNotExist = !senderId || !receiverId
    if (isSenderIdOrReceiverIdNotExist)
      return res.status(401).json({ status: "fail", message: "sender and receiver id is required" })

    const conversation = await getConversation(senderId, receiverId)

    if (!conversation) throw new Error("Getting conversation failed")

    const { message } = validationResult.data
    const newMessage = await createNewMessage(senderId, message, conversation.id)
    if (!newMessage) throw new Error("Send Message failed")

    const conversationUpdateResult = await updateConversationMessages(
      conversation.id,
      newMessage.id
    )

    if (!conversationUpdateResult) throw new Error("Update conversation failed")

    res.status(201).json({ status: "success", message: "message sent successfully" })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params
    const senderId = req.user.id

    const isSenderIDOrUserToChatIdNotExist = !userToChatId || !senderId
    if (isSenderIDOrUserToChatIdNotExist)
      return res
        .status(401)
        .json({ status: "fail", message: "sender and user to chat id is required" })

    const conversation = await getConversationMessagesByOrder(senderId, userToChatId)

    if (!conversation) return res.status(200).json({ status: "success", messages: [] })

    return res.status(200).json({ status: "success", messages: conversation.messages })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getUserList = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id

    if (!authUserId) return res.status(404).json({ status: "fail", message: "User id not found" })

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true,
      },
    })

    return res.status(201).json({ status: "success", users })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getConversationsList = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id

    if (!authUserId) return res.status(404).json({ status: "fail", message: "User id not found" })

    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          has: authUserId,
        },
      },
      include: {
        participants: {
          where: {
            id: {
              not: authUserId,
            },
          },
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePic: true,
          },
        },
        messages: {
          take: -1,
        },
      },
    })

    return res.status(201).json({ status: "success", conversations })
  } catch (error) {
    return handleError(res, error)
  }
}
