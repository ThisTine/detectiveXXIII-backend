import { Request, Response } from "express";

interface Event {
    location: string
}

// query hint จาก event_group โดยเอาใน index ที่ event_hints_count

const getEvent = (req:Request,res:Response<Event>)=>{

}

export default getEvent