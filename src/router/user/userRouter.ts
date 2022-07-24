import cors from "cors"
import express, { json } from "express"
import { authUser } from "../../middleware/auth"
import requriedPartner from "../../middleware/requriedPartner"
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

userRouter.get("/event", requriedPartner, getEvent)

userRouter.get("/code", getCode)

userRouter.post("/code", sendCode)

userRouter.get("/hints", requriedPartner, getHint)

userRouter.post("/hints", sendHints)

userRouter.get("/partners", requriedPartner, getPartners)

userRouter.get("/openhint", requriedPartner, openHint)

export default userRouter
