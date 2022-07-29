import { Request, Response } from "express"

const paringWithPartner = async (req: Request, res: Response) => {
    try {
        const { prisma } = req
        const data = await prisma.user.findMany({
            where: { OR: [{ room: null }, { room: { user_count: { lte: 1 } } }] },
            select: { room: true, id: true, year: true },
        })
        let year_1_users = data.filter((item) => item.year === 1)
        let year_2_users = data.filter((item) => item.year === 2)
        let ind = 0
        for (let i of year_2_users) {
            if (i.room && year_1_users[ind]) {
                await prisma.room.update({
                    where: { id: i.room.id },
                    data: { users: { connect: { id: year_1_users[ind].id } }, user_count: { increment: 1 } },
                })
                ind++
            }
        }
        let rooms = await prisma.room.findMany({ where: { user_count: { lte: 2 } } })
        let rind = 0
        if (rooms.length === 0) {
            rooms = await prisma.room.findMany()
        }

        for (let i = ind; i < year_1_users.length; i++) {
            let item = year_1_users[i]
            await prisma.room.update({ where: { id: rooms[rind].id }, data: { users: { connect: { id: item.id } }, user_count: { increment: 1 } } })
            rind++
            if (rind >= rooms.length) rind = 0
        }
        for (let i = ind; i < year_2_users.length; i++) {
            let item = year_2_users[i]
            await prisma.room.update({ where: { id: rooms[rind].id }, data: { users: { connect: { id: item.id } }, user_count: { increment: 1 } } })
            rind++
            if (rind >= rooms.length) rind = 0
        }
        return res.send("Success")
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal server Error")
    }
}

export default paringWithPartner
