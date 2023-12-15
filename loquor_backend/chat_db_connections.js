const mysql = require("mysql2/promise");
const mysqlDB = require('mysql');


async function getMessages(user_id, username) {
    try {
      const con = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "mydb",
      });
  
      const other_user_id = await getUserId(username)
      .catch(err=>{
        throw err;
      });

      const query = "SELECT * FROM messages where (creator_id = ? and recipient_id = ?) or (recipient_id = ? and creator_id = ?)";
      const [rows, fields] = await con.execute(query,[user_id,other_user_id.id,user_id, other_user_id.id])
      .catch(err=>{
        throw err;
      });

      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error en la eliminacion del usuario:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
    
  }

  async function sendMessage(user_id, recipient_username, message) {
    try {
      const con = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "mydb",
      });
  
      if(message == "" || message == null){
        throw {
          "en":"The message's body can't be empty",
          "es":"El cuerpo del mensaje no puede estar vacio"
        };
      };

      const other_user_id = await getUserId(recipient_username)
      .catch(err=>{
        throw err;
      });

      console.log(user_id,other_user_id.id,message);

      const query = "INSERT INTO messages(creator_id, recipient_id, body) VALUES(?,?,?)";
      const [rows, fields] = await con.execute(query,[user_id,other_user_id.id, message]);
      console.log("Filas afectadas:", rows.affectedRows);
      console.log(rows);
      await con.end();
      return rows;
  
    } catch (error) {
      console.error("Error obtencion del id del usuario:", error);
      throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
    }
  }



  async function getUserId(recipient_username){
    try {
        const con = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "root",
          database: "mydb",
        });
    
        if(recipient_username == ""){
          throw {
            "en":"You have to choose an user to send a message",
            "es":"Tienes que seleccionar un usuario para enviar un mensaje"
          };
        }

        console.log("Nombre de quien recibe");
        console.log(recipient_username);
        console.log("Nombre de quien recibe");
        const query = "SELECT id FROM users where username = ?";
        const [rows, fields] = await con.execute(query,[recipient_username]);
        console.log("ID USUARIO A MENSAJEAR");
        console.log(rows);
        await con.end();
        return rows[0];

      } catch (error) {
          throw error; // Propagar el error para que pueda ser manejado en el código que llama a esta función
      }
  }


  module.exports = {getMessages, sendMessage};