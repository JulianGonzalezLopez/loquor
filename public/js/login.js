const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let object = {};
    let formData = new FormData(loginForm);
    formData.forEach((value, key) => (object[key] = value));
    let json = JSON.stringify(object);
    let myIP;
    let serverIP;
    fetch("/login", {
        headers: {
            "Content-Type": "application/json",
          },
        method:"post",
        body:json
    })
    .then(res=>res.json())
    .then(res=>{
        myIP = res.clientIP;
        serverIP = res.serverIP;
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
            console.log(myIP == "::1");
            if(myIP == "::1"){
                window.location.href = 'http://localhost:3000/html/chat.html';
            }
            else{
                window.location.href = `http://${serverIP}:3000/html/chat.html`; 
            }
        });
    });
})