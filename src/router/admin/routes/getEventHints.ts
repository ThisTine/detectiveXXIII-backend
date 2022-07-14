import { Request, Response } from "express";

export type eventHint = {
    id:string,
    location:string
}

export interface EventHints {
    hints:eventHint[]
}

// Gun ( BlueBox ) && Boss ( Sorrawit )

// getEventhints ทั้งหมด

const getEventHints = (req:Request,res:Response<EventHints>)=>{

}

export default getEventHints