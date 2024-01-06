const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let object = {};
  let formData = new FormData(loginForm);
  formData.forEach((value, key) => (object[key] = value));
  let json = JSON.stringify(object);
  console.log(json);
  let myIP;
  let serverIP;
  fetch("/admin", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: json,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        alert(res.status);
      }
    })
    .then((res) => {
      myIP = res.clientIP;
      serverIP = res.serverIP;
      console.log("!listo");
      console.log(res);
      sessionStorage.setItem("admin_token", res.token);
      console.log(sessionStorage.getItem("admin_token"));
      if (myIP == "::1") {
        window.location.href = "http://localhost:3000/html/adminPanel.html";
      } else {
        window.location.href = `http://${serverIP}:3000/html/adminPanel.html`;
      }
    });
});
