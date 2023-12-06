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
    console.log("------");
    console.log(req.body);
    console.log("------");
    console.log(username + " : " + password);
    let resawa = await verifyPassword("prueba","prueba");
    console.log(resawa)
    res.end(JSON.stringify(resawa));
    //res.redirect("/authorize");
})

module.exports = router;