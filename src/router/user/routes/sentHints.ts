import { Request, Response } from "express";

interface HintsRequest {
    hints: string[]
}

interface Hints {
    hints: string[]
}

// เพิ่ม hints ของ user (เช็คด้วยว่ามี hints ครบหรือยัง ถ้าครบแล้วจะเพิ่มไม่ได้)

const sendHints = (req:Request<any,any,HintsRequest>,res:Response<Hints>)=>{

}

export default sendHints