import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js"
const app = express()

app.use(cors());
app.use(express.json())


app.use("/api/user", userRouter)

app.listen(8000,()=>{
    console.log("port running on 8000")
})