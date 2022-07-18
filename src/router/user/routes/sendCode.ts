import { Prisma } from "@prisma/client"
import { Request, Response } from "express"

interface sendCode {
    status: "paring_with_partner" | "paring_success" | "paring_fail" | "event"
    event_next_hint?: string
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

const applyforroom = async (req: Request<any, any, sendCodeBody, any>, res: Response<sendCode>) => {
    try {
        const { prisma } = req
        const room = await prisma.room.findFirst({ where: { code: req.body.code, user_count: { lt: 3 } }, select: { id: true, user_count: true } })
        if (!room) throw new Error("Room not found")
        await prisma.room.update({ where: { id: room.id }, data: { user_count: { increment: 1 } } })
        await prisma.user.update({ where: { id: req.user?.id }, data: { room: { connect: { id: room.id } } } })
        res.send({ status: "paring_with_partner" })
    } catch (err: any) {
        res.status(400).send(err.toString())
    }
}

const sendCode = async (req: Request<any, any, sendCodeBody, any>, res: Response<sendCode>) => {
    try {
        if (!req.user) throw new Error("No user")
        const { prisma } = req
        const user = await prisma.user.findFirst({ where: { id: req.user.id }, select: { room: true } })
        if (!user) throw new Error("No user")
        if (!user.room) {
            return applyforroom(req, res)
        } else {
            const code = await prisma.code.findFirst({ where: { name: req.body.code } })
        }
    } catch (err: Prisma.RejectPerOperation | Prisma.RejectOnNotFound | any) {
        return res.status(400).send(err.toString())
    }
}

export default sendCode
