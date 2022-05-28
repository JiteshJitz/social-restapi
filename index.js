const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgon = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")

dotenv.config();

mongoose.connect("mongodb+srv://Jiteshru:root123@project1.tphrwu6.mongodb.net/social?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true},()=>{
    console.log("connected to mongodb")
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgon("common"));

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)

app.listen(8800,()=>{
    console.log("Backend server is running!")
});