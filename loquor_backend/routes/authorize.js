const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    console.log("ACA");
    console.log(req.body);
    console.log("ACA");
    jwt.sign({user:req.body.username}, process.env.SECRET, {expiresIn:"1h"} ,(err,token)=>{
        console.log("SECRETO: " + process.env.SECRET);
        console.log("Token: " + token);
        res.json({token});
    })
});

module.exports = router;