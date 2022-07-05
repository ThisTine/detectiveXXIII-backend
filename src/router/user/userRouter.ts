import cors from "cors";
import express from "express";
import {authUser} from "../../middleware/auth";

const router = express.Router()

router.use(cors({allowedHeaders:["GET","POST"],origin:process.env.APP_URL,credentials:true}))

router.get("/init",authUser,(req,res)=>{
    res.send(req.user)
})


export default router
