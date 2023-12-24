//REQUIRES
const express = require("express");
const {getMessages,sendMessage,getLastMessage} = require("../chat_db_connections");
//CONSTANTS
const router = express.Router();

router.post("/", async (req,res)=>{
    try{
        await sendMessage(req.body.user_id, req.body.recipient_username, req.body.input);
        res.status(200).send({
            "en":"Message sent",
            "es":"Mensaje enviado"
        });
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get("/", async (req,res)=>{
    const { user_id, recipient_username} = req.query;
    try{
        const messages = await getMessages(user_id,recipient_username);
        res.json(messages);
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get("/last", async (req,res)=>{
    const { user_id, recipient_username} = req.query;
    try{
        const message = await getLastMessage(user_id,recipient_username);
        res.json(message);
    }
    catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;