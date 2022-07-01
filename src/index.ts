import express from 'express'
import { PrismaClient} from '@prisma/client'
import publicRouter from './router/api/router'
import adminRouter from './router/admin/router'
require('dotenv').config()
const app = express()
const prisma = new PrismaClient()
declare global{
    namespace Express{
        interface Request{
            prisma: PrismaClient
        }
    }
}

app.use((req,res,next)=>{
    req.prisma = prisma
    next()
})

app.use("/",publicRouter)

app.use("/admin",adminRouter)

app.listen(8000,()=>{
    console.log("running on 8000")
})