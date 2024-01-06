//REQUIRES
const express = require("express");
const { getMessages,sendMessage,getLastMessage, getNotSeenMessages, setMessagesToSeen} = require("../chat_db_connections");
//CONSTANTS
const router = express.Router();

router.post("/", async (req,res)=>{
    try{
        let response = await sendMessage(req.body.user_id, req.body.recipient_username, req.body.input)
        console.log(response);
        res.send({
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
});

router.get("/notseen", async (req,res)=>{
    const { user_id, recipient_username} = req.query;
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    try{
        console.log("ESTOY ACA");
        const message = await getNotSeenMessages(user_id,recipient_username);
        res.json(message);
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.put("/seen", async (req,res)=>{
    const { user_id, recipient_username} = req.query;
    let date = new Date();
    const formatedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    console.log(date);
    try{
        
        const message = await setMessagesToSeen(user_id,recipient_username,formatedDate);
        res.json(message);
        //res.json(date);
    }
    catch(err){
        res.status(400).send(err);
    }
})

module.exports = router;