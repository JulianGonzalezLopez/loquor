const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let object = {};
  let formData = new FormData(loginForm);
  formData.forEach((value, key) => (object[key] = value));
  let json = JSON.stringify(object);
  console.log(json);
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
      console.log("!listo");
      console.log(res);
      sessionStorage.setItem("admin_token", res.token);
      console.log(sessionStorage.getItem("admin_token"));
      window.location.href = "http://localhost:3000/html/adminPanel.html";
      //window.location.href = "http://192.168.0.9:3000/html/adminPanel.html"; //THIS IS THE DIRECTION THAT YOU SHOULD REDIRECT YOUR USERS TO
    });
});
