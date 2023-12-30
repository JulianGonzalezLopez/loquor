const createUser = document.getElementById("createUser");
      createUser.addEventListener("submit",(e)=>{
        e.preventDefault();
        e.preventDefault();
        let object = {};
        let formData = new FormData(createUser);
        console.log("form data " + formData);
        formData.forEach((value, key) => (object[key] = value));
        let json = JSON.stringify(object);
        console.log(json);

        fetch("/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : sessionStorage.getItem("admin_token") ? sessionStorage.getItem("admin_token") : ""
          },
          body: json,
        })
          .then((res) => res.json())
          .then((res) => console.log(res));
      })


      const modifyUser = document.getElementById("modifyUser");
      modifyUser.addEventListener("submit", (e) => {
        e.preventDefault();
        let object = {};
        let formData = new FormData(modifyUser);
        console.log("form data " + formData);
        formData.forEach((value, key) => (object[key] = value));
        let json = JSON.stringify(object);
        console.log(json);

        fetch("/users", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : sessionStorage.getItem("admin_token") ? sessionStorage.getItem("admin_token") : ""
          },
          body: json,
        })
          .then((res) => res.json())
          .then((res) => console.log(res));
      });

      const deleteUser = document.getElementById("deleteUser");
      console.log(deleteUser);
      deleteUser.addEventListener("submit", (e) => {
        e.preventDefault();

        let object = {};
        let formData = new FormData(deleteUser);
        console.log("form data " + formData);
        formData.forEach((value, key) => (object[key] = value));
        let json = JSON.stringify(object);
        console.log(json);
        console.log(formData);
        console.log(object);

        fetch("/users", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization" : sessionStorage.getItem("admin_token") ? sessionStorage.getItem("admin_token") : ""
          },
          body: json,
        })
        .then(res=>res.json())
        .then(res=>console.log(res));
      });


      //open
      const listaUsuarios = document.getElementById("lista-usuarios");
      const btnCargar = document.getElementById("cargar-usuarios-btn");
      btnCargar.addEventListener("click", () => {
        fetch("/users",{
        method:"get",
          headers : {
            "Authorization" : sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ""
          }
        }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Network response was not ok: ${res.status}`);
            }
            return res.json();
          })
          .then((resJSON) => {
            console.log(resJSON);
            listaUsuarios.innerHTML = "";
            resJSON.forEach((user) => {
              const listItem = document.createElement("li");
              listItem.textContent = `Username: ${user.username}, Password: ${user.password}, Role: ${user.role}`;
              console.log(listItem);
              listaUsuarios.appendChild(listItem);
            });
          })
          .catch((error) => console.error("Error fetching data:", error));
      });