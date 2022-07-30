import { Request, Response } from "express"
import { eventGroups } from "./randomEventGroup"

// get eventgroup ทั้งหมด
// Gun ( BlueBox ) && Boss ( Sorrawit )
const getEventGroups = async (req: Request, res: Response<eventGroups>) => {
    try {
        const { prisma } = req
        const query = await prisma.event_Group.findMany({
            select: {
                id: true,
                eventOnhints: {
                    select: {
                        hint: {
                            select: {
                                id: true,
                                text: true,
                            },
                        },
                    },
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        year: true,
                    },
                },
            },
        })

        const resQuery = query.map((item) => ({
            id: item.id,
            hints: item.eventOnhints.map((hintItem) => ({
                location: hintItem.hint.text,
                id: hintItem.hint.id,
            })),
            users: item.users,
        }))

        return res.send({
            groups: resQuery,
        })
    } catch (err: any) {
        return res.send(err)
    }
}

export default getEventGroups
