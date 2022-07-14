import { Request, Response } from "express";
import { eventGroup } from "./randomEventGroup";

interface putEventHintsToGroupRequest {
    hints:{id:string}[]
}

// อย่าพึ่งทำ

const putEventHintsToGroup = (req:Request<any,any,putEventHintsToGroupRequest>,res:Response<eventGroup>)=>{

}

export default putEventHintsToGroup