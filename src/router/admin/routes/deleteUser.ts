import { Request, Response } from "express"

interface DeletedUser {
    id: string
}

// Tine (Thistine )

// ลบ user ตาม id

const deleteUser = async (req: Request<any, any, DeletedUser>, res: Response<DeletedUser>) => {
    try {
        const { prisma } = req
        const fuser = await prisma.user.findFirst({
            where: { id: req.body.id },
            select: { room: { include: { _count: { select: { users: true } } } }, id: true },
        })
        if (fuser && fuser.room && fuser.room._count.users === 1) {
            await prisma.room.delete({ where: { id: fuser.room.id } })
        }
        const user = prisma.user.delete({ where: { id: req.body.id } })
        const user_Opened_Code = prisma.user_Opened_Code.deleteMany({ where: { user_id: req.body.id } })
        const hints = prisma.hint.deleteMany({ where: { user_id: req.body.id } })
        await prisma.$transaction([hints, user_Opened_Code, user])
        return res.send({ id: fuser?.id || "" })
    } catch (err: any) {
        return res.status(500).send(err.toString())
    }
}

export default deleteUser
