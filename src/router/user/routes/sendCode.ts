import { Request, Response } from "express";

interface sendCode {
    status: "paring_with_partner" | "paring_success" | "paring_fail" | "event",
    event_next_hint?: string,
    opened_hint?: string
}

interface sendCodeBody {
    code: string
}

//Boss ( Nattapat )

// เปิดโค้ดต่าง ๆ 
// เปิดโค้ดมี 2 แบบ คือเปิด paring code (โค้ดจับคู่พี่รหัสตอนเข้าเกม)
// กับเปิด code แบบปกติ (คำไบ้,เปิดทายพี่รหัส) 
// เช็คในตารางโค้ดว่าโค้ดนั้นต้องเป็นโค้ดประเภทอะไร
// ถ้าเป็นประเภท paring code (room == null) ให้จับคู่ user กับ room ที่มี
// ถ้าจับสำเร็จให้ขึ้น status "paring_with_partner"
// ถ้าเป็นโค้ดประเภทปกติ (คำไบ้,เปิดทายพี่รหัส)  ให้เอาไปเช็คกับ table code ว่ามีตรงไหม
// อย่าลืมเช็คว่าโค้ดหมดอายุหรือยัง
// ถ้ามีตรงกับ table code ให้เช็คว่าโค้ดนั้นเป็นโค้ดคำไบ้ หรือ โค้ดทายพี่รหัส
// ถ้าเป็นโค้ดคำไบ้ให้เปิดคำไบ้เพิ่ม opened_hints +1 อันแล้ว แล้วเพิ่ม event_hints_count +1 แล้ว return ค่า hint กับ event location ใหม่
// ถ้าเป็น paring ให้ดูว่า userid ตรงกับ partner มั้ยถ้าตรงก็ให้เพิ่ม status paring_success ถ้าไม่ตรงใช้ "paring_fail" แล้วหัก life user กับ userid ของโค้ด -1 

const sendCode = (req:Request<any,any,sendCodeBody, any>,res:Response<sendCode>)=>{
    
}

export default sendCode