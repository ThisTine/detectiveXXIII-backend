import { PrismaClient } from "@prisma/client"
import { Strategy as MicrosoftStrategy } from "passport-microsoft"
import OAuth2Strategy from "passport-oauth2"
import axios from "axios"
import { nanoid } from "nanoid"
const verfy: (prisma: PrismaClient) => OAuth2Strategy.VerifyFunction =
    (prisma) => async (accessToken: string, refreshToken: string, profile: any, done: OAuth2Strategy.VerifyCallback) => {
        let pf: any
        try {
            pf = await axios.get(`https://graph.microsoft.com/beta/me/photos/432x432/$value`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "image/jpg",
                },
                responseType: "arraybuffer",
            })
        } catch (err) {
            pf = {}
        }
        try {
            const {
                data: { onPremisesSamAccountName },
            } = await axios.get(`https://graph.microsoft.com/v1.0/users/${profile.id}?$select=onPremisesSamAccountName`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            })
            const { _json } = profile
            if (
                !onPremisesSamAccountName ||
                !(
                    ((onPremisesSamAccountName as string).startsWith("62") ||
                        (onPremisesSamAccountName as string).startsWith("63") ||
                        (onPremisesSamAccountName as string).startsWith("64") ||
                        (onPremisesSamAccountName as string).startsWith("65")) &&
                    _json.officeLocation === "Computer Science"
                ) ||
                !onPremisesSamAccountName ||
                !_json
            ) {
                throw new Error("You don't have permission to enter !")
            }
            let year = parseInt((onPremisesSamAccountName as string).substring(0, 2))
            const eduyear = 66 - year
            const user = await prisma.user.upsert({
                where: {
                    id: _json.id,
                },
                update: {
                    name: _json.displayName,
                    email: _json.mail,
                    img: pf.data || null,
                },
                create: {
                    id: _json.id,
                    email: _json.mail,
                    img: pf.data || null,
                    year: eduyear,
                    name: _json.displayName,
                    isPlayable: eduyear === 1 || eduyear === 2,
                    ...(eduyear === 2 && {
                        room: { create: { code: nanoid(7) } },
                    }),
                },
                include: { room: true },
            })
            if (!user.room && user.year === 2) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { room: { create: { code: nanoid(7) } } },
                })
            }
            return done(null, {
                id: user.id,
                email: user.email,
                name: user.name,
                year: user.year,
                isAdmin: user.isAdmin,
                isPlayable: user.isPlayable,
            })
        } catch (err: any) {
            return done(err)
        }
    }

export default (prisma: PrismaClient) =>
    new MicrosoftStrategy(
        {
            clientID: process.env.MICROSOFT_CLIENTID || "",
            clientSecret: process.env.MICROSOFT_CLIENTSECRET || "",
            callbackURL: process.env.MICROSOFT_CALLBACKURL,
            scope: ["User.ReadBasic.All"],
            tokenURL: process.env.MICROSOFT_TOKENURL,
            authorizationURL: process.env.MICROSOFT_AUTHRIZATIONURL,
        },
        verfy(prisma)
    )
