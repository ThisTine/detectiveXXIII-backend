import express from "express"
import { PrismaClient } from "@prisma/client"
import publicRouter from "./router/api/router"
import adminRouter from "./router/admin/adminRouter"
import passport from "passport"
import MicrosoftInstance from "./passport/MicrosoftInstance"
import userRouter from "./router/user/userRouter"
import session, { Store } from "express-session"
import authRouter from "./router/auth/authRouter"
import SQLiteConnect from "connect-sqlite3"
import path from "path"
const SQLiteStore = SQLiteConnect(session)

let gameConfig = {
    isGameReady: false,
    isEventReady: false,
}

type setGameConfigtype = (props: { isGameReady?: boolean; isEventReady?: boolean }) => void

const setGameConfig: setGameConfigtype = (props) => {
    const keys = Object.keys(gameConfig) as ("isGameReady" | "isEventReady")[]
    keys.forEach((key) => {
        if (Object.keys(props).includes(key)) {
            gameConfig[key] = props[key] as boolean
        }
    })
}

const app = express()
const prisma = new PrismaClient()

declare global {
    namespace Express {
        interface User {
            id: string
            email: string
            name: string
            year: number
            isAdmin: boolean
            isPlayable: boolean
        }
        interface Request {
            prisma: PrismaClient
            gameConfig: typeof gameConfig
            setGameConfig: typeof setGameConfig
        }
    }
}

passport.use(MicrosoftInstance(prisma))

app.use(
    session({
        secret: process.env.SESSION_SECRET || "",
        resave: false,
        saveUninitialized: false,
        cookie: { domain: process.env.COOKIE_ORIGIN },
        ...(process.env.NODE_ENV !== "production" && {
            store: new SQLiteStore({
                db: "session.db",
                dir: path.resolve(__dirname, "db"),
            }) as session.Store,
        }),
    })
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user: any, done) {
    done(null, user)
})

app.use((req, _, next) => {
    req.prisma = prisma
    req.setGameConfig = setGameConfig
    req.gameConfig = gameConfig
    next()
})

app.use("/auth", authRouter)

app.use("/admin", adminRouter)

app.use("/user", userRouter)

app.use("/", publicRouter)

app.listen(8000, () => {
    console.log("running on 8000")
})
