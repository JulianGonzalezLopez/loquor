const mysql = require("mysql2/promise");
const mysqlDB = require('mysql');
const jwt = require("jsonwebtoken");


async function deleteTables(){
  const con = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  console.log(await con.execute("show tables"));

  await con.execute("DROP TABLE messages")
  .then(()=>{
    con.execute("DROP TABLE users");
  });
}


async function setDB() {
  const con = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });

  await con.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`);


  await con.execute(`USE ${process.env.DATABASE}`);

  await con.execute(`CREATE TABLE IF NOT EXISTS users(
        id int AUTO_INCREMENT,
        username varchar(64) NOT NULL,
        password varchar(32) NOT NULL,
        role varchar(20) DEFAULT 'user',
        PRIMARY KEY(id)
    )`);

  try{
    await createUser(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD, "on");
  }
  catch(err){
    console.log(err);
  }

  await con.execute(`CREATE TABLE IF NOT EXISTS messages(
        id int AUTO_INCREMENT,
        creator_id int NOT NULL,
        recipient_id int NOT NULL,
        seen boolean DEFAULT FALSE,
        body varchar(248),
        date DATETIME,
        PRIMARY KEY(id),
        FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
  let res = await con.execute("SHOW TABLES");
  console.log(res);
}

async function createUser(username, password,is_admin) {
  try {
    if (!username || !password) {
      throw new Error(
        "Se requieren tanto el nombre de usuario como la contraseña."
      );
    }

    const con = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });

    let query = "SELECT * FROM users WHERE username = ?";
    let [rows, fields] = await con.execute(query, [username]);
    console.log(rows + " igualdades");
    if(rows.length > 0){
      throw {
        "en":"This user already exists",
        "es":"Este usuario ya existe"
      };

    }
    if(is_admin == "on"){
      query = "INSERT INTO users(username, password, role) VALUES (?, ?, ?)";
      [rows, fields] = await con.execute(query, [username, password, "admin"]);
    }
    else{
      query = "INSERT INTO users(username, password) VALUES (?, ?)";
      [rows, fields] = await con.execute(query, [username, password]);
    }
    console.log("Filas afectadas:", rows.affectedRows);
    await con.end();
  } catch (error) {
    console.error("Error en la creación de usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function modifyUser(oldusername, username, password) {
  try {
    if (!oldusername && (!password || !username)) {
      throw new Error("Se requiere como minimo el usuario base y un usuario o contraseña.");
    }

    const con = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });

    let rows, fields;

    if (username && password) {
      let query = "UPDATE users set username = ?, password = ? where username = ?";
      [rows, fields] = await con.execute(query, [username, password, oldusername]);
      const formedQuery = con.format(query, [username, password, oldusername]);
      console.log("Consulta SQL formada:", formedQuery);
    } else if (username) {
      let query = "UPDATE users set username = ? where username = ?";
      [rows, fields] = await con.execute(query, [username,oldusername]);
    } else if (password) {
      let query = "UPDATE users set password = ? where username = ?";
      [rows, fields] = await con.execute(query, [password, oldusername]);
    }
    console.log("Filas afectadas:", rows.affectedRows);
    await con.end();
  } catch (error) {
    console.error("Error en la modificacion del usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function deleteUser(username) {
  console.log("A VER EL USER "+ username);
  try {
    if (!username) {
      throw new Error(
        "Se requieren el usuarioa a eliminar."
      );
    }

    const con = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });

    const query = "DELETE FROM users WHERE username = ?";
    const [rows, fields] = await con.execute(query, [username]);
    console.log("Filas afectadas:", rows.affectedRows);
    await con.end();

  } catch (error) {
    console.error("Error en la eliminacion del usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function getUsers() {
  try {
    const con = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });

    const query = "SELECT * FROM users";
    const [rows, fields] = await con.execute(query);
    console.log("Filas afectadas:", rows.affectedRows);
    console.log(rows);
    await con.end();
    return rows;

  } catch (error) {
    console.error("Error en la obtencion de usuarios:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}


async function verifyPassword(username, password){
  console.log("Usuario y pass a verificar: " + username + " : " + password);
  try {
    const con = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });


    if(username == "" || username == null){
      throw{
        "en": "The username can't be empty",
        "es": "El username no puede estar vacio"
      }
    }

    if(password == "" || password == null){
      throw{
        "en": "The password can't be empty",
        "es": "La contraseña no puede estar vacia"
      }
    }


    const query = "SELECT * FROM users where username = ?";
    const [rows, fields] = await con.execute(query,[username]);
    if(rows.length == 0){
      throw {
        "en":"This user does not exists",
        "es":"Este usuario no existe"
      }
    }
    await con.end();
    if(rows[0].password === password){
      return rows[0];
    }
    else{
      return {
        "en":"Wrong password",
        "es":"Contraseña incorrecta"
      };
    }

  } catch (error) {
    console.error(error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function verifyPasswordAndRole(username, password){
  console.log("Usuario y pass a verificar: " + username + " : " + password);
  try {
    const con = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });

    const query = "SELECT * FROM users where username = ?";
    const [rows, fields] = await con.execute(query,[username]);
    if(rows.length == 0){
      throw {
        "en":"This user does not exists",
        "es":"Este usuario no existe"
      }
    }
    await con.end();
    console.log(rows[0]);
    
    if(rows[0].password !== password){
      throw {
        "en":"Wrong password",
        "es":"Contraseña incorrecta"
      };
    }

    if(rows[0].role == "admin"){ 
          const token = jwt.sign({user:username}, process.env.ADMIN_SECRET, {expiresIn:"1h"});
          let response = {
            "token": token,
            "en":"You are  an admin",
            "es":"Sos un administrador",
            "is_admin": true
          };
          console.log(response);
          return response;
      }
      else{
        return {
          "token":false,
          "en":"You are not an admin",
          "es":"No sos un administrador",
          "is_admin": false
        };
      }

  } catch (error) {
    console.error(error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}


//deleteTables();
setDB();


module.exports = {createUser, modifyUser, deleteUser, getUsers, verifyPassword, verifyPasswordAndRole};
