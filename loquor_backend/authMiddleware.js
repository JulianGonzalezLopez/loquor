const jwt = require("jsonwebtoken");

module.exports = function middleware (req,res,next){
    console.log("RUTA: " + req.url);
    console.log("Tiene token?");
    console.log(req.headers["authorization"] ? "Si" : "No");
    if(typeof req.headers["authorization"] !== "undefined"){
      console.log("paso2");
      jwt.verify(req.headers["authorization"], process.env.SECRET, (err,authData)=>{
        if(err){
          res.redirect("/login");
        }
        else{
            console.log("paso3");
            next();
        }
      });
    }
    else{
      res.redirect("/login");
    }
  };