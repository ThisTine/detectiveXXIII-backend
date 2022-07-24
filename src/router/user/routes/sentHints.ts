import { Request, Response } from "express";

interface HintsRequest {
    hints: string[]
}

interface Hints {
    hints: string[]
}

// Neng ( stthi )

// เพิ่ม hints ของ user (เช็คด้วยว่ามี hints ครบหรือยัง ถ้าครบแล้วจะเพิ่มไม่ได้)

const sendHints = async(req:Request<any,any,HintsRequest>,res:Response<Hints | String>)=>{
    try {
        const {prisma} = req
        const queryBody = req.body.hints.map((e)=>{
            return {
                user_id : req.user?.id || "",
                text : e
            }
        })
        if(req.body.hints.length != 10){
            return res.status(400).send("hint ไม่ครบ")
        }
        for(const i of req.body.hints){
            if(i.length > 10){
                return res.status(400).send("hint more than 10 letter")
            }
        }
        await prisma.hint.createMany({data:[...queryBody]}) //เข้า database
        res.send(req.body)
    } catch (error : any) {
        res.send(error)
    }
}

export default sendHints