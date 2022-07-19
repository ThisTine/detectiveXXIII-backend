import { Request, Response } from "express"

export type userStatusType = "filling_hints" | "waiting" | "playing"

interface User {
    id: string
    name: string
    email: string
    year: number
    lifes: number
    hints: { id: string; text: string }[]
    status: userStatusType
    isGameReady: boolean
    partnerCount: number
    img: Buffer | null
}

//  Boss ( Nattapat )

// เอา status ของ user ออกมาเพื่อ initialized user ก่อนเล่นเกม

const getUser = async (req: Request, res: Response<User | string>) => {
    const { prisma } = req
    try {
        const userq = await prisma.user.findFirst({
            where: {
                id: req.user?.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                year: true,
                lifes: true,
                img: true,
                hints: {
                    select: {
                        id: true,
                        text: true,
                    },
                },
                room: {
                    select: {
                        user_count: true,
                    },
                },
            },
        })
        const userStatusType: () => userStatusType = () => {
            if (!userq?.hints || userq.hints.length < 10) return "filling_hints"
            if (!userq.room || userq.room.user_count < 2) return "waiting"
            else return "playing"
        }
        if (!userq) throw new Error("User not found")

        const resformat: User = {
            id: userq.id,
            email: userq.email,
            hints: userq.hints,
            isGameReady: req.gameConfig.isGameReady,
            lifes: userq.lifes,
            name: userq.name,
            partnerCount: userq.room?.user_count || 0,
            status: userStatusType(),
            year: userq.year,
            img: userq.img,
        }
        res.send(resformat)
    } catch (err: any) {
        res.send(err)
    }
}

export default getUser
