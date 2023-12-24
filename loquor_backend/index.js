//REQUIRES
const express = require("express"); //
const logger = require("morgan"); //Traza de requests
const path = require("path"); //Resolucion de paths
const socket = require("socket.io"); //
const http = require("http");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
//INTERNAL REQUIRES
const users = require("./routes/users.js");
const chat = require("./routes/chat.js");
const login = require("./routes/login.js");
const authorize = require("./routes/authorize");
const authMiddleware = require("./authMiddleware");
const admin = require("./routes/admin");
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

    // socket.on("chat message",(msg)=>{
    //     console.log("Msg: " + msg); //Displays de msg in the console
    //     io.emit("chat message", msg); //Broadcasts the msg to all users
    // })
    socket.on("newMsg",()=>{
        io.emit("newMsg");
    })

})

//APP'S BODY
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/users", users); //This has admin related authorization methods

//Routes free of authorization methods
app.use("/authorize", authorize);
app.use("/admin",admin);
app.use("/login", login);

app.use(authMiddleware); //User auth middleware

//User auth requires routes
app.use("/chat",chat);

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