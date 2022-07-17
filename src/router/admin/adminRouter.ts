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
        allowedHeaders: ["GET", "POST", "PUT", "DELETE"],
        origin: process.env.APP_ADMIN,
        credentials: true,
    })
)

adminRouter.use(json())

adminRouter.get("/", authAdmin, getAdmin)

adminRouter.get("/users", authAdmin, getUsers)

adminRouter.get("/codes", authAdmin, getCodes)

adminRouter.delete("/user", authAdmin, deleteUser)

adminRouter.get("/config", authAdmin, getGameConfig)

adminRouter.put("/config", authAdmin, putGameConfig)

adminRouter.get("/event/random", authAdmin, randomEventGroup)

adminRouter.get("/eventgroup", authAdmin, getEventGroups)

adminRouter.post("/eventgroup", authAdmin, createEventGroup)

adminRouter.delete("/eventgroup", authAdmin, deleteEventGroup)

adminRouter.put("/eventgroup", authAdmin, putEventHintsToGroup)

adminRouter.get("/event/hint", authAdmin, getEventHints)

adminRouter.put("/event/hint", authAdmin, editEventHints)

adminRouter.delete("/event/hint", authAdmin, deleteEventhint)

adminRouter.post("/event/hint", authAdmin, createEventHint)

export default adminRouter
