const dotenv = require("dotenv").config();
const { describe, it } = require('node:test');
const jwt = require("jsonwebtoken");

describe("Chatting related tests", ()=>{

    it("Passing test (Auth + Msg sent)", async ()=>{

        let tk;
        
            jwt.sign({user:process.env.ADMIN_USERNAME}, process.env.SECRET, {expiresIn:"1h"} , async (err,token)=>{
                if(err){
                    throw err;
                }

                let body = {
                    user_id: 1,
                    recipient_username: process.env.ADMIN_USERNAME,
                    input: "Test message 2"
                };

                let response = await fetch("http://localhost:3000/chat", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    method: "post",
                    body: JSON.stringify(body)
                });

                if(!response.ok){
                    let err = new Error("Failed to send test message: ", response.status, response.statusText);
                    console.log(err)
                    throw err;
                }
            });
    });

    it("Failling test (Msg sent without auth)", async ()=>{
        try{
            
            let body = {
                user_id: 1,
                recipient_username: process.env.ADMIN_USERNAME,
                input: "This message should not be sent"
            };

            let response = await fetch("http://localhost:3000/chat", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                body: JSON.stringify(body)
            });

            if(response.ok){
                console.log(response.ok);
                let err = new Error("Failed to send test message: ", response.ok);
                console.error(err);
                throw err;
            }

        }
        catch(err){
            throw err;
        };

        
    });

})