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


    socket.on("joinRooms", async (uid)=>{
        let ouidsA = await getUsersId();
        for(let ouidA of ouidsA){
            //ALWAYS BIGGER NUMBER FIRST
            if(uid > ouidA.id){
                socket.join(uid+"_"+ouidA.id);
                io.to(uid+"_"+ouidA.id).emit("connected",{
                    "message":`You have succesfully connected to ${uid}_${ouidA.id}`,
                    "room": `${uid}_${ouidA.id}`
                });
            }
            else{
                socket.join(ouidA.id+"_"+uid);
                io.to(ouidA.id+"_"+uid).emit("connected",{
                    "message":`You have succesfully connected to ${ouidA.id}_${uid}`,
                    "room": `${ouidA.id}_${uid}`
                });
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


    socket.on("joinRoom", async (uid,ouu)=>{
        
        let ouidA = await getUserId(ouu)
        .catch(err=>{
            throw err;
        })

        let ouid = ouidA.id;
        
        console.log("ZZZZZZZZZZZZZZZZZZZZZ");
        console.log(uid);
        console.log(ouid);
        console.log(ouu);
        console.log("ZZZZZZZZZZZZZZZZZZZZZ");
        socket.join(uid+"_"+ouid);
        socket.join(ouid+"_"+uid);

        io.to(uid+"_"+ouid).emit("connected",{
            "message":`You have succesfully connected to ${uid}_${ouid}`,
            "room": `${uid}_${ouid}`

        });
        io.to(ouid+"_"+uid).emit("connected",{
            "message":`You have succesfully connected to ${ouid}_${uid}`,
            "room": `${ouid}_${uid}`
        });
    })


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