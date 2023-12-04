const express = require("express");
const path = require("path");
const {createUser, modifyUser} = require("../db_connections.js");

const router = express.Router();
const currentDirectory = __dirname;

let parentDirectory = path.resolve(currentDirectory, "../..");

router.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/loquor_frontend/adminPanel.html")
})

router.post("/users", async (req,res)=>{
    console.log(req.body);
    const { username, password } = req.body;
    try{
        await createUser(username,password);
    }
    catch(error){
        console.error("FALLÓ");
    }
    res.redirect("/adminPanel");
    res.end();
});

router.put("/users", async (req,res)=>{ 
    console.log(req.body);
    const { username, password } = req.body;
    try{
        await modifyUser(username,password);
    }
    catch(error){
        console.error("FALLÓ");
    }
    res.redirect("/adminPanel");
    res.end();
});

module.exports = router;