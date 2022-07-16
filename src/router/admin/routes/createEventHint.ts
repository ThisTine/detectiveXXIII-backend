import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { eventHint } from "./getEventHints";

interface createEventHintRequest {
    location:string
}
// Gun ( BlueBox ) && Boss ( Sorrawit )
// สร้าง event hint
// adminRouter.post("/event/hint", authAdmin, createEventHint)
const createEventHint = async (req:Request<any,any,createEventHintRequest>,res:Response<eventHint>)=>{
    try
    {
        const data = await req.prisma.event_Hint.create( { data: { text: req.body.location, code: { create: { name: nanoid( 8 ), type: "EVENT" } } } } )
        res.send( { id: data.id, location: data.text } )
        
    } catch (err:any) {
        res.send(err)
    }
}

export default createEventHint