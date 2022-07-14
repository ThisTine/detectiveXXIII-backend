import { Request, Response } from "express";

interface Admin {
    id: string,
    name:string,
    email:string
}

//  Boss ( Nattapat )

// get ข้อมูลของ admin

const getAdmin = (req:Request,res:Response<Admin>)=>{

}

export default getAdmin