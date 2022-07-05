import cors from "cors"
import express from "express"
import passport from "passport"


const router = express.Router()

router.use(cors({allowedHeaders:["GET","POST"],origin:[process.env.APP_URL||"",process.env.ADMIN_URL||""],credentials:true}))

router.get("/", passport.authenticate("microsoft",{prompt: 'select_account'}))

router.get("/logout",(req,res)=>{
    req.logOut({},(err)=>{
        if(err){
           return res.status(400).send("Error")
        }
        return res.send("success")
    })
})


router.get("/callback",passport.authenticate("microsoft",{failureRedirect:process.env.AUTH_FAIL_URL}),(req,res)=>res.redirect(process.env.AUTH_SUCCESS_URL||""))

export default router