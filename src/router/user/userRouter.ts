import cors from "cors"
import express, { json } from "express"
import { authUser } from "../../middleware/auth"
import getCode from "./routes/getCode"
import getEvent from "./routes/getEvent"
import getHint from "./routes/gethints"
import getPartners from "./routes/getPartners"
import getUser from "./routes/getUser"
import openHint from "./routes/openHint"
import sendCode from "./routes/sendCode"
import sendHints from "./routes/sentHints"

const userRouter = express.Router()

userRouter.use(
    cors({
        methods: ["GET", "POST"],
        origin: process.env.APP_URL,
        credentials: true,
    })
)

userRouter.use(json())

userRouter.use(authUser)

userRouter.get("/", getUser)

userRouter.get("/event", getEvent)

userRouter.get("/code", getCode)

userRouter.post("/code", sendCode)

userRouter.get("/hints", getHint)

userRouter.post("/hints", sendHints)

userRouter.get("/partners", getPartners)

userRouter.get("/openhint", openHint)

export default userRouter
