//REQUIRES
const express = require("express");
const {getMessages,sendMessage} = require("../chat_db_connections");
//CONSTANTS
const router = express.Router();

router.post("/", async (req,res)=>{
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    await sendMessage(req.body.user_id, req.body.recipient_username, req.body.input);
    res.end();

});

router.get("/", async (req,res)=>{
    const { user_id, recipient_username} = req.query;
    console.log("QUERY");
    console.log(req.query);
    console.log("QUERY");
    const messages = await getMessages(user_id,recipient_username);
    console.log("mensajes obtenidos");
    //console.log(messages);
    res.json(messages);
})

module.exports = router;