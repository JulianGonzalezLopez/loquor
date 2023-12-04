const mysql = require("mysql2/promise");

async function setDB() {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb",
  });

  // const con = mysql.createConnection({
  //     host: "localhost",
  //     user: "root",
  //     password: "root"
  //   });

  await con.execute("CREATE DATABASE IF NOT EXISTS mydb");

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

    const query = "INSERT INTO users(username, password) VALUES (?, ?)";
    const [rows, fields] = await con.execute(query, [username, password]);
    console.log("Filas afectadas:", rows.affectedRows);
    await con.end();
  } catch (error) {
    console.error("Error en la creación de usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

async function modifyUser(username, password) {
  try {
    if (!username && !password) {
      throw new Error("Se requiere como minimo un usuario o contraseña.");
    }

    const con = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb",
    });

    let rows, fields;

    if (username && password) {
      let query = `UPDATE users
        set username = ?,
        password = ?
        where username = ?`;
      [rows, fields] = await con.execute(query, [username, password]);
    } else if (username) {
      let query = `UPDATE users
        set username = ?
        where username = ?`;
      [rows, fields] = await con.execute(query, [username]);
    } else if (password) {
      let query = `UPDATE users
        set password = ?
        where username = ?`;
      [rows, fields] = await con.execute(query, [password]);
    }
    console.log("Filas afectadas:", rows.affectedRows);
    await con.end();
  } catch (error) {
    console.error("Error en la creación de usuario:", error);
    throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
  }
}

//setDB();

module.exports = {createUser, modifyUser};
