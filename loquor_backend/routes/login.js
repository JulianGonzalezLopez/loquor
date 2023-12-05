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

router.post("/", async (req,res)=>{
    const {username, password} = req.body;
    await verifyPassword(username,password);
    res.redirect("/chat");
})

module.exports = router;