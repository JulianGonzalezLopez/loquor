//REQUIRES
const express = require("express");
//CONSTANTS
const router = express.Router();
const {verifyPassword} = require("../db_connections.js");

router.post("/", async (req,res)=>{    //TENGO QUE DESCUBRIR PORQUE EL BODY ESTÁ VACIO
    const {username, password} = req.body;
    console.log(req.body);
    try{
        if(password === '' || username === ''){
            throw {
                "en":"You forgot to pass data",
                "es":"Olvidaste pasar informacion"
            }
        }
        const result = await verifyPassword(username,password);
        console.log("Resultado de verificacion");
        console.log(result);
        res.json(result);
    }
    catch(err){
        res.json(err);
    }
})

module.exports = router;