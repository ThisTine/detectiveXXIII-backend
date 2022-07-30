import { NextFunction, Request, Response } from "express"
import { Resvg } from "@resvg/resvg-js"
import { promises } from "fs"
import { join, resolve } from "path"
import { getAllhints } from "./gethints"

interface getHintImgBody {
    id: 1 | 2
}

const getHintImg = async (req: Request<any, any, getHintImgBody, getHintImgBody>, res: Response, next: NextFunction) => {
    try {
        const userId = req.query.id == 2 ? 2 : 1
        const hints = await getAllhints(req as any)
        const hintsList = hints.hints.filter((item) => item.userId === userId).map((item) => ({ hint: item.hint, isShow: item.isShow }))
        if (hintsList.length !== 10) {
            return res.status(500).send("Internal server Error")
        }
        let svgImage = await promises.readFile(join(__dirname, "../../../etc/hintimg/img.svg"))
        let svgString = svgImage.toString()
        // let svgImage = svgHeader
        for (let i = 0; i < 10; i++) {
            svgString = svgString.replaceAll(`TEXT${i}`, hintsList[i].isShow ? hintsList[i].hint : "*********")
        }
        // svgImage += svgFooter
        const svg = new Resvg(svgString, {
            font: { fontFiles: [resolve(__dirname, "../../../etc/hintimg/fonts/Kanit-Regular.ttf")], defaultFontFamily: "Kanit" },
        })
        const pngData = svg.render()
        const pngBuffer = pngData.asPng()
        res.end(pngBuffer)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Error")
    }
}

export default getHintImg
