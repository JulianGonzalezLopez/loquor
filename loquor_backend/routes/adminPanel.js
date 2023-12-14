const express = require("express");

const adminAuth = require("../authAdminMiddeware");
const {createUser, modifyUser, deleteUser, getUsers} = require("../db_connections.js");

const router = express.Router();

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
});

router.use(adminAuth);

router.post("/users", async (req,res)=>{
    console.log(req.body);
    const { username, password, is_admin } = req.body;
    try{
        await createUser(username,password,is_admin);
    }
    catch(error){
        console.error("FALLÓ");
    }
    res.redirect("/html/adminPanel.html");
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