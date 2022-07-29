import { Request, Response } from "express"

export interface Hint {
    hints: { userId: 1 | 2; hint: string; isShow: boolean }[]
}

// Neng ( stthi )

// get hints จาก Room ที่เชื่อมกับ user โดย select ถึงแค่จำนวน opened_hints
// ที่เหลือเค้าอยากให้สร้าง hint ปลอมให้หน่อย (อันที่ isShow เป็น false)
// userId ที่มีเค้าอยากให้เป็น fake userid หรือก็คือจะมีแค่ 1 หรือ 2 เท่านั้น
export const getAllhints: (req: Request) => Promise<Hint> = async (req) => {
    const { prisma } = req
    let opened_hints = await prisma.user.findFirst({
        where: { id: req.user?.id },
        select: { opened_hints: true, room: { select: { users: { select: { id: true, hints: true } } } } },
    })
    if (!opened_hints) throw new Error("Couldn't find user")
    if (opened_hints.opened_hints > 10) {
        opened_hints.opened_hints = 10
        await prisma.user.update({ where: { id: req.user?.id }, data: { opened_hints: 10 } })
    }
    const users = opened_hints?.room?.users.filter((e) => e.id !== (req.user?.id || ""))
    let response: { userId: 1 | 2; hint: string; isShow: boolean }[] = []
    users?.forEach((item, index) => {
        for (let i = 0; i < (opened_hints?.opened_hints || 0); i++) {
            let e = item.hints[i]
            response.push({ userId: (index + 1) as any, hint: e.text, isShow: true })
        }
    })
    const length = users?.length === 1 ? response.length : response.length / 2
    for (let i = length; i < 10; i++) {
        response.push({ userId: 1 as any, hint: "ฮั่นแน่ !!!", isShow: false })
        if ((users?.length || 0) > 1) {
            response.push({ userId: 2 as any, hint: "ฮั่นแน่ !!!", isShow: false })
        }
    }
    return { hints: response }
}
const getHint = async (req: Request, res: Response<Hint>) => {
    try {
        const response = await getAllhints(req)
        return res.send(response)
    } catch (error: any) {
        return res.status(500).send(error)
    }
}

export default getHint
