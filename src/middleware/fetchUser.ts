import { NextFunction, Request, Response } from "express"

const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return next()
        }
        const user = await req.prisma.user.findFirst({
            where: { id: req.user?.id },
            select: { email: true, isAdmin: true, isPlayable: true, id: true, name: true, year: true, student_id: true },
        })
        if (!user) {
            return req.logOut({}, (err) => {
                return res.status(404).send("User not found")
            })
        }
        if (!user.student_id) {
            return req.logOut({}, (err) => {
                return res.status(404).send("Please login again")
            })
        }
        req.user = user
        return next()
    } catch (err) {
        return next()
    }
}

export default fetchUser
