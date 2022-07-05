import express from 'express'
import cors from 'cors'
import hello from './routes/hello'
const router = express.Router()

router.use(cors({allowedHeaders:["GET","POST"],origin:process.env.APP_URL,credentials:true}))

router.get("/",hello)

router.get("/showimage/:id",async (req,res)=>{
    const {prisma} = req
    const image = await prisma.user.findFirst({where:{id:req.params.id},select:{img:true}}) 
    console.log(image?.img)
    res.end(image?.img)
})




export default router