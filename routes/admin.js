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
      if(result.is_admin == true){
        res.status(200).send(result);
      }
      else{
        res.status(400).send(result);
      }
  }
  catch(err){
      res.status(400).json(err);
  }
});

router.use(adminAuth);

module.exports = router;