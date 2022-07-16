import { Request, Response } from "express";
import { eventHint } from "./getEventHints";

interface eventHintReq {
  id: string
}

// Gun ( BlueBox ) && Boss ( Sorrawit )

// ลบ event hint

const deleteEventhint = async (req: Request<any, any, eventHintReq>, res: Response<eventHint>) => {
  try {
    const { prisma } = req
    const result = await prisma.event_Hint.delete({
      where: {
        id: req.body.id
      }
    })
    res.send({ id: result.id, location: result.text })
  } catch (err: any) {
    res.send(err)
  }
}

export default deleteEventhint