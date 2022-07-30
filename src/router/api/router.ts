import express from "express"
import cors from "cors"
import hello from "./routes/hello"
const router = express.Router()

router.use(cors({ allowedHeaders: ["GET", "POST"], origin: process.env.APP_URL, credentials: true }))

router.get("/", hello)

export default router
