import express from "express"
import { protectRoute } from "../middleware/protectRoute"
import {
  getMessages,
  getConversationsList,
  getUserList,
  sendMessage,
} from "../controllers/message.controllers"

const router = express.Router()

router.get("/conversations", protectRoute, getConversationsList)

router.post("/send/:id", protectRoute, sendMessage)

router.get("/users", protectRoute, getUserList)

router.get("/:id", protectRoute, getMessages)

export default router
