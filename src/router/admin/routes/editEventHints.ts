import { Request, Response } from "express"
import { eventHint } from "./getEventHints"

interface editEventHintRequest {
    id: string
    location: string
}

// Gun ( BlueBox ) && Boss ( Sorrawit ) && Boss ( Nattapat )

// แก้ไข event hint

const editEventHints = async (req: Request<any, any, editEventHintRequest>, res: Response<eventHint>) => {
    try {
        const { prisma } = req
        const result = await prisma.event_Hint.update({
            where: {
                id: req.body.id,
            },
            data: {
                text: req.body.location,
            },
        })
        return res.send({ id: result.id, location: result.text })
    } catch (err: any) {
        return res.send(err)
    }
}

export default editEventHints
