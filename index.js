const express = require("express");
const UserRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv").config();
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");






const port=process.env.PORT;
app.use(express.json());    
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use('/',UserRoutes);

var client = {}
io.on("connection",(socket)=>{
    socket.on("signin",async (id)=>{
        client[id] = socket;
        console.log(Object.keys(client).length);
    })
    socket.on("message",(msg)=>{
        console.log(msg);
        client["123456789"].emit("message",msg)
    })
    socket.emit("send","hi from server saini");


    socket.on("disconnect",()=>{
        console.log(Object.keys(client).length);
    })
})




http.listen(port,()=>{
    console.log("Running server on 3000 port");
})


