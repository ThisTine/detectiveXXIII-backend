import cors from "cors"
import express, { Request } from "express"
import passport from "passport"

const authRouter = express.Router()

authRouter.use(
    cors({
        methods: ["GET", "POST"],
        origin: [process.env.APP_URL || "", process.env.ADMIN_URL || ""],
        credentials: true,
    })
)

authRouter.get("/", (req: Request<{ isAdmin?: boolean }>, res, next) => {
    const { isAdmin } = req.query
    console.log(isAdmin)
    return passport.authenticate("microsoft", { prompt: "select_account", state: isAdmin ? process.env.ADMIN_URL : process.env.AUTH_SUCCESS_URL })(
        req,
        res,
        next
    )
})

authRouter.get("/logout", (req, res) => {
    req.logOut({}, (err) => {
        if (err) {
            return res.status(400).send("Error")
        }
        return res.send("success")
    })
})

authRouter.get(
    "/callback",
    passport.authenticate("microsoft", {
        failureRedirect: process.env.AUTH_FAIL_URL,
    }),
    (req, res) => {
        return res.redirect(req.query.state + "")
    }
)

export default authRouter
