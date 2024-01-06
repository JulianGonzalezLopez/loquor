//REQUIRES
const express = require("express");
const path = require("path");
//CONSTANTS
const router = express.Router();
const {verifyPassword} = require("../db_connections.js");
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, "..");

router.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/public/html/login.html");
});

router.use((req,res,next)=>{
    const ip = req.socket.remoteAddress;
    req.clientIP = ip;
    req.serverIP = process.env.SERVER_IP;
    console.log(ip);
    next();
});

router.post("/", async (req,res)=>{    //TENGO QUE DESCUBRIR PORQUE EL BODY ESTÁ VACIO
    const {username, password} = req.body;
    try{
        if(password === '' || username === ''){
            throw {
                "en":"You forgot to pass data",
                "es":"Olvidaste pasar informacion"
            }
        }
        const result = await verifyPassword(username,password);
        console.log("Resultado de verificacion");
        result.clientIP = req.clientIP;
        result.serverIP = req.serverIP;
        res.json(result);
    }
    catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;