import { Request, Response } from "express";

interface CodeList {
    rooms: string[]
    events: string[]
}

// Boss ( Nattapat )

// get codes ทั้งหมดทั้งโค้ดของ room ต่าง ๆ และ โค้ดของ event_group

const getCodes = (req:Request,res:Response<CodeList>)=>{

}

export default getCodes