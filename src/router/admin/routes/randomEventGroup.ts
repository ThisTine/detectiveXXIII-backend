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

const randomEventGroup = (req: Request, res: Response<eventGroups>) => {

}

export default randomEventGroup