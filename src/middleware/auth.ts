import { NextFunction, Request, Response } from "express";

export const authUser = (req:Request,res:Response,next:NextFunction)=>{
    if(req.user && req.user.isPlayable){
        return next()
    }
    return res.status(401).send("unauthorized")
}

export const authAdmin = (req:Request,res:Response,next:NextFunction)=>{
    if(req.user && req.user.isAdmin){
        return next()
    }
    return res.status(401).send("unauthorized")
}