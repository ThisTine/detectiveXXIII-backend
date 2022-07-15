import { Request, Response } from "express";

export type eventGroup = {
    id: string,
    hints: {
        location: string,
        id: string
    }[],
    users: {
        id: string,
        name: string,
        email: string
    }[]
}

export interface eventGroups {
    groups: eventGroup[]
}

//Gun ( BlueBox ) && Boss ( Sorrawit )

// random user ทั้งหมด เข้าไป event group อย่างละเท่า ๆ กัน

const randomEventGroup = async (req: Request, res: Response<eventGroups>) => {
    try {
        const { prisma } = req
        // TODO:
        // query to get all user (array)
        // shuffle and divide them equally for db
        // insert into db:event_group (create)
    } catch (err: any) {
        res.send(err)
    }
}

export default randomEventGroup