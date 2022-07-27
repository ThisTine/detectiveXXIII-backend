import { NextFunction, Request, Response } from "express"

const disableGame = (req: Request, res: Response, next: NextFunction) => {
    if (!req.gameConfig.isGameReady) return res.status(500).send("Game is not ready yet")
    return next()
}

export default disableGame
