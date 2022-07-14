import { Request, Response } from "express";

export type userStatusType = "filling_hints" | "waiting" | "playing";

interface User {
    id:string,
    name:string,
    email:string,
    year: number,
    lifes: number,
    hints: {id:string,text:string}[],
    status: userStatusType,
    isGameReady: boolean,
    partnerCount: number
}

// เอา status ของ user ออกมาเพื่อ initialized user ก่อนเล่นเกม

const getUser = (req:Request,res:Response<User | string>)=>{
    res.send("test")
}

export default getUser