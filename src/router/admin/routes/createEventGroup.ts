import { Request, Response } from "express";
import { eventGroup } from "./randomEventGroup";

interface createEventGroupRequest {
    hints: {id:string}[]
}

// Gun ( BlueBox ) && Boss ( Sorrawit )
// สร้าง event_group จาก event_hints id ที่เอามาใส่

const createEventGroup = (req:Request<any,any,createEventGroupRequest>,res:Response<eventGroup>)=>{

}

export default createEventGroup