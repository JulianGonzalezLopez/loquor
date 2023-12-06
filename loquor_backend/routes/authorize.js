const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    console.log("ACA");
    console.log(req.body);
    console.log("ACA");
    jwt.sign({user:req.body.username}, process.env.SECRET, {expiresIn:"1h"} ,(err,token)=>{
        res.json({token})
    })
});

module.exports = router;