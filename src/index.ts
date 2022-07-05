import express from 'express'
import { PrismaClient} from '@prisma/client'
import publicRouter from './router/api/router'
import adminRouter from './router/admin/router'
import passport from 'passport'
import MicrosoftInstance from './passport/MicrosoftInstance'
import userRouter from './router/user/userRouter'
import session from 'express-session'
import authRouter from './router/auth/authRouter'

const app = express()
const prisma = new PrismaClient()
declare global{
    namespace Express{
        interface Request{
            prisma: PrismaClient
        }
    }
}

passport.use(MicrosoftInstance(prisma))

app.use(session({
    secret:"test",    
    resave: false,
    saveUninitialized: false,
    cookie:{domain:"localhost"}
}))


app.use(passport.initialize())
app.use(passport.session())



passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user:any, done) {
    done(null, user);
  });

app.use((req,res,next)=>{
    req.prisma = prisma
    next()
})


app.use("/",publicRouter)

app.use("/auth",authRouter)

app.use("/admin",adminRouter)

app.use("/user",userRouter)


app.listen(8000,()=>{
    console.log("running on 8000")
})