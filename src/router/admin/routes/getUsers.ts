import { Request, Response } from "express";
import { userStatusType } from "../../user/routes/getUser";

interface UserList {
    users: {id:string,name:string,email:string,year:string,lifes:number,status:userStatusType,partnerCount:number}[]
}

//Boss ( Nattapat )

// get users ทั้งหมด

const getUsers = (req:Request,res:Response<UserList>)=>{

}

export default getUsers