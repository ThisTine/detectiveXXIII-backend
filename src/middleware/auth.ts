import { NextFunction, Request, Response } from "express";

export const authUser = (req:Request,res:Response,next:NextFunction)=>{
    if(req.user){
        return next()
    }
    return res.status(401).send("unauthorized")
}

