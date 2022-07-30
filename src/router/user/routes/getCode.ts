import { Request, Response } from "express"
import { nanoid } from "nanoid"

interface Code {
    code: string
    created: Date
    end: Date
}

// Boss ( Nattapat )

// สร้าง code โดยอิงจาก userid ใน table โค้ด (ใช้ upsert)
// โดย update created และ end ทุกครั้งที่สร้าง (end ห่างจาก created 90s)
// โค้ดใช้ nanoid ความยาว 8 ตัวอักษร

const getCode = async (req: Request, res: Response<Code>) => {
    try {
        const { prisma } = req
        const code = await prisma.code.upsert({
            where: {
                id: req.user?.id,
            },
            update: {
                name: nanoid(8),
                expire_date: new Date(Date.now() + 1000 * 90),
            },
            create: {
                id: req.user?.id,
                name: nanoid(8),
                user: {
                    connect: {
                        id: req.user?.id,
                    },
                },
                type: "PARING",
                expire_date: new Date(Date.now() + 1000 * 90),
            },
        })
        return res.send({ code: code.name, created: new Date(Date.now()), end: code.expire_date || new Date() })
    } catch (err: any) {
        return res.status(500).send(err)
    }
}

export default getCode
