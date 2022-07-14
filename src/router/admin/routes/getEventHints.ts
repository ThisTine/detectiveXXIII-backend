import { Request, Response } from "express";

export type eventHint = {
    id: string,
    location: string
}

export interface EventHints {
    hints: eventHint[]
}

// Gun ( BlueBox ) && Boss ( Sorrawit )

// getEventhints ทั้งหมด

const getEventHints = async (req: Request, res: Response<EventHints>) => {
    try {
        const { prisma } = req
        const result = await prisma.event_Hint.findMany()
        res.send({
            hints: result.map((item) => ({
                id: item.id,
                location: item.text
            }))
        })
    } catch (err: any) {
        res.send(err)
    }
}

export default getEventHints