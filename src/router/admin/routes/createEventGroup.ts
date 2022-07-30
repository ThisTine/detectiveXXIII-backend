import { Request, Response } from "express"
import { eventGroup } from "./randomEventGroup"

interface createEventGroupRequest {
    hints: { id: string }[]
}

// Gun ( BlueBox ) && Boss ( Sorrawit )
// สร้าง event_group จาก event_hints id ที่เอามาใส่

const createEventGroup = async (req: Request<any, any, createEventGroupRequest>, res: Response<eventGroup>) => {
    try {
        const group = await req.prisma.event_Group.create({
            include: {
                eventOnhints: { select: { hint: { select: { text: true, id: true } } } },
                users: true,
            },

            data: {
                eventOnhints: { createMany: { data: [...req.body.hints.map((item) => ({ hint_id: item.id }))] } },
            },
        })
        const rlakesponse = {
            users: group.users,
            id: group.id,
            hints: group.eventOnhints.map((item) => ({ location: item.hint.text, id: item.hint.id })),
        }
        console.log(group)
        return res.send(rlakesponse)
    } catch (err: any) {
        return res.send(err)
    }
}

export default createEventGroup
