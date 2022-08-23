import { NextFunction, Request, Response } from "express";

const randomParing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { prisma } = req
        const users_first_year = await (await prisma.user.findMany({ where: { room_id: null, year: 1, isPlayable: true }, include: { hints: true } })).filter((item) => item.hints.length === 10)
        const room_with_no_partner = (await prisma.room.findMany({ select: { _count: { select: { users: true } }, id: true } })).filter((item) => item._count.users === 1)
        let ind = 0;
        // paring with 1st year
        const connect_first_year_to_room = users_first_year.map(
            (item) => prisma.user.update({ where: { id: item.id }, data: { room: { connect: { id: room_with_no_partner[ind++].id } } } }))
        await prisma.$transaction(connect_first_year_to_room)

        // paring 3 users
        const users_with_no_pair = (await prisma.user.findMany({ where: { year: 2 }, select: { room: { include: { _count: { select: { users: true } } } }, room_id: true, id: true, hints: true } })).filter(item => item.hints.length === 10)
            .filter(item => (item.room?._count.users || 0) === 1)

        const room_with_pair = (await prisma.room.findMany({ select: { _count: { select: { users: true } }, id: true } })).filter(item => item._count.users === 2)
        ind = 0;
        const connect_no_pair_with_pair = users_with_no_pair.map(item => prisma.user.update({ where: { id: item.id }, data: { room: { connect: { id: room_with_pair[ind++].id } } } }))
        await prisma.$transaction(connect_no_pair_with_pair)

        return res.send(true)
    } catch (err) {
        return res.status(500).send("Internal server error")
    }
}

export default randomParing