import { Request, Response } from "express"

interface Partner {
    partners: { userId: string; name: string; img: Buffer | null }[]
}

// Tine ( Thistine ) & Thun ( Bsthun )

// verify ว่า user คนนั้นได้เปิดสายรหัสไปหรือยัง จาก user_opened_codes
// ถ้าเปิดโค้ดที่ id ตรงกับ id ของ partner แล้วก็ให้ return partner คนนั้นตาม response type
// หรือถ้าโค้ดเราโดนเปิดโดย user id ที่เป็น partner เราแล้ว (เช็คจาก user_opened_code) ก็ให้ return partners เหมือนกัน

const getPartners = async (req: Request, res: Response<Partner | String>) => {
    try {
        const { prisma } = req
        const partners = await prisma.user.findFirst({
            where: { id: req.user?.id },
            select: { room: { select: { users: { select: { id: true } }, _count: { select: { users: true } } } } },
        })
        if (!partners || !partners.room || partners.room._count.users <= 1) {
            throw new Error("Partner not found")
        }
        if (req.gameConfig.isGameEnd) {
            const users = await prisma.user.findFirst({ where: { id: req.user?.id }, select: { room: { select: { users: true } } } })
            if (!users || !users.room) {
                throw new Error("Partner not found")
            }
            const resuser = users?.room?.users.filter((item) => item.id !== req.user?.id)
            return res.send({ partners: resuser.map((item) => ({ img: item.img, name: item.name, userId: item.id })) })
        }
        const code_ids = partners.room.users.map((item) => ({ code_id: item.id }))
        const user_opened_code = await prisma.user_Opened_Code.findMany({
            where: { user_id: req.user?.id, OR: [...code_ids] },
            select: { user: true },
        })
        if (user_opened_code.length === 0) {
            res.status(400).json("Game is not complete yet")
        }
        res.send({ partners: user_opened_code.map((item) => ({ img: item.user.img, name: item.user.name, userId: item.user.id })) })
    } catch (err) {
        res.status(500).send("Internal server Error")
    }
}

export default getPartners
