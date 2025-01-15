import express from "express";
import cookieParser from "cookie-parser"
import postRouter from "./routes/post.route.js"
import authRouter from "./routes/auth.route.js"
import testRouter from "./routes/test.route.js"
import userRouter from "./routes/user.route.js"

// npm i cors
import cors from "cors";




const app = express();


// WE USED WHEN WE USE THE VARIABLE OF THE REQUEST
app.use(express.json())
app.use(cookieParser());

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))

app.use(cors({
    origin: process.env.CLIENT_URL , 
    credentials: true 
  }));

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/users", userRouter);

app.listen(8800, () => {
    console.log("server is running!");
})