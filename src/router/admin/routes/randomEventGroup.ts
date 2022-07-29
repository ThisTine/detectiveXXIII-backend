import { Request, Response } from "express"

export type eventGroup = {
    id: string
    hints: {
        location: string
        id: string
    }[]
    users: {
        id: string
        name: string
        email: string
        year: number
    }[]
}

export interface eventGroups {
    groups: eventGroup[]
}

//Gun ( BlueBox ) && Boss ( Sorrawit )

// random user ทั้งหมด เข้าไป event group อย่างละเท่า ๆ กัน

// TODO:
// query to get all user (array)
// shuffle and divide them equally for db
// insert into db:event_group (create)

const randomEventGroup = async (req: Request, res: Response<eventGroups>) => {
    try {
        const { prisma } = req
        const query = await prisma.user.findMany({
            where: {
                isPlayable: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                year: true,
            },
        })
        const event_Group = await prisma.event_Group.findMany({
            select: {
                id: true,
            },
        })

        const shuffleuser = getMultipleRandom(query)
        const maps = shuffleuser.map((item: typeof query[0], index) => {
            return prisma.user.update({
                where: {
                    id: item.id,
                },
                data: {
                    event_group_id: event_Group[index % event_Group.length].id,
                },
            })
        })
        await prisma.$transaction(maps)

        const res_event_Group = await prisma.event_Group.findMany({
            select: {
                id: true,
                eventOnhints: {
                    select: {
                        hint: {
                            select: {
                                text: true,
                            },
                        },
                        hint_id: true,
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

        return res.send({
            groups: res_event_Group.map((item) => ({
                id: item.id,
                hints: item.eventOnhints.map((hintItem) => ({
                    location: hintItem.hint.text,
                    id: hintItem.hint_id,
                })),
                users: item.users,
            })),
        })
    } catch (err: any) {
        return res.send(err)
    }
}

export default randomEventGroup

function getMultipleRandom(arr: any) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())

    return shuffled
}
