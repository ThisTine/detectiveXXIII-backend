import { Request, Response } from "express"

interface Event {
    location: string
}

// Neng ( stthi )

// query hint จาก event_group โดยเอาใน index ที่ event_hints_count

const getEvent = async (req: Request, res: Response<Event | String>) => {
    try {
        const { prisma } = req
        if (!req.gameConfig.isEventReady) {
            return res.status(400).send("Event is not ready !!")
        }
        const eventHints = await prisma.user.findFirst({
            where: {
                id: req.user?.id,
            },
            select: {
                event_hints_count: true,
                event_group: {
                    select: {
                        eventOnhints: {
                            select: {
                                hint: true,
                            },
                        },
                    },
                },
            },
        })
        if (!eventHints?.event_group) {
            return res.status(400).send("Group not found")
        }
        const hint = eventHints?.event_group?.eventOnhints[eventHints.event_hints_count]
        if (!hint) {
            return res.status(400).send("non hint")
        }
        return res.send({ location: hint.hint.text })
    } catch (error: any) {
        res.send(error)
    }
}

export default getEvent
