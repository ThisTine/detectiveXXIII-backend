import express from "express"
import { PrismaClient } from "@prisma/client"
import publicRouter from "./router/api/router"
import adminRouter from "./router/admin/adminRouter"
import passport from "passport"
import MicrosoftInstance from "./passport/MicrosoftInstance"
import userRouter from "./router/user/userRouter"
import session from "express-session"
import authRouter from "./router/auth/authRouter"
import SQLiteConnect from "connect-sqlite3"
import path from "path"
import cron from "node-cron"
import { createClient } from "redis"
import fetchUser from "./middleware/fetchUser"
import connectRedis from "connect-redis"
const SQLiteStore = SQLiteConnect(session)
const RedisStore = connectRedis(session)

let gameConfig = {
    isGameReady: true,
    isEventReady: true,
    isGameEnd: false,
}

type setGameConfigtype = (props: { isGameReady?: boolean; isEventReady?: boolean; isGameEnd?: boolean }) => void

const setGameConfig: setGameConfigtype = (props) => {
    const keys = Object.keys(gameConfig) as ("isGameReady" | "isEventReady" | "isGameEnd")[]
    keys.forEach((key) => {
        if (Object.keys(props).includes(key)) {
            gameConfig[key] = props[key] as boolean
        }
    })
}

const redisClient = createClient({ legacyMode: true, url: process.env.REDIS_URL, password: process.env.REDIS_PASSWORD })
redisClient.connect().catch(console.error)

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

cron.schedule(process.env.CORNJOB_TIME || "", async () => {
    const updated = await prisma.user.updateMany({ where: { lifes: { lt: 5 } }, data: { lifes: { increment: 1 } } })
    console.log(Date.now(), " - updated ", updated.count, updated.count > 1 ? "people" : "person")
})

passport.use(MicrosoftInstance(prisma))

app.use(
    session({
        secret: process.env.SESSION_SECRET || "",
        resave: false,
        saveUninitialized: false,
        cookie: { domain: process.env.COOKIE_ORIGIN, maxAge: 1000 * 60 * 60 * 24 * 30 },
        store:
            process.env.NODE_ENV === "production"
                ? (new RedisStore({ client: redisClient }) as session.Store)
                : (new SQLiteStore({
                      db: "session.db",
                      dir: path.resolve(__dirname, "db"),
                  }) as session.Store),
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

app.use(fetchUser)

app.use("/auth", authRouter)

app.use("/admin", adminRouter)

app.use("/user", userRouter)

app.use("/", publicRouter)

app.listen(8000, () => {
    console.log("running on 8000")
})
