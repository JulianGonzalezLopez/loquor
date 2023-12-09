//REQUIRES
const express = require("express");
//CONSTANTS
const router = express.Router();
const {verifyPassword} = require("../db_connections.js");

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