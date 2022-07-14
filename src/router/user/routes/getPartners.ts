import { Request, Response } from "express";

interface Partner {
    partners: {userId:string,name:string,img:{type:"Buffer",data:number[]} | null}[]
}

// verify ว่า user คนนั้นได้เปิดสายรหัสไปหรือยัง จาก user_opened_codes 
// ถ้าเปิดโค้ดที่ id ตรงกับ id ของ partner แล้วก็ให้ return partner คนนั้นตาม response type
// หรือถ้าโค้ดเราโดนเปิดโดย user id ที่เป็น partner เราแล้ว (เช็คจาก user_opened_code) ก็ให้ return partners เหมือนกัน

const getPartners = (req:Request,res:Response<Partner>)=>{

}

export default getPartners