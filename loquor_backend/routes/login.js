//REQUIRES
const express = require("express");
const path = require("path");
//CONSTANTS
const router = express.Router();
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, "../..");
const {verifyPassword} = require("../db_connections.js");

router.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/loquor_frontend/login.html")
})

router.post("/", async (req,res)=>{    //TENGO QUE DESCUBRIR PORQUE EL BODY ESTÁ VACIO
    const {username, password} = req.body;
    const correctPassword = await verifyPassword(username,password);
    console.log("Resultado de verificacion");
    console.log(correctPassword);
    if(correctPassword){
        console.log("Positivo");
        res.json(correctPassword);
    }
    res.end();
})

module.exports = router;