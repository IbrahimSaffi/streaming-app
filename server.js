const express = require("express")
const cors = require("cors")
// const morgan = require("morgan")
const { ExpressPeerServer } = require('peer');
const {Server} = require("socket.io")

const app = express()

//Initializing express/node server
const httpServer = app.listen(process.env.PORT || 8000);

//Middleware use
app.use(cors());
// app.use(morgan)
app.use(express.static("public"))
app.set("view engine","ejs")

//Routing
app.get("/",(req,res)=>{
    res.render("index")
})
//Initallizing peer server
const peerServer = new ExpressPeerServer(httpServer, { debug : true })
peerServer.on("connection",(client)=>{
   console.log(`${client.id} connected`)
})
app.use("/peerjs",peerServer)
//Initializing socket server
const io =new Server(httpServer,{cors:{origin:"*"}})
//Upon socket connecting to server
io.on("connection",(socket)=>{
    console.log(`new connection to socket ${socket.id}`)
    //Upon recieving "new-connection" event
    socket.on("new-connection",(peerId)=>{
        console.log("new connection request")
        //sending "user-add" event to frontEnd
        socket.emit("user-add",peerId)
    })
})