const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
    try{
        jwt.sign({user:req.body.username}, process.env.SECRET, {expiresIn:"1h"} ,(err,token)=>{
            if(err){
                throw err;
            }
            res.json({token});
        });
    }
    catch(err){
        res.status(400).send(err);
    };
});

module.exports = router;