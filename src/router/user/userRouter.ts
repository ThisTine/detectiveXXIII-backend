import cors from "cors"
import express, { json } from "express"
import { authUser } from "../../middleware/auth"
import disableGame from "../../middleware/disableGame"
import requriedPartner from "../../middleware/requriedPartner"
import { validateMiddleware } from "../../middleware/validate"
import { sendCodeBody } from "../../validator/sendCodeBody"
import { SendHints } from "../../validator/sendHintsBody"
import getCode from "./routes/getCode"
import getEvent from "./routes/getEvent"
import getHintImg from "./routes/getHintImg"
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
        origin: process.env.APP_URL || "",
        credentials: true,
    })
)

userRouter.use(json())

userRouter.use(authUser)

userRouter.get("/", getUser)

userRouter.get("/event", [disableGame, requriedPartner], getEvent)

userRouter.get("/code", [disableGame], getCode)

userRouter.post("/code", validateMiddleware(sendCodeBody), sendCode)

userRouter.get("/hints", [disableGame, requriedPartner], getHint)

userRouter.get("/hints/img", [disableGame, requriedPartner], getHintImg)

userRouter.post("/hints", validateMiddleware(SendHints), sendHints)

userRouter.get("/partners", requriedPartner, getPartners)

userRouter.get("/openhint", [disableGame, requriedPartner], openHint)

export default userRouter
