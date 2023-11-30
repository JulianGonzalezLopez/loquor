//REQUIRES
const express = require("express"); //
const logger = require("morgan"); //Traza de requests
const path = require("path"); //Resolucion de paths
const socket = require("socket.io"); //
const http = require("http");


//CONSTANTS
const port = process.env.PORT ?? 3000;
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, "..");

//SERVER CONFIG
const app = express(); //Takes care of routing, requests and middlewares
const server = http.createServer(app); //Real server
const io = new socket.Server(server, {
    connectionStateRecovery:{}
}); //Takes care of chat connections

//Subscribed events of the server using webSockets
io.on("connection",(socket)=>{
    //console.log("A connection has been made");

    socket.on("chat message",(msg)=>{
        console.log("Msg: " + msg); //Displays de msg in the console
        io.emit("chat message", msg); //Broadcasts the msg to all users
    })
    
})

//APP'S BODY
app.use(logger("dev"));
app.use("/images", express.static(__dirname + "/public"));

app.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/loquor_frontend/index.html")
})


//LISTENER
server.listen(port,()=>{
    console.log("Esperando respuestas");
})