import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export const validateMiddleware = (Scheme: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sc = new Scheme()

        for (let i of Object.keys(req.body)) {
            sc[i] = req.body[i]
        }

        await validateOrReject(sc)
        return next()
    } catch (err: any) {
        console.log(err)
        return res.status(400).send(err.toString())
    }
}
