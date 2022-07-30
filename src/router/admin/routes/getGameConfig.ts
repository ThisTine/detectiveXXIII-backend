import { Request, Response } from "express";
import { gameConfig } from "./putGameConfig";

// Tine ( Thistine ) & Thun ( Bsthun )

// get game config จาก redis

const getGameConfig = (req:Request,res:Response<gameConfig>)=>{
    return res.send(req.gameConfig)
}

export default getGameConfig