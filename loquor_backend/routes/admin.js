const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const adminAuth = require("../authAdminMiddeware");

const currentDirectory = __dirname;
const parentDirectory = path.resolve(currentDirectory, "..");
const {verifyPasswordAndRole} = require("../db_connections.js");
const router = express.Router();

router.get("/",(req,res)=>{
    res.sendFile(parentDirectory + "/public/html/loginAdmin.html");
});

router.post("/", async (req,res)=>{    //TENGO QUE DESCUBRIR PORQUE EL BODY ESTÁ VACIO
  const {username, password} = req.body;
  console.log("intentando")
  console.log(req.body);
  try{
      if(password === '' || username === ''){
          throw {
              "en":"You forgot to pass data",
              "es":"Olvidaste pasar informacion"
          }
      }
      const result = await verifyPasswordAndRole(username,password);
      console.log("Resultado de verificacion");
      console.log(result);
      res.json(result);
  }
  catch(err){
      res.json(err);
  }
});

router.use(adminAuth);

module.exports = router;