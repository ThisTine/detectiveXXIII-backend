import { Request, Response } from "express"

interface Admin {
    id: string
    name: string
    email: string
}

//  Boss ( Nattapat )

// get ข้อมูลของ admin

const getAdmin = (req: Request, res: Response<Admin | string>) => {
    try {
        if (!req.user) throw new Error("No user")
        const { id, email, name } = req.user
        return res.send({ id, email, name })
    } catch (err: any) {
        return res.status(400).send(err.toString())
    }
}

export default getAdmin
