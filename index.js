const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgon = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postsRoute = require("./routes/posts")

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,useUnifiedTopology: true},()=>{
    console.log("connected to mongodb")
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgon("common"));

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postsRoute)

app.listen(8800,()=>{
    console.log("Backend server is running!")
});