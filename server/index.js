import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
// import dotenv from "dotenv"
import morgan from "morgan"
import multer from "multer"
import path  from "path"
import helmet from "helmet"
import { fileURLToPath } from "url";
import { database } from "./Database/database.js";
import authRoute  from "./Route/Router.js"
import { Register } from "./Controller/auth.js";
import userRouter from "./Route/users.js"
// import {CreatePost} from "./Controller/posts.js"
import postRouter from "./Route/postRoutes.js"
import ConversationRoute from "./Messenger/Route/Conversation.js"
import MessagesRoute from "./Messenger/Route/Message.js"
// import {verifyToken} from "./middleware/auth.js"

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
// dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname,"public/assets")));

import * as dotenv from 'dotenv'
dotenv.config();
/* FILE STORAGE */
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"public/assets")
//     },
//     filename:function(req,file,cb){
//        cb(null,file.originalname)
//     }
// });
// const upload = multer({storage})

// /* ROUTE WITH FILES */
// app.post("/auth/register",upload.single("picture"),Register);
// app.post("/posts",verifyToken, upload.single("picture"),CreatePost)

/* ROUTES */
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/conversation",ConversationRoute)
app.use("/api/v1/messages",MessagesRoute)

/* CONNECT DATABSE */
database()

/* CREATING SERVER */ 
const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} and ${PORT} port number `);
})