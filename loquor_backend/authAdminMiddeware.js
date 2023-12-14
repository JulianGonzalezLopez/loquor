const jwt = require("jsonwebtoken");

module.exports = function middleware (req,res,next){
    console.log("Tiene token?");
    console.log(req.headers["authorization"] ? "Si" : "No");
    if(typeof req.headers["authorization"] !== "undefined"){
        console.log("iok");
      jwt.verify(req.headers["authorization"], process.env.ADMIN_SECRET, (err,authData)=>{
        console.log(authData)
        if(err){
          res.redirect("/html/loginAdmin.html");
        }
        else{
            console.log("pasa nomas");
            next();
        }
      });
    }
    else{
      res.redirect("/html/loginAdmin.html");
    }
  };