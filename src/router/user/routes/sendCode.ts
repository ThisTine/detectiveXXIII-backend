import { CodeType, Event_Group, Prisma, Room } from "@prisma/client"
import { Request, Response } from "express"

interface sendCode {
    status: "paring_with_partner" | "paring_success" | "paring_fail" | "event"
    event_next_hint?: string
    opened_hint?: string[]
}

interface sendCodeBody {
    code: string
}

// Tine (Thistine)

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
        const room = await prisma.room.findFirst({ where: { code: req.body.code }, select: { id: true, _count: { select: { users: true } } } })
        if (!room || room._count.users > 2) throw new Error("Room not found")
        await prisma.user.update({ where: { id: req.user?.id }, data: { room: { connect: { id: room.id } } } })
        return res.send({ status: "paring_with_partner" })
    } catch (err: any) {
        return res.status(400).send(err.toString())
    }
}

const applyforparing = async (
    req: Request<any, any, sendCodeBody, any>,
    res: Response<sendCode>,
    code: { id: string; expire_date: Date | null; type: CodeType },
    room: Room & {
        users: {
            id: string
        }[]
    }
) => {
    try {
        const { prisma } = req
        if (code.id === req.user?.id) {
            return res.status(400).send("Cannot use code that refer to yourself" as any)
            throw new Error("Cannot use code that refer to yourself")
        }
        if (
            room.users
                .filter((item) => item.id !== req.user?.id)
                .map((item) => item.id)
                .includes(code.id)
        ) {
            await prisma.user_Opened_Code.upsert({
                where: { user_id_code_id: { code_id: code.id, user_id: req.user?.id || "" } },
                update: { code_id: code.id, user_id: req.user?.id || "" },
                create: { code_id: code.id, user_id: req.user?.id || "" },
            })
            await prisma.user_Opened_Code.upsert({
                where: { user_id_code_id: { code_id: req.user?.id || "", user_id: code.id } },
                update: { code_id: req.user?.id || "", user_id: code.id },
                create: { code_id: req.user?.id || "", user_id: code.id },
            })
            return res.send({ status: "paring_success" })
        } else {
            await prisma.user_Opened_Code.upsert({
                where: { user_id_code_id: { code_id: code.id, user_id: req.user?.id || "" } },
                update: { code_id: code.id, user_id: req.user?.id || "" },
                create: { code_id: code.id, user_id: req.user?.id || "" },
            })
            await prisma.user.update({ where: { id: req.user?.id || "" }, data: { lifes: { decrement: 1 } } })
            return res.send({ status: "paring_fail" })
        }
    } catch (err: any) {
        return res.status(500).send(err.toString())
    }
}

const applyforevent = async (
    req: Request<any, any, sendCodeBody, any>,
    res: Response<sendCode | string>,
    code: { id: string; expire_date: Date | null; type: CodeType },
    user: { id: string; event_hints_count: number; event_group: Event_Group | null; opened_hints: number }
) => {
    try {
        const { prisma } = req
        if (!user.event_group) return res.status(400).send("No event group")
        const hint = await prisma.event_Group_On_Hint.findFirst({
            where: { group_id: user.event_group.id },
            skip: user.event_hints_count,
            orderBy: { group_id: "asc" },
            select: { hint: { select: { code_id: true, text: true } } },
        })
        if (!hint) return res.status(400).send("Hint not found")
        if (hint.hint.code_id === code.id) {
            await prisma.user.update({ where: { id: user.id }, data: { event_hints_count: { increment: 1 }, opened_hints: { increment: 1 } } })
            const eventhint = await prisma.event_Group_On_Hint.findFirst({
                where: { group_id: user.event_group.id },
                skip: user.event_hints_count + 1,
                orderBy: { group_id: "asc" },
                select: { hint: { select: { text: true } } },
            })
            const userhint = await prisma.user.findFirst({
                where: { id: req.user?.id },
                select: {
                    room: { select: { users: { select: { id: true, hints: { take: 1, skip: user.opened_hints } } } } },
                })
            let hints: string[] = []
            const partners = userhint?.room?.users.filter((item) => item.id !== user.id)
            partners?.forEach((item) => {
                item.hints.forEach((e) => hints.push(e.text))
            })
            return res.send({
                status: "event",
                event_next_hint: eventhint?.hint.text,
                opened_hint: hints,
            })
        }
        return res.status(400).send("This code does not belong to " + hint.hint.text)
    } catch (err: any) {
        return res.status(500).send(err.toString())
    }
}

const sendCode = async (req: Request<any, any, sendCodeBody, any>, res: Response<sendCode | string>) => {
    try {
        if (!req.user) throw new Error("No user")
        const { prisma } = req
        const user = await prisma.user.findFirst({
            where: { id: req.user.id },
            select: {
                room: { include: { users: { select: { id: true } } } },
                lifes: true,
                event_hints_count: true,
                event_group: true,
                opened_hints: true,
                id: true,
            },
        })
        if (!user) throw new Error("No user")
        if (!user.room) {
            return applyforroom(req, res)
        } else {
            const code = await prisma.code.findFirst({ where: { name: req.body.code }, select: { expire_date: true, id: true, type: true } })
            if (!code) throw new Error("Code not found")
            if (code.expire_date && code.expire_date.getTime() < Date.now()) throw new Error("Code expired")
            if (code.type === "PARING") {
                if (user.lifes <= 0) throw new Error("insufficient lifes")
                return applyforparing(req, res, code, user.room)
            }
            if (code.type === "EVENT") {
                if (user.opened_hints >= 10) return res.status(400).send("Already opened hints")
                return applyforevent(req, res, code, user)
            }
            return res.status(500).send("internal server error")
        }
    } catch (err: Prisma.RejectPerOperation | Prisma.RejectOnNotFound | any) {
        return res.status(400).send(err.toString())
    }
}

export default sendCode
