import { Room, User } from "@prisma/client"
import { ArrayMaxSize, ArrayMinSize, IsArray } from "class-validator"
import { Request, Response } from "express"
import { nanoid } from "nanoid"
import { roomresponse } from "./getRoom"

export class putUserToRoomBody {
    roomId?: string
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    userIds: string[]
}

const putUserToRoom = async (req: Request<any, any, putUserToRoomBody>, res: Response<roomresponse | string>) => {
    try {
        const { prisma } = req
        if (req.body.roomId) {
            let room: Room & {
                users: User[]
                _count: {
                    users: number
                }
            }
            try {
                room = await prisma.room.findFirstOrThrow({
                    where: { id: req.body.roomId },
                    include: { users: true, _count: { select: { users: true } } },
                })
            } catch (err) {
                return res.status(400).send("Couldn't find room")
            }
            const users = await prisma.user.findMany({
                where: { OR: [...req.body.userIds.map((item) => ({ id: item }))] },
                include: { room: { include: { _count: { select: { users: true } } } } },
            })
            const usersWithdiffids = users.filter((item) => !item.room_id || item.room_id !== room.id)
            if (
                !(
                    [...room.users, ...usersWithdiffids].map((item) => item.year).includes(1) &&
                    [...room.users, ...usersWithdiffids].map((item) => item.year).includes(2)
                )
            ) {
                return res.status(400).send("Room need to be mixed between 1st year and 2nd year")
            }
            const updateUsers = usersWithdiffids
                .filter((item) => item.room && item.room._count.users === 1)
                .map((item) => prisma.room.delete({ where: { id: item.room_id || "" } }))

            await prisma.$transaction(updateUsers)

            console.log(room._count.users + usersWithdiffids.length)

            if (room._count.users + usersWithdiffids.length > 3) {
                return res.status(400).send("Maximum amount of people per 1 room is 3")
            }
            const roomreq = usersWithdiffids.map(({ id }) => prisma.room.update({ where: { id: room.id }, data: { users: { connect: { id } } } }))

            await prisma.$transaction(roomreq)

            const room1 = await prisma.room.findFirst({ select: { id: true, users: { select: { id: true } } }, where: { id: req.body.roomId } })
            if (!room1) {
                return res.status(400).send("Couldn't find room")
            }
            return res.send(room1)
        } else {
            const users = await prisma.user.findMany({
                where: { OR: [...req.body.userIds.map((item) => ({ id: item }))] },
                include: { room: { include: { _count: { select: { users: true } } } } },
            })
            if (!(users.map((item) => item.year).includes(1) && users.map((item) => item.year).includes(2))) {
                return res.status(400).send("Room need to be mixed between 1st year and 2nd year")
            }
            if (users.length > 3 || users.length < 1) {
                return res.status(400).send("Maximum amount of people per 1 room is 3")
            }
            // const updateUsers = users
            //     .filter((item) => item.room && item.room._count.users === 1)
            //     .map((item) => prisma.room.delete({ where: { id: item.room?.id } }))
            // await prisma.$transaction(updateUsers)
            const room = await prisma.room.create({
                data: { code: nanoid(7), users: { connect: [...users.map((item) => ({ id: item.id }))] } },
                select: { id: true, users: { select: { id: true } } },
            })
            const allrooms = await prisma.room.findMany({ select: { id: true, _count: { select: { users: true } } } })
            // clean up
            const ids = await allrooms.filter((item) => !item._count.users).map((item) => item.id)
            await prisma.room.deleteMany({ where: { OR: [...ids.map((item) => ({ id: item }))] } })
            return res.send(room)
        }
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
}

export default putUserToRoom
