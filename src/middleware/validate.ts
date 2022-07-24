import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export const validateMiddleware = (Scheme: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validateOrReject(new Scheme(req.body))
        return next()
    } catch (err: any) {
        return res.status(400).send(err.toString())
    }
}
