import { NextFunction, Request, Response } from "express"

const requriedPartner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const room = await req.prisma.user.findFirst({ where: { id: req.user?.id }, select: { room: { select: { user_count: true } } } })
        if ((room?.room?.user_count || 0) <= 1) {
            return res.status(400).send("This route required partner")
        }
        next()
    } catch (err) {
        return res.status(500).send("Internal server error")
    }
}

export default requriedPartner
