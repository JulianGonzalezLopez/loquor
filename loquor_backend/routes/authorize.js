const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    jwt.sign({user:req.body.username}, process.env.SECRET, {expiresIn:"1h"} ,(err,token)=>{
        res.json({token});
    })
});

module.exports = router;