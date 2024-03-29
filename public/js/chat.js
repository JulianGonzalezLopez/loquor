const socket = io(); //We don't require to specify the url due to the fact that it realices that the server has 1 active
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const users = document.getElementById("users");
const currentChat = document.getElementById("currentChat");
const userIdInput = document.getElementById("user_id");
const recipientUsernameInput = document.getElementById("recipient_username");
const chatSection = document.getElementById("chat-section");
let currentRoom;

window.addEventListener("load", () => {
    userIdInput.value = sessionStorage.getItem("user_id");
    socket.emit("joinRooms", sessionStorage.getItem("user_id"));
    socket.emit("createSession", sessionStorage.getItem("user_id"));
    sessionStorage.setItem("currentChat", "");
    fetch("/users", {
        method: "get",
        headers: {
            "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
        }
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.status}`);
            }
            return res.json();
        })
        .then((resJSON) => {
            
            users.innerHTML = "";
            resJSON.forEach((user) => {
                const listItem = document.createElement("button");
                listItem.textContent = user.username;
                console.log(user);
                if(user.connected == 1){
                    listItem.classList.add("button-chat");
                }
                else{
                    listItem.classList.add("button-chat");
                    listItem.classList.add("disconnected");
                }
                
                let spanNotSeen = document.createElement("span");
                const url = "/chat/notseen?" + new URLSearchParams({
                    user_id: sessionStorage.getItem("user_id"),
                    recipient_username: user.username
                });

                fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
                    }
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((resJSON) => {
                        let notseen = 0;
                        for (let resmsg of resJSON) {
                            if (resmsg.creator_id != sessionStorage.getItem("user_id")) {
                                notseen++;
                            }
                        }
                        spanNotSeen.textContent = notseen > 0 ? " " + notseen : " 0";
                        listItem.appendChild(spanNotSeen);
                        console.log("Cantidad de mensajes no vistos: " + notseen);
                    });



                listItem.addEventListener("click", (e) => {
                    let aux = listItem.textContent.split(" ");
                    listItem.textContent = aux[0] + " 0";
                    chatSection.classList.add("visible");
                    messages.innerHTML = "";
                    spanNotSeen.textContent = " 0";
                    sessionStorage.setItem("currentChat", user.username);
                    socket.emit("seen", sessionStorage.getItem("user_id"), sessionStorage.getItem("currentChat"), new Date());
                    currentChat.innerText = user.username;
                    recipientUsernameInput.value = user.username;
                    let url = "/chat?" + new URLSearchParams({
                        user_id: sessionStorage.getItem("user_id"),
                        recipient_username: user.username
                    });
                    fetch(url, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
                        }
                    })
                        .then(res => res.json())
                        .then(resJSON => {
                            const msgContainer = document.createDocumentFragment();
                            for (msg of resJSON) {
                                let newMsg = document.createElement("li");
                                newMsg.setAttribute("data-idMsg", msg.id);
                                newMsg.classList.add("formato-msg");
                                let newMsgDate = document.createElement("small");
                                newMsgDate.classList.add("formato-msg-date");
                                const fecha = new Date(msg.date);
                                const año = fecha.getFullYear();
                                const mes = fecha.getMonth() + 1; // Los meses son indexados desde 0
                                const dia = fecha.getDate();
                                const horas = fecha.getHours();
                                const minutos = fecha.getMinutes();
                                const segundos = fecha.getSeconds();
                                newMsgDate.textContent = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')} ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

                                if (msg.creator_id == sessionStorage.getItem("user_id")) {
                                    newMsg.classList.add("msg");
                                }
                                else {
                                    newMsg.classList.add("foreign-msg");
                                }
                                const msgContent = document.createElement("p");
                                msgContent.classList.add("formato-msg-texto")
                                msgContent.textContent = msg.body;
                                //newMsg.textContent = msg.body;
                                newMsg.appendChild(msgContent);
                                newMsg.appendChild(newMsgDate);
                                let tick = document.createElement("small");
                                msg.seen == "1" ? tick.textContent = "✓" : tick.textContent = "..."; tick.classList.add("formato-tick");
                                newMsg.appendChild(tick);


                                msgContainer.appendChild(newMsg);
                            }
                            if (resJSON[0] == undefined) {
                                sessionStorage.setItem("lastMsg", "");
                            }
                            else {
                                sessionStorage.setItem("lastMsg", resJSON[resJSON.length - 1].id);
                            }
                            messages.appendChild(msgContainer);
                        });
                    url = "/chat/seen?" + new URLSearchParams({
                        user_id: sessionStorage.getItem("user_id"),
                        recipient_username: user.username
                    });
                    fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
                        }
                    })
                        .then(res => res.json())


                    //socket.emit("joinRoom", sessionStorage.getItem("user_id"), user.username);

                });
                users.appendChild(listItem);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
})


form.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("seen", sessionStorage.getItem("user_id"), sessionStorage.getItem("currentChat"), new Date());
    let object = {};
    let formData = new FormData(form);
    formData.forEach((value, key) => (object[key] = value));
    let json = JSON.stringify(object);
    fetch("/chat", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
        },
        method: "post",
        body: json
    })
        .then((res) => {
            let aux = JSON.parse(json);
            socket.emit("newMsgV2", sessionStorage.getItem("user_id"), sessionStorage.getItem("currentChat"));
        })

    if (input.value) {
        input.value = "";
    };
});

socket.on("connected", (res) => {
    console.log(res);
})

socket.on("seen", (ouu, time) => {
        let messagesChildren = messages.children;
        for (msg of messagesChildren) {
            let timeMsg = msg.getElementsByClassName("formato-msg-date")[0];
            console.log("--------------");
            console.log(new Date(timeMsg.textContent));
            console.log(new Date(time));
            console.log(new Date(timeMsg.textContent) < new Date(time));
            console.log("--------------");
            if (new Date(timeMsg.textContent) < new Date(time)) {
                console.log(msg);
                let tickAux = msg.getElementsByClassName("formato-tick")[0];
                console.log(tickAux);
                tickAux.textContent = "✓";
                console.log(tickAux);
                console.log("Ok");
            }
            else{
                console.log("nono");
            }
        }
})

socket.on("changeConnectionState",(uuu)=>{
    console.log(uuu);
    let url = "/users/status?" + new URLSearchParams({
        username: uuu
    });
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
        }
    })
        .then(res => res.json())
        .then(resJSON => {
            console.log(resJSON);
            let chats = document.getElementsByClassName("button-chat");
            console.log(chats);
            for(let chat of chats){
                let split = chat.innerText.split(" ");
                console.log(split[0]);
                if(split[0] == uuu){
                    if(resJSON[0].connected == 1){
                        if(chat.classList.contains("disconnected")){
                            chat.classList.remove("disconnected");
                        }
                    }
                    else{
                        if(!chat.classList.contains("disconnected")){
                            chat.classList.add("disconnected");
                        }
                    }
                }
            }
        });

})


socket.on("alert", (ouu) => {
    if (ouu == sessionStorage.getItem("currentChat") || ouu == sessionStorage.getItem("username")) {
        let url = "/chat/last?" + new URLSearchParams({
            user_id: sessionStorage.getItem("user_id"),
            recipient_username: sessionStorage.getItem("currentChat")
        });
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
            }
        })
            .then(res => res.json())
            .then(resJSON => {
                let newMsg = document.createElement("li");
                newMsg.classList.add("formato-msg");
                let newMsgDate = document.createElement("small");
                newMsgDate.classList.add("formato-msg-date");
                const fecha = new Date(resJSON[0].date);
                const año = fecha.getFullYear();
                const mes = fecha.getMonth() + 1; // Los meses son indexados desde 0
                const dia = fecha.getDate();
                const horas = fecha.getHours();
                const minutos = fecha.getMinutes();
                const segundos = fecha.getSeconds();
                newMsgDate.textContent = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')} ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                if (resJSON[0].creator_id == sessionStorage.getItem("user_id")) {
                    newMsg.classList.add("msg");
                }
                else {
                    newMsg.classList.add("foreign-msg");
                }
                const msgContent = document.createElement("p");
                msgContent.classList.add("formato-msg-texto")
                msgContent.textContent = resJSON[0].body;
                newMsg.appendChild(msgContent);
                newMsg.appendChild(newMsgDate);
                let tick = document.createElement("small");
                tick.classList.add("formato-tick")
                tick.textContent = "...";
                newMsg.appendChild(tick);
                messages.appendChild(newMsg);
            });
        url = "/chat/seen?" + new URLSearchParams({
            user_id: sessionStorage.getItem("user_id"),
            recipient_username: sessionStorage.getItem("currentChat")
        });
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
            }
        })
            .then(res => res.json())
        let chats = document.getElementsByClassName("button-chat");
    }
    else {
        //LOGICA PARA ACTUALIZAR BOTON CON CANTIDAD DE MENSAJES SIN LEER
        console.log("FUERA DE CHAT");
        let chats = document.getElementsByClassName("button-chat");
        for (let chat of chats) {
            let affectedChat = chat.textContent;
            let split = affectedChat.split(" ");
            console.log(split[0]);
            if (split[0] == ouu) {
                let url = "/chat/notseen?" + new URLSearchParams({
                    user_id: sessionStorage.getItem("user_id"),
                    recipient_username: ouu
                });

                fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
                    }
                })
                    .then((res) => {
                        console.log(res);
                        return res.json();
                    })
                    .then((resJSON) => {
                        chat.textContent = ouu + " " + resJSON.length;
                    });


            }
        }
    }
})

socket.on("newMsg", () => {
    const url = "/chat/last?" + new URLSearchParams({
        user_id: sessionStorage.getItem("user_id"),
        recipient_username: sessionStorage.getItem("currentChat")
    });
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
        }
    })
        .then(res => res.json())
        .then(resJSON => {
            if (sessionStorage.getItem("lastMsg") != resJSON[0].id) {
                let newMsg = document.createElement("li");
                newMsg.classList.add("formato-msg");
                let newMsgDate = document.createElement("small");
                newMsgDate.classList.add("formato-msg-date");
                const fecha = new Date(resJSON[0].date);
                const año = fecha.getFullYear();
                const mes = fecha.getMonth() + 1; // Los meses son indexados desde 0
                const dia = fecha.getDate();
                const horas = fecha.getHours();
                const minutos = fecha.getMinutes();
                const segundos = fecha.getSeconds();
                newMsgDate.textContent = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')} ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                if (resJSON[0].creator_id == sessionStorage.getItem("user_id")) {
                    newMsg.classList.add("msg");
                }
                else {
                    newMsg.classList.add("foreign-msg");
                }
                const msgContent = document.createElement("p");
                msgContent.classList.add("formato-msg-texto")
                msgContent.textContent = resJSON[0].body;
                newMsg.appendChild(msgContent);
                newMsg.appendChild(newMsgDate);
                messages.appendChild(newMsg);
                sessionStorage.setItem("lastMsg", resJSON[0].id);
            }
        });
})