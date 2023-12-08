const mysql = require("mysql2/promise");
const mysqlDB = require('mysql');


async function setDB() {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
  });

  await con.execute("CREATE DATABASE IF NOT EXISTS mydb");


  await con.execute("USE mydb");

  await con.execute(`CREATE TABLE IF NOT EXISTS users(
        id int AUTO_INCREMENT,
        username varchar(64) NOT NULL,
        password varchar(32) NOT NULL,
        role varchar(20) DEFAULT 'user',
        PRIMARY KEY(id)
    )`);

  await con.execute(`CREATE TABLE IF NOT EXISTS message(
        id int AUTO_INCREMENT,
        creator_id int NOT NULL,
        recipient_id int NOT NULL,
        received boolean DEFAULT FALSE,
        body varchar(248),
        PRIMARY KEY(id),
        FOREIGN KEY(creator_id) REFERENCES users(id),
        FOREIGN KEY(recipient_id) REFERENCES users(id)
    )`);
  let res = await con.execute("SHOW TABLES");
  console.log(res);
}

async function createUser(username, password) {
  try {
    if (!username || !password) {
      throw new Error(
        "Se requieren tanto el nombre de usuario como la contraseña."
      );
    }

    const con = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
    });

    let query = "SELECT * FROM users WHERE username = ?";
    let [rows, fields] = await con.execute(query, [username]);
    console.log(rows + " igualdades");
    if(rows.length > 0){
      return null;
    }

    query = "INSERT INTO users(username, password) VALUES (?, ?)";
    [rows, fields] = await con.execute(query, [username, password]);
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
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
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
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
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
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
    });

    const query = "SELECT * FROM users";
    const [rows, fields] = await con.execute(query);
    console.log("Filas afectadas:", rows.affectedRows);
    console.log(rows);
    await con.end();
    return rows;

  } catch (error) {
    console.error("Error en la eliminacion del usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function createAdmin(username, password) {
  try {
    if (!username || !password) {
      throw new Error(
        "Se requieren tanto el nombre de usuario como la contraseña."
      );
    }

    const con = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
    });

    const query = "INSERT INTO users(username, password, role) VALUES (?, ?, 'admin')";
    const [rows, fields] = await con.execute(query, [username, password]);
    console.log("Filas afectadas:", rows.affectedRows);
    await con.end();
  } catch (error) {
    console.error("Error en la creación de usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function verifyPassword(username, password){
  console.log(username + " : " + password);
  try {
    const con = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
    });

    const query = "SELECT * FROM users where username = ?";
    const [rows, fields] = await con.execute(query,[username]);
    console.log(rows);
    await con.end();
    if(rows[0].password === password){
      return rows[0];
    }
    else{
      return false;
    }
    

  } catch (error) {
    console.error("Error al verificar password:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

//setDB();
//createAdmin("admin","admin");


module.exports = {createUser, modifyUser, deleteUser, getUsers, verifyPassword};
