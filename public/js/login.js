const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let object = {};
    let formData = new FormData(loginForm);
    formData.forEach((value, key) => (object[key] = value));
    let json = JSON.stringify(object);
    
    fetch("/login", {
        headers: {
            "Content-Type": "application/json",
          },
        method:"post",
        body:json
    })
    .then(res=>res.json())
    .then(res=>{
        if(res["id"] == undefined){
            window.alert(res["es"]);
            return null;
        }
        sessionStorage.setItem("user_id",res["id"]);
        sessionStorage.setItem("username",res["username"]);
        fetch("/authorize",{
            headers: {
                "Content-Type": "application/json",
              },
            method:"post",
            body:json
        })
        .then(res=>res.json())
        .then(json=>{
            console.log("Token: " + json.token);
            sessionStorage.setItem("token",json.token);
            console.log(sessionStorage.getItem("token"));
            window.location.href = 'http://localhost:3000/html/chat.html';
            //window.location.href = "http://192.168.0.9:3000/html/chat.html"; //THIS IS THE DIRECTION THAT YOU SHOULD REDIRECT YOUR USERS TO
        })
        
    });
    
})