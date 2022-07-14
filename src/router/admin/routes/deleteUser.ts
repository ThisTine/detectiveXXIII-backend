import { Request, Response } from "express";

interface DeletedUser {
    id: string
}

// ลบ user ตาม id

const deleteUser = (req:Request,res:Response<DeletedUser>)=>{

}

export default deleteUser