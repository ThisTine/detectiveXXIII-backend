import { Request, Response } from "express"

const hello = (req:Request,res:Response)=>{
    res.send("Hello from "+ process.env.API_STAGE)
}

export default hello