import { Request, Response } from "express"

interface Code {
    code: string
    created: Date
    end: Date
}

// Boss ( Nattapat )

// สร้าง code โดยอิงจาก userid ใน table โค้ด (ใช้ upsert)
// โดย update created และ end ทุกครั้งที่สร้าง (end ห่างจาก created 1 นาที)
// โค้ดใช้ nanoid ความยาว 8 ตัวอักษร

const getCode = (req: Request, res: Response<Code>) => {}

export default getCode
