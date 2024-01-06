const jwt = require("jsonwebtoken");

module.exports = function middleware (req,res,next){
    console.log("Tiene token?");
    console.log(req.headers["authorization"] ? "Si" : "No");
    if(typeof req.headers["authorization"] !== "undefined"){
      jwt.verify(req.headers["authorization"], process.env.SECRET, (err,authData)=>{
        console.log(authData)
        if(err){
          res.redirect("/html/login.html");
        }
        else{
            next();
        }
      });
    }
    else{
      res.redirect("/html/login.html");
    }
  };
