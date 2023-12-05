const express = require("express");
const path = require("path");
const {createUser, modifyUser, deleteUser, getUsers} = require("../db_connections.js");

const router = express.Router();
const currentDirectory = __dirname;

let parentDirectory = path.resolve(currentDirectory, "../..");

router.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/loquor_frontend/adminPanel.html")
})

router.get("/users", async (req,res)=>{
    try{
        console.log("ok");
        let users = await getUsers();
        console.log(users);
        res.json(users);
    }
    catch(error){
        console.error("FALLÓ");
        res.end();
    }
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
});

router.put("/users", async (req,res)=>{ 
    console.log(req.body);
    const { oldusername, username, password } = req.body;
    try{
        console.log("ESTO ES UN PUTO");
        await modifyUser(oldusername,username,password);
    }
    catch(error){
        console.error("FALLÓ");
    }
    res.redirect("/");
});

router.delete("/users", async (req,res)=>{ 
    console.log(req.body);
    const { username } = req.body;
    try{
        console.log("ESTO ES UN PUTO => " + username);
        await deleteUser(username);
    }
    catch(error){
        console.error("FALLÓ");
    }
    res.redirect("/");
});

module.exports = router;