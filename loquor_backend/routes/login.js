//REQUIRES
const express = require("express");
//CONSTANTS
const router = express.Router();
const {verifyPassword} = require("../db_connections.js");

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
        res.json(result);
    }
    catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;