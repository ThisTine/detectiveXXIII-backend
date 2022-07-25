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
import { validateMiddleware } from "../../middleware/validate"
import { CreateEventGroupBody, WithId } from "../../validator/createEventGroupBody"
import { EditEventHintBody } from "../../validator/editEventHintRequest"
import { CreateEventHintBody } from "../../validator/createEventHintBody"
import paringWithPartner from "./routes/paringWithPartner"
import getRooms from "./routes/getRoom"
import putUserToRoom, { putUserToRoomBody } from "./routes/putUserToRoom"
const adminRouter = express.Router()

const getorigins = ()=>{
    if(process.env.API_STAGE === "staging"){
        return [process.env.ADMIN_URL || "" , "http://localhost:3000"]
    }else{
        return [process.env.ADMIN_URL || ""]
    }
}

adminRouter.use(
    cors({
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        origin: getorigins(),
        credentials: true,
    })
)

adminRouter.use(json())

adminRouter.use(authAdmin)

adminRouter.get("/", getAdmin)

adminRouter.get("/users", getUsers)

adminRouter.get("/codes", getCodes)

adminRouter.delete("/user", validateMiddleware(WithId), deleteUser)

adminRouter.get("/config", getGameConfig)

adminRouter.put("/config", putGameConfig)

adminRouter.post("/event/random", randomEventGroup)

adminRouter.get("/eventgroup", getEventGroups)

adminRouter.post("/eventgroup", validateMiddleware(CreateEventGroupBody), createEventGroup)

adminRouter.delete("/eventgroup", validateMiddleware(WithId), deleteEventGroup)

adminRouter.put("/eventgroup", putEventHintsToGroup)

adminRouter.get("/event/hint", getEventHints)

adminRouter.put("/event/hint", validateMiddleware(EditEventHintBody), editEventHints)

adminRouter.delete("/event/hint", validateMiddleware(WithId), deleteEventhint)

adminRouter.post("/event/hint", validateMiddleware(CreateEventHintBody), createEventHint)

adminRouter.post("/user/partner", paringWithPartner)

adminRouter.get("/room", getRooms)

adminRouter.put("/room", validateMiddleware(putUserToRoomBody) , putUserToRoom )

export default adminRouter
