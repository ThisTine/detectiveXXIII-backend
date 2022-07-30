import { Request, Response } from "express"

export interface roomresponse {
    id: string
    users: {
        id: string
    }[]
}

const getRooms = async (req: Request, res: Response<roomresponse[] | string>) => {
    try {
        const { prisma } = req
        const rooms = await prisma.room.findMany({ select: { id: true, users: { select: { id: true } } } })
        return res.send(rooms)
    } catch (err) {
        return res.status(500).send("Internal server error")
    }
}

export default getRooms
