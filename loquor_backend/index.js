//REQUIRES
const express = require("express"); //
const logger = require("morgan"); //Traza de requests
const path = require("path"); //Resolucion de paths
const socket = require("socket.io"); //
const http = require("http");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
//INTERNAL REQUIRES
const adminPanel = require("./routes/adminPanel.js");
const chat = require("./routes/chat.js");
const login = require("./routes/login.js");
const authorize = require("./routes/authorize");
const authMiddleware = require("./authMiddleware");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes free of authorization methods
app.use("/authorize", authorize);
app.use("/login", login);

app.use(authMiddleware);

//Auth required routes
app.use("/adminPanel", adminPanel);
app.use("/chat",chat);

//home
app.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/loquor_frontend/index.html")
})

//LISTENER
server.listen(port,()=>{
    console.log("Esperando respuestas");
})



/** 
 * Ideas a agregar
 * 1. Usuarios 
 * 2. Pasar el contenido de index.html a chat.html
 * 3. Crear servicios que se encarguen de: autenticación, enviado, recepción y recepcion al abrir el programa
*/