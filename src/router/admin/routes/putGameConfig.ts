import { Request, Response } from "express";

export interface gameConfig { 
    isGameReady: boolean, 
    isEventReady: boolean }

// เปลี่ยน game config

const putGameConfig = (req:Request<any,any,gameConfig,any>,res:Response<gameConfig>)=>{
    try{
        req.setGameConfig(req.body)
        return res.send(req.gameConfig)
    }catch(err:any){
        return res.status(500).send(err)
    }
}

export default putGameConfig