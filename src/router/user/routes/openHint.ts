import { Request, Response } from "express";
import { Hint } from "./gethints";

// Neng ( stthi )

// เช็คว่า user มีหัวใจพอมั้ย ใช้ 3 lifes เพื่อเปิด 1 hint
// เช็คว่า user เปิด hint หมดหรือยัง (เช็คจำนวน opened_hints ว่าเท่ากับ 10 มั้ย)
// เปิด hint ใหม่ (เพิ่ม opened_hints +1 แล้วลด lifes -3 อย่าลืมเช็คด้วยว่าเปิด hint หมดหรือยัง)


const openHint = (req:Request,res:Response<Hint>)=>{

}

export default openHint