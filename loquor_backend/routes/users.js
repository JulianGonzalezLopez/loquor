const express = require("express");

const adminAuth = require("../authAdminMiddeware.js");
const {createUser, modifyUser, deleteUser, getUsers} = require("../db_connections.js");

const router = express.Router();

//Tengo que ver como voy a cubrir este endpoint
router.get("/", async (req,res)=>{
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

router.post("/", async (req,res)=>{
    console.log(req.body);
    const { username, password, is_admin } = req.body;
    try{
        let response = await createUser(username,password,is_admin);
        res.json(response);
    }
    catch(error){
        console.error("FALLÓ");
    }
});

router.put("/", async (req,res)=>{ 
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

router.delete("/", async (req,res)=>{ 
    console.log("que esta pasando");
    console.log(req.body);
    const { username } = req.body;
    try{
        console.log("ESTO ES UN PUTO => " + username);
        let response = await deleteUser(username);
        res.json(response);
    }
    catch(error){
        console.error("FALLÓ");
    }
});

module.exports = router;