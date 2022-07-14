import { Request, Response } from "express";

interface DeletedUser {
    id: string
}

// Tine (Thistine )

// ลบ user ตาม id

const deleteUser = (req:Request,res:Response<DeletedUser>)=>{

}

export default deleteUser