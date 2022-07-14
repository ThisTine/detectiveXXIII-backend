import { Request, Response } from "express";
import { gameConfig } from "./putGameConfig";

// get game config จาก redis

const getGameConfig = (req:Request,res:Response<gameConfig>)=>{
    return res.send(req.gameConfig)
}

export default getGameConfig