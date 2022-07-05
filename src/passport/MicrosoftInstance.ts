import { PrismaClient } from '@prisma/client'
import {Strategy as MicrosoftStrategy} from 'passport-microsoft'
import OAuth2Strategy from 'passport-oauth2'
import axios from 'axios'
const verfy:(prisma:PrismaClient)=>OAuth2Strategy.VerifyFunction = (prisma)=> 
async (accessToken:string, refreshToken:string, profile:any, done:OAuth2Strategy.VerifyCallback)=>{
    const pf = await axios.get(`https://graph.microsoft.com/beta/me/photos/432x432/$value`,{headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"image/jpg"},responseType:"arraybuffer"})
    try{
        const {data:{onPremisesSamAccountName}} = await axios.get(`https://graph.microsoft.com/v1.0/users/${profile.id}?$select=onPremisesSamAccountName`,{headers:{Authorization:`Bearer ${accessToken}`,"Content-Type":"application/json"}})
        const { _json} = profile
        if(!onPremisesSamAccountName || !(((onPremisesSamAccountName as string).startsWith("64") || (onPremisesSamAccountName as string).startsWith("65")) && _json.officeLocation === "Computer Science") || !onPremisesSamAccountName || !_json ){
           return new Error("You don't have permission to enter !")
        }
        let year = parseInt((onPremisesSamAccountName as string).substring(0,2))
        const user = await prisma.user.upsert({
            where: {
                id: _json.id
            },
            update:{
                name: _json.displayName,
                email: _json.mail,
                img: pf.data || null,
            },
            create:{
                id: _json.id,
                email: _json.mail,
                img: pf.data || null,
                year: year-66,
                name: _json.displayName,
            }
        })
       return done(null,user)
    }catch(err:any){
       return done(err)
    }
}




export default (prisma: PrismaClient)=> new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENTID || "",
    clientSecret: process.env.MICROSOFT_CLIENTSECRET || "",
    callbackURL: process.env.MICROSOFT_CALLBACKURL,
    scope: ['User.ReadBasic.All'],
    tokenURL: process.env.MICROSOFT_TOKENURL,
    authorizationURL: process.env.MICROSOFT_AUTHRIZATIONURL
},verfy(prisma) )