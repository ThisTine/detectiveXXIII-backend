import { Request, Response } from "express"

interface CodeList {
    rooms: string[]
    events: {
        location: string
        code: string
    }[]
}

// Boss ( Nattapat )

// get codes ทั้งหมดทั้งโค้ดของ room ต่าง ๆ และ โค้ดของ event_group

const getCodes = async (req: Request, res: Response<CodeList>) => {
    try {
        const { prisma } = req
        const codeRoom = await prisma.room.findMany({
            select: {
                code: true,
            },
        })
        const codeEgroup = await prisma.event_Hint.findMany({
            select: {
                text: true,
                code: {
                    select: {
                        name: true,
                    },
                },
            },
        })
        const Room_Codes = codeRoom.map((item) => item.code)

        const code_Egroup = codeEgroup.map((item) => ({ location: item.text, code: item.code.name }))

        res.send({ rooms: Room_Codes, events: code_Egroup })
    } catch (err: any) {
        res.status(500).send(err)
    }
}

export default getCodes
