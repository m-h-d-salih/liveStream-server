import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors'
import { roomHandler } from './roomHandler';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandling';
import adminRouter from './routes/adminRoutes';
import userRouter from "./routes/userRoutes"

dotenv.config();
const port=process.env.PORT || 8080;
const DB_URL=process.env.MONGO_URI as string;
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
console.log(`connected to db`)
}
const app=express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})

io.on('connection',(socket)=>{
    console.log(`user is connected`);
 roomHandler(socket);

    socket.on('disconnect',()=>{
        console.log(`user is disconneted`)
    })  
   
} )



app.use(
    errorHandler as (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
      ) => void
    );
app.set("io", io); 
server.listen(port,()=>{
    console.log(`listening on ${port}`)
})
export { server, app, express, io };
