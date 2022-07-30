import { Request, Response } from "express"

interface deleteEventGroupRequestResponse {
    id: string
}

// Gun ( BlueBox ) && Boss ( Sorrawit )

// ลบ event_group

const deleteEventGroup = async (req: Request<any, any, deleteEventGroupRequestResponse>, res: Response<deleteEventGroupRequestResponse>) => {
    try {
        const { prisma } = req
        // console.log( req.body.id )
        const delete_EventGroup = prisma.event_Group.delete({
            where: {
                id: req.body.id,
            },
        })
        const delete_EventGroupOnHint = prisma.event_Group_On_Hint.deleteMany({
            where: {
                group_id: req.body.id,
            },
        })

        const result = await prisma.$transaction([delete_EventGroupOnHint, delete_EventGroup])

        return res.send({ id: result[1].id })
    } catch (err: any) {
        return res.send(err)
    }
}

export default deleteEventGroup
