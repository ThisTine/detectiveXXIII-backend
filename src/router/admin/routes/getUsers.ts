import { Request, Response } from "express"
import { userStatusType } from "../../user/routes/getUser"

interface UserList {
    users: {
        id: string
        name: string
        email: string
        year: number
        lifes: number
        isPlayable: boolean
        status: userStatusType
        partnerCount: number
    }[]
}

//Boss ( Nattapat )

// get users ทั้งหมด
const userStatusType: (userq: any) => userStatusType = (userq) => {
    if (!userq?.hints || userq.hints.length < 10) return "filling_hints"
    if (!userq.room || userq.room._count.users < 2) return "waiting"
    else return "playing"
}

const getUsers = async (req: Request, res: Response<UserList>) => {
    try {
        const { prisma } = req
        const userq = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                year: true,
                lifes: true,
                isPlayable: true,
                hints: {
                    select: {
                        id: true,
                        text: true,
                    },
                },
                room: {
                    select: {
                        _count: { select: { users: true } },
                    },
                },
            },
        })
        const mapdata: UserList = {
            users: userq.map((item) => ({
                email: item.email,
                id: item.id,
                lifes: item.lifes,
                name: item.name,
                isPlayable: item.isPlayable,
                partnerCount: item.room?._count.users || 0,
                status: userStatusType(item),
                year: item.year,
            })),
        }
        return res.send(mapdata)
    } catch (err: any) {
        return res.status(500).send(err)
    }
}

export default getUsers
