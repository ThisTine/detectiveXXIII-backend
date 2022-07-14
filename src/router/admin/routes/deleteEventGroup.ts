import { Request, Response } from "express";

interface deleteEventGroupRequestResponse {
    id:string
}

// ลบ event_group


const deleteEventGroup = (req:Request<any,any,deleteEventGroupRequestResponse>,res:Response<deleteEventGroupRequestResponse>)=>{

}

export default deleteEventGroup