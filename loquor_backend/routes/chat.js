//REQUIRES
const express = require("express");
const path = require("path");
//CONSTANTS
const router = express.Router();
const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, "../..");

router.get("/",(req,res)=>{
    console.log("REQ BODY DE CHAT");
    console.log(req.body);
    res.sendFile(parentDirectory + "/loquor_frontend/chat.html")

})



module.exports = router;