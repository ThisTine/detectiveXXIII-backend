import cors from "cors"
import express from "express"
import passport from "passport"

const authRouter = express.Router()

authRouter.use(
    cors({
        allowedHeaders: ["GET", "POST"],
        origin: [process.env.APP_URL || "", process.env.ADMIN_URL || ""],
        credentials: true,
    })
)

authRouter.get(
    "/",
    passport.authenticate("microsoft", { prompt: "select_account" })
)

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
    (req, res) => res.redirect(process.env.AUTH_SUCCESS_URL || "")
)

export default authRouter
