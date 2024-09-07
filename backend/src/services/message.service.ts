import prisma from "../db/prisma"

export const getConversation = async (senderId: string, receiverId: string) => {
  const isConversationExist = await prisma.conversation.findFirst({
    where: {
      participantIds: {
        hasEvery: [senderId, receiverId],
      },
    },
  })

  if (isConversationExist) {
    return isConversationExist
  }
  return await createNewConversation(senderId, receiverId)
}
export const updateConversationMessages = async (conversationId: string, newMessageId: string) =>
  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      messages: {
        connect: {
          id: newMessageId,
        },
      },
    },
  })

export const createNewConversation = async (senderId: string, receiverId: string) =>
  await prisma.conversation.create({
    data: {
      participantIds: {
        set: [senderId, receiverId],
      },
    },
  })

export const createNewMessage = async (senderId: string, message: string, conversationId: string) =>
  await prisma.message.create({
    data: {
      senderId,
      body: message,
      conversationId,
    },
  })

export const getConversationMessagesByOrder = async (senderId: string, receiverId: string) =>
  await prisma.conversation.findFirst({
    where: {
      participantIds: {
        hasEvery: [senderId, receiverId],
      },
    },
    include: {
      messages: {
        orderBy: {
          createAt: "asc",
        },
      },
    },
  })
