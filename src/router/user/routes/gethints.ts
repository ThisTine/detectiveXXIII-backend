import { Request, Response } from "express";

export interface Hint {
    hints: {userId:1|2,hint:string,isShow:boolean}[]
}

// get hints จาก Room ที่เชื่อมกับ user โดย select ถึงแค่จำนวน opened_hints 
// ที่เหลือเค้าอยากให้สร้าง hint ปลอมให้หน่อย (อันที่ isShow เป็น false)
// userId ที่มีเค้าอยากให้เป็น fake userid หรือก็คือจะมีแค่ 1 หรือ 2 เท่านั้น

const getHint = (req:Request,res:Response<Hint>)=>{

}

export default getHint