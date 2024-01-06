const dotenv = require("dotenv").config();
const { describe, it } = require('node:test');


describe("Login related tests", ()=>{
    it("Passing test", async ()=>{
        let body = {
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD
        }
    
        let response = await fetch("http://localhost:3000/login", {
            headers: {
                "Content-Type": "application/json",
              },
            method:"post",
            body:  JSON.stringify(body)
        })
    
        if(!response.ok){
            let err = new Error("Failed to fetch: ", response.status, response.statusText);
            console.log(err)
            throw err;
        } 
        else{
            const res = await response.json();
        }
    });

    it("Failling test (No password)", async ()=>{
        let body = {
            username: process.env.ADMIN_USERNAME,
        }
    
        let response = await fetch("http://localhost:3000/login", {
            headers: {
                "Content-Type": "application/json",
              },
            method:"post",
            body:  JSON.stringify(body)
        })
    
        if(response.ok){
            let err = new Error("Failed to fetch: ", response.status, response.statusText);
            console.log(err)
            throw err;
        } 
    });

    it("Failling test (No username)", async ()=>{
        let body = {
            password: process.env.ADMIN_PASSWORD,
        }
        
        let response = await fetch("http://localhost:3000/login", {
            headers: {
                "Content-Type": "application/json",
              },
            method:"post",
            body:  JSON.stringify(body)
        })
    
        if(response.ok){
            let err = new Error("Failed to fetch: ", response.status, response.statusText);
            console.log(err)
            throw err;
        } 

    });
    
    it("Failling test (Unexisting credentials)", async ()=>{
        let body = {
            username: "123123fafa1w3123123",
            password: "qweqweqwe"
        };
        
        let response = await fetch("http://localhost:3000/login", {
            headers: {
                "Content-Type": "application/json",
              },
            method:"post",
            body:  JSON.stringify(body)
        })
    
        if(response.ok){
            let err = new Error("Failed to fetch: ", response.status, response.statusText);
            console.log(err)
            throw err;
        } 

    });
})






