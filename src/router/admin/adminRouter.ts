import express, { json } from "express"
import cors from "cors"
import getAdmin from "./routes/getAdmin"
import getUsers from "./routes/getUsers"
import getCodes from "./routes/getCodes"
import deleteUser from "./routes/deleteUser"
import putGameConfig from "./routes/putGameConfig"
import getGameConfig from "./routes/getGameConfig"
import randomEventGroup from "./routes/randomEventGroup"
import getEventGroups from "./routes/getEventGroups"
import createEventGroup from "./routes/createEventGroup"
import deleteEventGroup from "./routes/deleteEventGroup"
import putEventHintsToGroup from "./routes/putEventHintsToGroup"
import getEventHints from "./routes/getEventHints"
import deleteEventhint from "./routes/deleteEventhint"
import createEventHint from "./routes/createEventHint"
import { authAdmin } from "../../middleware/auth"
import editEventHints from "./routes/editEventHints"
const adminRouter = express.Router()

adminRouter.use(
    cors({
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        origin: process.env.ADMIN_URL || "",
        credentials: true,
    })
)

adminRouter.use(json())

adminRouter.use(authAdmin)

adminRouter.get("/", getAdmin)

adminRouter.get("/users", getUsers)

adminRouter.get("/codes", getCodes)

adminRouter.delete("/user", deleteUser)

adminRouter.get("/config", getGameConfig)

adminRouter.put("/config", putGameConfig)

adminRouter.get("/event/random", randomEventGroup)

adminRouter.get("/eventgroup", getEventGroups)

adminRouter.post("/eventgroup", createEventGroup)

adminRouter.delete("/eventgroup", deleteEventGroup)

adminRouter.put("/eventgroup", putEventHintsToGroup)

adminRouter.get("/event/hint", getEventHints)

adminRouter.put("/event/hint", editEventHints)

adminRouter.delete("/event/hint", deleteEventhint)

adminRouter.post("/event/hint", createEventHint)

export default adminRouter
