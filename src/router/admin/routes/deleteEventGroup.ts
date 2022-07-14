import { Request, Response } from "express";

interface deleteEventGroupRequestResponse {
    id: string
}

// Gun ( BlueBox ) && Boss ( Sorrawit )

// ลบ event_group


const deleteEventGroup = async (req: Request<any, any, deleteEventGroupRequestResponse>, res: Response<deleteEventGroupRequestResponse>) => {
    try {
        const { prisma } = req
        const result = await prisma.event_Group.delete({
            where: {
                id: req.body.id
            }
        })
        // Interface ??? 
        res.send(result)
    } catch (err: any) {
        res.send(err)
    }
}

export default deleteEventGroup