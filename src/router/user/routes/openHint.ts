import { Request, Response } from "express"
import { getAllhints, Hint } from "./gethints"

// Neng ( stthi )

// เช็คว่า user มีหัวใจพอมั้ย ใช้ 3 lifes เพื่อเปิด 1 hint
// เช็คว่า user เปิด hint หมดหรือยัง (เช็คจำนวน opened_hints ว่าเท่ากับ 10 มั้ย)
// เปิด hint ใหม่ (เพิ่ม opened_hints +1 แล้วลด lifes -3 อย่าลืมเช็คด้วยว่าเปิด hint หมดหรือยัง)

const openHint = async (req: Request, res: Response<Hint | String>) => {
    try {
        const { prisma } = req
        const life = await prisma.user.findFirst({ select: { lifes: true }, where: { id: req.user?.id } })
        if ((life?.lifes || 0) < 3) {
            res.status(400).send("insufficient lifes")
        }
        await prisma.user.update({ where: { id: req.user?.id || "" }, data: { opened_hints: { increment: 1 } } })
        const getResponse = await getAllhints(req)
        res.send(getResponse)
    } catch (error: any) {
        res.send(error)
    }
}

export default openHint
