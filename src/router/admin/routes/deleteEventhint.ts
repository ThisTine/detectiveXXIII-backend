import { Request, Response } from "express"
import { eventHint } from "./getEventHints"

interface eventHintReq {
    id: string
}

// Gun ( BlueBox ) && Boss ( Sorrawit )

// ลบ event hint

const deleteEventhint = async (req: Request<any, any, eventHintReq>, res: Response<eventHint>) => {
    try {
        const { prisma } = req
        await prisma.event_Group_On_Hint.deleteMany({ where: { hint_id: req.body.id } })
        const result = await prisma.event_Hint.delete({
            where: {
                id: req.body.id,
            },
        })
        return res.send({ id: result.id, location: result.text })
    } catch (err: any) {
        return res.send(err)
    }
}

export default deleteEventhint
