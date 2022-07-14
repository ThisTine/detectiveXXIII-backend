import { Request, Response } from "express";
import { eventHint } from "./getEventHints";

interface createEventHintRequest {
    location:string
}
// Gun ( BlueBox ) && Boss ( Sorrawit )
// สร้าง event hint

const createEventHint = (req:Request<any,any,createEventHintRequest>,res:Response<eventHint>)=>{

}

export default createEventHint