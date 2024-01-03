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
const {getUserId, getUsersId, getUsername} = require("./chat_db_connections.js");
const {createSession, changeConnectionState, getUserIdFromSession} = require("./db_connections.js");
const { Console } = require("console");
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

    socket.on("createSession", async (uid)=>{
        console.log("ID DE LA SESION");
        console.log(socket.id);
        await createSession(uid, socket.id);
        let res = await changeConnectionState(uid, 1);


        let uu = await getUsername(uid);
        console.log(uu);
        io.emit("changeConnectionState",uu.username);
    })

    socket.on("disconnect", async ()=>{
        console.log("Me desconecté!");
        try {
            let uid = await getUserIdFromSession(socket.id);
            console.log("Usuario por session id");
            console.log(uid);
            console.log(socket.id);
            console.log("Usuario por session id");
            let res = await changeConnectionState(uid, 0);
            console.log("La conexión se ha cambiado con éxito:", res);
            let uu = await getUsername(uid);
            console.log("Se desconectó: " + uu.username);
            io.emit("changeConnectionState",uu.username);
        } catch (error) {
            // Manejar el error aquí
            console.error("Error al cambiar el estado de conexión:", error);
        }
    })


    socket.on("joinRooms", async (uid)=>{
        let ouidsA = await getUsersId();
        for(let ouidA of ouidsA){
            //ALWAYS BIGGER NUMBER FIRST
            if(uid > ouidA.id){
                socket.join(uid+"_"+ouidA.id);
            }
            else{
                socket.join(ouidA.id+"_"+uid);
            }
            console.log("ok");
        }
    })

    socket.on("newMsgV2", async (uid,ouu)=>{
        let ouidA = await getUserId(ouu)
        .catch(err=>{
            throw err;
        });
        
        let uu = await getUsername(uid);
        console.log(uu);

        if(uid > ouidA.id){
            io.to(uid+"_"+ouidA.id).emit("alert",uu.username);
        }
        else{
            io.to(ouidA.id+"_"+uid).emit("alert",uu.username);
        }
        
    });

    socket.on("seen", async (uid,ouu, time)=>{
        let ouidA = await getUserId(ouu)
        .catch(err=>{
            throw err;
        });

        if(uid > ouidA.id){
            io.to(uid+"_"+ouidA.id).emit("seen",ouu,time);
        }
        else{
            io.to(ouidA.id+"_"+uid).emit("seen",ouu,time);
        }
        
    });


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